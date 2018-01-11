var express = require('express');
var bodyParser = require('body-parser'); //takes Json and converts to object
var {ObjectID} = require('mongodb');

var {Mongoose} = require('./db/mongoose');
var {Password} = require('./models/password');

var app = express();
//port is set if running on heroku otherwise it will equal 3000 
const port = process.env.PORT || 3000

app.use(bodyParser.json());
//these are your routes fool! Post won't work unless you use username, password, and name!
app.post('/passwords', (req, res) => {
    var password = new Password ({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
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
app.delete('/passwords/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    } 
    Password.findOneAndRemove(id).then((password) => {
        if(!password) {
            return res.send.status(404).send();
        }
        res.send({password}); 
    }).catch((e) => {
        res.status(404).send(); 
    })
});

app.get('/passwords/:name', (req, res) => {
    var name = req.params;
    Password.findOne(name).then((password) => {
        if(!password) {
            return res.send.status(404).send();
        }
        res.send({password});
    }).catch((e) => {
        res.status(404).send();
    })
});

app.listen(port, () => {
    //switched port to template string so we can inject the port
    console.log(`started listening on ${port}`);
});

module.exports = {
    app
};