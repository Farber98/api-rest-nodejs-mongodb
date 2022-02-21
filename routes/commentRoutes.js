'use strict'

var express = require('express');
var CommentController = require('../controllers/commentController');
var middAuthJWT = require('../middlewares/auth');

var router = express.Router();

router.get('/test',CommentController.test);
router.post('/topic/:id',middAuthJWT.authJWT,CommentController.add);
router.put('/:id',middAuthJWT.authJWT,CommentController.update);
router.delete('/topic/:topid/:comid',middAuthJWT.authJWT,CommentController.delete);

/* Rewrite routes */

module.exports = router;
