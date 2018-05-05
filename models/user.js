const mongoose = require('mongoose'),
      validator = require('validator'),
      jwt = require('jsonwebtoken'),
      _ = require('lodash')

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    required: true,
    trim: true,
    unique: true,
    // utilizziamo package validator per verificare correttezza formale email
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  // tokens: feature available in mongodb not available in SQL databases like postgres, generati con metodo sotto generateAuthToken
  // USER TOKEN ARRAY
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// permette di definire quali properties ritornare quando un oggetto document mongodb viene converito in JSON. serve per filtrare le risposte
UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email'])
}


// UserSchema.methods = oggetto che possiamo utilizzare per aggiungere metodi custom ai documents -> si chiamano instance method
UserSchema.methods.generateAuthToken = function() {
  // in questo caso this è il document secifico
  let user = this;
  let access = 'auth';
  // {_id: user._id.toHexString(), access} data we want to sign
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  //update the user token array (struttura sopra)
  user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    // se tutto ok ritorna token
    return token;
  })
};

// UserSchema.statics = oggetto che possiamo utilizzare per aggiungere metodi custom alla collection -> si chiamano model method
UserSchema.statics.findByToken = function (token) {
  // in questo caso this è la collection
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  };

  return User.findOne({
    // quando nel nome c'è il punto (tokens.token) bisogna utilizzare '', per consistenza in questo caso utilizziamo le '' anche con _id
    '_id' : decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};



const User = mongoose.model('User', UserSchema);

module.exports = {User}


// let newuser = new User({
//   email: 'Saetta077@gmail.com',
// });
//
// // promise al posto di callback
// newuser.save().then((user) => {
//   console.log(user);
// },(e) => {
//   console.log(e);
// });
