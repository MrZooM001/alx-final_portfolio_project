import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/appRoutes.js';
import authRouter from './routes/authRoutes.js';
import usersRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const API_PORT = process.env.API_PORT || 5000;

app.use('/', appRouter);
app.use('/auth/', authRouter);
app.use('/users/', usersRouter);
app.use('/courses/', courseRouter);

app.listen(API_PORT, () => {
  console.log(`
    \t◤⁗‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷◥
    \t|    Innovative Learning Platform API    |
    \t|    ————————————————————————————————    |
    \t|     » Learning Management System «     |
    \t◣…………………………………………………………………………………………………………◢
\nServer is listening on http://localhost:${API_PORT}\n`);
});
