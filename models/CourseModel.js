import { Schema, model } from 'mongoose';

const courseSchema = new Schema({
  title: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true },
  instructor: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  content: { type: Schema.Types.ObjectId, ref: 'content' },
  isPublic: { type: Boolean, default: false },
}, { timestamps: true });

const Course = model('course', courseSchema);
export default Course;
