const StaffService = require('./../Services/staff_service.js')
module.exports = function(app){
    var nurseService = new StaffService(app);
    var Nurse = app.models.Nurse;
    var User = app.models.User;


    app.get('/nurse/:id',function(req,res,next){
        nurseService.getAllDetailData(Nurse,req,function(err,nurseData){
            if(err)return next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            nurseData.Staff.profission = 'Enfermeiro'
            nurseData.particular = 'particular'
            nurseData.logout = `/logout/particular${tokenPath}`
            nurseData.Token = req.query.accessToken
            nurseData.email = nurseData.Staff.Email
            nurseData.changePasswordURL = `/nurse/${nurseData.Staff.id}/changepassword${tokenPath}`
            res.render('staff.hbs',nurseData)
        })
    })


    app.get('/nurse/:id/team/:tid/patient/:pid',function(req,res,next){
        nurseService.getTeamPatientsDetail(Nurse,req,function(err,result){
            if(err)return next(err)
            result.role='staff'
            var tokenPath = '?accessToken='+req.query.accessToken
            result.particular = 'particular'
            result.logout = `/logout/particular${tokenPath}`
            result.postsocialHistory = req.path + '/socialhistory' + tokenPath
            result.postsexualHistory = req.path + '/sexualhistory' + tokenPath
            result.postmedicalHistory = req.path + '/medicalhistory' + tokenPath
            result.postfamilyHistory = req.path + '/familyhistory' + tokenPath
            result.medrecordsgroup = req.path + '/medrecordsgroup'+ tokenPath
            res.render('sharedPatientPage.hbs',result)
        })
    })

    app.get('/nurse/:id/team/:tid/patient/:pid/medrecordsgroup',function(req,res,next){
        nurseService.getPatientAllmedRecordsGroup(Nurse,req,function(err,data){
          if(err)return next(err)
          data.Staff.profission = 'Enfermeiro'
          var tokenPath = '?accessToken='+req.query.accessToken
          var path = `/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/create_medrecordsgroup`
          res.render('medicalRecordGroupList.hbs',{Staff:data.Staff,medicalRecordGroups:data.medRecordsGroup,backTo:`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}${tokenPath}`,particular:'particular', logout:`/logout/particular${tokenPath}`,Token:req.query.accessToken})
        })
    })

    app.get('/nurse/:id/team/:tid/patient/:pid/medicalhistory',function(req,res){
        res.render('createMedicalHistory.hbs',{postMedicalHistory: req.path + '?accessToken=' +req.query.accessToken,particular:'particular',logout:`/logout/particular?accessToken=${req.query.accessToken}`})
    })

    app.get('/nurse/:id/team/:tid/patient/:pid/sexualhistory',function(req,res){
        res.render('createSexualHistory.hbs',{postSexualHistory: req.path + '?accessToken=' +req.query.accessToken,particular:'particular',logout:`/logout/particular?accessToken=${req.query.accessToken}`})
    })

    app.get('/nurse/:id/team/:tid/patient/:pid/familyhistory',function(req,res){
         res.render('createFamilyMedicalHistory.hbs',{postFamilyHistory: req.path + '?accessToken=' +req.query.accessToken,particular:'particular',logout:`/logout/particular?accessToken=${req.query.accessToken}`})
    })

    app.get('/nurse/:id/team/:tid/patient/:pid/socialhistory',function(req,res){
         res.render('createSocialHistory.hbs',{postSocialHistory: req.path + '?accessToken=' +req.query.accessToken,particular:'particular',logout:`/logout/particular?accessToken=${req.query.accessToken}`})
    })


    app.post('/nurse/:id/team/:tid/patient/:pid/sexualhistory',function(req,res,next){
        nurseService.addPatientMedicalSexualHistory(Nurse,req,function(err,result){
          if(err)return next(err)
          res.redirect(`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=${req.query.accessToken}`)
        })
    })

    app.post('/nurse/:id/team/:tid/patient/:pid/familyhistory',function(req,res,next){
         nurseService.addPatientfamilyHistory(Nurse,req,function(err,result){
          if(err)return next(err)
          res.redirect(`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=${req.query.accessToken}`)
        })
    })

    app.post('/nurse/:id/team/:tid/patient/:pid/socialhistory',function(req,res,next){
         nurseService.addPatientSocialHistory(Nurse,req,function(err,result){
          if(err)return next(err)
          res.redirect(`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=${req.query.accessToken}`)
        })
    })

    app.post('/nurse/:id/team/:tid/patient/:pid/medicalhistory',function(req,res,next){
        nurseService.addPatientMedicalHistory(Nurse,req,function(err,result){
          if(err)return next(err)
          res.redirect(`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}?accessToken=${req.query.accessToken}`)
        })
    })

    app.get('/nurse/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid',function(req,res,next){
       nurseService.getPatientmedRecordsGroup(Nurse,req,function(err,medrecordGroup){
            if(err) return next(err)
            medrecordGroup.backTo=`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup?accessToken=${req.query.accessToken}`
            medrecordGroup.particular = 'particular'
            medrecordGroup.logout = `/logout/particular?accessToken=${req.query.accessToken}`
            medrecordGroup.Token = req.query.accessToken
            medrecordGroup.Staff.profission = 'Enfermeiro'
            res.render('medicalRecordGroup.hbs',medrecordGroup)
        })
    })
   
    app.get('/nurse/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/medrecords',function(req,res,next){
        nurseService.getPatientAllmedRecords(Nurse,req,function(err,data){
            if(err) return next(err)
            data.particular = 'particular'
            data.Token = req.query.accessToken
            data.logout = `/logout/particular?accessToken=${req.query.accessToken}`
            data.backTo=`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}?accessToken=${req.query.accessToken}`
            res.render('medicalRecordList.hbs',data)
        })
    })


    app.get('/nurse/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/medrecords/:mrid',function(req,res,next){
       nurseService.getPatientmedRecord(Nurse,req,function(err,data){
            if(err) return next(err)
            data.role = 'enfermeiro'
            data.particular = 'particular'
            data.logout = `/logout/particular?accessToken=${req.query.accessToken}`
            data.addNoteURL = req.path + '/notes?accessToken=' + req.query.accessToken
            res.render('medicalRecord.hbs',data)
        })
    })
    //GetAllDetailedmedRecords
    app.get('/nurse/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords',function(req,res,next){
        nurseService.getPatientAllDetailedmedRecords(Nurse,req,function(err,data){
            if(err) return next(err)
            data.particular = 'particular'
            data.Token = req.query.accessToken
            data.logout = `/logout/particular?accessToken=${req.query.accessToken}`
            data.backTo=`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}?accessToken=${req.query.accessToken}`
            res.render('detailedMedicalRecordList.hbs',data)
        })
    })

    //DetailedmedRecords
    app.get('/nurse/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords/:did',function(req,res,next){
        nurseService.getPatientDetailedmedRecords(app.models.Doctor,req,function(err,data){
            if(err) return next(err)
            data.role = 'enfermeiro'
            data.addNoteURL = req.path + '/notes?accessToken=' + req.query.accessToken
            data.logout = `/logout/particular?accessToken=${req.query.accessToken}`
            data.backTo=`/nurse/${req.params.id}/team/${req.params.tid}/patient/${req.params.pid}/medrecordsgroup/${req.params.mrgid}/detailedmedrecords?accessToken=${req.query.accessToken}`
            data.particular = 'particular'
            res.render('detailedMedicalRecord.hbs',data)
        })
    })    

    app.put('/nurse/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/medrecords/:mrid/notes',function(req,res,next){
        nurseService.addNotes(Nurse,app.models.MedicalRecord,req.params.mrid,req,function(err,result){
          if(err)return next(err)
          res.status(200).send({msg: 'Note added'}) 
        })
    })

    app.put('/nurse/:id/team/:tid/patient/:pid/medrecordsgroup/:mrgid/detailedmedrecords/:did/notes',function(req,res,next){
      nurseService.addNotes(Nurse,app.models.DetailedMedicalRecord,req.params.did,req,function(err,result){
        if(err)return next(err)
        res.status(200).send({msg: 'Note added'}) 
      })
    })

}