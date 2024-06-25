import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient({
      url: 'redis://localhost:6379',
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
