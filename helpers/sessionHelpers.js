import redisClient from '../utils/redis.js';

const getActiveSessions = async () => {
  try {
    const keys = await redisClient.client.keys('user:*');
    return keys.length;
  } catch (err) {
    console.error('Error retrieving active sessions from Redis:', err.message);
    throw err;
  }
};

export { getActiveSessions };
