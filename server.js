import express from 'express';
import dotenv from 'dotenv';
import appRouter from './routes/appRoutes.js';
import authRouter from './routes/authRoutes.js';
import usersRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_PORT = process.env.API_PORT || 5000;

app.use('/', appRouter);
app.use('/auth/', authRouter);
app.use('/users/', usersRouter);

app.listen(API_PORT, () => {
  console.log(`Innovative Learning Platform API server is listening on http://localhost:/${API_PORT}`);
});
