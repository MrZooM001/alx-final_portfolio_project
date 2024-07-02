import express from 'express';
import AppController from '../controllers/AppController.js';

const appRouter = express.Router();



// Homepage route include welcome message
appRouter.get('/', async (req, res) => {
  res.status(200).json({
    greeting: "Hi fellas!",
    message: "Welcome to Innovative Learning Platform API - a learning management system",
  });
});

// Shows server status
appRouter.get('/status', AppController.getStatus);

// Shows collections statistics from database
appRouter.get('/stats', AppController.getStats);

export default appRouter;
