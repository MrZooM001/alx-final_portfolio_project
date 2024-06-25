import express from 'express';
import AuthController from '../controllers/AuthController.js';

const authRouter = express.Router();

//#region AuthController routes
// Login a user
authRouter.post('/login', AuthController.loginUser);

// Logout a user
authRouter.delete('/logout', AuthController.logoutUser);
//#endregion

export default authRouter;
