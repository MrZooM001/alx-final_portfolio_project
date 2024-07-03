
//#region Courses Endpoints
/**
 * @swagger
 * /courses/:
 *  get:
 *   summary: Get a list of all published courses, including search queries (public endpoint)
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
 *     summary: Get a course by ID (public endpoint)
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
 *                   error: "Content not found"
 * 
 * /courses/{courseId}/content/{contentId}:
 *   get:
 *     summary: Get content by ID, within the course by ID
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
 *                   error: "Content not found"
 * 
 * /courses/create:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
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
 *                   error: "Access token is missing or invalid"
 *  
 * /courses/{courseId}/add-content:
 *   post:
 *     summary: Add content to a course
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
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
 *                   error: "Access token is missing or invalid"
 * 
 * /courses/{courseId}/update:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
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
 *                   error: "Access token is missing or invalid" 
 * 
 * 
 * 
 * /courses/{courseId}/full-delete:
 *   delete:
 *     summary: Fully and permanent delete the course
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
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
 *                   error: "Access token is missing or invalid"

 * /courses/{courseId}/delete:
 *   delete:
 *     summary: Soft delete a course, Archive the course instead of delete, it can be restored later by the instructor or the admin
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
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
 *                   message: "Course deleted successfully"
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   error: "Access token is missing or invalid"
 * 
 * /courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll a user in a course
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
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
 *                   error: "Access token is missing or invalid"
 * 
 * /courses/{courseId}/disenroll:
 *   post:
 *     summary: Disenroll a user from a course
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
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
 *                   error: "Access token is missing or invalid" 
 * 
 * /courses/{courseId}/publish:
 *   put:
 *     summary: Publish a course
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Course published successfully
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   error: "Access token is missing or invalid" 
 * 
 * 
 * /courses/{courseId}/unpublish:
 *   put:
 *     summary: Unpublish a course, only done by the instructor of the course of admin 
 *     tags: [Courses]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Course unpublished successfully
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *             examples:
 *               Unauthorized:
 *                 value:
 *                   error: "Access token is missing or invalid" 
 * 
 */
//#endregion
