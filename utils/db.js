import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/UserModel.js';
import courseModel from '../models/CourseModel.js';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_DATABASE || 'ilp_lms_api_db';
const mongoUri = `mongodb://${DB_HOST}:${DB_PORT}`;

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
