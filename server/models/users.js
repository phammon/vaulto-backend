const mongoose = require('mongoose');
const validator = require('validator');    
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,  
            message: '{value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
    }]
});
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then((user) =>{
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            // user bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                }else {
                    reject();
                }
            });
        });
    });
};
UserSchema.statics.findByToken = function(token) {
    //this is a model method
    var User = this;
    var decoded = undefined;
    try {
       decoded = jwt.verify(token, 'passcode');
    }catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        'tokens.access': 'auth',
        'tokens.token': token,
        '_id': decoded._id
    })
}

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
    //pull lets you remove items from an array that match certain criteria
        $pull: {
            tokens: {token}
        }
    })    
};
//returns only ID and email.... don't wanna be returning passwords!
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['_id', 'email']);
};
//arrow functions dont bind this so we use normal function 
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'passcode').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });  
};
// middleware to run before a document gets save to the db
UserSchema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')) {
        //hash the password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    }else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);  

module.exports = {User}