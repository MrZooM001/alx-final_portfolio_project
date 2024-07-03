const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Course API Integration Tests', () => {
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

  it('should get all courses', (done) => {
    chai.request(server)
      .get('/courses')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get a course by ID', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .get(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id', courseId);
        done();
      });
  });

  it('should create a course', (done) => {
    chai.request(server)
      .post('/courses/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Course', description: 'Course Description' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('title', 'New Course');
        done();
      });
  });

  it('should add content to a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .post(`/courses/${courseId}/add-content`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Content', type: 'video', data: { url: 'http://example.com' } })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should update a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .put(`/courses/${courseId}/update`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Course' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('title', 'Updated Course');
        done();
      });
  });

  it('should fully delete a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .delete(`/courses/${courseId}/full-delete`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });

  it('should soft delete a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .delete(`/courses/${courseId}/delete`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Course deleted successfully');
        done();
      });
  });

  it('should publish a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .put(`/courses/${courseId}/publish`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should unpublish a course', (done) => {
    const courseId = 'courseId123';
    chai.request(server)
      .put(`/courses/${courseId}/unpublish`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
