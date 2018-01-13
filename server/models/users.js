const mongoose = require('mongoose');
const validator = require('validator');    
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

var User = mongoose.model('User', UserSchema);  

module.exports = {User}