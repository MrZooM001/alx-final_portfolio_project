import * as chai from 'chai';
import server from '../server.js';
import request from 'supertest';

const { expect } = chai;

describe('Course Enrollment API Integration Tests', () => {
  let token;

  before((done) => {
    request(server)
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'password' })
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });

  it('should enroll a user in a course', (done) => {
    const courseId = '667d9fb6fc3bcc9600a90cca';
    request(server)
      .post(`/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Enrolled successfully');
        done();
      });
  });

  it('should disenroll a user from a course', (done) => {
    const courseId = '667d9fb6fc3bcc9600a90cca';
    request(server)
      .post(`/courses/${courseId}/disenroll`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Disenrolled successfully');
        done();
      });
  });
});
