import redisClient from "../utils/redis";
import courseModel from '../models/CourseModel.js';

const getCachedCourses = async (key) => {
  /**
   * What we need to do:
   * - get all courses from the database
   * - chech the Redis for key "courses", if exists
   *   return the cached courses
   *   if not exists, set courses to Redis with the key "courses",
   *   and return the cached courses
   * - set cache expiration to 1hr
   * 
   * return the cached courses for Redis
   */

  let cachedCourses = await redisClient.get(key);
  if (!cachedCourses) {
    const getCourses = await courseModel.find({ isPublic: true });
    await redisClient.set(key, JSON.stringify(getCourses), 3600);
    cachedCourses = await redisClient.get(key);
  }
  return JSON.parse(cachedCourses);
}