'use strict';

var assert = require('chai').assert;
var app = require('../server/server.js')
var request = require('supertest')(app)
var createRoles = require('./define_roles.js')
var decryptService = require('../server/Services/decrypt_service.js')
describe('Administrative integration Tests', function() {
  var location
  before(function(done) {
    var models = app.models();
    models = models.filter(model=> model.name!='Email')
    models.forEach(model=>{
      model.attachTo(app.dataSources.testDB);
    });
    createRoles(app,(err,res)=>{
      done();      
    });
  });
  after(function(done){
    app.dataSources.testDB.automigrate(done)
  });

  it('Administrative create', function(done) {
    let data = {
      "instituitionnumber": '123412432',
      "name": 'Institute 1',
      "address": 'beira City',
      "Status": true,
      "email": 'inst1@test.com',
      "password": '123',
      "country": 'Portugal'};
 
    request
      .post('/administrative-register')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, post) {
        if (err) { return done(err); }
          assert.equal(post.status, 302);
          done();
      });
  });

  it('Administrative assert informations after decypher',function(done){
    app.models.Administrative.find((err,result)=>{
      var administrative = result[0]
      decryptService.decryptAllInfo(administrative,(err,administrative)=>{
        assert.equal(administrative.InstituitionNumber,'123412432')
        assert.equal(administrative.Name,'Institute 1')
        assert.equal(administrative.email,'inst1@test.com')
        done()
      })
    })
  })

  it('Administrative login', function(done) {
    let data = {
      "email": 'inst1@test.com',
      "password": '123'};
    request
      .post('/login/administrative')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, loginRes) {
        if (err) { return done(err); }
        assert.equal(loginRes.status, 302);
        location = loginRes.headers.location.split('/')[2].split('?');
        request
          .get(loginRes.headers.location)
          .end(function(err, result) {
            if (err) { return done(err); }
              assert.equal(result.status, 200);
              done();
          })
      });
  })
  it('Administrative creating Doctor',function(done){
    let doctor = {
      "idType":'Cartão Cidadão',
      "idNumber":'123234234',
      "name":'Ulissio',
      "lastname":'Mendes',
      "Status":true,
      "gender":'Male',
      "nationality":'Portugal',
      "address":'Rua do Batatal 1',
      "postalcode":'1800-061',
      "email":'doctor1@test.com'};
      
    request
      .post(`/administrative/${location[0]}/doctor?${location[1]}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(doctor)
      .end(function(err, res) {
        if (err) { return done(err); }
        assert.equal(res.status, 302);
        assert.equal(res.headers.location,`/administrative/${location[0]}?${location[1]}`)
        done()
      })
  });
  it('Assert created doctor informations after decypher',function(done){
    app.models.Doctor.find((err,result)=>{
      var doctor = result[0]
      decryptService.decryptAllInfo(doctor,(err,doctor)=>{
        assert.equal(doctor.IDType,'Cartão Cidadão')
        assert.equal(doctor.IDNumber,'123234234')
        assert.equal(doctor.Name,'Ulissio')
        assert.equal(doctor.LastName,'Mendes')
        assert.equal(doctor.Email,'doctor1@test.com')
        done()
      })
    })
  })
  it('Administrative creating Team',function(done){
    let team = {
      "lastname":'Abacate United',
      "leader":'doctor1@test.com'};
      
    request
      .post(`/administrative/${location[0]}/team?${location[1]}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(team)
      .end(function(err, res) {
        if (err) { return done(err); }
        assert.equal(res.status, 302);
        assert.equal(res.headers.location,`/administrative/${location[0]}?${location[1]}`)
        done()
      })
  });
  

  it('Administrative creating Team - Failing -(Wrong doctor email) 401 code',function(done){
    let team = {
      "lastname":'Abacate United',
      "leader":'doctor11@test.com'};
      
    request
      .post(`/administrative/${location[0]}/team?${location[1]}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(team)
      .end(function(err, res) {
        if (err) { return done(err); }
        assert.equal(res.status, 401);
        done()
      })
  });

  it('Administrative creating Patient',function(done){
    let patient = {
      "idType":'Cartão Cidadão',
      "idNumber":'12334555',
      "name":'John',
      "lastname":'Wick',
      "Status":true,
      "gender":'Male',
      "nationality":'Portuguese',
      "address":'Rua Cidade Moskowitz',
      "postalcode":'1800-076',
      "email":'wick@test.com',
      "instituition":location[0],
      "maritalstatus":'married',
      "nif":'12323122',
      "birthdate":'03/08/1995',
      "phonenumber":'999111333',
      "cityofbirth":'Lisbon',
      "countrybirth":'Cabo Verde',
    }
    app.models.Team.find((err,res)=>{
      var teamId = res[0].id.toString();
      patient.teamID = teamId
      request
      .post(`/administrative/${location[0]}/patient?${location[1]}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(patient)
      .end(function(err, res) {
        if (err) { return done(err); }
        assert.equal(res.status, 302);
        assert.equal(res.headers.location,`/administrative/${location[0]}?${location[1]}`)
        done()
      })
    })
  });

  it('Assert created patient informations after decypher',function(done){
    app.models.Patient.find((err,result)=>{
      var patient = result[0]
      decryptService.decryptAllInfo(patient,(err,patient)=>{
        assert.equal(patient.IDType,'Cartão Cidadão')
        assert.equal(patient.IDNumber,'12334555')
        assert.equal(patient.Name,'John')
        assert.equal(patient.LastName,'Wick')
        assert.equal(patient.Email,'wick@test.com')
        done()
      })
    })
  })
  it('Administrative creating Nurse',function(done){
    let nurse = {
      "idType":'Cartão Cidadão',
      "idNumber":'123234234',
      "name":'Etelvina',
      "lastname":'Monteiro',
      "Status":true,
      "gender":'Male',
      "nationality":'Portugal',
      "address":'Rua do Batatal 1',
      "postalcode":'1800-061',
      "email":'nurse1@test.com'};
      
    request
      .post(`/administrative/${location[0]}/nurse?${location[1]}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(nurse)
      .end(function(err, res) {
        if (err) { return done(err); }
        assert.equal(res.status, 302);
        assert.equal(res.headers.location,`/administrative/${location[0]}?${location[1]}`)
        done()
      })
  });
  it('Assert created nurse informations after decypher',function(done){
    app.models.Nurse.find((err,result)=>{
      var nurse = result[0]
      decryptService.decryptAllInfo(nurse,(err,nurse)=>{
        assert.equal(nurse.IDType,'Cartão Cidadão')
        assert.equal(nurse.IDNumber,'123234234')
        assert.equal(nurse.Name,'Etelvina')
        assert.equal(nurse.LastName,'Monteiro')
        assert.equal(nurse.Email,'nurse1@test.com')
        done()
      })
    })
  })
  it('Administrative creating user with already existing email - Failing - 401 code',function(done){
    let nurse = {
      "idType":'Cartão Cidadão',
      "idNumber":'123234234',
      "name":'Etelvina',
      "lastname":'Monteiro',
      "Status":true,
      "gender":'Male',
      "nationality":'Portugal',
      "address":'Rua do Batatal 1',
      "postalcode":'1800-061',
      "email":'nurse1@test.com'};
      
    request
      .post(`/administrative/${location[0]}/nurse?${location[1]}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(nurse)
      .end(function(err, res) {
        if (err) { return done(err); }
        assert.equal(res.status, 401);
        done()
      })
  });


 /* it('Administrative login Failing', function(done) {
    let data = {
      "email": 'inst1@test.com',
      "password": '1234'};
    request
      .post('/login/administrative')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, result) {
        if (err) { return done(err); }
        assert.equal(result.status, 401);
        done();
      });
  })*/
 

});


