'use strict'

var userController = {
    probando: function(req,res){
        return res.status(200).send({
            msg: "Test in UserController."
        })
    },
}

module.exports = userController;