import express from 'express';
import dbClient from 'db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  // check MongoDB connection and reading data from database
  const countUsers = await dbClient.countUsers();
  const countCourses = await dbClient.countCourses();
  res.status(200).json({ message: "Hi fellas!", countUsers, countCourses });
});

export default router;
