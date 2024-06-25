import { createClient } from 'redis';

/**
 * A class representing a Redis client with connection handling
 * and basic operations.
 */
class RedisClient {
  constructor() {
    this.client = createClient({
      port: 6379,
      host: 'localhost',
    });

    this.isConnected = false;

    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('Redis client connected');
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      console.error('Redis client not connected:', err.message || err.toString());
    });

    this.client.on('ready', () => {
      console.log('Redis client ready');
    });

    this.client.on('end', () => {
      this.isConnected = false;
      console.log('Redis client disconnected');
    });

    process.on('SIGINT', () => {
      this.client.quit();
      console.log('\nRedis client disconnected through CTRL+C termination');
      process.exit(0);
    });

    this.client.connect().catch((err) => {
      console.error('Redis connection error:', err.message || err.toString());
    })
  }

  /**
   * Checks if the Redis client is connected.
   *
   * @returns {boolean} True if the Redis client is connected, false otherwise.
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * Retrieves the value associated with the given key from Redis.
   *
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<string|null>} A promise that resolves with the value associated
   * with the key, or null if the key does not exist.
   * @throws {Error} If an error occurs while retrieving the value.
   */
  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  /**
   * Sets a key-value pair in Redis with an expiration time.
   *
   * @param {string} key - key to set in Redis.
   * @param {string} value - value to associate with the key.
   * @param {number} duration - key expiration time in seconds.
   * @returns {Promise<boolean>} A promise that resolves to true if the operation is successful,
   * or rejects with an error if an error occurs.
   * @throws {Error} If an error occurs while setting the value in Redis.
   */
  set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setEx(key, duration, value, (err) => {
        if (err) {
          reject(err);
          return;
        }
        return resolve(true);
      });
    });
  }

  /**
   * Deletes a key from Redis.
   *
   * @param {string} key - The key to delete from Redis.
   * @returns {Promise<boolean>} A promise that resolves to true if the key was successfully deleted,
   * or rejects with an error if an error occurs.
   * @throws {Error} If an error occurs while deleting the key from Redis.
   */
  del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }
}

export const redisClient = new RedisClient();
export default redisClient;
