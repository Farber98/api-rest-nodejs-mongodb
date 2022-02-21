'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
require('dotenv').config();

var jwtkey = process.env.JWTKEY;

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(5,'days').unix()
    }
    return jwt.encode(payload,jwtkey);
};