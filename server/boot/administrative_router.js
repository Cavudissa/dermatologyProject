const AdministrativeDAL = require('./../Model/Administrative')
const administrativeService = require('./../Services/administractive_service')
module.exports = function(app){
    const AdministrativeService = new administrativeService(app);


    app.get('/administrative/:instituition/patient',(req, res,next)=>{
        const token = `?accessToken=${req.query.accessToken}`
        AdministrativeService.getAllTeamPatients(req,(err,patients)=>{
            if(err) return next(err)
            if(patients.length>0){ 
                patients.forEach(patient=> 
                        patient.PatientURL = `/administrative/${req.params.instituition}/patient/${patient.id}${token}`)
            
                res.render("getPatientsList.hbs",{patientsObjs:patients, backToAdministrative:`/administrative/${req.params.instituition}${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})
            }
            else res.render("getPatientsList.hbs",{isNotArray:true, backToAdministrative :`/administrative/${req.params.instituition}${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})     
        })
    })  

    
    app.get('/administrative/:instituition/doctors',(req, res,next)=>{
        const token = `?accessToken=${req.query.accessToken}`
        AdministrativeService.getMembers(app.models.Doctor,req,(err,doctors)=>{
            if(err) return next(err)
            if(doctors.length>0){ 
            doctors.forEach(doctor=>{
                    doctor.DoctorURL = `/administrative/${req.params.instituition}/doctor/${doctor.id}${token}`
                    doctor.Role="Doutor"})
            res.render("getStaffMembersList.hbs",{doctorsObjs:doctors, backToAdministrative:`/administrative/${req.params.instituition}${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})
            }
            else res.render("getStaffMembersList.hbs",{isNotArray:true, backToAdministrative :`/administrative/${req.params.instituition}${token}`,administrative:'administrative',logout:`/logout/administrative${token}`,Staff:'Médicos'})     
        })
    })  

    app.get('/administrative/:instituition/nurses',(req, res,next)=>{    
        const token = `?accessToken=${req.query.accessToken}`
        AdministrativeService.getMembers(app.models.Nurse,req,(err,doctors)=>{
                if(err) return next(err)
                if(doctors.length>0){ 
                doctors.forEach(doctor=>{
                        doctor.DoctorURL = `/administrative/${req.params.instituition}/nurse/${doctor.id}${token}`
                        doctor.Role="Enfermeiro"})
                res.render("getStaffMembersList.hbs",{doctorsObjs:doctors, backToAdministrative:`/administrative/${req.params.instituition}${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})
                }
            else res.render("getStaffMembersList.hbs",{isNotArray:true, backToAdministrative :`/administrative/${req.params.instituition}${token}`,administrative:'administrative',logout:`/logout/administrative${token}`,Staff:'Enfermeiros'})     
        })
    })  
    
    app.get('/login/administrative',(req, res,next)=>{
        res.render("login.hbs",{postURL:'/login/administrative'})
    })
    
    app.post('/login/administrative',(req, res,next)=>{
        AdministrativeService.loginAdministrative(req,(err,result)=>{
            if(err) return next(err)
            res.status(200).json({url:`/administrative/${result.id}?accessToken=${result.accessToken}`}) 
        })
    })
    
    app.get('/logout/administrative',(req,res,next)=>{
        const access_token = req.query.accessToken;
        if (!access_token) {
            res.status(400).json({"error": "access token required"});
            return;
        }
        app.models.Administrative.logout(access_token, function (err) {
            if (err) {
                res.status(404).json({"error": "logout failed"});
                return;
            }
            res.redirect('/home');
        });		
    })
          
   

   app.get('/administrative/:instituition',(req, res,next)=>{
        const token = `?accessToken=${req.query.accessToken}`
        AdministrativeService.detailAdministrative(req,(err,data)=>{
            if(err) return next(err)
            res.render("administrative.hbs",{ administrativeData:data,
                                              instituitionID:req.params.instituition,
                                              token: token,
                                              logout:`/logout/administrative${token}`,
                                              administrative:'administrative',
                                              postTeamURL: `/administrative/${req.params.instituition}/team${token}`,
                                              postStaffURL: `/administrative/${req.params.instituition}/`,
                                              postPatientURL: `/administrative/${req.params.instituition}/patient${token}`,
                                              DoctorsURL: `/administrative/${req.params.instituition}/doctors${token}`,
                                              NursesURL: `/administrative/${req.params.instituition}/nurses${token}`,
                                              AddPeopleURL:`/administrative/${req.params.instituition}/people${token}`,
                                              SharePatientMedicaRecordURL:`/administrative/${req.params.instituition}/share${token}`
                                            }
                      )
        })
    })  

   
    app.post('/administrative-register',(req, res,next)=>{	
        AdministrativeService.createAdministrative(req,(err,result)=>{
            if(err) return next(err)
            res.redirect(`/administrative/${result.id}?accessToken=${result.accessToken}` )
        })
    })


     app.get('/administrative-register',(req, res,next)=>{	
        res.render("registe-administrative.hbs",{postURL:'/administrative-register'})
    })

    app.post('/administrative/:instituition/team',(req, res,next)=>{    
        AdministrativeService.createTeam(req,(err,data)=>{
            if(err) return next(err)
            res.redirect(`/administrative/${req.params.instituition}?accessToken=${req.query.accessToken}`)
        })
    })

    app.post('/administrative/:instituition/doctor',(req, res,next)=>{    
        AdministrativeService.createDoctor(req,(err,result)=>{
                if(err) return next(err)
                res.redirect(`/administrative/${req.params.instituition}?accessToken=${req.query.accessToken}`)
        })
    })

    app.post('/administrative/:instituition/people',(req, res,next)=>{    
        AdministrativeService.addPeople(req,(err,result)=>{
                if(err) return next(err)
                res.redirect(`/administrative/${req.params.instituition}?accessToken=${req.query.accessToken}`)
        })
    })

    app.post('/administrative/:instituition/share',(req, res,next)=>{    
        AdministrativeService.shareMedicalRecord(req,(err,result)=>{
                if(err) return next(err)
                res.redirect(`/administrative/${req.params.instituition}?accessToken=${req.query.accessToken}`)
        })
    })

    app.post('/administrative/:instituition/nurse',(req, res,next)=>{    
        AdministrativeService.createNurse(req,(err,data)=>{
                if(err) 
                   return next(err)
                res.redirect(`/administrative/${req.params.instituition}?accessToken=${req.query.accessToken}`)
        })
    })

    app.post('/administrative/:instituition/patient',(req, res,next)=>{    
        AdministrativeService.createPatient(req,(err,data)=>{
                if(err) return next(err)
                res.redirect(`/administrative/${req.params.instituition}?accessToken=${req.query.accessToken}`)
        })
    })
    

    app.get('/administrative/:instituition/team',(req, res,next)=>{
        const token = `?accessToken=${req.query.accessToken}`
        let teams = []
        AdministrativeService.getAdministrativeTeams(req,(err,data)=>{
            if(err) return next(err)
            if(data.Teams.length>0){
                data.Teams.map(team => teams.push({
                    TeamLeader : team.Leader.Name +" "+team.Leader.LastName,
                    TeamName   :team.Team.TeamName,
                    teamNursesURL: `/administrative/${req.params.instituition}/team/${team.Team.id}/nurses${token}`,
                    teamDoctorsURL: `/administrative/${req.params.instituition}/team/${team.Team.id}/doctors${token}`,
                    teamLeaderURL: `/administrative/${req.params.instituition}/doctor/${team.Leader.id}${token}`,
                    addMemberURL : `/administrative/${req.params.instituition}/team/${team.Team.id}${token}`,
                    id:team.Team.id
                }))
            }
            res.render("getTeams.hbs",{teams:teams,  backToAdministrative :`/administrative/${req.params.instituition}${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})
        })
    }) 
    app.get('/administrative/:instituition/team/:teamId/nurses',(req, res,next)=>{    
        let nursesObjs = []
        const token = `?accessToken=${req.query.accessToken}`
        AdministrativeService.getAllTeamMembers(app.models.Nurse,req,'Nurses',(err,nurses)=>{
            if(err) return next(err)
            if(nurses.length>0){ 
                nurses.map(nurse=> nursesObjs.push({
                    StaffMemberName : nurse.Name +" "+nurse.LastName,
                    StaffMemberEmail: nurse.Email,
                    StaffMemberRole: "Enfermeiro",
                    StaffMemberURL: `/administrative/${req.params.instituition}/nurse/${nurse.id}${token}`
                }))
                res.render("staffMemberList.hbs",{staffMembers:nursesObjs, backToAdministrative :`/administrative/${req.params.instituition}/team${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})
            } 
            else res.render("staffMemberList.hbs",{isNotArray:true,StaffMemberRole: " enfermeiros ", backToAdministrative :`/administrative/${req.params.instituition}/team${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})
                
        })
           
    })
    
    app.get('/administrative/:instituition/team/:teamId/doctors',(req, res,next)=>{    
        const token = `?accessToken=${req.query.accessToken}`
        let doctorsObjs = []
        AdministrativeService.getAllTeamMembers(app.models.Doctor,req,'Doctors',(err,doctors)=>{
            if(err) return next(err)
            if(doctors.length>0){ 
                doctors.map(doctor=> doctorsObjs.push({
                    StaffMemberName : doctor.Name +" "+doctor.LastName,
                    StaffMemberEmail: doctor.Email,
                    StaffMemberRole: "Doutor",
                    StaffMemberURL: `/administrative/${req.params.instituition}/doctor/${doctor.id}${token}`,
                }))
                res.render("staffMemberList.hbs",{staffMembers:doctorsObjs, backToAdministrative :`/administrative/${req.params.instituition}/team${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})
            }
            else res.render("staffMemberList.hbs",{isNotArray:true,StaffMemberRole: " doutores ", backToAdministrative :`/administrative/${req.params.instituition}/team${token}`,administrative:'administrative',logout:`/logout/administrative${token}`})     
        })          
    }) 

    app.put('/administrative/:instituition/team/:teamId',(req, res,next)=>{    
        AdministrativeService.addStaffToTeam(req, (err,member)=>{
            if(err) return next (err)
            res.status(200).send({msg: 'Member Added'})
        }) 
    })

    app.delete('/administrative/:instituition/team/:teamId/doctors',(req, res,next)=>{    
        AdministrativeService.removeStaffFromTeam(app.models.Doctor,req, (err,member)=>{
            if(err) return next (err)
            res.status(200).send({msg: 'Member removed'})
        }) 
    })

    app.delete('/administrative/:instituition/team/:teamId/nurses',(req, res,next)=>{    
        AdministrativeService.removeStaffFromTeam(app.models.Nurse,req, (err,member)=>{
            if(err) return next (err)
            res.status(200).send({msg: 'Member removed'})
        }) 
    })

    app.get('/administrative/:instituition/doctor/:staffmemberId',(req, res,next)=>{
        const token = `?accessToken=${req.query.accessToken}`    
        AdministrativeService.getStaffMember(app.models.Doctor,req,(err,doctor)=>{
            if(err) return next(err)
            doctor.StaffMemberRole="Doutor"
            doctor.logout = `/logout/administrative${token}`
            doctor.administrative = 'administrative'
            doctor.backToAdministrative = `/administrative/${req.params.instituition}${token}`
            res.render("StaffmemberDetail.hbs",doctor)  
        })      
    }) 
    app.get('/administrative/:instituition/nurse/:staffmemberId',(req, res,next)=>{
        const token = `?accessToken=${req.query.accessToken}`    
        AdministrativeService.getStaffMember(app.models.Nurse,req,(err,nurse)=>{
                if(err) return next(err)
                nurse.StaffMemberRole="Enfermeiro"
                nurse.logout = `/logout/administrative${token}`
                nurse.administrative = 'administrative'
                nurse.backToAdministrative = `/administrative/${req.params.instituition}${token}`
                res.render("StaffmemberDetail.hbs",nurse)  
        })       
    })         
}