'use strict'

var express = require('express');
var UserController = require('../controllers/userController');
var middAuthJWT = require('../middlewares/auth');
var multiparty = require('connect-multiparty');

var router = express.Router();
var middUploadAvatar = multiparty({uploadDir: './uploads/users' });

router.get('/test',UserController.test);
router.post('/register',UserController.register);
router.post('/login',UserController.login);
router.put('/update', middAuthJWT.authJWT ,UserController.update);
router.post('/upload-avatar', [middAuthJWT.authJWT,middUploadAvatar],UserController.uploadAvatar);
router.get('/get-avatar/:fileName', middAuthJWT.authJWT,UserController.getAvatar);
router.get('/get-users', middAuthJWT.authJWT,UserController.getAllUsers);
router.get('/get-user/:userId', middAuthJWT.authJWT,UserController.getUser);

module.exports = router;
