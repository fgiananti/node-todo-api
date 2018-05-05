const express = require('express'),
      router = express.Router(),
      bodyParser = require('body-parser'),
      {User} = require('../models/user'),
      _ = require('lodash'),
      {authenticate} = require('../middleware/authenticate')

router.use(bodyParser.json());

router.post('/', (req, res) => {
  // tokens non va messo, gestito automaticamente
  let body = _.pick(req.body, ['email','password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    // x-auth salverà jwt value che andrà inviato con le request per verificare autorizzazione
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  })
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});


module.exports = router
