import express from 'express';
import CourseController from '../controllers/CourseController.js';
import ContentController from '../controllers/ContentController.js';
import EnrollmentController from '../controllers/EnrollmentController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const courseRouter = express.Router();

//#region CourseController
// Create a new course
courseRouter.post('/create', verifyAccessToken, CourseController.createCourse);

courseRouter.get('/', CourseController.getAllCourses);

courseRouter.get('/:courseId', CourseController.getCourseById);

courseRouter.post('/:courseId/update', verifyAccessToken, CourseController.updateCourse);

courseRouter.post('/:courseId/add-content', verifyAccessToken, ContentController.addContentToCourse);

courseRouter.delete('/:courseId/full-delete', verifyAccessToken, CourseController.fullDeleteCourse);

courseRouter.delete('/:courseId/delete', verifyAccessToken, CourseController.deleteCourse);

courseRouter.post('/:courseId/enroll', verifyAccessToken, EnrollmentController.enrollUserToCourse);

//#endregion

export default courseRouter;