"use strict";
const patientDAL = require('./../Model/Patient.js')
const SharedPermissionDAL = require('./../Model/SharedPermission')
const decryptService = require('./decrypt_service.js')

function PatientService(app){
    const UtilsService = require('./utils_service.js')
    const utilsService = new UtilsService(app)
    const patientRole = 'patient'
    const Error = {status:500,message:"Something something is not working... Not your fault! Our engineers will take care of it! :)"}
    this.createPatient = function(req,cb){
        const userCredentials = {
            "password": utilsService.generatePassword(),
            "email":  req.body.email,
            "realm": patientRole
        }
        let instituitions =[]
        instituitions.push(req.params.instituition)
        let patient = new patientDAL(req.body.idType,req.body.idNumber,req.body.name,req.body.lastname,true,req.body.gender,req.body.nationality,
                                req.body.address,req.body.postalcode,req.body.email,req.params.instituition,req.body.maritalstatus,req.body.nif,req.body.birthdate,
                                req.body.phonenumber,req.body.cityofbirth,req.body.countrybirth,instituitions)
        utilsService.createKeyandEncrypt(patient,['Status','InstituteID','kek','dek','RegistedInstitutions'],function(err,result){
            if (err) cb(Error)
            app.models.user.create(userCredentials, function(err,user) {
                if (err) cb(Error)
                result.data.teamId = req.body.teamID
                user.patient.create(result.data, function(err,doc){
                    if (err) return cb(Error)
                    utilsService.assignRole(patientRole, user.id,(err,res)=>{
                        if(err) return cb(Error)
                        let sharedPermission = new SharedPermissionDAL(req.body.teamID,doc.id,true,result.kek,result.dek)
                        app.models.SharedPermission.create(sharedPermission,function(err,doc){
                            if (err) return cb(Error)
                            let text = `Obrigado por se ter registado na nossa aplicação. Segue o seu password : ${userCredentials.password}. \nCom os melhores cumprimentos, \nDermosApp.`
                            let subject = 'O seu password'
                            app.models.Email.sendEmail(req.body.email,text,subject,(err,result)=>{
                                if(err) return cb(Error)
                                cb(null,result)
                           })
                        })
                    })      
                })
            })    
        })
    }


    this.acceptShare = function(req,cb){
        app.models.SharedPermission.findOne({where: {and :[{Patient:{like:req.params.id}},{DidPatientAccepted:false},{Team:{like:req.body.teamId}}]}},(err,result)=>{
            if(err) return cb(Error)
            app.models.SharedPermission.updateAll({id:result.id},{DidPatientAccepted:true,text:""},(err,result)=>{
                if(err) return cb(Error)
                cb(null,result)
            })
        })
    }

    this.getTeamMembers = function(req,cb){
        app.models.SharedPermission.find({where: {and :[{Patient:{like:req.params.id}},{DidPatientAccepted:true}]}},(err,shares)=>{
            if(err) return cb(Error)
            if (shares.length==0){
                return cb(null,{Teams:[]})
            }
            let obj = {}
            obj.Teams = []
            let teams = []
            shares.forEach(share=> {
                teams.push(app.models.Team.findOne({where:{id:share.Team}}))
            })  
            Promise.all(teams)
            .then(teams =>{
                let staff = [] 
                teams.forEach(team =>{
                    let prom = []
                    let filterNurse = []
                    let filterDoctor = []
                    team.Doctors.forEach(doctor =>{
                        filterDoctor.push({id:doctor})
                    })
                    team.Nurses.forEach(doctor =>{
                        filterNurse.push({id:doctor})
                    })
                    prom.push(app.models.Doctor.find({where:{or:filterDoctor}}))
                    prom.push(app.models.Nurse.find({where:{or:filterNurse}}))
                    staff.push(prom)
                   // obj.Teams.push({TeamName:team.TeamName})
                })
                const promise4all = Promise.all(
                    staff.map(function(innerPromiseArray) {
                        return Promise.all(innerPromiseArray);
                    })
                );
                promise4all
                .then(staffs =>{
                   for(var i = 0 ; i < staffs.length; i++){
                        obj.Teams.push({doctors:staffs[i][0]})
                        obj.Teams[i].nurses = staffs[i][1]
                    }
                    decryptService.decryptAllInfo(obj,(err,result)=>{
                        if(err) return cb(Error)
                        for(var i = 0 ; i < result.Teams.length; i++){
                           result.Teams[i].id = shares[i].id.toString()
                        }
                        cb(null,result)
                    })
                })
                .catch(err =>{
                    cb(Error)
                })
            })
        })
    }

    this.getPatients = function(cb){
        app.models.Patient.find(function(err,doc){
            if(err) return cb(Error);
            cb(null,doc)
        })
    }

    this.detailPatient = function(req,cb){
        app.models.Patient.findOne({where:{id:req.params.id}},(err,patient)=>{
            if(err) return cb(Error)
            var histories=[]
            histories.push(patient.familyHistory.get())
            histories.push(patient.sexualHistory.get())
            histories.push(patient.socialHistory.get())
            histories.push(patient.medicalHistory.get())
            Promise.all(histories)
            .then(data => {
                var obj = {patient:patient,sexual:data[1],family:data[0],social:data[2],medical:data[3]}
                decryptService.decryptAllInfo(obj,(err,result)=>{
                    if(err) return cb(Error)
                    this.getNotifications(req,(err,not)=>{
                        if(err) return cb(Error)
                        cb(null,{Patient:result,shares:not,length:not.length})
                    })
                   
                })
            })
        })
    }
    
    this.getNotifications = function(req,cb){
        const patientId = req.params.id
        app.models.SharedPermission.find({where: {and :[{Patient:{like:patientId}},{DidPatientAccepted:false}]}},(err,shares)=>{
            if(err) return cb(Error)
            if(shares.length==0)
            return cb(null,[])
            let mapped = shares.map(share=>{ return {team:share.Team,msg:share.text}})
            cb(null,mapped) 
        })
                
    }

    this.getPatientMedicalRecordGroups = function(req,cb){
        app.models.Patient.findOne({where:{id:req.params.id}},function(err,patient){
            if(err) cb(Error)
            patient.medicalRecordGroups.find((err,mrgData)=>{
                if(err) cb(Error)
                var obj = {medicalRecordGroups:mrgData}
                decryptService.decryptAllInfo(obj,(err,result)=>{
                    if(err) return cb(Error)
                    cb(null,result)
                })
            })
        })
    }

    this.getPatientMRGDetail = function(req,cb){
        this.getPatientMedicalRecordGroups(req,function(err,result){
            if(err) cb(Error)
            var detail = result.medicalRecordGroups.filter(elem => elem.id.toString() == req.params.mid)[0]
            cb(null,{medRecordsGroup:detail})
        })
    }

    this.getPatientAllMedicalRecords = function(req,cb){
        this.getPatientMRGDetail(req,function(err,result){
            if(err) cb(Error)
            app.models.MedicalRecord.find({where:{medicalRecordGroupId:result.medRecordsGroup.id}},(err,result)=>{
                if(err) cb(Error)
                var obj = {medicalRecords:result}
                decryptService.decryptAllInfo(obj,(err,result)=>{
                    if(err) cb(Error)
                    cb(null,result)
                })
            })
        })
    }

    this.getPatientAllDetailedMedicalRecords = function(req,cb){
        this.getPatientMRGDetail(req,function(err,result){
            if(err) cb(Error)
            app.models.DetailedMedicalRecord.find({where:{medicalRecordGroupId:result.medRecordsGroup.id}},(err,result)=>{
                if(err) cb(Error)
                var obj = {detailedmedicalRecords:result}
                decryptService.decryptAllInfo(obj,(err,result)=>{
                    if(err) cb(Error)
                    cb(null,result)
                })
            })
        })
    }

    this.getPatientMedicalRecord = function(req,cb){
        app.models.MedicalRecord.findOne({where:{id:req.params.mrid}},(err,result)=>{
            if(err) return cb(Error)
            var medicalRecord={}
            medicalRecord.medicalRecord = result
            if(result.TeamNotes.length!=0){
                medicalRecord.TeamNotes = result.TeamNotes
            }
            decryptService.decryptAllInfo(medicalRecord,(err,res)=>{
                if(err) return cb(Error)
                cb(null,res)
            })
        })
    }

    this.getPatientDetailedMedicalRecord = function(req,cb){
        app.models.DetailedMedicalRecord.findOne({where:{id:req.params.did}},(err,detail)=>{
            if(err) return cb(Error)
            var detailedmedicalRecord={}
            detailedmedicalRecord.detailedmedicalRecord = detail
            
            if(detail.TeamNotes.length!=0){
                detailedmedicalRecord.TeamNotes = detail.TeamNotes
            }
            decryptService.decryptAllInfo(detailedmedicalRecord,(err,res)=>{
              if(err) return cb(Error)
              app.models.container.getFiles(detail.container,(err,result)=>{
                  if(err) return cb(Error)
                  var obj = []
                  result.forEach(elem => obj.push({src: elem.fullPath}))
                  detailedmedicalRecord.detailedmedicalRecord.uploadedImages = obj
                  cb(null,detailedmedicalRecord)
              })
            })
        })
    }

    this.revokePermissions = function(req,cb){
      app.models.SharedPermission.updateAll({id:req.params.shareId},{DidPatientAccepted:false},(err,res)=>{
        if(err) cb(Error)
        cb(null,res)
      })
    }

    this.getPatientTeams = function(req,cb){
        this.detailPatient(req,function(err,result){
            if(err) cb(Error)
            cb(null,result.team)
        })
    }

    this.getPatientTeamDoctors = function(req,cb){
        this.detailPatient(req,function(err,result){
            if(err) cb(Error)
            cb(null,result.doctors)
        })
    }

    this.getPatientTeamDoctorsDetail = function(req,cb){
        this.getPatientTeamDoctors(req,function(err,result){
            if(err) cb(err)
            //Filter the one with equal req.did
            //result = result.filter
            cb(null,result)
        })
    }

    this.getPatientTeamNurses = function(req,cb){
        this.getPatientTeams(req,function(err,result){
            if(err) cb(err)
            cb(null,result.nurses)
        })
    }

    this.getPatientTeamNursesDetail = function(req,cb){
        this.getPatientTeamNurses(req,function(err,result){
            if(err) cb(err)
            //Filter the one with equal req.nid
            //result = result.filter
            cb(null,result)
        })
    }
}

module.exports = PatientService