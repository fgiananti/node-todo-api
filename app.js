const express = require('express'),
      app = express(),
      mongoose = require('mongoose')

// routes
const indexRoutes = require('./routes/index'),
      todoRoutes = require('./routes/todo')

// mongoose connect
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ToDoApp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected!');
});

// various
app.set('view engine', 'ejs');

// collections
const {User} = require('./models/user');

// import routes - url
app.use('/', indexRoutes);
app.use('/todos', todoRoutes);


app.listen(3000, () => {
  console.log('Started on port 3000');
});

// per test 
// module.exports = {app}
