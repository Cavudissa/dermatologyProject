const AdminDAL = require('./../Model/Admin.js')
const adminService = require('./../Services/admin_service.js')
module.exports = function(app){

        const AdminService = new adminService(app);
        app.post('/admin',(req, res,next)=>{	
            AdminService.createAdmin(req,(err,data)=>{
                if(err) return next(err)
                res.json(data)
            })
        })


        app.put('/admin/:id',(req, res,next)=>{	
            AdminService.updateAdmin(req,(err,data)=>{
                if(err) return next(err)
                res.json(data)
            })
        })
        
        app.delete('/admin/:id',(req, res,next)=>{	
            AdminService.deleteAdmin(req,(err,data)=>{
                if(err) return next(err)
                res.json(data)
            })
        })

       app.post('admin/:id/administrative',(req, res,next)=>{	
         AdminService.createAdministrative(req,(err,data)=>{
             if(err) return next(err)
             res.json(data)
         })
      })  
        

    app.delete('admin/:id/adminitrative/:instituition',(req, res,next)=>{
         if(!req.query.access_token) return res.redirect('/login')
         AdminService.deleteAdministrative(req,(err,data)=>{
             if(err) return next(err)
             res.json(data)
         })
      })


   app.put('admin/:id/adminitrative/:instituition',(req, res,next)=>{
         if(!req.query.access_token) return res.redirect('/login')	
         AdminService.updateAdministrative(req,(err,data)=>{
             if(err) return next(err)
             res.json(data)
         })
      })
  
}