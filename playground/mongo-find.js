const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
    // si mette return per terminare la funzione qua se err
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // QUERY ALL THE DOCUMENTS ON THE COLLECTION
  // db.collection('Todos').find().toArray().then((docs) => {
  //   console.log('TODOS');
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  // QUERY BY PROPERTY VALUE! COMPLETED: TRUE
  // db.collection('Todos').find({completed: true}).toArray().then((docs) => {
  //   console.log('TODOS');
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  // QUERY BY OBJECTID! '5aeb36038e93e44207868c07'
  // db.collection('Todos').find({
  //   _id : new ObjectID('5aeb36038e93e44207868c07')
  // }).toArray().then((docs) => {
  //   console.log('TODOS');
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
  // })

  // QUERY BY PROPERTY VALUE! COMPLETED: TRUE
  db.collection('Todos').find().count().then((count) => {
    console.log(count);
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })






  // client.close();

});
