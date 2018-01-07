var express = require('express');
var bodyParser = require('body-parser'); //takes Json and converts to object

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

app.listen(3000 , () => {
    console.log('started on port 3000!');
});

