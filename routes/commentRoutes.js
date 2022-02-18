'use strict'

var express = require('express');
var CommentController = require('../controllers/commentController');

var router = express.Router();

router.get('/test',CommentController.test);

/* Rewrite routes */

module.exports = router;
