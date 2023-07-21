const PatientService = require('./../Services/patient_service.js')
const UtilsService = require('./../Services/utils_service.js')
const decryptService = require('./../Services/decrypt_service.js')
module.exports = function(app){
    var patientService = new PatientService(app);
    var utilsService = new UtilsService(app);

    app.get('/patient/:id',function(req,res,next){
        patientService.detailPatient(req,function(err,patientObjs){
            if(err)return next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            let patient = patientObjs.Patient
            patient.notification = patientObjs.shares
            patient.length = patientObjs.length
            patient.particular = 'particular'
            patient.staffUrl = `/patient/${req.params.id}/staff?accessToken=${req.query.accessToken}`
            patient.shareURL = req.path + `/accept${tokenPath}`
            patient.logout = `/logout/particular${tokenPath}`
            patient.medRecordsGroup = `/patient/${req.params.id}/medrecordsgroup?accessToken=${req.query.accessToken}`
            patient.email = patientObjs.Patient.patient.Email
            patient.changePasswordURL = `/patient/${patientObjs.Patient.id}/changepassword${tokenPath}`
            res.render('patient.hbs',patient)
        })
    })

    app.put('/patient/:id/accept',(req,res,next)=>{
        patientService.acceptShare(req,(err,cb)=>{
            if(err) return next(err)
            res.status(200).send({msg: 'Permission shared!'}) 
        })
    })

    app.get('/patient/:id/staff',function(req,res,next){
        patientService.getTeamMembers(req,function(err,staff){
            if(err)return next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            staff.logout = `/logout/particular${tokenPath}`
            staff.particular = 'particular'
            staff.role = 'patient'
            staff.revokeUrl = `/patient/${req.params.id}/staff/`
            staff.token = `${tokenPath}`
            staff.backToMenu = `/patient/${req.params.id}?accessToken=${req.query.accessToken}`
            res.render('staffList.hbs',staff)
        })
    })
    app.delete('/patient/:id/staff/:shareId',function(req,res,next){
        patientService.revokePermissions(req,function(err,staff){
          if(err) return next (err)
          res.status(200).json({message:'success'}) 
        })
    })

    app.get('/patient/:id/medrecordsgroup',function(req,res,next){
        patientService.getPatientMedicalRecordGroups(req,function(err,patientRecordsGroup){
            if(err) return next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            patientRecordsGroup.particular = 'particular'
            patientRecordsGroup.logout = `/logout/particular${tokenPath}`
            patientRecordsGroup.backTo = `/patient/${req.params.id}?accessToken=${req.query.accessToken}`
            patientRecordsGroup.Token = req.query.accessToken
            res.render('medicalRecordGroupList.hbs',patientRecordsGroup)
        })
    })

    app.get('/patient/:id/medrecordsgroup/:mid',function(req,res,next){
        patientService.getPatientMRGDetail(req,function(err,patientRecordGroup){
            if(err) return next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            patientRecordGroup.particular = 'particular'
            patientRecordGroup.logout = `/logout/particular${tokenPath}`
            patientRecordGroup.backTo = `/patient/${req.params.id}/medrecordsgroup?accessToken=${req.query.accessToken}`
            patientRecordGroup.Token = req.query.accessToken
            res.render('medicalRecordGroup.hbs',patientRecordGroup)
        })
    })

    app.get('/patient/:id/medrecordsgroup/:mid/medrecords',function(req,res,next){
        patientService.getPatientAllMedicalRecords(req,function(err,patientMedicalRecords){
            if(err) return next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            patientMedicalRecords.particular = 'particular'
            patientMedicalRecords.logout = `/logout/particular${tokenPath}`
            patientMedicalRecords.backTo = `/patient/${req.params.id}/medrecordsgroup/${req.params.mid}?accessToken=${req.query.accessToken}`
            patientMedicalRecords.Token = req.query.accessToken
            res.render('medicalRecordList.hbs',patientMedicalRecords)
        })
    })

    app.get('/patient/:id/medrecordsgroup/:mid/detailedmedrecords',function(req,res,next){
       patientService.getPatientAllDetailedMedicalRecords(req,function(err,patientDetailedMedicalRecords){
            if(err) return next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            patientDetailedMedicalRecords.particular = 'particular'
            patientDetailedMedicalRecords.logout = `/logout/particular${tokenPath}`
            patientDetailedMedicalRecords.backTo = `/patient/${req.params.id}/medrecordsgroup/${req.params.mid}?accessToken=${req.query.accessToken}`
            patientDetailedMedicalRecords.Token = req.query.accessToken
            res.render('detailedMedicalRecordList.hbs',patientDetailedMedicalRecords)
        })
    })

    app.get('/patient/:id/medrecordsgroup/:mid/medrecords/:mrid',function(req,res,next){
         patientService.getPatientMedicalRecord(req,function(err,medicalRecord){
            if(err) next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            medicalRecord.particular = 'particular'
            medicalRecord.logout = `/logout/particular${tokenPath}`
            res.render('medicalRecord.hbs',medicalRecord)
        })
    })

    app.get('/patient/:id/medrecordsgroup/:mid/detailedmedrecords/:did',function(req,res){
        patientService.getPatientDetailedMedicalRecord(req,function(err,detailedMedicalRecord){
            if(err) return next(err)
            var tokenPath = '?accessToken='+req.query.accessToken
            detailedMedicalRecord.particular = 'particular'
            detailedMedicalRecord.logout = `/logout/particular${tokenPath}`
            res.render('detailedMedicalRecord.hbs',detailedMedicalRecord)
        })
    })
}