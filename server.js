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

const PORT = process.env.PORT;
const HOST = 'https://ilearningplatform.me/';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const corsOptions = {
  origin: HOST,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: 'Innovative Learning Platform API documentation',
      version: '1.0.0',
      description: `Innovative Learning Platform API is a RESTful API, fully featured learning management system that facilitates the management of users, courses, course content and enrollment with a focus on high performance, scalability, and security. It provides user management features, allowing for user registration, login, logout, and updating user information and passwords, as well as the deletion of user accounts. Course management is made simple with capabilities to create courses with all content in one request, update course details, archive and restore courses along with their content, and delete courses entirely. The API also supports detailed course content management, enabling the addition, updating, and deletion of course materials. Additionally, it includes an enrollment system for managing user enrollments in courses. Security is a top priority, with authentication and authorization handled via JSON Web Tokens (JWT) to ensure secure access. The API includes thorough error handling, offering descriptive messages to facilitate troubleshooting and user feedback. It utilizes a high-performance database to guarantee fast and reliable data operations. Additionally, certain routes are restricted to admin users only, ensuring that sensitive operations are secure and controlled. This API is designed to provide a seamless and efficient experience for managing learning resources and user interactions within the LMS`,
      contact: {
        name: 'API Support',
        email: 'support@ilearningplatform.me',
      }
    },
    servers: [
      {
        url: HOST,
      }
    ]
  },
  customSiteTitle: "API Documentation - Innovative Learning Platform",
  apis: ['./docs/*.js']
};

const specs = swaggerJSDoc(swaggerOptions);

// API routes
app.use('/', appRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/courses', courseRouter);
app.use('/archive', archiveRouter);
app.use('/api-admin', adminRouter);

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));


app.listen(PORT, () => {
  console.log(`NodeJS Server is listening on port ${PORT}`);
});

export default app;
