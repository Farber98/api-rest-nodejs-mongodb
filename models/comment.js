'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
    content: String,
    date: {type:Date, defaulte: Date.now},
    user: {type: Schema.ObjectId, ref:'User'}
})

module.exports = mongoose.model('Comment',CommentSchema)