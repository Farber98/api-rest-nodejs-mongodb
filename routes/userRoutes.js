'use strict'

var express = require('express');
var UserController = require('../controllers/userController');

var router = express.Router();

router.get('/test',UserController.test);

/* Rewrite routes */

module.exports = router;
