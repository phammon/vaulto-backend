var mongoose = require('mongoose');

var Password = mongoose.model('password', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Password};