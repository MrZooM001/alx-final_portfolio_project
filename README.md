# Awesome API Project

![GitHub repo size](https://img.shields.io/github/repo-size/MrZooM001/alx-final_portfolio_project)
![GitHub contributors](https://img.shields.io/github/contributors/MrZooM001/alx-final_portfolio_project)

<p style="font-size: 20px">ALX Webstack Portfolio Project</p>
<p style="font-size: 20px">Learning Management System API</p>

## Project Name:
<p style="font-size: 46px">Innovative Learning Platform API</p>
<br />


## Introduction
Welcome to the Innovative Learning Platform API! <br />
This API is designed to serve as the backbone for a comprehensive learning management system.<br />
It is a portfolio project for graduation from **ALX Software Engineering Program** <br />
<br />
The main goal of this project is to provide a seamless platform for adding, managing, and accessing educational content from various devices, including web, mobile, or desktop applications.


## Overview
Innovative Learning Platform API is a RESTful API that facilitates the management of courses, content, and user enrollments. Built with cutting-edge technologies, this API ensures high performance, scalability, and security. It enables educators to create and distribute educational material efficiently while allowing learners to access and interact with content easily.

## Technologies Used
* <p style="font-size: 20px">Node.js </p>
* <p style="font-size: 20px">Express.js</p>
* <p style="font-size: 20px">MongoDB</p>
* <p style="font-size: 20px">Redis</p>

## NPM Packages used in this project
- ` express `
- ` morgan `
- ` mongoose `
- ` redis `
- ` dotenv `
- ` jsonwebtoken `
- ` bcrypt `
- ` date `
- ` joi `
- ` @joi/date `
- ` http-errors `
- ` cors `
- ` swagger-jsdoc `
- ` swagger-ui-express `

## Features

- ` Course Management `  Create, update, and delete courses.
- ` Content Management `  Add various types of content (videos, articles, audio, quizzes) to courses.
- ` User Enrollment `  Create, update users information easily.
- ` Enrollment Management `  Users can easily enroll, disenroll from courses and list all enrolled courses.
- ` Authentication `   cure endpoints with JWT authentication.
- ` Error Handling `  Comprehensive error handling with descriptive error messages.
- ` Data validation `  Powerful validation steps to ensure correct data entered by users.
- ` API Adminstation `  Granti full access over all API endpoints for Admin users.

### Endpoints Overview

| Root Endpoint                | Description
| ----------------------- | ----------------------------------------|
| `/`                     | Root of the API, contains an overview.  |
| `/users`                | Route of the users endpoints.           |
| `/courses`              | Route for courses endpoints.            |
| `/enrollment`           | Route for courses endpoints.            |
| `/auth`                 | Route for authentication endpoints.     |
| `/api-admin`            | Route for all restricted endpoints.     |


## Security

The API ensures secure operations through:

- ` Course Management `  Create, update, and delete courses.
- `JWT Authentication` Secure access to protected endpoints.
- `Data Validation` Robust input validation using Joi to ensure data integrity.
- `Encrypted Passwords` User passwords are securely hashed using bcrypt.
- `CORS` Configured to allow secure cross-origin requests.

## Documentation

Comprehensive API documentation is available using Swagger UI. <br />
> **Documentations available on** <a href="https://innovative-learning-api-e73228a278b9.herokuapp.com/api/docs">**Innovative Learning API Documentation**</a>