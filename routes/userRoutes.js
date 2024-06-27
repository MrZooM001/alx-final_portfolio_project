import express from 'express';
import UsersController from '../controllers/UsersController.js';
import { verifyAccessToken } from '../middlewares/verifyAccessTokenMiddleware.js';

const usersRouter = express.Router();

//#region UserController
// Register a new user
usersRouter.post('/register', UsersController.registerUser);

// get active users count as statistics from Redis cache
usersRouter.get('/active-users', verifyAccessToken, UsersController.getActiveUsers);
//#endregion

export default usersRouter;
