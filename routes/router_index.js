import express from 'express';
import AppController from '../controllers/AppController.js';

const router = express.Router();

// Homepage routes include welcome message
router.get('/', async (req, res) => {
  res.status(200).json({ greeting: "Hi fellas!",
    message: "Welcome to Innovative Learning Platform - LMS API",
   });
});

// Shows server status
router.get('/status', AppController.getStatus);

// Shows collections statistics from database
router.get('/stats', AppController.getStats);

export default router;
