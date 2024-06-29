import express from 'express';
import CourseController from '../controllers/CourseController.js';
import ContentController from '../controllers/ContentController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const archiveRouter = express.Router();

//#region CourseController
// Create a new course
archiveRouter.get('/', verifyAccessToken, CourseController.getAllArchivedCourses);

archiveRouter.get('/:courseId', verifyAccessToken, CourseController.getArchivedCourseById);

archiveRouter.post('/:courseId/restore', verifyAccessToken, CourseController.restoreCourse);

//#endregion

export default archiveRouter;
