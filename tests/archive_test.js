const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const { expect } = chai;

chai.use(chaiHttp);

describe('Course Archive API Integration Tests', () => {
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

  it('should get all archived courses', (done) => {
    chai.request(server)
      .get('/archive')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get an archived course by ID', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .get(`/archive/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', courseId);
        done();
      });
  });

  it('should restore an archived course by ID', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .post(`/archive/${courseId}/restore`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Course restored successfully');
        done();
      });
  });
});
