const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
    // si mette return per terminare la funzione qua se err
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  //  DELETE MANY: TUTTE I TODO CON TEXT 'EAT LUNCH'
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // DELETE ONE
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  //FIND ONE (FIRST) AND DELETE
  // ELIMINA E RITORNA (COME RESULT) L'OGGETTO
  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result)
  });


  // client.close();

  });
