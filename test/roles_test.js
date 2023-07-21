'use strict';

var assert = require('chai').assert;
var app = require('../server/server.js')
var request = require('supertest')(app)
var createRoles = require('./define_roles.js')
var UtilsService = require('../server/Services/utils_service.js')
describe('Test Roles', function() {
  const utilsService = new UtilsService(app)
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
      request
        .post('/administrative-register')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data)
        .end(function(err, post) {
          if (err) { return done(err); }
          done();
        });
    });
    
  });
  after(function(done){
    app.dataSources.testDB.automigrate(done)
  });

  it('Verify Administrative Role and Token', function(done) {
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
        var at = loginRes.headers.location.split('/')[2].split('?')[1].split('=')[1];
        utilsService.verifyRole(at,(err,result)=>{
          if (err) { return done(err); }
          assert.equal(result.role,'administrative')
          done();
        })
      });
  })


  it('Verify Role failing - Wrong Token 403', function(done) {
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
        utilsService.verifyRole('12312323123',(err,result)=>{
          assert.equal(err.status,403)
          done();
        })
      });
  })
})