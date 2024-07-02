import express from 'express';
import CourseController from '../controllers/CourseController.js';
import ContentController from '../controllers/ContentController.js';
import QueryController from '../controllers/QueryController.js';

import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const archiveRouter = express.Router();

// Get all archived courses by a user
archiveRouter.get('/', verifyAccessToken, QueryController.getArchivedCoursesByInstructor);

// Get archived course by course ID
archiveRouter.get('/:courseId', verifyAccessToken, QueryController.getArchivedCourseById);

// Restore archived course by course ID
archiveRouter.post('/:courseId/restore', verifyAccessToken, CourseController.restoreCourse);

export default archiveRouter;
