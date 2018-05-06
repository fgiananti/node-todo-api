const mongoose = require('mongoose');

const ToDoSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const ToDo = mongoose.model('ToDo', ToDoSchema);

module.exports = {ToDo}

// let newToDo = new ToDo({
//   text: 'Cook dinner',
// })
//
// newToDo.save((err, todo) => {
//   if (err) return console.log(err);
//   console.log(todo);
// });
