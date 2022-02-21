'use strict'

var express = require('express');
var TopicController = require('../controllers/topicController');
var middAuthJWT = require('../middlewares/auth');
var router = express.Router();

router.get('/test',TopicController.test);
router.post('/save',middAuthJWT.authJWT,TopicController.save);
router.get('/get-topics/:page?',middAuthJWT.authJWT,TopicController.getTopics);

module.exports = router;
