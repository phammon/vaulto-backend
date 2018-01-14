var Mongoose = require('mongoose');

//tell mongoose we want to use built in promis library
Mongoose.Promise = global.Promise;
Mongoose.connect(process.env.MONGODB_URI);

module.exports = {Mongoose}