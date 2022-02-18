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

/* Rewrite routes */
app.use('/api/users', UserRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/topics', TopicRoutes);

/* Export module */
module.exports = app;