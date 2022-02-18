'use strict'

var topicController = {
    test: function(req,res){
        return res.status(200).send({
            msg: "Test in topicController."
        })
    },
}

module.exports = topicController;