const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var data = {
    id: 10
}

var token = jwt.sign(data, '123abc');

var password = "abc123";
var hashedPassword = "$2a$10$Pp0ZVJNQxMzjBqDm0cpVoubJnlEk7wbrZ0/ZGdzwOX4Rl3UfVBfXi";

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// });

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});