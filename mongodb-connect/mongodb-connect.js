// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');  

MongoClient.connect('mongodb://localhost:27017/vaulto-backend', (err, db) => {
    if(err) {
       return console.log('unable to connect to db server');
    } 
    console.log('connected to mongodb server');
   
    db.collection('addPassword').find().toArray().then((docs) => {
        console.log('docs');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to fetch vaulto', err);
    })
    // db.close();
});

