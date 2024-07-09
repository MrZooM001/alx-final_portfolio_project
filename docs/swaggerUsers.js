
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
 * 
 * /users/update:
 *  put:
 *   summary: Update info /not password/ for the current logged in user.
 *   tags: [Users]
 *   security:
 *      - Bearer: []
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
 * 
 * /users/update-password:
 *  put:
 *   summary: Update password only for the current logged in user.
 *   tags: [Users]
 *   security:
 *      - Bearer: []
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
 * 
 * /users/enrolled-courses:
 *  get:
 *   summary: List of courses that current logged in user has beed enrolled into.
 *   tags: [Users]
 *   security:
 *      - Bearer: []
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
 * /users/my-courses:
 *  get:
 *   summary: List of courses created by the current instructor user.
 *   tags: [Users]
 *   security:
 *      - Bearer: []
 *   responses:
 *    200:
 *     description: Array of courses that user has been created.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Course'
 *    404:
 *     description: No courses found
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
 * /users/my-courses/{courseId}:
 *  get:
 *   summary: Get a course created by the current instructor user by ID.
 *   tags: [Users]
 *   security:
 *      - Bearer: []
 *   responses:
 *    200:
 *     description: a course matches the ID which user has been created.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Course'
 *    404:
 *     description: No courses found
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
 */
//#endregion
