'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var topicController = {
    test: function(req,res){
        return res.status(200).send({
            msg: "Test in topicController."
        })
    },
    save: function(req,res){
        var params = req.body
        try{
            var vTitle = !validator.isEmpty(params.title);
            var vContent = !validator.isEmpty(params.content);
            var vLang = !validator.isEmpty(params.lang);
        }catch(err){
            return res.status(200).send({msg: "Required fields missing."})
        }
        if (!vTitle || !vContent || !vLang){
            return res.status(200).send({msg: "Invalid data."})
        }
        else{
            var topic = new Topic();
            topic.title = params.title.toLowerCase();
            topic.content = params.content.toLowerCase();
            topic.user = req.user.sub;
            params.code ? topic.code = params.code.toLowerCase() : undefined;
            topic.lang = params.lang.toLowerCase();
            topic.save((err, topicStored) => {
                if(err) {
                    return res.status(500).send({msg: "Error saving topic."})
                }
                if(!topicStored) {
                    return res.status(200).send({msg: "Could not save topic."})
                }
                return res.status(200).send({msg: "Topic saved."})
            })
        }
    },

    getTopics: function(req,res){
        var page
        req.params.page ? page = parseInt(req.params.page) : page = 1
        var options = {
            sort: {date: -1},
            select:'title content code lang date user comments',
            populate: {path:'user',select:'_id name surname email role image'},
            limit: 5,
            page: page
        }
        Topic.paginate({},options,(err,topics)=> {
            if(err){
                return res.status(500).send({msg: "Error getting topics."})
            }
            if(!topics){
                return res.status(200).send({msg: "No topics."})
            }
            return res.status(200).send({topics:topics})
        })
    }
}

module.exports = topicController;