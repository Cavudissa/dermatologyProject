
var kekG= require("keygenerator");
const UIDGenerator = require('uid-generator');
const DekGenerator = new UIDGenerator(512, UIDGenerator.BASE62);
var cryptoJSON = require('crypto-json')
var generator = require('generate-password');
const Key_vault_Service = require('./key_vaultServices.js')
const kv_Service = new Key_vault_Service()
function UtilsService(app){
    var Error = {status:403,message:"We are sorry but you do not have permission for such action!"}
    //Verify the Role of a user with a given Access Token
    this.verifyRole = function(acess_token,cb){
        app.models.AccessToken.findOne({where: {_id: acess_token}}, function(err, act) {
            if(act == null){
                return cb(Error)
            }
            if(err) return cb(Error)
            var str = act.userId.toString() // Get the userID via token
            app.models.RoleMapping.findOne({where: {principalId: str}}, function(err, rmp) {
                if(err) return cb(Error)
                var rm = rmp.roleId; //Now with the roleID we can retrieve the actual role on next step!
                app.models.Role.findOne({where: {_id: rm}}, function(err, role){
                    if(err) return cb(Error)
                    cb(null,{role:role.name,userId:str})
                })
            })
        })
    }
    
    this.assignRole = function(roleName, userID,cb){
        //Find the role name
        app.models.Role.findOne({where: {name: roleName}}, function(err, role) {
            if (err) { return cb({status:500,message:"Something something is not working... Not your fault! Our engineers will take care of it! :)"});}
            app.models.RoleMapping.create({
              principalType: "USER",
              principalId:userID, // here we assign a given userID to a role
              roleId: role.id
            }, function(err, roleMapping) {
                if (err) return cb({status:500,message:"Something something is not working... Not your fault! Our engineers will take care of it! :)"})
                cb(null,roleMapping)
            })
          });
    }
    this.filterFindbyID = function(toFilter,Model,cb){
        var filter = []
        toFilter.forEach(element => {
            filter.push({id: element})
        });
        Model.find({where: {or: filter}},(err,result)=>{
            if(err) return cb(err)
            cb(null,result)
        })
    }
    this.filterFindbyParam = function(toFilter,Model,filterParam,cb){
        var filter = []
        toFilter.forEach(element => {
            filter.push({[filterParam]: element})
        });
        Model.find({where: {or: filter}},(err,result)=>{
            if(err) return cb(err)
            cb(null,result)
        })
    }

    this.createKeyandEncrypt = function(modelDAL,ignoreKeys,cb){
        let dek = DekGenerator.generateSync() //Generate the DEK
        let kek = kekG._({ forceUppercase: true, specials: false,forceLowercase: false});
        kv_Service.createKeyandEncrypt(dek,kek,(err,keys)=>{
            if(err) return cb(err)
            const kid = keys.kid.split("/")[4] // Get the partial KEK identifier
            const dValue = Buffer.from(keys.cipherText.result, 'base64').toString('base64') // Conver the result to string to then store it on the data
            modelDAL.kek = kid
            modelDAL.dek = dValue
            var cipherData = cryptoJSON.encrypt(modelDAL, dek, {
                encoding: 'base64',
                keys: ignoreKeys
            }) 
            cb(null,{data : cipherData, kek:kid,dek:dValue})
        })
    }
    // Encrypt all the data object with given, the ignore keys are the fields that the function does not encrypt
    this.encryptInfo = function (modelDAL,dek,ignoreKeys){
        var cipherData = cryptoJSON.encrypt(modelDAL, dek, {
            encoding: 'base64',
            keys: ignoreKeys
        })
        return cipherData
    }

    // Get all the data decrypt if the field decrypt is TRUE! Otherwise we just retrieve the decrypted DEK!
    this.retrieveDecryptedInfo= function(model,keys,decrypt,cb){
        kv_Service.decrypt_retrieveData(process.env['Azure_KEYS']+model.kek,model.dek,function(err,res){
            if(err) return cb(err)
            var decryptedData = null
            if(decrypt){ // If true decrypt all the data
                var ts = JSON.parse(JSON.stringify(model))
                var decryptedData = cryptoJSON.decrypt(ts,res, {
                    encoding: 'base64',
                    keys: keys
                })
            }
            cb(null,{data :decryptedData,dek:model.dek,kek:model.kek, decryptedDek:res})
        })
    }

    //Generate 12 characters user password
    this.generatePassword = function(){
        var password = generator.generate({
            length: 12,
            numbers: true
        });
        return password
    }
}

module.exports = UtilsService