
//#region Archive Enpoints
/**
 * @swagger
 * /archive:
 *   get:
 *     summary: Get archived courses by instructor
 *     tags: [Archive]
 *     security:
 *       - Bearer: []
 *     responses:
 *       "200":
 *         description: List of archived courses
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
 * /archive/{courseId}:
 *   get:
 *     summary: Get archived course by ID
 *     tags: [Archive]
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
 *         description: Archived course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Course"
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
 * /archive/{courseId}/restore:
 *   post:
 *     summary: Restore archived course by ID
 *     tags: [Archive]
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
 *         description: Course restored successfully
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
 */
//#endregion
