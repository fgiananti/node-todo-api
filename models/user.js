const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    minlength: 5,
    required: true,
    trim: true
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
