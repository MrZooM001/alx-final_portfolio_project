import express from 'express';
import AppController from '../controllers/AppController.js';
import UserController from '../controllers/UsersController.js';

const router = express.Router();

//#region Homepage
// Homepage routes include welcome message
router.get('/', async (req, res) => {
  res.status(200).json({ greeting: "Hi fellas!",
    message: "Welcome to Innovative Learning Platform - LMS API",
   });
});
//#endregion

//#region App Controller
// Shows server status
router.get('/status', AppController.getStatus);

// Shows collections statistics from database
router.get('/stats', AppController.getStats);
//#endregion

//#region UserController
// Register a new user
router.post('/users/register', UserController.registerUser);
//#endregion

export default router;
