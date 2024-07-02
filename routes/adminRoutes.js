import express from 'express';
import UsersController from '../controllers/UsersController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';
import { checkUserRole } from '../middlewares/checkUserRoleMiddleware.js';
import CourseController from '../controllers/CourseController.js';
import QueryController from '../controllers/QueryController.js';


const adminRouter = express.Router();

// Delete a user
adminRouter.delete('/users/:userId/delete', verifyAccessToken, checkUserRole, UsersController.deleteUser);

// toggle suspend user
adminRouter.post('/users/:userId/toggle-suspend', verifyAccessToken, checkUserRole, UsersController.suspendUser);

// Get all users
adminRouter.get('/users', verifyAccessToken, checkUserRole, UsersController.getAllUsers);

// Get all archived courses
adminRouter.get('/archive', verifyAccessToken, checkUserRole, QueryController.getAllArchivedCourses);

adminRouter.post('/users/register-bulk', UsersController.registerBulkUsers);

// // Restore archived course by course ID
// adminRouter.post('/archive/:courseId/restore', verifyAccessToken, checkUserRole, CourseController.restoreCourse);

export default adminRouter;
