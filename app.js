const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      port = process.env.PORT || 3000;

// routes
const indexRoutes = require('./routes/index'),
      todoRoutes = require('./routes/todo'),
      userRoutes = require('./routes/user')

// mongoose connect
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ToDoApp');

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
app.use('/users', userRoutes);


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

// per test
// module.exports = {app}
