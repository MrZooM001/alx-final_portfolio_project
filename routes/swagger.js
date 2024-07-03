//#region Swagger schemas
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - password
 *         - dateOfBirth
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
 *
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
 *
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
 *
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
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *       example:
 *         error: "No courses found"
 * 
 *     Enrollment:
 *       type: object
 *       required:
 *         - user
 *         - course
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated id of the enrollment
 *         user:
 *           type: string
 *           description: ID of the student
 *         course:
 *           type: string
 *           description: ID of the course to enroll into
 *         status:
 *           type: string
 *           description: Status of the enrollment
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date and time when the user enroll in a course
 *         progress:
 *           type: string
 *           description: percentage number based on total completed content of the enrolled course
 *         isCompleted:
 *           type: boolean
 *           description: Indicates if the course is completed or not
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date and time when the course is completed
 *         completedContents:
 *           type: array
 *           description: Array of completed content by the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date and time when the enrollment was started
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated date and time when the enrollment was last updated
 *       example:
 *         id: "667d9fb6fc3bcc9600a90cca"
 *         user: "6680453a21718b5f2e34a364"
 *         course: "667f7030f8f35254af368b82"
 *         status: "enrolled"
 *         progress: 34
 *         isCompleted: false
 *         enrolledAt": "2024-06-29T23:30:15.967Z"
 *         completedAt": ""
 *         completedContents:
 *           - 667d9f7e2064f6b1471fc255
 *           - 667d9f7e2064f6b1471fc256
 *           - 667da63bfc3bcc9600a90cde
 *         createdAt: "2024-06-29T23:30:15.967Z"
 *         updatedAt: '2024-07-01T20:07:43.835Z'
 * 
 *     CourseEnrollment:
 *       type: object
 *       properties:
 *         courseId:
 *           type: string
 *           description: ID of the course
 *           example: 667d9fb6fc3bcc9600a90cca
 *         title:
 *           type: string
 *           description: Title of the course
 *           example: how to learn english verbs in 2024
 *         description:
 *           type: string
 *           description: Description of the course
 *           example: English verbs are fun
 *         instructor:
 *           type: string
 *           description: Name of the instructor
 *           example: undefined undefined
 *         status:
 *           type: string
 *           description: Enrollment status
 *           example: enrolled
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the enrollment occurred
 *           example: 2024-06-29T23:30:15.967Z
 *
 * 
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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users management API
 */

/**
 * @swagger
 * tags:
 *   name: API-Admin
 *   description: API for Admins only to manage restricted endpoints.
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

//#region Users Endpoints
/**
 * @swagger
 * /users/register:
 *  post:
 *   summary: Register a new user account.
 *   tags: [Users]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - dateOfBirth
 *       properties:
 *         email:
 *           type: string
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *         firstName:
 *           type: string
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           description: Last name of the user
 *         dateOfBirth:
 *           type: string
 *           format: date-time
 *           description: The user's date of birth, must use the format (M-D-YYYY)
 *         role:
 *           type: string
 *           description: User role (student, instructor)
 *       example:
 *         email: "john.doe@example.com"
 *         password: "password123"
 *         firstName: "John"
 *         lastName: "Doe"
 *         dateOfBirth: "6-19-1989"
 *         role: "student"
 *   responses:
 *    201:
 *     description: A new user account created successful & Returns the generated access token and refresh token that will be used for login and authorization.
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *        items:
 *         accessToken
 *         refreshToken
 *    400:
 *     description: Data validation errors like "password" length must be at least 6 characters long, etc...
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *    409:
 *     description: Email already exists
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *    500:
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *
 * /users/update:
 *  post:
 *   summary: Update info /not password/ for the current logged in user.
 *   tags: [Users]
 *   security:
 *      - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         firstName:
 *           type: string
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           description: Last name of the user
 *       example:
 *         firstName: "Batman"
 *         lastName: "Artista"
 *         # Both are optional
 *   responses:
 *    200:
 *     description: User info updated successfully and return the updated fields only.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *    404:
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *    500:
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *
 * /users/update-password:
 *  post:
 *   summary: Update password only for the current logged in user.
 *   tags: [Users]
 *   security:
 *      - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Current password of the current logged in user.
 *         newPassword:
 *           type: string
 *           description: New password of the current logged in user.
 *       example:
 *         currentPassword: 123456,
 *         newPassword: a100H66s
 *   responses:
 *    200:
 *     description: User password updated & return message that password updated successfully.
 *    404:
 *     description: User not found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *    500:
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *
 * /users/enrolled-courses:
 *  post:
 *   summary: List of courses that current logged in user has beed enrolled into.
 *   tags: [Users]
 *   security:
 *      - bearerAuth: []
 *   responses:
 *    200:
 *     description: Array of courses that user enrolled into.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CourseEnrollment'
 *    404:
 *     description: No enrollments found
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 *    500:
 *     description: Internal server error
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 * 
 * 
 */
