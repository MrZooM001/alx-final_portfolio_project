import mongoose from 'mongoose';
import userModel from '../models/UserModel.js';
import courseModel from '../models/CourseModel.js';
import dotenv from 'dotenv';

dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_DATABASE;
const DB_APP_NAME = process.env.DB_APP_NAME;
const DB_URL = process.env.DB_URL;

const mongoUri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/?retryWrites=true&w=majority&appName=${DB_APP_NAME}`;

class DBClient {
  constructor() {
    this.isConnected = false;
    mongoose.connect(mongoUri, { dbName: DB_NAME })
      .then(() => {
        console.log('MongoDB server connected');
      }).catch((err) => {
        console.error('MongoDB connection error:', err.message || err.toString());
      });

    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      console.log('Mongoose connected to database');
    });
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err.message || err.toString());
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose disconnected through CTRL+C termination');
      process.exit(0);
    });
  }

  isAlive() {
    return this.isConnected;
  }

  /**
   * Counts the number of users in the database.
   *
   * @returns {Promise<number>} The number of users in the database.
   * If the database is not connected, returns 0.
   */
  async countUsers() {
    if (!this.isAlive()) return 0;
    return userModel.countDocuments({ isSuspended: false });
  }

  /**
   * Counts the number of courses in the database.
   *
   * @returns {Promise<number>} The number of courses in the database.
   * If the database is not connected, returns 0.
   */
  async countCourses() {
    if (!this.isAlive()) return 0;
    return courseModel.countDocuments({ isPublic: true });
  }
}

export const dbClient = new DBClient();
export default dbClient;
