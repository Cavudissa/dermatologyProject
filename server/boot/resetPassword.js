module.exports = function(app){
  /** Reset and change Password Routes **/
  var Error = {status:400,message:'There is no user with the input email... Please enter a valid email'}
  app.get('/resetparticular',(req, res,next)=>{
      res.render("reset.hbs",{postURL:'/resetparticular'})   
  })

  app.get('/resetadministrative',(req, res,next)=>{
    res.render("reset.hbs",{postURL:'/resetadministrative'})   
  })      
  
  app.post('/resetparticular',(req,res,next)=>{
    resetPassword(app.models.user,req,(err,result)=>{
      if(err) return next(err)
      res.redirect('/home')
    })
  })

  function resetPassword(Model,req,cb){
    Model.findOne({where:{email:req.body.email}},(err,user)=>{
      if(err) return cb(Error)
      if(user==null){
        return cb(Error)
      }
      Model.resetPassword({email:req.body.email}, (err,result)=>{
        if(err) return cb({status:500,message:err})
        Model.setPassword(user.id.toString(), req.body.password,(err,result)=>{
          if(err) return cb({status:500,message:'We are very sorry but your password could not be changed! :('})
          cb(null,result)
        })
      })
    })
  }

  app.post('/resetadministrative',(req,res,next)=>{
      resetPassword(app.models.Administrative,req,(err,result)=>{
        if(err) return next(err)
        res.redirect('/home')
      })
  })


  app.post('/nurse/:id/changepassword',(req,res,next)=>{
    app.models.user.findOne({where:{email:req.body.email}},(err,user)=>{
      if(err) return next (err)
      if(user==null){
        return next(Error)
      }
      app.models.user.changePassword(user.id.toString(), req.body.oldPassword, req.body.password,(err,result)=>{
        if(err) return next (err)        
        res.redirect(`/login/particular`)
      })
    })
  })


  app.post('/doctor/:id/changepassword',(req,res,next)=>{
    app.models.user.findOne({where:{email:req.body.email}},(err,user)=>{
      if(err) return next (err)
      if(user==null){
        return next(Error)
      }
      app.models.user.changePassword(user.id.toString(), req.body.oldPassword, req.body.password,(err,result)=>{
        if(err) next (err)
        res.redirect(`/login/particular`)
      })
    })
  })


  app.post('/patient/:id/changepassword',(req,res,next)=>{
    app.models.user.findOne({where:{email:req.body.email}},(err,user)=>{
      if(err) return next (err)
      if(user==null){
        next(Error)
      }
      app.models.user.changePassword(user.id.toString(), req.body.oldPassword, req.body.password,(err,result)=>{
        if(err) return next (err)
        res.redirect(`/login/particular`)
      })
    })
  })

}