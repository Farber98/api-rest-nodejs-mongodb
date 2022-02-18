'use strict'

var express = require('express');
var bodyParser = require('body-parser');

/* Express */
var app = express();

/* Middlewares */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/* CORS */

/* Routes */
app.get('/test',(req,res) => {
    return res.status(200).send({
        msg: 'Hello World',
    }) 
})

/* Export module */
module.exports = app;