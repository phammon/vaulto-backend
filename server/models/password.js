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
        minlength: 4,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {Password};