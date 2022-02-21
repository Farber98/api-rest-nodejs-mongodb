'use strict'

var express = require('express');
var TopicController = require('../controllers/topicController');
var middAuthJWT = require('../middlewares/auth');
var router = express.Router();

router.get('/test',TopicController.test);
router.post('/save',middAuthJWT.authJWT,TopicController.save);
router.get('/get-topics/:page?',middAuthJWT.authJWT,TopicController.getTopics);
router.get('/user/:id',middAuthJWT.authJWT,TopicController.getTopicsByUser);
router.get('/:id',middAuthJWT.authJWT,TopicController.getTopic);
router.get('/search/:search',middAuthJWT.authJWT,TopicController.search);
router.put('/:id',middAuthJWT.authJWT,TopicController.update);
router.delete('/:id',middAuthJWT.authJWT,TopicController.delete);


module.exports = router;
