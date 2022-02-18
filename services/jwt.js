'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
const user = require('../models/user');
var jwtkey = process.env.jwtkey || 'clave-super-secreta';

exports.createToken = function(){
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