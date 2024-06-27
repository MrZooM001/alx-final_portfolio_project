import { Schema, model } from 'mongoose';

const courseSchema = new Schema({
  title: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true },
  instructor: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  contents: [{ type: Schema.Types.ObjectId, ref: 'content' }],
  category: { type: Schema.Types.ObjectId, required: true, ref: 'category' },
  isPublic: { type: Boolean, default: false },
}, { timestamps: true });

const Course = model('course', courseSchema);
export default Course;
