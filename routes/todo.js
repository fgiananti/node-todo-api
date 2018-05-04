const express = require('express'),
      router = express.Router(),
      bodyParser = require('body-parser'),
      {ToDo} = require('../models/todo'), // collection
      {ObjectID} = require('mongodb')


router.use(bodyParser.json());

//  GET: /todos
// esegue query database per ottenere oggetto todos (in realtà sarebbe un array ma con {} diventa oggetto)
router.get('/', (req, res) => {
  ToDo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET: /todos/id fetch specific todo by id
router.get('/:id', (req, res) => {
  // se objectid non valido
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  ToDo.findById(req.params.id).then((todo) => {
      // se objectid valido (formalmente) ma todo non esistente (prova a cambiare l'ultima cifra di un id)
      if (!todo) {
        return res.status(404).send();
      }
      // se tutto ok
      res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

router.delete('/:id', (req , res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  };

  ToDo.findByIdAndRemove(req.params.id).then((removed) => {
    if (!removed) {
      return res.status(404).send();
    }
    res.send({removed});
  }).catch((e) => {
    res.status(400).send();
  });
});



//  POST: /todos
// inviando questa request con body json con struttura come da Schema ToDo => aggiunta todo
router.post('/', (req, res) => {
  let newTodo = new ToDo({
    text: req.body.text
  });

  newTodo.save().then((todo) => {
    res.send(`todo added to the db: ${todo}`);
  }, (err) => {
    res.status(400).send(err);
  });

});





module.exports = router
