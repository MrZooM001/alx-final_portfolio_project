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
adminRouter.post('/users/register-bulk', verifyAccessToken, checkUserRole, UsersController.registerBulkUsers);

// Get all archived courses
adminRouter.get('/archive', verifyAccessToken, checkUserRole, QueryController.getAllArchivedCourses);

// Update user role by admin
adminRouter.put('/users/:userId/update-role', verifyAccessToken, checkUserRole, UsersController.updateUserRole);

export default adminRouter;
