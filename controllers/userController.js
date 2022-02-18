'use strict'

var validator = require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var userController = {
    /* TEST METHOD */
    test: function(req,res){
        return res.status(200).send({
            msg: "Test in userController."
        })
    },
    
    /* REGISTER METHOD */
    register: function(req,res){
        var params = req.body;
        
        /* Validate data */
        var vName = !validator.isEmpty(params.name);
        var vSurname = !validator.isEmpty(params.surname);
        var vEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var vPassword = !validator.isEmpty(params.password);
        
        if (vName && vSurname && vEmail && vPassword){
            /* Create user object */
            var user = new User();
            user.name = params.name.toLowerCase();
            user.surname = params.surname.toLowerCase();
            user.email = params.email.toLowerCase();
            user.role = 'user';
            user.image = null;

            /* Check if exists */
            User.findOne({email: user.email}, (err,issetUser) => {
                if(err) {
                    return res.status(500).send({msg: "Error checking if user exists."})
                }
                if(!issetUser){
                    /* If not exists, create pw and save */
                    bcrypt.hash(params.password, null, null, (err,hash) => {
                        user.password = hash;
                        user.save((err,userStored) => {
                            if(err || !userStored) {
                                return res.status(500).send({msg: "Error saving user."})
                            }
                            return res.status(200).send({user: userStored})
                        })
                    })
                } else {
                    return res.status(200).send({msg: "Email already in use."})
                }
            })
        }
    },

    /*  LOGIN METHOD */
    login: function(req,res){
        var params = req.body;

        /* Validate data */
        var vEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var vPassword = !validator.isEmpty(params.password);

        if (vEmail && vPassword) {
            /* Create user object */
            var user = new User();
            user.email = params.email.toLowerCase();
            User.findOne({email: user.email}, (err,user) => {
                if(err) {
                    return res.status(500).send({msg: "Error logging in."})
                }
                if(!user){
                    return res.status(200).send({msg: "User is not registered."})
                }
                bcrypt.compare(params.password, user.password, (err, check) => {
                    if(check){
                        /* Genera token */
                            return res.status(200).send({token: jwt.createToken(user)})
                    }
                    return res.status(200).send({msg: "Incorrect credentials."})
                })
            
            })
        } else {
            return res.status(200).send({msg: "Incorrect data."})
        }
    },

    /*  UPDATE METHOD */
    update: function(req,res){
        var params = req.body;
        
        /* Validate data */
        var vName = !validator.isEmpty(params.name);
        var vSurname = !validator.isEmpty(params.surname);
        var vEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        
        if (vName && vSurname && vEmail){
            /* Create user object */
            var user = new User();
            user.name = params.name.toLowerCase();
            user.surname = params.surname.toLowerCase();
            user.email = params.email.toLowerCase();
            var userId = req.user.sub
            /* Check unique email */
            User.findOne({email: user.email}, (err,userExists) => {
                if(err) {
                    return res.status(500).send({msg: "Error checking user."})
                }
                if(userExists && userExists._id != userId){
                    return res.status(200).send({msg: "Email already in use."})
                } else {
                    User.findOneAndUpdate({_id: userId}, {name:user.name, surname:user.surname,email:user.email},{new:true}, (err,userUpdated) => {
                        if(err) {
                            return res.status(500).send({msg: "Error updating user."})
                        }
                        if(!userUpdated) {
                            return res.status(200).send({msg: "Could not update user."})
                        }
                        return res.status(200).send({userUpdated})
                    })
                }
            })
        }
    }
}

module.exports = userController;