//#endregion

//#region Courses Endpoints
/**
 * @swagger
 * /courses/:
 *  get:
 *   summary: Get a list of all published courses, including search queries.
 *   tags: [Courses]
 *   parameters:
 *    - in: query
 *      name: title
 *      schema:
 *        type: string
 *      description: Search term to filter courses by title
 *    - in: query
 *      name: description
 *      schema:
 *        type: string
 *      description: Search term to filter courses by description
 *    - in: query
 *      name: instructor
 *      schema:
 *        type: string
 *      description: Search term to filter courses by instructor's first name or last name
 *    - in: query
 *      name: category
 *      schema:
 *        type: string
 *      description: Search term to filter courses by category name
 *   responses:
 *    200:
 *     description: List of published courses.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Course'
 *    404:
 *     description: No courses found /OR/ No courses match your search
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 * 
 *
 * /courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Course data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Course"
 *             example:
 *               _id: "667d9fb6fc3bcc9600a90cca"
 *               title: "how to learn english verbs in 2024"
 *               description: "English verbs are fun"
 *               category: "Language"
 *               instructor: "John Doe"
 *               isPublic: false
 *               createdAt: "2024-06-29T23:30:15.967Z"
 *               updatedAt: "2024-06-29T23:30:15.967Z"
 *               contents:
 *                 - _id: "6681ab2bb0287efcbc04d972"
 *                   title: "Introduction to verbs"
 *                   type: "video"
 *                   isPublic: true
 *                   data: "video data"
 *                 - _id: "6681ab2bb0287efcbc04d973"
 *                   title: "Verb to be"
 *                   type: "article"
 *                   isPublic: false
 *                   data: "article data"
 *       "404":
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               NotFound:
 *                 value:
 *                   error: "Course not found"
 * 
 * /courses/{courseId}/content:
 *   get:
 *     summary: Get all content for a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: List of course content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                 contents:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Content"
 *             example:
 *               courseId: "667d9fb6fc3bcc9600a90cca"
 *               contents:
 *                 - _id: "6681ab2bb0287efcbc04d972"
 *                   title: "Introduction to verbs"
 *                   type: "video"
 *                   isPublic: true
 *                   data: "video data"
 *                 - _id: "6681ab2bb0287efcbc04d973"
 *                   title: "Verb to be"
 *                   type: "article"
 *                   isPublic: false
 *                   data: "article data"
 *       "404":
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               NotFound:
 *                 value:
 *                   message: "Content not found"
 * 
 * /courses/{courseId}/content/{contentId}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Content data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Content"
 *             example:
 *               _id: "6681ab2bb0287efcbc04d972"
 *               title: "Introduction to verbs"
 *               type: "video"
 *               isPublic: true
 *               data: "video data"
 *               course: "667d9fb6fc3bcc9600a90cca"
 *       "404":
 *         description: Content not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               NotFound:
 *                 value:
 *                   status: 404
 *                   type: "Not Found"
 *                   message: "Content not found"
 * 
 * /courses/create:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Course"
 *     responses:
 *       "201":
 *         description: Course created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Course"
 *             example:
 *               success: true
 *               savedCourse:
 *                 title: "how to become a business owner in 2024"
 *                 description: "learn how to have your own business from zero money to first 1 million"
 *                 instructor: "667da500fc3bcc9600a90cda"
 *                 contents:
 *                   - "6681ab2bb0287efcbc04d972"
 *                   - "6681ab2bb0287efcbc04d973"
 *                   - "6681ab2bb0287efcbc04d974"
 *                 category: "667da63bfc3bcc9600a90cde"
 *                 isPublic: false
 *                 _id: "6681ab2bb0287efcbc04d970"
 *                 createdAt: "2024-06-30T18:59:55.457Z"
 *                 updatedAt: "2024-06-30T18:59:55.464Z"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   status: 401
 *                   type: "Unauthorized"
 *                   message: "Access token is missing or invalid"
 *  
 * /courses/{courseId}/add-content:
 *   post:
 *     summary: Add content to a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Content"
 *     responses:
 *       "201":
 *         description: Content added
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Content"
 *             example:
 *               - course: "667f7030f8f35254af368b82"
 *                 title: "jumanji 7 - welcome to the jungle"
 *                 type: "video"
 *                 data:
 *                   url: "youtube.com/amr/jumanji-2"
 *                   duration: "90:00 minutes"
 *                   description: "Just have fun!"
 *                 isPublic: false
 *                 _id: "667f7e5ec949319496cd2f3e"
 *                 createdAt: "2024-06-29T03:24:14.708Z"
 *                 updatedAt: "2024-06-29T03:24:14.708Z"
 *               - course: "667f7030f8f35254af368b82"
 *                 title: "jumanji 6 - welcome to the jungle 2"
 *                 type: "video"
 *                 data:
 *                   url: "youtube.com/amr/jumanji-3"
 *                   duration: "120:00 minutes"
 *                   description: "Just have bun!"
 *                 isPublic: true
 *                 _id: "667f7e5ec949319496cd2f3f"
 *                 createdAt: "2024-06-29T03:24:14.708Z"
 *                 updatedAt: "2024-06-29T03:24:14.708Z"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   status: 401
 *                   type: "Unauthorized"
 *                   message: "Access token is missing or invalid"
 * 
 * /courses/{courseId}/update:
 *   post:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Course"
 *     responses:
 *       "200":
 *         description: Course updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Course"
 *             example:
 *               updatedCourse:
 *                 title: "how to learn english verbs in 2024"
 *                 description: "English verbs are fun"
 *                 category: "language"
 *                 createdBy: "Madiha Hazem"
 *                 publishedOn: "27-6-2024"
 *                 lastUpdatedOn: "29-6-2024"
 *                 contents:
 *                   - title: "verb to do"
 *                     type: "video"
 *                     isPublic: false
 *                     data:
 *                       url: "https://www.innovativelearning-api.com/verb-to-do-english"
 *                       duration: "12:25 minutes"
 *                       level: "Beginner"
 *                   - title: "verb to have"
 *                     type: "video"
 *                     isPublic: false
 *                     data:
 *                       url: "https://www.innovativelearning-api.com/verb-to-have-english"
 *                       duration: "15:00 minutes"
 *                       level: "Beginner"
 *                   - title: "verb to win"
 *                     type: "video"
 *                     isPublic: false
 *                     data:
 *                       url: "https://www.innovativelearning-api.com/verb-to-have-english"
 *                       duration: "15:00 minutes"
 *                       level: "Beginner"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   status: 401
 *                   type: "Unauthorized"
 *                   message: "Access token is missing or invalid" 
 * 
 * 
 * 
 * /courses/{courseId}/full-delete:
 *   delete:
 *     summary: Fully delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content, course deleted
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   status: 401
 *                   type: "Unauthorized"
 *                   message: "Access token is missing or invalid"

 * /courses/{courseId}/delete:
 *   delete:
 *     summary: Soft delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course deleted successfully"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   status: 401
 *                   type: "Unauthorized"
 *                   message: "Access token is missing or invalid"
 * 
 * /courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll a user in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       "200":
 *         description: User enrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully enrolled in course "how to start your advertising agency in 2024"'
 *                 enrollment:
 *                   $ref: "#/components/schemas/Enrollment"
 *             example:
 *               message: 'successfully enrolled to course "how to start your advertising agency in 2024"'
 *               enrollment:
 *                 user: "667afe3fc90021903c387751"
 *                 course: "667f7030f8f35254af368b82"
 *                 status: "enrolled"
 *                 enrolledAt: "2024-06-29T23:30:15.967Z"
 *                 progress: 0
 *                 _id: "668099ae88a8a3931e385d6a"
 *                 createdAt: "2024-06-29T23:33:02.827Z"
 *                 updatedAt: "2024-06-29T23:33:02.827Z"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   status: 401
 *                   type: "Unauthorized"
 *                   message: "Access token is missing or invalid"
 * 
 * /courses/{courseId}/disenroll:
 *   post:
 *     summary: Disenroll a user from a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       "200":
 *         description: User disenrolled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Successfully disenrolled from course "how to learn english verbs in 2024"'
 *             example:
 *               message: 'Successfully disenrolled from course "how to learn english verbs in 2024"'
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   status: 401
 *                   type: "Unauthorized"
 *                   message: "Access token is missing or invalid" 
 * 
 */
//#endregion

//#region API Admin Endpoints
/**
 * @swagger
 * /api-admin/users/:
 *  get:
 *   summary: Get a list of all registerd users .
 *   tags: [API-Admin]
 *   parameters:
 *    - in: query
 *      name: email
 *      schema:
 *        type: string
 *      description: Search term to filter users by email
 *    - in: query
 *      name: firstName
 *      schema:
 *        type: string
 *      description: Search term to filter users by first name
 *    - in: query
 *      name: lastName
 *      schema:
 *        type: string
 *      description: Search term to filter users by last name
 *    - in: query
 *      name: role
 *      schema:
 *        type: string
 *      description: Search term to filter users by role
 *   responses:
 *    200:
 *     description: List of all registed users, including suspended users.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *    404:
 *     description: No users found /OR/ No users match your search
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Error'
 * 
 * 
 */
//#endregion
