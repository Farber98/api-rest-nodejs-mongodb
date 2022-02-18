'use strict'

var commentController = {
    test: function(req,res){
        return res.status(200).send({
            msg: "Test in commentController."
        })
    },
}

module.exports = commentController;