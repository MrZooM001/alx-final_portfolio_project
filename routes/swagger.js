//#region Swagger schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated id of the user
 *         email:
 *           type: string
 *           description: Email address of the user & used to login
 *         password:
 *           type: string
 *           description: Password of the user
 *         firstName:
 *           type: string
 *           description: First name
 *         lastName:
 *           type: string
 *           description: Last name
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *           description: The user's date of birth
 *         role:
 *           type: string
 *           description: User role as student, instructor or admin
 *         isSuspended:
 *           type: boolean
 *           description: Indicates if the user is suspended from login or not
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date and time when the user was last updated
 *       example:
 *         id: 667b1a926f4875e657358c5bm
 *         email: m.light@example.com
 *         password: $2b$12$KuFCyT3RtuqrUE1DFMC7YO4xD6Yv4ce/HNmjl2DHmOw6Ne507tOyC
 *         firstName: Moon
 *         lastName: Light
 *         dateOfBirth: '1999-06-18T17:13:02.030Z'
 *         role: true
 *         isSuspended: false
 *         createdAt: '2024-06-27T17:21:02.030Z'
 *         updatedAt: '2024-07-01T20:07:43.835Z'
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - instructor
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated id of the course
 *         title:
 *           type: string
 *           description: Title of the course
 *         description:
 *           type: string
 *           description: Description of the course
 *         instructor:
 *           type: string
 *           description: ID of the instructor (User)
 *         category:
 *           type: string
 *           description: ID of the category
 *         contents:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of content IDs related to the course
 *         isPublic:
 *           type: boolean
 *           description: Indicates if the course is public or private
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date and time when the course was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date and time when the course was last updated
 *       example:
 *         id: 667d9f7e2064f6b1471fc253
 *         title: Learn Arabic language from the arabs 2024
 *         description:
 *           We help our students to learn everything about Arabic language from the
 *           basic alphabet to the culture and everyday vocabulary.
 *         instructor: 667b08256f4875e657358c57
 *         category: 667f7030f8f35254af368b82
 *         contents:
 *           - 667d9f7e2064f6b1471fc255
 *           - 667d9f7e2064f6b1471fc256
 *           - 667da63bfc3bcc9600a90cde
 *         isPublic: true
 *         createdAt: '2024-06-27T17:21:02.030Z'
 *         updatedAt: '2024-07-01T20:07:43.835Z'
 *     Content:
 *      type: object
 *      required:
 *       - course
 *       - title
 *       - type
 *       - data
 *      properties:
 *       _id:
 *        type: string
 *        description: The auto-generated ID of the content.
 *        example: 60e45e2e0b5f1c001fc1e7e7
 *       course:
 *        type: string
 *        description: The ID of the course to which the content belongs.
 *        example: 60e45e2e0b5f1c001fc1e7e6
 *       title:
 *        type: string
 *        description: The title of the content.
 *        example: Introduction to JavaScript
 *       type:
 *        type: string
 *        enum: [video, article, audio, quiz]
 *        description: The type of the content.
 *        example: video
 *       data:
 *        type: object
 *        description: The data associated with the content, which can be of any type.
 *        example: { url: 'https://example.com/video.mp4', duration: '10:30' }
 *       isPublic:
 *        type: boolean
 *        default: false
 *        description: Indicates whether the content is public or not.
 *        example: true
 *       createdAt:
 *        type: string
 *        format: date-time
 *        description: The date and time when the content was created.
 *        example: 2023-07-02T14:30:00Z
 *       updatedAt:
 *        type: string
 *        format: date-time
 *        description: The date and time when the content was last updated.
 *        example: 2023-07-05T10:15:00Z
 *      example:
 *       _id: 60e45e2e0b5f1c001fc1e7e7
 *       course: 60e45e2e0b5f1c001fc1e7e6
 *       title: Introduction to JavaScript
 *       type: video
 *       data:
 *        url: https://example.com/video.mp4
 *        duration: '10:30'
 *       isPublic: true
 *       createdAt: 2023-07-02T14:30:00Z
 *       updatedAt: 2023-07-05T10:15:00Z
 *     Category:
 *      type: object
 *      required:
 *       - name
 *      properties:
 *       _id:
 *        type: string
 *        description: The auto-generated ID of the category.
 *        example: 60e45e2e0b5f1c001fc1e7e7
 *       name:
 *        type: string
 *        description: The name of the category.
 *        example: Learning
 *       createdAt:
 *        type: string
 *        format: date-time
 *        description: The date and time when the category was created.
 *        example: 2023-07-02T14:30:00Z
 *       updatedAt:
 *        type: string
 *        format: date-time
 *        description: The date and time when the category was last updated.
 *        example: 2023-07-05T10:15:00Z
 *      example:
 *       _id: 60e45e2e0b5f1c001fc1e7e7
 *       name: Programmming
 *       createdAt: 2023-07-02T14:30:00Z
 *       updatedAt: 2023-07-05T10:15:00Z
 */
//#endregion

//#region Swagger tags
/**
 * @swagger
 * tags:
 *   name: API Root
 *   description: The root of the API
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: The courses management API
 */
//#endregion

//#region Root Endpoints
/**
 * @swagger
 * /:
 *  get:
 *   summary: Just a greeting and welcome message.
 *   tags: [API Root]
 *   responses:
 *    200:
 *     description: A greeting & welcome message.
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        items:
 *         greeting
 *         message
 * 
 * /status:
 *  get:
 *   summary: Get status whether Redis and MongoDB servers are in an active state.
 *   tags: [API Root]
 *   responses:
 *    200:
 *     description: Show status for Caching (Redis) server & Database (MongoDB) server.
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        items:
 *         redis
 *         mongodb
 * 
 * /stats:
 *  get:
 *   summary: Get short statistics about total registered users and total published courses.
 *   tags: [API Root]
 *   responses:
 *    200:
 *     description: Show total registered users and total published courses.
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        items:
 *         redis
 *         mongodb
 * 
 */
//#endregion

