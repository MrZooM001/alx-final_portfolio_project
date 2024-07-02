import { Schema, model } from 'mongoose';
import { hashPassword, isMatchedPassword } from '../middlewares/hashPasswordMiddleware.js';


const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  dateOfBirth: { type: Date },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  isSuspended: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', hashPassword);

userSchema.methods.isMatchedPassword = isMatchedPassword;

const User = model('user', userSchema);
export default User;
