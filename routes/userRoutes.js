import express from 'express';
import UsersController from '../controllers/UsersController.js';
import EnrollmentController from '../controllers/EnrollmentController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const usersRouter = express.Router();


usersRouter.post('/register', UsersController.registerUser);

usersRouter.post('/update', verifyAccessToken, UsersController.updateUser);

usersRouter.post('/update-password', verifyAccessToken, UsersController.updatePassword);

// get active users count as statistics from Redis cache
usersRouter.get('/active-users', verifyAccessToken, UsersController.getActiveUsers);

usersRouter.get('/enrolled-courses', verifyAccessToken, EnrollmentController.getEnrolledCoursesByUser);


export default usersRouter;
