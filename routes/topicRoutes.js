'use strict'

var express = require('express');
var TopicController = require('../controllers/topicController');
var middAuthJWT = require('../middlewares/auth');
var router = express.Router();

router.get('/test',TopicController.test);


module.exports = router;
