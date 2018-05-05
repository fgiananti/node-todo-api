const mongoose = require('mongoose'),
      validator = require('validator'),
      jwt = require('jsonwebtoken'),
      _ = require('lodash'),
      bcrypt = require('bcryptjs')

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


UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  // checkiamo se utente esiste mediante email
  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    // se email => utente esiste:
    // non si può fare così perhce bcrypt non supporta le promises
    // bcrypt.compare
    // bisogna fare così:
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};


// .pre('save'...) mongoose middleware. ci permette di eseguire del codice prima di un determinato evento in mongodb... in questo caso il salvataggio di un document. runna automaticamente prima di user.save
UserSchema.pre('save', function (next) {
  let user = this;

  // non vogliamo fare l'hashing della password ogni volta che un document viene modificato e quindi risalvato nel database (ad esempio modifica data di nascita) => impostiamo questo if
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
});

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
