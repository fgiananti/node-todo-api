const express = require('express'),
      router = express.Router(),
      bodyParser = require('body-parser'),
      {ToDo} = require('../models/todo'), // collection
      {ObjectID} = require('mongodb'),
      _ = require('lodash'),
      {authenticate} = require('../middleware/authenticate')



router.use(bodyParser.json());

//  GET: /todos
// esegue query database per ottenere oggetto todos (in realtà sarebbe un array ma con {} diventa oggetto)
// aggiunta necessità di autenticazione per visualizzare i todo(solo quelli specifici dell'utente)
router.get('/', authenticate, (req, res) => {
  ToDo.find({
    _creator: req.user._id //ritornmiano solo i todo specifici dell'utente
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET: /todos/id fetch specific todo by id
// aggiunta necessità di autenticazione per visualizzare il todo
router.get('/:id', authenticate, (req, res) => {
  // se objectid non valido
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  }

  // cerchiamo nel database il todo specifiacando id e creator
  ToDo.findOne({
    _id: req.params.id,
    _creator: req.user._id
  }).then((todo) => {
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

// aggiunta necessità di autenticazione per eliminare un todo (specifico dell'utente)
router.delete('/:id', authenticate, (req , res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  };

  // cerchiamo nel database il todo specifiacando id e creator, poi remove
  ToDo.findOneAndRemove({
    _id : req.params.id,
    _creator: req.user._id
  }).then((removed) => {
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
// aggiunta necessità di essere autenticati (avere un token) per l'aggiunta di todo
router.post('/', authenticate, (req, res) => {
  let newTodo = new ToDo({
    text: req.body.text,
    _creator: req.user._id //questo lo prende dal middleware!!
  });

  newTodo.save().then((todo) => {
    res.send(`todo added to the db: ${todo}`);
  }, (err) => {
    res.status(400).send(err);
  });
});

// UPDATE: /todos/:id
// scenario: request di tipo update su /todos/:id con body contenente JSON con text ... e completed
// aggiunta necessità di autenticazione per eliminare un todo (specifico dell'utente)
router.patch('/:id', authenticate, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send();
  };
  // _.pick() è lodash! questo metodo permette di estrarre dall'oggetto req.body le sue proprietà text e completed per immagazinarle in una variabile (sotto forma di oggetto) chiamasi "subset".
  // text e completed sono i due campi che vogliamo poter aggiornare
  let body = _.pick(req.body, ['text', 'completed']);

  // se body.completed è boolean ed è true => impostiamo completedAt. se false il contrario.
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  //$set-$new operatori mongoose richiesti da findByIdAndUpdate
  ToDo.findOneAndUpdate({
    _id: req.params.id,
    _creator: req.user._id
  }, {$set: body}, {$new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

module.exports = router
