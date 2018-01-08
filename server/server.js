var express = require('express');
var bodyParser = require('body-parser'); //takes Json and converts to object
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Password} = require('./models/password');

var app = express();

app.use(bodyParser.json());

app.post('/passwords', (req, res) => {
    var password = new Password ({
        username: req.body.username,
        password: req.body.password
    });
    password.save().then((doc) => { 
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/passwords', (req, res) => {
     Password.find().then((passwords) =>{
        res.send({ passwords });
     },(e) => {
        res.status(400).send(e);
     })
})

app.get('/passwords/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    } 
    Password.findById(id).then((password) => {
        if(!password) {
            return res.send.status(404).send();
        }
        res.send({password});
    }).catch((e) => {
        res.status(404).send(); 
    })
});

app.listen(3000 , () => {
    console.log('started on port 3000!');
});

