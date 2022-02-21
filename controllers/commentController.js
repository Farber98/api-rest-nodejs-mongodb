'use strict'

var Topic = require('../models/topic');
var validator = require('validator');

var commentController = {
    test: function(req,res){
        return res.status(200).send({
            msg: "Test in commentController."
        })
    },

    /*  ADD METHOD */
    add: function(req,res){
        Topic.findById(req.params.id).exec((err,topic) => {
            if(err){
                return res.status(500).send({msg: "Error getting topic."})
            }
            if(!topic){
                return res.status(200).send({msg: "No topic."})
            }
            try{
                var vContent = !validator.isEmpty(req.body.content)
            }catch(err){
                return res.status(200).send({msg: "No content found."})
            }
            if(!vContent){
                return res.status(200).send({msg: "Invalid content."})
            }else {
                var comment = {
                    user:req.user.sub,
                    content: req.body.content
                }
                /* Push comment to topic */
                topic.comments.push(comment)
                topic.save(err => {
                    if(err){
                        return res.status(500).send({msg: "Error saving comment."})
                    }
                    return res.status(200).send({msg: "Comment saved."})
                })
            }
        })
    },
    

    /*  UPDATE METHOD */
    update: function(req,res){
        try{
            var vContent = !validator.isEmpty(req.body.content)
        }catch(err){
            return res.status(200).send({msg: "No content found."})
        }
        if(!vContent){
            return res.status(200).send({msg: "Invalid content."})
        }else {
            Topic.findOneAndUpdate({"comments._id": req.params.id}, {"$set":{"comments.$.content":req.body.content}},{new:true}, (err,commentUpdated) => {
                if(err) {
                    return res.status(500).send({msg: "Error updating comment."})
                }
                if(!commentUpdated) {
                    return res.status(200).send({msg: "Could not update comment."})
                }
                return res.status(200).send({msg: "Comment updated."})
            })
        }
        
    },

    /*  DELETE METHOD */
    delete: function(req,res){
        Topic.findById(req.params.topid, (err, topic) => {
            if(err) {
                return res.status(500).send({msg: "Error deleting comment."})
            }
            if(!topic) {
                return res.status(200).send({msg: "Could not delete comment."})
            }
            if(topic.comments.id(req.params.comid)){
                comment.remove();
            } else {
                return res.status(200).send({msg: "No comment."})  
            }
            topic.save((err) => {
                if(err) {
                    return res.status(500).send({msg: "Error saving topic."})
                }
                return res.status(200).send({msg: "Comment deleted."}) 
            })
        })
    },
}

module.exports = commentController;