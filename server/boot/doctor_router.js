const StaffService = require('./../Services/staff_service.js')
const UtilsService = require('./../Services/utils_service.js')
const decryptService = require('./../Services/decrypt_service.js')

module.exports = function(app){
  var doctorService = new StaffService(app);
  var utils = new UtilsService(app);    

  app.get('/doctor/:id',function(req,res,next){
      doctorService.getAllDetailData(app.models.Doctor,req,function(err,doctorData){
          if(err) return next(err)
          var tokenPath = `?accessToken=${req.query.accessToken}`
          doctorData.Staff.profission = 'Doutor'
          doctorData.particular = 'particular'
          doctorData.logout = `/logout/particular${tokenPath}`
          doctorData.staffUrl = `/doctor/${req.params.id}/staff${tokenPath}`
          doctorData.Token = req.query.accessToken
          doctorData.email = doctorData.Staff.Email
          doctorData.changePasswordURL = `/doctor/${doctorData.Staff.id}/changepassword${tokenPath}`
          res.render('staff.hbs',doctorData)
      })
  })

  app.get('/doctor/:id/staff/:teamId',function(req,res,next){
    doctorService.getTeamMembers(req,function(err,staff){
        if(err)return next(err)
        var tokenPath = '?accessToken='+req.query.accessToken
        staff.logout = `/logout/particular${tokenPath}`
        staff.particular = 'particular'
        staff.backToMenu = `/doctor/${req.params.id}?accessToken=${req.query.accessToken}`
        res.render('staffList.hbs',staff)
    })
})

  app.get('/doctor/:id/team/:tid/patient/:pid',function(req,res,next){
      doctorService.getTeamPatientsDetail(app.models.Doctor,req,function(err,result){
          if(err) return next(err)
          result.role='staff'
          var tokenPath = '?accessToken='+req.query.accessToken
          result.postsocialHistory = req.path + '/socialhistory' + tokenPath
          result.postsexualHistory = req.path + '/sexualhistory' + tokenPath
          result.postmedicalHistory = req.path + '/medicalhistory' + tokenPath
          result.postfamilyHistory = req.path + '/familyhistory' + tokenPath
          result.medrecordsgroup = req.path + '/medrecordsgroup'+ tokenPath
          result.particular = 'particular'
          result.logout = `/logout/particular${tokenPath}`
          res.render('sharedPatientPage.hbs',result)
      })
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup',function(req,res,next){
      doctorService.getPatientAllmedRecordsGroup(app.models.Doctor,req,function(err,result){
          if(err) return next(err)
          var tokenPath = '?accessToken='+req.query.accessToken
          result.Staff.profission = 'Doutor'
          var particular = 'particular'
          var logout = `/logout/particular${tokenPath}`
          var path = `/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/create_medrecordsgroup?accessToken=` +req.query.accessToken
          res.render('medicalRecordGroupList.hbs',{Staff:result.Staff,medicalRecordGroups:result.medRecordsGroup,postmedRecordsGroup:path,role:'doctor',backTo:`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=`+req.query.accessToken,Token:req.query.accessToken,particular:particular,logout:logout})
      })
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/medicalhistory',function(req,res){
      res.render('createMedicalHistory.hbs',{postMedicalHistory: req.path + '?accessToken=' +req.query.accessToken,particular:'particular',logout:`logout/particular?accessToken=${req.query.accessToken}`})
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/sexualhistory',function(req,res){
        res.render('createSexualHistory.hbs',{postSexualHistory: req.path + '?accessToken=' +req.query.accessToken,particular:'particular',logout:`logout/particular?accessToken=${req.query.accessToken}`})
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/familyhistory',function(req,res){
      res.render('createFamilyMedicalHistory.hbs',{postFamilyHistory: req.path + '?accessToken=' +req.query.accessToken,particular:'particular',logout:`logout/particular?accessToken=${req.query.accessToken}`})
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/socialhistory',function(req,res){
      res.render('createSocialHistory.hbs',{postSocialHistory: req.path + '?accessToken=' +req.query.accessToken,particular:'particular',logout:`logout/particular?accessToken=${req.query.accessToken}`})
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/create_medrecordsgroup',function(req,res){
      var path = `/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup` + '?accessToken=' +req.query.accessToken
      res.render('createMedicalRecordGroup.hbs',{postURL:path,particular:'particular',logout:`logout/particular?accessToken=${req.query.accessToken}`})
  })


  app.post('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup',function(req,res,next){
      doctorService.addPatientmedRecordsGroup(app.models.Doctor,req,function(err,result){
          if(err) return next(err)
          res.redirect(req.path + '?accessToken=' +req.query.accessToken)
      })
  })

  app.post('/doctor/:id/team/:tid/patient/:pid/sexualhistory',function(req,res,next){
      doctorService.addPatientMedicalSexualHistory(app.models.Doctor,req,function(err,result){
        if(err) return next(err)
        res.redirect(`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=${req.query.accessToken}`)
      })
  })

  app.post('/doctor/:id/team/:tid/patient/:pid/familyhistory',function(req,res,next){
      doctorService.addPatientfamilyHistory(app.models.Doctor,req,function(err,result){
        if(err) return next(err)
        res.redirect(`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=${req.query.accessToken}`)
      })
  })

  app.post('/doctor/:id/team/:tid/patient/:pid/socialhistory',function(req,res,next){
      doctorService.addPatientSocialHistory(app.models.Doctor,req,function(err,result){
        if(err) return next(err)
        res.redirect(`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=${req.query.accessToken}`)
      })
  })

  app.post('/doctor/:id/team/:tid/patient/:pid/medicalhistory',function(req,res,next){
      doctorService.addPatientMedicalHistory(app.models.Doctor,req,function(err,result){
        if(err) return next(err)
        res.redirect(`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=${req.query.accessToken}`)
      })
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid',function(req,res,next){
      doctorService.getPatientmedRecordsGroup(app.models.Doctor,req,function(err,medrecordGroup){
          if(err) return next(err)
          var tokenPath = '?accessToken='+req.query.accessToken
          medrecordGroup.backTo=`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup?accessToken=${req.query.accessToken}`
          medrecordGroup.Staff.profission = 'Doutor'
          medrecordGroup.Token = req.query.accessToken
          medrecordGroup.particular = 'particular'
          medrecordGroup.logout = `/logout/particular${tokenPath}`
          res.render('medicalRecordGroup.hbs',medrecordGroup)
      })
  })
  
  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/medrecords',function(req,res,next){
      doctorService.getPatientAllmedRecords(app.models.Doctor,req,function(err,medicalRecords){
          if(err)return next(err)
          var tokenPath = '?accessToken='+req.query.accessToken
          medicalRecords.backTo=`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}?accessToken=${req.query.accessToken}`
          medicalRecords.role = 'doutor'
          medicalRecords.Token = req.query.accessToken
          medicalRecords.particular = 'particular'
          medicalRecords.logout = `/logout/particular${tokenPath}`
          medicalRecords.medRecordsForm = `/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}/create_medrecords?accessToken=${req.query.accessToken}`
          res.render('medicalRecordList.hbs',medicalRecords)
      })
  })
  app.post('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/medrecords',function(req,res,next){
        doctorService.addPatientmedRecords(app.models.Doctor,req,function(err,result){
          if(err)return next(err)
          res.redirect(req.path + '?accessToken='+req.query.accessToken) 
      })
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/create_medrecords',function(req,res){
      var path = `/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}/medrecords?accessToken=${req.query.accessToken}`
      res.render('createMedicalRecord.hbs',{postURL:path,particular:'particular',logout:`/logout/particular?accessToken=${req.query.accessToken}`})
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/medrecords/:mrid',function(req,res,next){
      doctorService.getPatientmedRecord(app.models.Doctor,req,function(err,medicalRecord){
          if(err)return next(err)
          var tokenPath = '?accessToken='+req.query.accessToken
          medicalRecord.role = 'doctor'
          medicalRecord.particular = 'particular'
          medicalRecord.logout = `/logout/particular${tokenPath}`
          medicalRecord.addNoteURL = req.path + '/notes?accessToken=' + req.query.accessToken
          res.render('medicalRecord.hbs',medicalRecord)
      })
  })

  //GetAllDetailedmedRecords
  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords',function(req,res,next){
      doctorService.getPatientAllDetailedmedRecords(app.models.Doctor,req,function(err,data){
          if(err)return next(err)
          var tokenPath = '?accessToken='+req.query.accessToken
          data.backTo=`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}?accessToken=${req.query.accessToken}`
          data.role = 'doutor'
          data.particular = 'particular'
          data.logout = `/logout/particular${tokenPath}`
          data.detailedmedRecordsForm = `/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}/create_detailedmedrecords?accessToken=${req.query.accessToken}`                
          data.Token = req.query.accessToken
          data.compareURI = `/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}/detailedmedrecords/compare`
          res.render('detailedMedicalRecordList.hbs',data)
      })
  })

  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords/compare/:cmp_id1/:cmp_id2',function(req,res,next){
    doctorService.compareRecords(req,function(err,data){
        if(err)return next(err)
        var tokenPath = '?accessToken='+req.query.accessToken
        data.backTo=`/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}/detailedmedrecords?accessToken=${req.query.accessToken}`
        data.role = 'doutor'
        data.particular = 'particular'
        data.logout = `/logout/particular${tokenPath}`
        data.Token = req.query.accessToken
        res.render('compareSignals.hbs',data)
    })
})


  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/create_detailedmedrecords',function(req,res){
      var path = `/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}/detailedmedrecords?accessToken=${req.query.accessToken}`
      res.render('createDetailedMedicalRecord.hbs',{postURL:path,particular:'particular',logout:`/logout/particular?accessToken=${req.query.accessToken}`})
  })
  //DetailedmedRecords
  app.get('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords/:did',function(req,res,next){
      doctorService.getPatientDetailedmedRecords(app.models.Doctor,req,function(err,data){
          if(err) return next(err)
          var tokenPath = '?accessToken='+req.query.accessToken           
          data.role = 'doutor'
          data.addNoteURL = req.path + '/notes?accessToken=' + req.query.accessToken
          data.postURL = req.path + '/uploadFiles?accessToken=' + req.query.accessToken
          data.particular = 'particular'
          data.logout = `/logout/particular${tokenPath}`
          res.render('detailedMedicalRecord.hbs',data)

      })
  })
  //addPatientDetailedmedRecords
  app.post('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords',function(req,res,next){
      doctorService.addPatientDetailedmedRecords(app.models.Doctor,req,res,function(err,result){
        if(err) return next(err)
        res.send(req.path + '?accessToken='+req.query.accessToken) 
      })
  })

  app.post('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords/:did/uploadFiles',function(req,res,next){
      doctorService.addPatientFiles(req,res,function(err,result){
        if(err) return next(err)
        var path =  `/doctor/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}/detailedmedrecords/${req.params.did}?accessToken=${req.query.accessToken}`
        res.redirect(path)
      })
  })

  app.post('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords/:did/upload',function(req,res,next){
      doctorService.addPatientImages(req,res,function(err,result){
        if(err) return next(err)
        res.redirect(req.path)
      })
  })
  

  app.put('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/medrecords/:mrid/notes',function(req,res,next){
      doctorService.addNotes(app.models.Doctor,app.models.MedicalRecord,req.params.mrid,req,function(err,result){
        if(err) return next(err)
        res.status(200).send({msg: 'Note added'}) 
      })
  })

  app.put('/doctor/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords/:did/notes',function(req,res,next){
      doctorService.addNotes(app.models.Doctor,app.models.DetailedMedicalRecord,req.params.did,req,function(err,result){
        if(err) return next(err)
        res.status(200).send({msg: 'Note added'}) 
      })
  })
}