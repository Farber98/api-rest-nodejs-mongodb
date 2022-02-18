'use strict'

var express = require('express');
var UserController = require('../controllers/userController');

var router = express.Router();

router.get('/test',UserController.test);
router.post('/register',UserController.register);
router.post('/login',UserController.login);

module.exports = router;
