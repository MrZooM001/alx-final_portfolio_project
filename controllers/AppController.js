import redisClient from "../utils/redis.js";
import dbClient from "../utils/db.js";
import { getActiveSessions } from '../helpers/sessionHelpers.js';

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
      redis: {
        isAlive: redisClient.isAlive(),
      },
      mongodb: {
        isAlive: dbClient.isAlive()
      },
    };
    res.status(200).json(status);
  }

  static async getStats(req, res) {
    try {
      const countUsers = await dbClient.countUsers();
      const countCourses = await dbClient.countCourses();
      const activeUsers = await getActiveSessions();
      res.status(200).json({
        users: countUsers,
        courses: countCourses,
        activeUsers
      });
    } catch (err) {
      res.status(400).json({ error: `Failed to retrieve stats, ${err.message}` });
    }
  }
}

export default AppController;
