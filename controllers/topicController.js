'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var topicController = {
    test: function(req,res){
        return res.status(200).send({
            msg: "Test in topicController."
        })
    },

    /*  SAVE METHOD */
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

    /*  GET TOPICS METHOD */
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
    },

    /*  GET TOPICS BY USER METHOD */
    getTopicsByUser: function(req,res){

        Topic.find({user: req.user.sub},'title content code lang date user comments')
        .sort([['date','descending']])
        .exec((err,topics) => {
            if(err){
                return res.status(500).send({msg: "Error getting topics."})
            }
            if(!topics){
                return res.status(200).send({msg: "No topics."})
            }
            return res.status(200).send({topics})
        })
    },

    /*  GET TOPIC METHOD */
    getTopic: function(req,res){
        Topic.findById(req.params.id).populate({path:'user',select:'_id name surname email role image'})
        .exec((err,topic) => {
            if(err){
                return res.status(500).send({msg: "Error getting topic."})
            }
            if(!topic){
                return res.status(200).send({msg: "No topic."})
            }
            return res.status(200).send({topic})
        })
    },

    /*  UPDATE METHOD */
    update: function(req,res){
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
        else {
            var topic = new Topic();
            topic.title = params.title.toLowerCase();
            topic.content = params.content.toLowerCase();
            topic.user = req.user.sub;
            params.code ? topic.code = params.code.toLowerCase() : undefined;
            topic.lang = params.lang.toLowerCase();
            Topic.findOneAndUpdate({_id: req.params.id}, {title:topic.title, content: topic.content, code:topic.code, lang:topic.lang, date: Date.now() },{new:true}, (err,topicUpdated) => {
                if(err) {
                    return res.status(500).send({msg: "Error updating topic."})
                }
                if(!topicUpdated) {
                    return res.status(200).send({msg: "Could not update topic."})
                }
                return res.status(200).send({msg: "Topic updated."})
            })
        }
    },

    /*  DELETE METHOD */
    delete: function(req,res){
        Topic.findOneAndDelete({_id: req.params.id, user:req.user.sub}, (err,topicDeleted) => {
            if(err) {
                return res.status(500).send({msg: "Error deleting topic."})
            }
            if(!topicDeleted) {
                return res.status(200).send({msg: "Could not delete topic."})
            }
            return res.status(200).send({msg: "Topic deleted."})
        })
    },
    
    /*  SEARCH METHOD */
    search: function(req,res){
        Topic.find({"$or": [
            {"title":{"$regex":req.params.search, "$options":"i"}},
            {"content":{"$regex":req.params.search, "$options":"i"}},
            {"lang":{"$regex":req.params.search, "$options":"i"}},
        ]},'_id date comments title content lang').exec((err,topics) => {
            if(err){
                return res.status(500).send({msg: "Error getting topics."})
            }
            if(!topics){
                return res.status(200).send({msg: "No topics."})
            }
            return res.status(200).send({topics})
        })
    }
}
    


module.exports = topicController;