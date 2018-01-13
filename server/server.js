const express = require('express');
const bodyParser = require('body-parser'); //takes Json and converts to object
var {ObjectID} = require('mongodb');
const _ = require('lodash');
var {Mongoose} = require('./db/mongoose');
var {Password} = require('./models/password');
var {User} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');

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
app.post('/users', (req, res) => {
    //.pick is from lodash library, lets us pick off properties that we want
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        //x- is custom header to store value
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
}); 

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
    // console.log(req.user);
});
app.get('/passwords', (req, res) => {
     Password.find().then((passwords) =>{
        res.send({ passwords });
     },(e) => {
        res.status(400).send(e);
     })
});
app.patch('/passwords/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['username', 'password', 'name', 'completed'])
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    } 
    //if body.completed is boolean and if its true
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
     Password.findByIdAndUpdate(id, {$set: body}, {$new: true}).then((password) => {
            //if the password doesn't exist
            if(!password) {
                return res.status(404).send();
            }
            //otherwise send it back  
            res.send({password})
        }).catch((e) => {
            res.status(400).send();
        });
});
app.delete('/passwords/:id', (req, res) => {
    var id = req.params.id;
    //ID Validation
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