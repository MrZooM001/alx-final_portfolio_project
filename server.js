import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import appRouter from './routes/appRoutes.js';
import authRouter from './routes/authRoutes.js';
import usersRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import archiveRouter from './routes/archiveRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const API_PORT = process.env.API_PORT || 5000;
const API_HOST = process.env.API_HOST || 'localhost';

app.use('/', appRouter);
app.use('/auth/', authRouter);
app.use('/users/', usersRouter);
app.use('/courses/', courseRouter);
app.use('/archive/', archiveRouter);

app.listen(API_PORT, () => {
  console.log(`
    \t◤⁗‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷‷◥
    \t|    Innovative Learning Platform API    |
    \t|    ————————————————————————————————    |
    \t|     » Learning Management System «     |
    \t◣…………………………………………………………………………………………………………◢
\nNodeJS Server is listening on http://${API_HOST}:${API_PORT}/\n`);
});
