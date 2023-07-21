'use strict'

const Admin = require("./../Model/Admin")
const Team= require("./../Model/Administrative")
const Service= require("./utils_service.js")

function AdminService(app){
     var service = new Service(app);
     this.createAdmin = function(req,cb){
        let admin = new Admin(req.body.idType,req.body.idNumber,req.body.name,true,req.body.email)
    	const userCredentials = {
			"username": req.body.username,
            "password": req.body.password,
            "email": req.body.email
        }
  
       app.models.User.create(userCredentials,(err,obj)  =>{
            if(err) return cb(err)
            
            service.assignRole("admin", obj.id)
            app.models.Admin.create(admin,(err,obj)  =>{
            if(err) return cb(err)
            cb(null,obj)
        }) 

        
    
        })  
     

    }

   
    this.updateAdmin = function(req,cb){
        let admin = new Admin(req.body.idType,req.body.idNumber,req.body.name,true,req.body.email)
        app.models.Admin.updateAll({_id:req.params.id}, admin ,(err,obj)  =>{
            if(err) return cb(err)
            cb(null,obj)
        })        
    }


    this.deleteAdmin = function(req,cb){
        app.models.Admin.destroyById(req.params.id,(err,obj)  =>{
            if(err) return cb(err)
            cb(null,obj)
        })        
    }



    this.createAdministrative = function(req,cb){
        let administrative = new Administrative(req.body.name,req.params.instituition,req.body.adress,true)
    	const userCredentials = {
			"username": req.body.username,
            "password": req.body.password,
            "email": req.body.email
        }
  
       app.models.User.create(userCredentials,(err,obj)  =>{
            if(err) return cb(err)
            cb(null,obj)
     
        app.models.Administrative.create(administrative,(err,obj)  =>{
            if(err) return cb(err)
            cb(null,obj)
        }) 

    })          
}

    this.updateAdministrative = function(req,cb){
        let administrative = new Administrative(req.body.name,req.body.instituition,req.body.adress,true)
        app.models.Administrative.updateAll({instituitionNumber:req.params.instituition}, administrative,(err,obj)  =>{
            if(err) return cb(err)
            cb(null,obj)
        })        
    }


    this.deleteAdministrative = function(req,cb){
        app.models.Administrative.destroyById(req.params.instituition,(err,obj)  =>{
            if(err) return cb(err)
            cb(null,obj)
        })        
    }
}

module.exports = AdminService;
