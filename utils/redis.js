import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_ENDPOINT_URI = process.env.REDIS_ENDPOINT_URI;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_USERNAME = process.env.REDIS_USERNAME;

class RedisClient {
  constructor() {
    this.client = createClient({
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
      socket: {
        host: REDIS_ENDPOINT_URI,
        port: REDIS_PORT
      }
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

    process.on('SIGINT', async () => {
      await this.client.quit();
      console.log('\nRedis client disconnected through CTRL+C termination');
      process.exit(0);
    });

    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.isConnected = true;
    } catch (err) {
      console.error('Redis connection error:', err.message || err.toString());
    }
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('Redis GET error:', err.message);
      throw err;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.setEx(key, duration, value);
      return true;
    } catch (err) {
      console.error('Redis SET error:', err.message);
      throw err;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (err) {
      console.error('Redis DEL error:', err.message);
      throw err;
    }
  }
}

export const redisClient = new RedisClient();
export default redisClient;
