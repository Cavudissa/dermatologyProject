const Key_vault_Service = require('./key_vaultServices.js')
const kv_Service = new Key_vault_Service()
var cryptoJSON = require('crypto-json')
const keys = {
    Patient: ['InstituteID','Deceased','id','Status','kek','dek','teamId','userId'],
    Doctor: ['id','InstituteID','Status','kek','dek','Teams','userId'],
    Nurse: ['id','InstituteID','Status','kek','dek','Teams','userId'],
    Leader: ['id','InstituteID','Status','kek','dek','Teams','userId'],
    Administrative: ['id','Status','kek','dek','email','password'],
    Team: ['administrativeId','id','kek','dek','Status','Nurses','Doctors','Leader','TeamName'],
    DetailedMedicalRecord: ['id','kek','dek','TeamNotes','medicalRecordGroupId','teamId','container','description'],
    FamilyMedicalHistory: ['id','kek','dek','patientId'],
    KeyValuePair: ['kek','dek','id'],
    MedicalHistory: ['id','kek','dek','patientId'],
    MedicalRecord: ['id','kek','dek','medicalRecordGroupId','teamId','TeamNotes'],
    MedicalRecordGroup: ['id','kek','dek','patientId','Status'],
    SexualHistory: ['id','kek','dek','patientId'],
    SocialHistory:['id','kek','dek','patientId']
}


function decryptAllInfo(object,cb){
    var promises =[]
    var properties = []
    if(keys[object.constructor.name] !=undefined){
        retrieveDecryptedInfo(object,keys[object.constructor.name],true,(err, result)=>{
            if(err) return cb(err)
            cb(null,result.data)
        })
    }else{
        for(var property in object) {
            if(object[property]==null)
                continue
            var name = object[property].constructor.name
            var values = keys[name];
            var promise
            if(Array.isArray(object[property])){
                promise = new Promise(function(resolve, reject) {
                    decryptArray(object[property],(err, result)=>{
                        if(err)
                            reject(err)
                        resolve(result)
                    })
                });
            }
            else{
                promise = new Promise(function(resolve, reject) {
                    retrieveDecryptedInfo(object[property],values,true,(err, result)=>{
                        if(err)
                            reject(err)
                        resolve(result.data)
                    })
                }); 
            }
            promises.push(promise)
            properties.push(property)
        }
        Promise.all(promises).then(values => {
            for(i= 0; i < values.length ; i++){
                object[properties[i]] = values[i]
            }
            cb(null,object)
        }).catch(reason => { 
            cb(reason)
        });
    }
}

function decryptArray(value,cb){
    var promises =[]
    var promise
    value.forEach(elem => {
        promise = new Promise(function(resolve, reject) {
            decryptAllInfo(elem,(err, result)=>{
                if(err)
                    reject(err)
                resolve(result)
            })
        });
        promises.push(promise)
    })
    Promise.all(promises).then(values => {
        var result = []
        values.forEach(elem=>{
            result.push(elem)
        })
        cb(null,result)
    }).catch(reason => { 
        cb(reason)
    });
  
            
}
function retrieveDecryptedInfo(model,keys,decrypt,cb){
    kv_Service.decrypt_retrieveData(process.env['Azure_KEYS']+model.kek,model.dek,function(err,res){
        if(err) return cb(err)
        var decryptedData = null
        if(decrypt){
            var ts = JSON.parse(JSON.stringify(model))
            var decryptedData = cryptoJSON.decrypt(ts,res, {
                encoding: 'base64',
                keys: keys
            })
        }
        cb(null,{data :decryptedData,dek:model.dek,kek:model.kek, decryptedDek:res})
    })
}

module.exports.decryptAllInfo = decryptAllInfo