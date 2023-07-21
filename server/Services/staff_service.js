"use strict";
const doctorDAL = require('./../Model/Doctor.js')
const UtilsService = require('./utils_service.js')
var kekG= require("keygenerator");

const AdminstrativeService = require('./administractive_service.js')
const mrgDAL = require('./../Model/MedicalRecordGroup.js')
const medicalRecordsDAL = require('./../Model/MedicalRecord.js')
const kvDAL = require('./../Model/KeyValuePair.js')
const nurseDAL = require('./../Model/Nurse.js')
const detailedMRDAL = require('./../Model/DetailedMedicalRecord.js')
const sexualHistoryDAL = require('./../Model/SexualHistory.js')
const socialHistoryDAL = require('./../Model/SocialHistory.js')
const familyHistoryDAL = require('./../Model/FamilyMedicalHistory')
const medicalHistoryDAL = require('./../Model/MedicalHistory.js')
const Promise = require("bluebird");
const decryptService = require('./../Services/decrypt_service.js')
const azure = require('azure-storage');
function StaffService(app){
  const utilsService = new UtilsService(app)
  const Error = {status:500,message:"Something something is not working... Not your fault! Our engineers will take care of it! :)"}
	this.createDoctor = function(req,cb){
        var doctorRole = 'doctor'
        const userCredentials = {
            "password": utilsService.generatePassword(),
            "email": req.body.email,
            "realm":doctorRole
        }
        let instituitions =[]
        instituitions.push(req.params.instituition)
        const doctor = new doctorDAL(req.body.idType,req.body.idNumber,req.body.name,req.body.lastname,true,
                      req.body.gender,req.body.nationality,req.body.address,req.body.postalcode,
                      req.body.email,req.params.instituition,[],instituitions)
        utilsService.createKeyandEncrypt(doctor,['kek','dek','Status','Teams','InstituteID','RegistedInstitutions'],(err,doc)=>{
            app.models.user.create(userCredentials, function(err,user) {
                if (err) return cb({status:401,message:"There is an user with this email already!!"})
                user.doctor.create(doc.data, function(err,doc){
                    if(err) return cb(Error)
                    utilsService.assignRole(doctorRole, user.id,(err,res)=>{
                        if(err) return cb(Error)
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
        
  };

  this.createNurse = function(req,cb){
      const nurseRole = 'nurse'
      const userCredentials = {
          "password": utilsService.generatePassword(),
          "email": req.body.email,
          "realm" : nurseRole
      }
      let instituitions =[]
      instituitions.push(req.params.instituition)
      const nurse = new nurseDAL(req.body.idType,req.body.idNumber,req.body.name,req.body.lastname,
          true,req.body.gender,req.body.nationality,req.body.address,req.body.postalcode,
          req.body.email,req.params.instituition,[],instituitions)
          utilsService.createKeyandEncrypt(nurse,['kek','dek','Status','Teams','InstituteID','RegistedInstitutions'],(err,doc)=>{
              app.models.user.create(userCredentials, function(err,user) {
                  if (err) return cb({status:401,message:"There is an user with this email already!!"})
                  user.nurse.create(doc.data, function(err,doc){
                      if(err) return cb(Error)
                      utilsService.assignRole(nurseRole, user.id,(err,res)=>{
                        if(err) return cb(Error)
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
  };

  this.getNurses = function(req,cb){
      app.models.Nurse.find({where: {InstituteID:req.params.instituition}},function(err,doc){
          if(err) return cb(Error);
          cb(null,doc)
      })
  }

  this.getDoctors= function(req,cb){
      app.models.Doctor.find({where: {InstituteID:req.params.instituition}},function(err,doc){
          if(err) return cb(Error);
          cb(null,doc)
      })
  }

  this.detail= function(Model,req,cb){
      Model.findOne({where:{_id:req.params.id}},function(err,doc){
          if(err) return cb(Error);
          cb(null,doc)
      })
  }


  this.getAllDetailData = function(Model,req,cb){
      this.detail(Model,req,function(err,staff){
          if(err) return cb(Error)
          if(staff.Teams.length==0){
              decryptService.decryptAllInfo(staff,(err,obj)=>{
                if(err) return cb(Error)
                obj.Staff = obj
                obj.Teams = []
                return cb(null,obj)
              })
          }else {
              utilsService.filterFindbyID(staff.Teams,app.models.Team,(err,result)=>{
                  if(err) return cb(Error)
                  var teams = [];
                  var obj = {}
                  obj.Staff = staff
                  obj.Teams = []
                  for (var i = 0; i < result.length; ++i) {
                      teams.push(app.models.SharedPermission.find({where:{and :[{Team:{like:result[i].id.toString()}},{DidPatientAccepted:true}]}}));
                  }
                  Promise.all(teams)
                  .then(sharedPerms=>{
                      var patients = []         
                      for (var i = 0; i < sharedPerms.length; ++i) {
                          var toFilter = []
                          sharedPerms[i].forEach(element=>{
                              toFilter.push({id: element.Patient})
                          })
                          if(toFilter.length > 0)
                            patients.push(app.models.Patient.find({where: {or: toFilter}}))
                      }
                      return Promise.all(patients)
                  })
                  .then(data => {
                      for (var i = 0; i < result.length; ++i) {
                        obj.Teams.push({Team:result[i],Leader:result[i].Leader,Patient:data[i]});
                      }
                      decryptService.decryptAllInfo(obj,(err,result)=>{
                        if(err) return cb(Error)
                        cb(null,obj)
                      })
                  })
                  .catch(err => {
                    return cb(Error)
                  })
              })
          }
      })
  }
  
  this.getTeamMembers = function(req,cb){
    app.models.Team.findOne({where:{_id:req.params.teamId}},(err,teams)=>{
        if(err) return cb(err)
        let members = []
        let filter =[]
        let obj = {}
        obj.Teams = []
        
        teams.Doctors.forEach( doctor =>{
            filter.push({id:doctor})
        })
        members.push(app.models.Doctor.find({where:{or:filter}}))
      
        filter =[]
        teams.Nurses.forEach( nurse =>{
            filter.push({id:nurse})
        })
        members.push(app.models.Nurse.find({where:{or:filter}}))
        Promise.all(members)
        .then(staff=>{
            obj.Teams.push({doctors:staff[0]})
            obj.Teams[0].nurses = staff[1]
            decryptService.decryptAllInfo(obj,(err,result)=>{
                if(err) return cb(Error)
                cb(null,result)
            })
        })

    })
}

  this.getTeamPatientsDetail = function(Model,req,cb){
      app.models.Patient.findOne({where:{id:req.params.pid}},(err,patient)=>{
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
                  cb(null,result)
              })
          })
      })
  }

  this.getPatientAllmedRecordsGroup = function(Model,req,cb){
      Model.findOne({where:{id:req.params.id}},(err,staff)=>{
          if(err) return cb(Error)
          app.models.Patient.findOne({where:{id:req.params.pid}},(err,patient)=>{
              if(err) return cb(Error)
              patient.medicalRecordGroups.find((err,result)=>{
                  if(err) return cb(Error)
                  var obj = {medRecordsGroup:result,Staff:staff}
                  decryptService.decryptAllInfo(obj,(err,result)=>{
                      if(err) return cb(Error)
                      cb(null,result)
                  })
              })
          })
      })
      
  }

  this.getPatientmedRecordsGroup = function(Model,req,cb){
      this.getPatientAllmedRecordsGroup(Model,req,function(err,result){
          if(err) return cb(Error)
          result.medRecordsGroup = result.medRecordsGroup.filter(elem => elem.id.toString() == req.params.mrgid)[0]
          cb(null,result)
      })
  }

  
  this.getPatientDetailedmedRecords = function(Model,req,cb){
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
                  result.forEach(elem => {
                    var description = detail.description.filter(e=>e.file===elem.name)[0].description
                    obj.push({src: elem.fullPath,description:description})
                  
                  })
                  detailedmedicalRecord.detailedmedicalRecord.uploadedImages = obj
                  cb(null,detailedmedicalRecord)
              })
          })
      })
  }

  this.getPatientAllDetailedmedRecords = function(Model,req,cb){
      this.getPatientmedRecordsGroup(Model,req,function(err,data){
          if(err) return cb(Error)
          app.models.DetailedMedicalRecord.find({where:{medicalRecordGroupId:data.medRecordsGroup.id}},(err,result)=>{
              if(err) return cb(Error)
              var obj = {detailedmedicalRecords:result}
              var files = []
              decryptService.decryptAllInfo(obj,(err,result)=>{
                if(err) return cb(Error)
                cb(null,result)
              })
          })
      })
  }

  this.getPatientAllmedRecords = function(Model,req,cb){
      this.getPatientmedRecordsGroup(Model,req,function(err,data){
          if(err) return cb(Error)
          app.models.MedicalRecord.find({where:{medicalRecordGroupId:data.medRecordsGroup.id}},(err,result)=>{
              if(err) return cb(Error)
              var obj = {medicalRecords:result}
              decryptService.decryptAllInfo(obj,(err,result)=>{
                  if(err) return cb(Error)
                  cb(null,result)
              })
          })
      })
  }

  this.getPatientmedRecord = function(Model,req,cb){
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

  this.addPatientmedRecordsGroup = function(Model,req,cb){
    app.models.Patient.findOne({where:{id:req.params.pid}},(err,patient)=>{
        if(err) return cb(Error)
        var mrg = new mrgDAL(req.body.pathology,req.body.description,true,req.body.mainComplaint,req.body.when,req.body.location,req.body.type
        ,req.body.intensity,req.body.constancy,req.body.dispersal,req.body.injuryChanges[0],req.body.injuryEvolution,req.body.trigger[0],req.body.prevTreatment,req.body.others[0])
        this.encrypt(patient,mrg,['Status','dek','kek'],(err,result)=>{
          if(err) return cb(Error)
          patient.medicalRecordGroups.create(result,function(err,mrg){
            if(err) return cb(Error)
            cb(null,mrg)
          })
        })
    })
  }

  this.addPatientfamilyHistory = function(Model,req,cb){
    app.models.Patient.findOne({where:{id:req.params.pid}},(err,patient)=>{
        if(err) return cb(Error)
        var familyhistory = new familyHistoryDAL(req.body.atopias,req.body.baldness,req.body.cancer,req.body.cutaneous,req.body.diabetes,req.body.skinDiseases,req.body.others) 
        this.encrypt(patient,familyhistory,['dek','kek'],(err,result)=>{
          if(err) return cb(Error)
          patient.familyHistory.create(result,function(err,res){
            if(err) return cb(Error)
            cb(null,res)
          })
        })
    })
  }

  this.addPatientMedicalSexualHistory = function(Model,req,cb){
    app.models.Patient.findOne({where:{id:req.params.pid}},(err,patient)=>{
        if(err) return cb(Error)
        var sexualhistory = new sexualHistoryDAL(req.body.active,req.body.stdHistory)
        this.encrypt(patient,sexualhistory,['dek','kek'],(err,result)=>{
          if(err) return cb(Error)
          patient.sexualHistory.create(result,function(err,res){
            if(err) return cb(Error)
            cb(null,res)
          })
        }) 
    })
  }
  
  this.addPatientSocialHistory = function(Model,req,cb){
    app.models.Patient.findOne({where:{id:req.params.pid}},(err,patient)=>{
      if(err) return cb(Error)
      var socialhistory = new socialHistoryDAL(req.body.alimentation,req.body.alcohol,req.body.ethnicity,req.body.exercise,req.body.animals,req.body.drugs,req.body.sunExposure,
          req.body.hobbies,req.body.trips,req.body.smoking,req.body.makeup,req.body.systemicDrugs,req.body.activity,req.body.other)
      this.encrypt(patient,socialhistory,['dek','kek'],(err,result)=>{
        if(err) return cb(Error)
        patient.socialHistory.create(result,function(err,res){
          if(err) return cb(Error)
          cb(null,res)
        })
      })
    })
  }

  this.addPatientMedicalHistory = function(Model,req,cb){
    app.models.Patient.findOne({where:{id:req.params.pid}},(err,patient)=>{
      if(err) return cb(Error)
      var bmi = req.body.weight / (req.body.height *req.body.height)
      var medicalhistory = new medicalHistoryDAL(req.body.height,req.body.weightHistory,req.body.weight,bmi,req.body.bloodType,req.body.anorexia,req.body.allergies,req.body.atopias,req.body.surgeries,req.body.comorbidities,
            req.body.diseases,req.body.clinicalDiseases,req.body.sah,req.body.vaccination,req.body.thyroid,req.body.transfusions)
      this.encrypt(patient,medicalhistory,['dek','kek'],(err,result)=>{
        if(err) return cb(Error)
        patient.medicalHistory.create(result,function(err,res){
          if(err) return cb(Error)
          cb(null,res)
        })
      })
    })
  }

  
  this.addPatientmedRecords = function(Model,req,cb){
    app.models.MedicalRecordGroup.findOne({where:{id:req.params.mrgid}},(err,mrgroup)=>{
      if(err) return cb(Error)
      var location = req.body.location
      location.shift()
      location = location.join()
      var medRecs = new medicalRecordsDAL(req.body.skinType,[],new Date(Date.now()).toLocaleString(),req.body.phototype,req.body.photoaging,req.body.tanning,req.body.pallor,req.body.integrity,req.body.humidity,
                                          req.body.texture,req.body.thickness,req.body.temperature,req.body.elasticity,req.body.mobility,req.body.turgor,req.body.sensivity,req.body.sunburn,req.body.area,req.body.quantity,req.body.comparison,
                                          req.body.disposition,req.body.distribution,req.body.pattern,req.body.colorChange,req.body.layers,req.body.skinColor,req.body.otherSignals,req.body.hairs,location,req.body.adenomegalia,req.body.linfedema)
      medRecs.teamId = req.params.tid
      this.encrypt(mrgroup,medRecs,['kek','dek','teamId','TeamNotes'],(err,result)=>{
        if(err) return cb(Error)
        mrgroup.medicalRecords.create(result,function(err,res){
          if(err) return cb(Error)
          cb(null,res)
        })
      })
    })
  }

  this.addDetailedMedRecords = function(fields,files,container,Model,req,cb){
    app.models.MedicalRecordGroup.findOne({where:{id:req.params.mrgid}},(err,mrgroup)=>{
      if(err) return cb(Error)
      var descriptions = []
      if(files.img){
        files.img.forEach(img=>{
          descriptions.push({description:fields.description_upload,file:img.name})
        })
      }
      if(files.image_upload){
        files.image_upload.forEach(img=>{
          descriptions.push({description:fields.description_camera_input,file:img.name})
        })
      }
      var detailedmedRecs = new detailedMRDAL(fields.dimension,fields.injuryType,fields.lesion,fields.arrangement,fields.texture,fields.primaryInjury,fields.evaluation,fields.lymphNodes,
          fields.axillary,fields.inguinal,fields.interimDiagnosis,fields.exams,fields.cytoAnalysis,fields.diagnosis,new Date(Date.now()).toLocaleString(),[])
      detailedmedRecs.teamId = req.params.tid
      detailedmedRecs.container = container
      detailedmedRecs.description = descriptions
      this.encrypt(mrgroup,detailedmedRecs,['kek','dek','teamId','TeamNotes','container','description'],(err,result)=>{
        if(err) return cb(Error)
        mrgroup.detailedMedicalRecord.create(result,function(err,res){
          if(err) return cb(Error)
          cb(null,res)
        })
      })
    })
  }

  this.addPatientDetailedmedRecords = function(Model,req,res,cb){
      var container = kekG._({ forceUppercase: false, specials: false,forceLowercase: true});
      this.createContainerAndUpload(container,req,res,(err,result)=>{
          if(err) return cb(Error)
          for(var property in result.fields){
              result.fields[property] = result.fields[property].join()
          }
          this.addDetailedMedRecords(result.fields,result.files,container,Model,req,(err,result)=>{
              if(err) return cb(Error)
              cb(null,result)
          })    
      })
  }

  this.createContainerAndUpload = function(containerID,req,res,cb){
      var blobService = azure.createBlobService();
      blobService.createContainerIfNotExists(containerID, {
          publicAccessLevel: 'blob'
      }, (error, result, response)=> {
          if(error) return cb(Error)
          app.models.container.upload(containerID,req,res,(err,result)=>{
              if(err) return cb(Error)
              cb(null,result)
          })
      })
  }

  this.addPatientFiles = function(req,res,cb){
      app.models.DetailedMedicalRecord.findOne({where:{id:req.params.did}},(err,detailed)=>{
          if(err) return cb(Error)
          app.models.container.upload(detailed.container,req,res,(err,result)=>{
              if(err) return cb(Error)
              detailed.description.push({description:result.fields.description_upload[0],file:result.files.img[0].name})
              var body = {description:detailed.description}
              app.models.DetailedMedicalRecord.updateAll({id:req.params.did},body,(err,res)=>{
                  if(err) return cb(Error)
                  cb(null,res)
              })
          })
      })

  }

  this.addNotes =  function(Model,RecordNote,id,req,cb){
      this.addPatientrecordsNotes(Model,RecordNote,req,id,(err,res)=>{
          if(err) return cb(Error)
          cb(null,res)
      })
  }

  this.addPatientrecordsNotes = function(Model,RecordNote,req,id,cb){
      RecordNote.findOne({where:{id:id}},(err,result)=>{
          if(err) return cb(Error)
          var teamNote = new kvDAL(req.body.name,req.body.description)
          this.encrypt(result,teamNote,['kek','dek'],(err,data)=>{
            if(err) return cb(Error)
            result.TeamNotes.push(data)
            var body = {TeamNotes:result.TeamNotes}
            RecordNote.updateAll({id:id},body,(err,res)=>{
                if(err) return cb(Error)
                cb(null,res)
            })
          })
      })
  }
  this.compareRecords = function(req,cb){
    var records=[]
    records.push(app.models.DetailedMedicalRecord.findOne({where:{id:req.params.cmp_id1}}))
    records.push(app.models.DetailedMedicalRecord.findOne({where:{id:req.params.cmp_id2}}))
    Promise.all(records)
    .then(data => {
        var records = {record1:[],record2:[]}
         app.models.container.getFiles(data[0].container,(err,files1)=>{
            if(err) return cb(Error)
            files1.forEach(file=>{
                records.record1.push({src:file.fullPath,name:file.name})
            })
            app.models.container.getFiles(data[1].container,(err,files2)=>{
                if(err) return cb(Error)
                files2.forEach(file=>{
                    records.record2.push({src:file.fullPath,name:file.name})
                })
                cb(null,records)
            })
        })
    })
  }

  this.encrypt = function(Model,data,keysToIgnore,cb){
    utilsService.retrieveDecryptedInfo(Model,[],false,(err,data_retrieved)=>{
      if(err) return cb(Error)
      data.kek = data_retrieved.kek
      data.dek = data_retrieved.dek
      var cipherData = utilsService.encryptInfo(data,data_retrieved.decryptedDek,keysToIgnore)
      cb(null,cipherData)
    })
  }
}
module.exports = StaffService