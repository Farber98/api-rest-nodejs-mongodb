'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var middAuthJWT = require('../middlewares/auth');

var router = express.Router();

router.get('/test',UserController.test);
router.post('/register',UserController.register);
router.post('/login',UserController.login);
router.put('/update', middAuthJWT.authJWT ,UserController.update);

module.exports = router;
