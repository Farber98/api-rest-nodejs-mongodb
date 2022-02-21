'use strict'

var validator = require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

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
        try{
            var vName = !validator.isEmpty(params.name);
            var vSurname = !validator.isEmpty(params.surname);
            var vEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var vPassword = !validator.isEmpty(params.password);
        }catch(err){
            return res.status(200).send({msg: "Required fields missing."})
        }
        if (!vName || !vSurname || !vEmail || !vPassword){
            return res.status(200).send({msg: "Invalid data."})
        }else{
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
                            return res.status(200).send({msg: "User registered."})
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
        try{
            var vEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var vPassword = !validator.isEmpty(params.password);
        }catch(err){
            return res.status(200).send({msg: "Required fields missing."})
        }
        if (!vEmail || !vPassword) {
            return res.status(200).send({msg: "Invalid data."})
        }else{ 
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
        } 
    },

    /*  UPDATE METHOD */
    update: function(req,res){
        var params = req.body;
        
        /* Validate data */
        try{
            var vName = !validator.isEmpty(params.name);
            var vSurname = !validator.isEmpty(params.surname);
            var vEmail = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        }catch(err){
            return res.status(200).send({msg: "Required fields missing."})
        }
        if (!vName || !vSurname || !vEmail){
            return res.status(200).send({msg: "Invalid data."})
        }else{
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
                        return res.status(200).send({msg: "User updated."})
                    })
                }
            })
        }
    },

    /*  UPLOAD AVATAR METHOD */
    uploadAvatar: function(req,res){
        if(!req.files) {
            return res.status(404).send({msg: "File not detected."})
        }
        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('/')
        var fileName = fileSplit[2]
        var fileExt = fileName.split('.')[1]
        if(fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg'){
            fs.unlink(filePath, (err) => {
                return res.status(200).send({msg: "Not valid file extension."})
            })
        }else{
            User.findOneAndUpdate({_id:req.user.sub},{image:fileName},{new:true}, (err,userUpdated) => {
                if (err){
                    return res.status(500).send({msg: "Error updating user."})
                }
                if (!userUpdated){
                    return res.status(200).send({msg: "User was not updated."})
                }
                return res.status(200).send(({msg: "Avatar uploaded."}))
            })
        }
    },

    getAvatar: function(req,res){
        var fileName = req.params.fileName;
        var filePath = './uploads/users/' + fileName;
        fs.exists(filePath, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(filePath));
            } else {
                return res.status(404).send({msg:'Image not found.'})
            }
        })
    },

    getAllUsers: function(req,res){
        User.find({},'name surname email role image').exec((err,users) => {
            if(err){
                return res.status(500).send({msg: "Error getting users."})
            }
            if(!users){
                return res.status(200).send({msg: "No users."})
            }
            return res.status(200).send({users})
        })
    },

    getUser: function(req,res){
        User.findById(req.params.userId,'name surname email role image').exec((err,user)=> {
            if(err){
                return res.status(500).send({msg: "Error getting users."})
            }
            if(!user){
                return res.status(200).send({msg: "No user."})
            }
            return res.status(200).send({user})
        })
    }

}

module.exports = userController;