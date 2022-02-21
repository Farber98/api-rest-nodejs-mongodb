'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
require('dotenv').config();

var jwtkey = process.env.JWTKEY;

exports.authJWT = (req,res,next) => {
    if(!req.headers['authorization']){
        return res.status(403).send({msg:'Authorization header missing.'})
    }
    var token = req.headers['authorization'].replace(/['"]+/g,'');
    try{
        /* Decode Token */
        var payload = jwt.decode(token,jwtkey)
        if(payload.exp <= moment().unix()){
            return res.status(404).send({msg:'Expired Token.'})
        }
    }catch(ex){
        return res.status(404).send({msg:'Invalid Token.'})
    }
    req.user = payload;
    next();
}