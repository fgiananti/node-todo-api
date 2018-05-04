const express = require('express'),
      router = express.Router(),
      bodyParser = require('body-parser'),
      {ToDo} = require('../models/todo') // collection


router.use(bodyParser.json());

//  GET: /todos
router.get('/', (req, res) => {
  ToDo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

//  POST: /todos
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
