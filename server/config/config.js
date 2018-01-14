var env = process.env.NODE_ENV || 'development'

if(env === 'development') {
    var config = require('./config.json');
    var dev = config.development;

    Object.keys(dev).forEach((key) => {
        process.env[key] = dev[key]
    });
} 

