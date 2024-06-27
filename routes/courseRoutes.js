import express from 'express';
import CourseController from '../controllers/CourseController.js';
import {verifyAccessToken} from '../middlewares/verifyAccessTokenMiddleware.js';

const courseRouter = express.Router();

//#region CourseController
// Create a new course
courseRouter.get('/', verifyAccessToken, CourseController.createCourse);

//#endregion

export default courseRouter;
