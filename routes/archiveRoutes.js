import express from 'express';
import CourseController from '../controllers/CourseController.js';
import ContentController from '../controllers/ContentController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const archiveRouter = express.Router();

//#region CourseController

// Get all archived courses by a user
archiveRouter.get('/', verifyAccessToken, CourseController.getArchivedCoursesByUser);

// Get archived course by course ID
archiveRouter.get('/:courseId', verifyAccessToken, CourseController.getArchivedCourseById);

// Restore archived course by course ID
archiveRouter.post('/:courseId/restore', verifyAccessToken, CourseController.restoreCourse);

//#endregion

export default archiveRouter;
