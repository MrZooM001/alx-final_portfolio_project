
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
 * /api-admin/users/{userId}/delete:
 *   delete:
 *     summary: Delete a user
 *     tags: [API-Admin]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: User deleted successfully
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
 * /api-admin/users/{userId}/toggle-suspend:
 *   post:
 *     summary: Toggle suspend a user
 *     tags: [API-Admin]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: User suspension toggled successfully
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
 * /api-admin/archive:
 *   get:
 *     summary: Get all archived courses
 *     tags: [API-Admin]
 *     security:
 *       - Bearer: []
 *     responses:
 *       "200":
 *         description: List of all archived courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Course"
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
 * /api-admin/users/register-bulk:
 *   post:
 *     summary: Register bulk users
 *     tags: [API-Admin]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: "#/components/schemas/User"
 *     responses:
 *       "200":
 *         description: Users registered successfully
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
