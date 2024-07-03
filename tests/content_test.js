const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Course Content API Integration Tests', () => {
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

  it('should get all contents of a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .get(`/courses/${courseId}/content`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get a specific content of a course by content ID', (done) => {
    const courseId = 'courseId123';
    const contentId = 'contentId123';
    chai.request(server)
      .get(`/courses/${courseId}/content/${contentId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', contentId);
        done();
      });
  });
});
