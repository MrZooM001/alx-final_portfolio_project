import express from 'express';
import CourseController from '../controllers/CourseController.js';
import ContentController from '../controllers/ContentController.js';
import QueryController from '../controllers/QueryController.js';
import EnrollmentController from '../controllers/EnrollmentController.js';
import { checkUserRole } from '../middlewares/checkUserRoleMiddleware.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const courseRouter = express.Router();

courseRouter.get('/', QueryController.getAllCourses);

courseRouter.get('/:courseId', verifyAccessToken, QueryController.getCourseById);

courseRouter.get('/:courseId/content', verifyAccessToken, QueryController.getAllContentForCourse);

courseRouter.get('/:courseId/content/:contentId', verifyAccessToken, QueryController.getContentById);

// Create a new course
courseRouter.post('/create', verifyAccessToken, CourseController.createCourse);

courseRouter.post('/:courseId/add-content', verifyAccessToken, ContentController.addContentToCourse);

courseRouter.put('/:courseId/update', verifyAccessToken, CourseController.updateCourse);

courseRouter.delete('/:courseId/full-delete', verifyAccessToken, CourseController.fullDeleteCourse);

courseRouter.delete('/:courseId/archive', verifyAccessToken, CourseController.archiveCourseById);

courseRouter.post('/:courseId/enroll', verifyAccessToken, EnrollmentController.enrollUserInCourse);

courseRouter.post('/:courseId/disenroll', verifyAccessToken, EnrollmentController.disenrollFromCourse);

courseRouter.put('/:courseId/publish', verifyAccessToken, CourseController.publishCourse);

courseRouter.put('/:courseId/unpublish', verifyAccessToken, CourseController.unpublishCourse);

export default courseRouter;
