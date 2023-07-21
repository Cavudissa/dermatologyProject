'use strict';

var assert = require('chai').assert;
var app = require('../server/server.js')
var request = require('supertest')(app)
var createRoles = require('./define_roles.js')
var decryptService = require('../server/Services/decrypt_service.js')
describe('Test Staff', function() {
  var location,team_id,doctor_at,nurse_at
  before(function(done) {
    var models = app.models();
    models = models.filter(model=> model.name!='Email')
    models.forEach(model=>{
      model.attachTo(app.dataSources.testDB);
    });
    createRoles(app,(err,res)=>{
      let data = {
        "instituitionnumber": '123412432',
        "name": 'Institute 1',
        "address": 'beira City',
        "Status": true,
        "email": 'inst1@test.com',
        "password": '123',
        "country": 'Portugal'};
  
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
        let team = {
          "lastname":'Abacate United',
          "leader":'doctor1@test.com'};
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
        let login = {
          "email": 'inst1@test.com',
          "password": '123'};
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
          "maritalstatus":'married',
          "nif":'12323122',
          "birthdate":'03/08/1995',
          "phonenumber":'999111333',
          "cityofbirth":'Lisbon',
          "countrybirth":'Cabo Verde',
        }
      request
        .post('/administrative-register')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function(err, res) {
          if (err) { return done(err); }
          request
          .post('/login/administrative')
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send(login)
          .end(function(err, loginRes) {
            if (err) { return done(err); }
            assert.equal(loginRes.status, 302);
            location = loginRes.headers.location.split('/')[2].split('?');
            request
            .post(`/administrative/${location[0]}/doctor?${location[1]}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(doctor)
            .end(function(err, res) {
              if (err) { return done(err); }
              request
              .post(`/administrative/${location[0]}/team?${location[1]}`)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/json')
              .send(team)
              .end(function(err, res) {
                if (err) { return done(err); }
                request
                .post(`/administrative/${location[0]}/nurse?${location[1]}`)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(nurse)
                .end(function(err, res) {
                  if (err) { return done(err); }
                  assert.equal(res.status, 302);
                  assert.equal(res.headers.location,`/administrative/${location[0]}?${location[1]}`)
                  app.models.Team.find((err,res)=>{
                    var teamId = res[0].id.toString();
                    patient.teamID = teamId
                    team_id = teamId
                    patient.instituition=location[0]
                    request
                    .put(`/administrative/${location[0]}/team/${teamId}?${location[1]}`)
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
                    .send({memberId: 'nurse1@test.com'})
                    .end(function(err, res) {
                      if (err) { return done(err); }
                      request
                      .post(`/administrative/${location[0]}/patient?${location[1]}`)
                      .set('Accept', 'application/json')
                      .set('Content-Type', 'application/json')
                      .send(patient)
                      .end(function(err, res) {
                        if (err) { return done(err); }
                        done()
                      })
                    })
                  })
                })
              })
            })
          });
        })
    })  
  });
  after(function(done){
    app.dataSources.testDB.automigrate(done)
  });

  it('Doctor changing Password sucess',function(done) {
      request
      .post('/resetparticular')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({email:'doctor1@test.com',password:'12345'})
      .end(function(err, res) {
        assert.equal(res.status, 302);
        done()
      })
  })

  it('Doctor changing Password failed because of wrong password',function(done) {
    request
    .post('/resetparticular')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({email:'doctor12@test.com',password:'12345'})
    .end(function(err, res) {
      assert.equal(res.status, 400);
        done()
    })
  })


  it('Nurse changing Password sucess',function(done) {
    request
    .post('/resetparticular')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({email:'nurse1@test.com',password:'12345'})
    .end(function(err, res) {
      assert.equal(res.status, 302);
      done()
    })
  })

  it('Doctor login success',function(done) {
    request
    .post('/login/particular')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({email:'doctor1@test.com',password:'12345'})
    .end(function(err, res) {
      assert.equal(res.status, 302);
      doctor_at = res.headers.location.split('/')[2].split('?')[1];
      done()
    })
  })

  it('Nurse login success',function(done) {
    request
    .post('/login/particular')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({email:'nurse1@test.com',password:'12345'})
    .end(function(err, res) {
      if (err) { return done(err); }
      assert.equal(res.status, 302);
      nurse_at = res.headers.location.split('/')[2].split('?')[1];
      done()
    })
  })
  it('Doctor add patient family medical history ',function(done) {
    let data = {"atopias" : 'atopias',
        "baldness": 'baldness',
        "cancer": 'cancer',
        "cutaneous": 'cutaneous',
        "diabetes":'diabetes',
        "skinDiseases": 'skinDiseases',
        "others":'others'}
    app.models.Doctor.find((err,doctor)=>{
      if (err) { return done(err); }
      var id = doctor[0].id.toString()
      app.models.Patient.find((err,patient)=>{
        if (err) { return done(err); }
        var patientId = patient[0].id.toString()
        request
        .post(`/doctor/${id}/team/${team_id}/patient/${patientId}/familyhistory?${doctor_at}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function(err, res) {
          if (err) { return done(err); }
          assert.equal(res.status, 302);
          done()
        })
      })
    })
  })
  it('Assert patient family medical  history',function(done){
    app.models.FamilyMedicalHistory.find((err,result)=>{
      var fmh = result[0]
      decryptService.decryptAllInfo(fmh,(err,fmh)=>{
        assert.equal(fmh.Cutaneous,'cutaneous')
        assert.equal(fmh.Baldness,'baldness')
        assert.equal(fmh.Others,'others')
        assert.equal(fmh.Cancer,'cancer')
        done()
      })
    })
  })

  it('Nurse add patient sexual  history ',function(done) {
    let data = {"active" : 'active',
        "stdHistory": 'stdHistory'}
    app.models.Nurse.find((err,nurse)=>{
      if (err) { return done(err); }
      var id = nurse[0].id.toString()
      app.models.Patient.find((err,patient)=>{
        if (err) { return done(err); }
        var patientId = patient[0].id.toString()
        request
        .post(`/nurse/${id}/team/${team_id}/patient/${patientId}/sexualhistory?${nurse_at}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function(err, res) {
          if (err) { return done(err); }
          assert.equal(res.status, 302);
          done()
        })
      })
    })
  })
  it('Assert patient family medical  history',function(done){
    app.models.SexualHistory.find((err,result)=>{
      var sh = result[0]
      decryptService.decryptAllInfo(sh,(err,sh)=>{
        assert.equal(sh.SexuallyActive,'active')
        assert.equal(sh.STDHistory,'stdHistory')
        done()
      })
    })
  })

})