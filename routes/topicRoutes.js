'use strict'

var express = require('express');
var TopicController = require('../controllers/topicController');

var router = express.Router();

router.get('/test',TopicController.test);

/* Rewrite routes */

module.exports = router;
