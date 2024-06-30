import express from 'express';
import CourseController from '../controllers/CourseController.js';
import ContentController from '../controllers/ContentController.js';
import QueryController from '../controllers/QueryController.js';
import EnrollmentController from '../controllers/EnrollmentController.js';
import { checkUserRole } from '../middlewares/checkUserRoleMiddleware.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const courseRouter = express.Router();

// Get & Search courses by title, description and instructor name
courseRouter.get('/', QueryController.getAllCourses);

courseRouter.get('/:courseId', QueryController.getCourseById);

courseRouter.get('/:courseId/content', QueryController.getAllContentForCourse);

courseRouter.get('/:courseId/content/:contentId', QueryController.getCourceContentById);

// Create a new course
courseRouter.post('/create', verifyAccessToken, CourseController.createCourse);

courseRouter.post('/:courseId/add-content', verifyAccessToken, ContentController.addContentToCourse);

courseRouter.post('/:courseId/update', verifyAccessToken, CourseController.updateCourse);

courseRouter.delete('/:courseId/full-delete', verifyAccessToken, CourseController.fullDeleteCourse);

courseRouter.delete('/:courseId/delete', verifyAccessToken, CourseController.deleteCourse);

courseRouter.post('/:courseId/enroll', verifyAccessToken, EnrollmentController.enrollUserInCourse);

courseRouter.post('/:courseId/disenroll', verifyAccessToken, EnrollmentController.disenrollFromCourse);

export default courseRouter;
