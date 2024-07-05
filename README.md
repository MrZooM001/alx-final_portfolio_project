# Awesome API Project

![GitHub repo size](https://img.shields.io/github/repo-size/MrZooM001/alx-final_portfolio_project)
![GitHub contributors](https://img.shields.io/github/contributors/MrZooM001/alx-final_portfolio_project)



### **<p style="font-size: 20px">ALX Webstack Portfolio Project</p>**

### **<p style="font-size: 20px">Learning Management System API</p>**



## Project Name

**<p style="font-size: 36px">Innovative Learning Platform API</p>**

### **API URL** <a href="https://ilearningplatform.me" target="_blank" rel="noreferrer">https://ilearningplatform.me</a>


## Introduction
Welcome to the Innovative Learning Platform API! <br />
This API is designed to serve as the backbone for a comprehensive learning management system.<br />
It is a portfolio project for graduation from **ALX Software Engineering Program** <br />
<br />
The main goal of this project is to provide a seamless platform for adding, managing, and accessing educational content from various devices, including web, mobile, or desktop applications.


## Overview
Innovative Learning Platform API is a RESTful API that facilitates the management of courses, content, and user enrollments. Built with cutting-edge technologies, this API ensures high performance, scalability, and security. It enables instructors to create and distribute educational material efficiently while allowing learners to access and interact with content easily.


## Technologies Used

* <p style="font-size: 20px; display: flex; align-items: center;">Node.js  &nbsp; &nbsp; &nbsp; &nbsp; <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" style="background-color: white; padding: 4px 8px" alt="express" width="64" height="64"/></p>

* <p style="font-size: 20px; display: flex; align-items: center;">Express.js &nbsp; &nbsp; &nbsp; <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" style="background-color: white; padding: 4px 8px" alt="express" width="64" height="64"/></p>
* <p style="font-size: 20px; display: flex; align-items: center; ">MongoDB &nbsp; &nbsp; <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" style="background-color: white; padding: 4px 8px" alt="express" width="64" height="64"/></p>

* <p style="font-size: 20px; display: flex; align-items: center;">Redis &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" alt="redis" style="background-color: white; padding: 4px 8px" alt="express" width="64" height="64"/></p>

## NPM Packages used in this project

  * `  express  ` <br />
  * `  morgan  ` <br />
  * `  mongodb  ` <br />
  * `  mongoose  ` <br />
  * `  redis  ` <br />
  * `  dotenv  ` <br />
  * `  jsonwebtoken  ` <br />
  * `  bcrypt  ` <br />
  * `  joi  ` <br />
  * `  @joi/date  ` <br />
  * `  date-fns  ` <br />
  * `  http-errors  ` <br />
  * `  cors  ` <br />
  * `  swagger-jsdoc  ` <br />
  * `  swagger-ui-express  ` <br />


## Features

- ` Course Management `  Create, update, and delete courses.
- ` Content Management `  Add various types of content (videos, articles, audio, quizzes) to courses.
- ` User Enrollment `  Create, update users information easily.
- ` Enrollment Management `  Users can easily enroll, disenroll from courses and list all enrolled courses.
- ` Authentication `   cure endpoints with JWT authentication.
- ` Error Handling `  Comprehensive error handling with descriptive error messages.
- ` Data validation `  Powerful validation steps to ensure correct data entered by users.
- ` API Adminstation `  Grant full access over all API endpoints for Admin users only.

### Endpoints Overview

| Root Endpoint                | Description
| ----------------------- | ----------------------------------------|
| `/`                     | Root of the API, contains an overview.  |
| `/users`                | Root route for the users endpoints.           |
| `/courses`              | Root route for courses and related content endpoints.            |
| `/enrollment`           | Root route for courses enrollment endpoints.            |
| `/archive`              | Root route for archive courses by instructors endpoints.            |
| `/auth`                 | Root route for authentication endpoints.     |
| `/api-admin`            | Root route for all restricted endpoints.     |


## Security

The API ensures secure operations through:

- `JWT Authentication` Secure access to protected endpoints.
- `Encrypted Passwords` User passwords are securely hashed using bcrypt.
- `CORS` Configured to allow secure cross-origin requests.
- `Data Validation` Robust input validation using Joi to ensure data integrity.

## Documentation

Comprehensive API documentation is available using Swagger UI. <br />

> Documentations available on **<a href="https://ilearningplatform.me/api/docs" target="_blank" rel="noreferrer">Innovative Learning Platform - API Documentation</a>**
