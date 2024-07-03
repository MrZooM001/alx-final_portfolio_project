import express from 'express';
import UsersController from '../controllers/UsersController.js';
import EnrollmentController from '../controllers/EnrollmentController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const usersRouter = express.Router();


usersRouter.post('/register', UsersController.registerUser);

usersRouter.put('/update', verifyAccessToken, UsersController.updateUser);

usersRouter.put('/update-password', verifyAccessToken, UsersController.updatePassword);

usersRouter.get('/enrolled-courses', verifyAccessToken, EnrollmentController.getEnrolledCoursesByUser);

// Get all courses created by the current user as instructor, including private courses.
usersRouter.get('/my-courses', verifyAccessToken, UsersController.getCreatedCoursesByCurrentInstructor);

// Get all courses created by the current user as instructor, including private courses.
usersRouter.get('/my-courses/:courseId', verifyAccessToken, UsersController.getCreatedCourseByCurrentInstructorAndCourseId);

export default usersRouter;
