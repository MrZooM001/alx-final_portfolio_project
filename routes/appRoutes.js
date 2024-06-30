import express from 'express';
import AppController from '../controllers/AppController.js';

const appRouter = express.Router();

//#region Homepage
// Homepage route include welcome message
appRouter.get('/', async (req, res) => {
  res.status(200).json({
    greeting: "Hi fellas!",
    message: "Welcome to Innovative Learning Platform API - Learning Management System",
  });
});
//#endregion

//#region App Controller
// Shows server status
appRouter.get('/status', AppController.getStatus);

// Shows collections statistics from database
appRouter.get('/stats', AppController.getStats);
//#endregion

export default appRouter;
