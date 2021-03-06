'use strict'

var mongoose = require('mongoose');
var app = require('./app');
require('dotenv').config();
var port = process.env.PORT;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node',{useNewUrlParser:true})
        .then(() => {
            console.log("MongoDB connected.")
            /* Server */

            app.listen(port,() => {
                console.log('http://localhost:3999/test');
            })
        })
        .catch(error => console.log(error));