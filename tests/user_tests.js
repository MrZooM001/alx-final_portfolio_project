const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe('User API Integration Tests', () => {
  let token;

  before((done) => {
    chai.request(server)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should register a user', (done) => {
    chai.request(server)
      .post('/users/register')
      .send({ email: 'user@example.com', password: 'password' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('email', 'user@example.com');
        done();
      });
  });

  it('should update a user', (done) => {
    chai.request(server)
      .put('/users/update')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'updateduser@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('email', 'updateduser@example.com');
        done();
      });
  });

  it('should update a user password', (done) => {
    chai.request(server)
      .put('/users/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'newpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should get enrolled courses for a user', (done) => {
    chai.request(server)
      .get('/users/enrolled-courses')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
});
