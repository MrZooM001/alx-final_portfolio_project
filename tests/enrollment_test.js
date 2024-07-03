const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('Course Enrollment API Integration Tests', () => {
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

  it('should enroll a user in a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .post(`/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Enrolled successfully');
        done();
      });
  });

  it('should disenroll a user from a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .post(`/courses/${courseId}/disenroll`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Disenrolled successfully');
        done();
      });
  });
});
