import express from 'express';
import AppController from '../controllers/AppController.js';
import dotenv from 'dotenv';

dotenv.config();
const HOST = 'https://ilearningplatform.me/';

const appRouter = express.Router();

// Homepage route include welcome message
appRouter.get('/', async (req, res) => {
  res.status(200).json({
    greeting: "Hi fellas!",
    message: "Welcome to Innovative Learning Platform API - a full featured learning management system",
    docs: `${HOST}api/docs`
  });
});

// Shows server status
appRouter.get('/status', AppController.getStatus);

// Shows collections statistics from database
appRouter.get('/stats', AppController.getStats);

export default appRouter;
