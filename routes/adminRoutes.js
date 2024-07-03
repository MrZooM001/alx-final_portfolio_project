import express from 'express';
import UsersController from '../controllers/UsersController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';
import { checkUserRole } from '../middlewares/checkUserRoleMiddleware.js';
import CourseController from '../controllers/CourseController.js';
import QueryController from '../controllers/QueryController.js';

const adminRouter = express.Router();

// Get all users
adminRouter.get('/users', verifyAccessToken, checkUserRole, UsersController.getAllUsers);

// toggle suspend user
adminRouter.post('/users/:userId/toggle-suspend', verifyAccessToken, checkUserRole, UsersController.suspendUser);

// Delete a user
adminRouter.delete('/users/:userId/delete', verifyAccessToken, checkUserRole, UsersController.deleteUser);

// Create bulk of users at once
adminRouter.post('/users/register-bulk', UsersController.registerBulkUsers);

// Get all archived courses
adminRouter.get('/archive', verifyAccessToken, checkUserRole, QueryController.getAllArchivedCourses);

// get active users count as statistics from Redis cache
adminRouter.get('/active-users', verifyAccessToken, UsersController.getActiveUsers);

export default adminRouter;
