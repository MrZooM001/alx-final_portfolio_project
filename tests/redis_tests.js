const chai = require('chai');
const chaiHttp = require('chai-http');
const { redisClient } = require('../utils/redis');

chai.use(chaiHttp);
const { expect } = chai;

describe('Redis Tests', () => {
  it('should set and get a value from Redis', (done) => {
    redisClient.set('testKey', 'testValue', (err, reply) => {
      expect(reply).to.equal('OK');
      redisClient.get('testKey', (err, value) => {
        expect(value).to.equal('testValue');
        done();
      });
    });
  });

  it('should delete a value from Redis', (done) => {
    redisClient.del('testKey', (err, reply) => {
      expect(reply).to.equal(1);
      redisClient.get('testKey', (err, value) => {
        expect(value).to.be.null;
        done();
      });
    });
  });
});
