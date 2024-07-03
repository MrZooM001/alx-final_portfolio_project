
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
