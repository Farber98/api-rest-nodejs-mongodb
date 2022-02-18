'use strict'

var userController = {
    test: function(req,res){
        return res.status(200).send({
            msg: "Test in userController."
        })
    },
}

module.exports = userController;