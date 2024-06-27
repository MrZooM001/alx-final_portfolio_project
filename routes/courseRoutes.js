import express from 'express';
import CourseController from '../controllers/CourseController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const courseRouter = express.Router();

//#region CourseController
// Create a new course
courseRouter.post('/create', verifyAccessToken, CourseController.createCourse);

courseRouter.get('/', CourseController.getAllCourses);

//#endregion

export default courseRouter;
