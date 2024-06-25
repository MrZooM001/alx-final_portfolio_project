import express from 'express';
import UsersController from '../controllers/UsersController.js';

const usersRouter = express.Router();

//#region UserController
// Register a new user
usersRouter.post('/register', UsersController.registerUser);

// get active users count as statistics from Redis cache
usersRouter.get('/active-users', UsersController.getActiveUsers);
//#endregion

export default usersRouter;
