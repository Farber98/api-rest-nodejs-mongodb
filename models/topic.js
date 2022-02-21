'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2')
var Schema = mongoose.Schema;

var Comment = Schema({
    content: String,
    date: {type:Date, defaulte: Date.now},
    user: {type: Schema.ObjectId, ref:'User'}
})

var TopicSchema = Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'},
    comments: [Comment]
})

TopicSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Topic',TopicSchema);