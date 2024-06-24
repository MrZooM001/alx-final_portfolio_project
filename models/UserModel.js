import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  dateOfBirth: { type: Date },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
}, { timestamps: true });

const User = model('user', userSchema);
export default User;
