
const Administrative = require("./../Model/Administrative.js")
const SharedPermission = require("./../Model/SharedPermission.js")
const Team = require("./../Model/Team")
const UtilsService = require('./utils_service.js')
const StaffService = require('./staff_service.js')
const PatientService = require('./patient_service.js')
const decryptService = require('./decrypt_service.js')
const Promise   = require("bluebird")
 function AdministrativeService(app){
    const utilsService = new UtilsService(app)
    const staffService = new StaffService(app)
    const patientService = new PatientService(app)
    var Error = {status: 500, message: 'Something something is not working... Not your fault! Our engineers will take care of it! :)'};
   
    this.createAdministrative = function(req,cb){
        let administrative = new Administrative(req.body.name,req.body.instituitionnumber,req.body.address,true,req.body.email,req.body.password,req.body.country)
        utilsService.createKeyandEncrypt(administrative,['password','kek','dek','email','Status'],(err,obj)=>{
            if(err) return cb(Error)
            app.models.Administrative.create(obj.data,(err,administrative)  =>{
              if(err) return cb(Error)
                utilsService.assignRole("administrative", administrative.id,(errOnAssigning,res)=>{
                    if(errOnAssigning) {
                        //if already added administrative but occured a problem while assigning role
                        //then delete this administrative and return the errOnAssigning
                        app.models.Administrative.destroyById(obj.id,(errOnDestroying,obj)  =>{
                            if(errOnDestroying) return cb(Error)
                        })   
                        return cb(obj)
                    }
                    app.models.Administrative.login({email:req.body.email,password:req.body.password}, 'administrative', function (err, result) {			
                        if (err) {
                            return cb(err)
                        }
                        cb(null,{accessToken:result.id,id:administrative.id})
                    });
                })
            })
        })
    }

    this.detailAdministrative = function(req,cb){
        app.models.Administrative.findOne({where:{_id:req.params.instituition}},(err,result)=>{
            if(err) return cb(Error)
            decryptService.decryptAllInfo(result,(err,administrative)=>{
                if(err) return cb(Error)
                cb(null,administrative)
            })
        })
    }

    this.getStaffMember = function(Model,req,cb){
        Model.findOne({where:{_id:req.params.staffmemberId}},function(err,member){
            if(err) return cb(Error);
            decryptService.decryptAllInfo(member,(err,result)=>{
                if(err) return cb(Error);
                cb(null,result)
            })
        })
    } 


this.getMembers = function(Model,req,cb){
    Model.find(function(err,members){
        if(err) return cb(Error);
        if(members.length==0)
            return cb(null,[])
        const results = members.filter(member =>
              member.RegistedInstitutions.includes(req.params.instituition))
        decryptService.decryptAllInfo(results,(err,data)=>{
            if(err) return cb(Error);
            cb(null,data)
        })
    })
} 


    this.updateAdministrative = function(req,cb){
        //TODO: Check this!!
        let administrative = new Administrative(req.body.name,req.body.instituitionnumber,req.body.address,true,req.body.email)
        let body = req.body
        for(var p in body) { if(body[p]==undefined || body[p]=="")    delete body[p]}
        app.models.Administrative.updateAll({InstituitionNumber:req.params.instituition},body,(err,obj)  =>{
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

     this.getAdministratives = function(req,cb){
        app.models.Administrative.find((err,administratives)  =>{
            if(err) return cb(err)
            cb(null,administratives)
        })        
    }

    this.addPeople = function(req,cb){
        var Model= app.models.Doctor
        const role = req.body.role
        const email= req.body.memberEmail
        const instituitionId= req.params.instituition
       
        if(role =="nurse"){
            Model= app.models.Nurse 
        }
        app.models.user.findOne({where:{email:email},include:{relation:role}},(err,user)=>{
            if(err) return cb(Error)
            if(!user) return cb({status:400,message:'Este utilizador não existe ou não é um '+role})
            user = user.__data[role]
            if(!user.RegistedInstitutions.includes(instituitionId)){
                user.RegistedInstitutions.push(instituitionId)
                var body = {RegistedInstitutions: user.RegistedInstitutions}
                Model.updateAll({id:user.id},body,(err,model)=>{
                   if(err) return cb(Error)
                   cb(null,model)        
                }) 
            }   
        })
    }

     this.shareMedicalRecord = function(req,cb){
        const teamId = req.body.teamId
        const email  = req.body.patientEmail
        app.models.user.findOne({where:{email:email},include:{relation:'patient'}},(err,user)=>{
            if(user == null)
                return cb({status:400,message:'Not Found'})
            var patient = user.__data.patient
            this.detailAdministrative(req,(err,administrative)=>{
                if(err) return cb(Error)
                let subject ="Aplicação Medical Skin Care"  
                let text = "A instituição "+administrative.Name + " Localizada em "+administrative.Address +" necessita de permissão para aceder aos seus dados. Vá em Notificações para  conceder permissão." 
                const shared = new SharedPermission(teamId,patient.id,false,text)
                app.models.SharedPermission.create(shared,(err,result)=>{
                    if(err) return cb(Error)
                    patient.RegistedInstitutions.push(req.params.instituition)
                    app.models.Patient.updateAll({id:patient.id},{RegistedInstitutions:patient.RegistedInstitutions},(err,res)=>{
                        if(err) return cb(Error)
                        app.models.Email.sendEmail(email,text,subject,(err,result)=>{
                            if(err) return cb(Error)
                            cb(null,result)
                        })      
                    })   
                })
            })
        })   
    }   


     this.createTeam = function(req,cb){
        app.models.Administrative.findOne({where:{_id:req.params.instituition}},(err,dataAdmin)=>{
            if(err) return cb(Error)
            app.models.user.findOne({where:{email:req.body.leader},include:{relation:'doctor'}},(err,user)=>{
                if(err) return cb(Error)
                if(user ==null){
                  return cb({status:401,message:"User not Found"})
                }
                var doctor = user.__data.doctor
                var doctors = []
                doctors.push(doctor.id.toString())
                let team = new Team(true,doctor,req.body.lastname,doctors,[])
                utilsService.createKeyandEncrypt(team,['kek','dek','Status','Doctors','Nurses','Leader','TeamName'],(err,obj)=>{
                  if(err) return cb(Error)
                  dataAdmin.teams.create(obj.data,(err,teamObj)  =>{
                      if(err) return cb(Error)
                      doctor.Teams.push(teamObj.id)
                      app.models.Doctor.updateAll({id:doctor.id.toString()},{Teams:doctor.Teams},(err,result)=>{
                          if(err) return cb(Error)
                          cb(null,result)
                      })
                  })
                })
            })
        })
    }
    this.createDoctor = function(req,cb){
        staffService.createDoctor(req,(err,obj)=>{
            if(err) return cb(err)
            cb(null,obj)
        })
    }

    this.createPatient = function(req,cb){
        patientService.createPatient(req,(err,patientObj)=>{
            if(err) return cb(err)
            cb(null,patientObj)
        })
    }

    this.createNurse = function(req,cb){
        staffService.createNurse(req,(err,obj)=>{
            if(err) return cb(err)
            cb(null,obj)
        })
    }
    this.addStaffToTeam = function(req,cb){
        const email = req.body.memberId
        const teamId = req.params.teamId
        app.models.user.findOne({where: {email:email}},(err,userObj)=>{
            if(err) return cb(Error)
            if(!userObj) return cb(err.detail.message)
            if(userObj.realm == 'patient') return cb ({status:400,message:'Um paciente não pode ser inserido como membro duma equipa!'})
            if(userObj.realm == 'nurse'){
                this.addMemberToTeam(app.models.Nurse,userObj.id,teamId,'Nurses',(err,result)=>{
                    if(err) return cb(Error)
                    cb(null,result)
                })
            }
            else if(userObj.realm == 'doctor')
            this.addMemberToTeam(app.models.Doctor,userObj.id,teamId,'Doctors',(err,result)=>{
                if(err) return cb(Error)
                cb(null,result)
            })     
        })
    }
        
    this.addMemberToTeam= function(Model,memberId,teamId,staff,cb){
        Model.findOne({where:{userId:memberId}},(err,staffObj)=>{  
            if(err) return cb(Error)
            staffObj.Teams.push(teamId)
            Model.updateAll({userId:memberId},{Teams :staffObj.Teams},(err,res)=>{
                if(err) return cb(Error)
                app.models.Team.findOne({where: {_id:teamId}},(err,teamObj)=>{
                    if(err) return cb(Error)
                    teamObj[staff].push(staffObj.id)
                    app.models.Team.updateAll({id:teamId},{[staff]:teamObj[staff]},(err,res)=>{
                        if(err) return cb(Error)
                        cb(null,res)
                    })
                })
            })
        }) 
    }
        
      


    this.getAdministrativeTeams = function(req,cb){
        app.models.Administrative.findOne({where: {_id:req.params.instituition}},(err,obj)  =>{
            if(err) return cb(Error)
            obj.teams.find((err,t)=>{
                if(err) return cb(Error)
                if(t.length == 0)
                    return cb(null,{Teams:[]})
                var obj = {}
                obj.Teams = []
                t.forEach(team =>{
                    obj.Teams.push({Team:team,Leader:team.Leader})
                })
                decryptService.decryptAllInfo(obj,(err,result)=>{
                    if(err) return cb(Error)
                    cb(null,result)
                }) 
            })
        })        
    }

    this.deleteAdministrativeTeam = function(req,cb){
      app.models.Team.destroyById(req.body.teamId,(err,info) =>{
          if(err) return cb(Error)
          cb(null,info)
      })
    }

    this.removeStaffFromTeam = function(Model,req,cb){
      var role = 'doctor'
      var model = 'Doctors'
      if(req.body.role !='doctor'){
        role = 'nurse'
        model = 'Nurses'
      }
      app.models.user.findOne({where:{email:req.body.email},include:{relation:role}},(err,user)=>{
        if(err) return cb(Error)
        if(!user) return cb({status:400,message:'Este utilizador não existe ou não é um '+role})
        app.models.Team.findOne({where:{id:req.params.teamId}},(err,team)=>{
          if(err) return cb(Error)
          user = user.__data[role]
          var body_Model = user.Teams.filter(id => id!=req.params.teamId)
          var body_Team = team[model].filter (id => id!=user.id)
          var ab = {[model]:body_Team}
          Model.updateAll({id:user.id},{Teams:body_Model},(err,model)=>{
              if(err) return cb(Error)
              app.models.Team.updateAll({id:req.params.teamId},ab,(err,team)=>{
                if(err) return cb(Error)
                cb(null,team)        
              })         
          }) 
        })
      })
    }


    this.updateAdministrativeTeam = function(req ,cb){
        //Check THIS!!
        let body = req.body
        for(var p in body) { if(body[p]==undefined || body[p]=="")    delete body[p]}
        getAdministrativeTeamByTeamName(req,(err,teamObj) =>{
            if(err) return cb(err)
            app.models.Team.updateAll({TeamName:req.params.teamname},body,(err,obj)  =>{
                if(err) return cb(err)
                cb(null,obj)
               })           
            })
        
    }

    this.getAdministrativeTeamByTeamName = function(req,cb){
         this.getAdministrativeTeams(req,(err,teams) =>{
            if(err) return cb(Error)
            let teamObj = teams.filter(team =>team.TeamName ==req.params.teamname)
            cb(null,teamObj[0])
       })
    }

    this.deleteAdministrativeTeamByTeamName = function(req,cb){
        this.getAdministrativeTeamByTeamName(req,(err,teamObj) =>{
            if(err) return cb(Error)
            app.models.Team.destroyById(req.params.teamname,(err,obj)  =>{
                if(err) return cb(Error)
                cb(null,obj)
               })           
        })
    }

    this.loginAdministrative =function(req,cb){
        app.models.Administrative.login(req.body, 'administrative', function (err, result) {			
            if (err) {
                return cb({status:401,message:"Login Failed"})
            }
            cb(null,{accessToken:result.id,id:result.userId.toString()})
        });
    }


this.getAllTeamMembers= function(Model,req,staffRole,cb){
    app.models.Team.findOne({where:{id:req.params.teamId}},(err,result)=>{
        if(result[staffRole].length ==0) return cb(null,[])
        utilsService.filterFindbyParam(result[staffRole],Model,'id',(err,members)=>{
            if(err) return cb(Error)
            decryptService.decryptAllInfo(members,(err,result)=>{
                if(err) return cb(Error)
                cb(null,result)
            })
        })
    })
           
     
 }
    this.getAllTeamPatients= function(req,cb){
        app.models.Patient.find((err,patients)=>{
            if(err) return cb(Error)
            if(patients.length==0)
                return cb(null,[])
            patients = patients.filter(patient =>patient.RegistedInstitutions.includes(req.params.instituition))
            decryptService.decryptAllInfo(patients,(err,data)=>{
                if(err) return cb(Error)
                cb(null,data)
            })
        })
    }
 
}
module.exports = AdministrativeService