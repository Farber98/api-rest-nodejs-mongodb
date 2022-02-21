'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var UserRoutes = require('./routes/userRoutes');
var CommentRoutes = require('./routes/commentRoutes');
var TopicRoutes = require('./routes/topicRoutes');

/* Express */
var app = express();

/* Middlewares */
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

/* CORS */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

/* Rewrite routes */
app.use('/api/users', UserRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/topics', TopicRoutes);

/* Export module */
module.exports = app;