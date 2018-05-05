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

router.post('/login', (req, res) => {
  let body = _.pick(req.body, ['email','password']);

  // .findByCredentials custom function
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// logout: ovviamente possiamo effettuare questa operazione solo se siamo loggati => middleware authenticate. removeToken la scriviamo noi => la impostiamo come promise
router.delete('/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
})


module.exports = router
