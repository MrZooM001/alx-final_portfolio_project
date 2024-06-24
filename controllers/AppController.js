import redisClient from "../utils/redis.js";
import dbClient from "../utils/db.js";

class AppController {
  /**
   * Get the status of the application's dependencies (Redis and MongoDB).
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   *
   * @returns {Promise<void>}
   *
   * @example
   * GET /status
   *
   * Response:
   * {
   *   "redis": true,
   *   "mongodb": true
   * }
   */
  static async getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      mongodb: dbClient.isAlive(),
    };
    res.status(200).json(status);
  }

  
  static async getStats(req, res) {
    const countUsers = await dbClient.countUsers();
    const countCourses = await dbClient.countCourses();
    res.status(200).json({ users: countUsers, courses: countCourses });
  }
}

export default AppController;
