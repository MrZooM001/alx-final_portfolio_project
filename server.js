import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import adminRouter from './routes/adminRoutes.js';
import appRouter from './routes/appRoutes.js';
import authRouter from './routes/authRoutes.js';
import usersRouter from './routes/userRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import archiveRouter from './routes/archiveRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: 'Innovative Learning Platform API',
      version: '1.0.0',
      description: 'API documentation for the Innovative Learning Platform - Learning Management System API',
      contact: {
        name: 'API Support',
        email: 'support@ilearningplafrom.com',
        url: 'https://api.ilearningplafrom.com/support'
      }
    },
    servers: [
      {
        url: `http://${HOST}:${PORT}`
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJSDoc(options);

// API routes
app.use('/', appRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/courses', courseRouter);
app.use('/archive', archiveRouter);
app.use('/api-admin', adminRouter);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));


app.listen(PORT, () => {
  console.log(`NodeJS Server is listening on http://${HOST}:${PORT}/`);
});
