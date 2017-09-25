/**
 *  @author Jan-Patrick Bollow 349891
 */

var mongo = require('mongodb');
var monk = require('monk');

// var supertest = require("supertest");
// This agent refers to PORT where program is runninng.
// var server = supertest.agent("http://localhost:3000");

var index = require('../app_client/js/index');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Json', () => {
  /*
   * Test the /GET getjson
   */
  describe('GET /getjson', () => {
    it('it should GET all json', (done) => {
      chai.request(index)
        .get('/getjson')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});

//Our parent block
describe('Routes', () => {
  /*
   * Test the /GET route
   */
  describe('GET /getroute', () => {
    it('it should GET all json', (done) => {
      chai.request(index)
        .get('/getroute')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});

//Our parent block
describe('Stage', () => {
  /*
   * Test the /GET stage
   */
  describe('GET /getstage', () => {
    it('it should GET all json', (done) => {
      chai.request(index)
        .get('/getstage')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});