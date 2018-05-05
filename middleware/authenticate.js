const {User} = require('../models/user')

const authenticate = (req, res, next) => {
  // provide x-auth token => condizione per "loggare"
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
      // questo fa scattare .catch
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate}
