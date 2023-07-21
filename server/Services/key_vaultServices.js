"use strict";
function KeyVaultServices(){

    var util = require('util');
    var KeyVault = require('azure-keyvault');
    var AuthenticationContext = require('adal-node').AuthenticationContext;

    _validateEnvironmentVariables();
    

    // service principal details for running the sample
    var clientId = process.env['CLIENT_ID']; // service principal
    var domain = process.env['DOMAIN']; // tenant id
    var secret = process.env['APPLICATION_SECRET'];
    var subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
    var objectId = process.env['OBJECT_ID'];
    var vaultUri = process.env['VAULT_URI']

    
    var kvCredentials = new KeyVault.KeyVaultCredentials(authenticator);
    var keyVaultClient = new KeyVault.KeyVaultClient(kvCredentials);
   

    // Helpers for interacting with keyvault.

    function authenticator(challenge, callback) {
        // Create a new authentication context.
        var context = new AuthenticationContext(challenge.authorization);

        // Use the context to acquire an authentication token.
        return context.acquireTokenWithClientCredentials(challenge.resource, clientId, secret, function (err, tokenResponse) {
            if (err) throw err;
            // Calculate the value to be set in the request's Authorization header and resume the call.
            var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;

            return callback(null, authorizationValue);
        });
    }

    //Store the key in the Key Vault and encrypt the DEK
    this.createKeyandEncrypt = function(token,keyName, callback) {
        var attributes = { expires: new Date('2050-02-02T08:00:00.000Z'), notBefore: new Date('2018-01-01T08:00:00.000Z') };
        var keyOperations = ['encrypt', 'decrypt'];
        var keyOptions = {
            keyOps: keyOperations,
            keyAttributes: attributes
        };
        keyVaultClient.createKey(vaultUri, keyName, 'RSA', keyOptions, (err,result)=>{
            if(err) return callback(err)
            keyVaultClient.encrypt(result.key.kid, 'RSA-OAEP', Buffer.from(token, 'utf8'), function (encryptErr, cipherText) {		 
                if(err) return callback(encryptErr)
                callback(null, {kid: result.key.kid, cipherText: cipherText})
            });
        }); 
    }

    //Decrypt and retrieve all the DATA
    this.decrypt_retrieveData = function(kid,cypherText,cb){
        keyVaultClient.decrypt(kid,'RSA-OAEP', Buffer.from(cypherText, 'base64'), function (err, result){
            if (err){
                return cb(err)
            }
            var res =result.result.toString('utf8')    
            cb(null,res);
        })
    }
    //Validate if all the environment variables are correctly set
    function _validateEnvironmentVariables() {
        var envs = [];
        if (!process.env['CLIENT_ID']) envs.push('CLIENT_ID');
        if (!process.env['DOMAIN']) envs.push('DOMAIN');
        if (!process.env['APPLICATION_SECRET']) envs.push('APPLICATION_SECRET');
        if (!process.env['AZURE_SUBSCRIPTION_ID']) envs.push('AZURE_SUBSCRIPTION_ID');
        if (!process.env['OBJECT_ID']) envs.push('OBJECT_ID');
        if (envs.length > 0) {
            throw new Error(util.format('please set/export the following environment variables: %s', envs.toString()));
        }
    }
}

module.exports = KeyVaultServices