module.exports = function(app) {
    /*var Administrative = app.models.Administrative;
    var Team = app.models.Team;
    var Doctor = app.models.Doctor;
    var Nurse = app.models.Nurse;
    var administrativeDAL = require('./../Model/Administrative.js');
    var teamDAL = require('./../Model/Team.js');
    var patientDAL = require('./../Model/Patient.js');
    var doctorDAL = require('./../Model/Doctor.js');
    var nurseDAL = require('./../Model/Nurse.js');
    var mrgDAL = require('./../Model/MedicalRecordGroup.js')
    var medicalRecordsDAL = require('./../Model/MedicalRecord.js')
    var kvDAL = require('./../Model/KeyValuePair.js')
    var detailedDAL = require('./../Model/DetailedMedicalRecord.js')
    var sexualhistoryDAL = require('./../Model/SexualHistory')
    var familyhistoryDAL = require('./../Model/FamilyMedicalHistory.js')
    var medicalhistoryDAL = require('./../Model/MedicalHistory')
    var socialhistoryDAL = require('./../Model/SocialHistory')


    app.dataSources.db.automigrate('Administrative', function(err) {
        if (err) throw err;
        var administrative = new administrativeDAL('Dermos1','DD1','Rua Cidade da Beira 7',true,'dermos1@live.com.pt','administrative','kek','dek')
        var doctors =[new doctorDAL('CC','12345','Jose','Moreira',true,'M','Portugues','Ajdsah','1800-061','josemoreira@pt.com','DD1',[],'kek','dek'),
                        new doctorDAL('CC','12346','Luisa','Moreira',true,'F','Portugues','Ajdsah','1800-061','luisamoreira@pt.com','DD1',[],'kek','dek'),
                        new doctorDAL('CC','12347','Arnaldo','Moreira',true,'M','Portugues','Ajdsah','1800-061','arnaldomoreira@pt.com','DD1',[],'kek','dek'),
                        new doctorDAL('CC','12348','Joana','Moreira',true,'F','Portugues','Ajdsah','1800-061','joanamoreira@pt.com','DD1',[],'dek','kek')
                    ]
        var nurses = [new nurseDAL('CC','12349','Jose','Moreira',true,'M','Portugues','Ajdsah','1800-061','josemoreira@pt.com','DD1',[],'kek','dek'),
                        new nurseDAL('CC','12350','Josefa','Moreira',true,'F','Portugues','Ajdsah','1800-061','josefamoreira@pt.com','DD1',[],'kek','dek'),
                        new nurseDAL('CC','12351','Jorge','Moreira',true,'M','Portugues','Ajdsah','1800-061','jorgemoreira@pt.com','DD1',[],'kek','dek'),
                        new nurseDAL('CC','12352','Luana','Moreira',true,'F','Portugues','Ajdsah','1800-061','luanamoreira@pt.com','DD1',[],'kek','dek')
                    ]
        var teams = [ new teamDAL(true,doctors[1],"DD1",'abacate1',[],[]),new teamDAL(true,doctors[3],"DD1",'abacate2',[],[])]        
        var patients = [new patientDAL('CC','102030','Maria','Morgado',true,'F','Portuguesa','Rua cidade da beira 7','1800-061','morgado3@live.com.pt','DD1','maried','123456','03/08/1990',false,'97898998798','Praia','Cape Verde','kek','dek'),
                        new patientDAL('CC','102031','Aliah','Morgado',true,'F','Portuguesa','Rua cidade da beira 7','1800-061','morgado3@live.com.pt','DD1','maried','123456','03/08/1990',false,'97898998798','Praia','Cape Verde','kek','dek')]

        var mgr1 = new mrgDAL('skin cancer','asdasd',true,'dor na abs','12/10/2015','aa','ab','5','1234','localizada','ad',['a'],'asdas',['adasd'],'yes','baby')
        var mgr2 = new mrgDAL('acnea','asdasd',true,'dor na abs','12/10/2015','aa','ab','5','1234','localizada','ad',['a'],'asdas',['adasd'],'yes','baby')
        
        var acnea_medicalRecords = new medicalRecordsDAL('1',[new kvDAL('Doctor','ysgdasg')],'hoje','1','abcd','ct','pallor','fine','humidity','texture','thick','90','elas','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1',['1'],'1','1','1')
        var skin_medicalRecords = new medicalRecordsDAL('1',[new kvDAL('Doctor','ysgdasg')],'hoje','1','abcd','ct','pallor','fine','humidity','texture','thick','90','elas','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1',['1'],'1','1','1')
        var acnea_detailed = new detailedDAL('adas','asdad','cl','cl','cl','cl','cl','cl','cl','cl','cl',['cl'],['cl'],'cl','cl','cl','cl')
        var skin_detailed =new detailedDAL('adas','asdad','cl','cl','cl','cl','cl','cl','cl','cl','cl',['cl'],['cl'],'cl','cl','cl','cl')      
        var sexualhistory = new sexualhistoryDAL('asa','asdsad')
        var socialhistory = new socialhistoryDAL('all','all','all','all',true,true,true,['all'],true,true,true,true,'all','all')
        var familyhistory = new familyhistoryDAL('asd',true,true,'asda',true,true,['asd'])
        var medicalhistory = new medicalhistoryDAL('asd','asd','asd','asd','asd','asd',true,'asd','asd','asd','asd','asd','asd','asd','asd','asd','asd')
        
        Administrative.create(administrative,function(err,admini_doc){
            if (err) return console.error(err);
            admini_doc.teams.create(teams[0],function(err,teamUno){
                if (err) return console.error(err);
                doctors[0].Teams = [teamUno.id]
                doctors[1].Teams = [teamUno.id]
                nurses[0].Teams = [teamUno.id]
                nurses[1].Teams = [teamUno.id]
                Doctor.create(doctors[0],(err,result) =>{
                    if (err) return console.error(err);
                    var body = teamUno.Doctors
                    body.push(result.id)
                    body = {Doctors: body}
                    Team.updateAll({id:teamUno.id},body,(err,res)=>{
                        if (err) return console.error(err);
                    })
                })
                Doctor.create(doctors[1],(err,result) =>{
                    if (err) return console.error(err);
                    var body = teamUno.Doctors
                    body.push(result.id)
                    body = {Doctors: body}
                    Team.updateAll({id:teamUno.id},body,(err,res)=>{
                        if (err) return console.error(err);
                    })
                   
                })
                Nurse.create(nurses[0],(err,result) =>{
                    if (err) return console.error(err);
                    var body = teamUno.Nurses
                    body.push(result.id)
                    body = {Nurses: body}
                    Team.updateAll({id:teamUno.id},body,(err,res)=>{
                        if (err) return console.error(err);
                    })
                })
                Nurse.create(nurses[1],(err,result) =>{
                    if (err) return console.error(err);
                    var body = teamUno.Nurses
                    body.push(result.id)
                    body = {Nurses: body}
                    Team.updateAll({id:teamUno.id},body,(err,res)=>{
                        if (err) return console.error(err);
                    })
                })
                teamUno.patients.create(patients[0],function(err,result){
                    result.medicalRecordGroups.create(mgr1,function(err,mrg){
                        if (err) return console.error(err);
                        var medRecs = skin_medicalRecords
                        medRecs.teamId = teamUno.id      
                        mrg.medicalRecords.create(medRecs,function(err,sucess){
                            if (err) return console.error(err);
                        })
                        mrg.detailedMedicalRecord.create(skin_detailed,function(err,detail){
                            if (err) return console.error(err);
                        })
                    })
                    result.socialHistory.create(socialhistory,function(err,log){
                        if (err) return console.error(err);
                    })
                    result.medicalHistory.create(medicalhistory,function(err,log){
                        if (err) return console.error(err);
                    })  
                })
            })
            admini_doc.teams.create(teams[1],function(err,teamDuo){
                doctors[2].Teams = [teamDuo.id]
                doctors[3].Teams = [teamDuo.id]
                nurses[2].Teams = [teamDuo.id]
                nurses[3].Teams = [teamDuo.id]
                Doctor.create(doctors[2],(err,result) =>{
                    if (err) return console.error(err);
                    var body = teamDuo.Doctors
                    body.push(result.id)
                    body = {Doctors: body}
                    Team.updateAll({id:teamDuo.id},body,(err,res)=>{
                        if (err) return console.error(err);
                    })
                })
                Doctor.create(doctors[3],(err,result) =>{
                    if (err) return console.error(err);
                    var body = teamDuo.Doctors
                    body.push(result.id)
                    body = {Doctors: body}
                    Team.updateAll({id:teamDuo.id},body,(err,res)=>{
                        if (err) return console.error(err);
                    })
                   
                })
                Nurse.create(nurses[2],(err,result) =>{
                    if (err) return console.error(err);
                    var body = teamDuo.Nurses
                    body.push(result.id)
                    body = {Nurses: body}
                    Team.updateAll({id:teamDuo.id},body,(err,res)=>{
                        if (err) return console.error(err);
                    })
                })
                Nurse.create(nurses[3],(err,result) =>{
                    if (err) return console.error(err);
                    var body = teamDuo.Nurses
                    body.push(result.id)
                    body = {Nurses: body}
                    Team.updateAll({id:teamDuo.id},body,(err,res)=>{
                        if (err) return console.error(err);
                    })
                })
                teamDuo.patients.create(patients[1],function(err,result){
                    result.medicalRecordGroups.create(mgr2,function(err,mrg){
                        if (err) return console.error(err);
                        var medRecs = acnea_medicalRecords
                        medRecs.teamId = teamDuo.id
                        mrg.medicalRecords.create(medRecs,function(err,sucess){
                            if (err) return console.error(err);
                        })
                        mrg.detailedMedicalRecord.create(acnea_detailed,function(err,detail){
                            if (err) return console.error(err);
                        })
                    })
                    result.familyHistory.create(familyhistory,function(err,log){
                        if (err) return console.error(err);
                    })
                    result.sexualHistory.create(sexualhistory,function(err,log){
                        if (err) return console.error(err);
                    })
                })
            })

        })
    })*/
}