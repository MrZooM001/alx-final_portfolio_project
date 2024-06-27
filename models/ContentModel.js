import { Schema, model } from 'mongoose';

const contentSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'course', required: true },
  title: { type: String, required: true, lowercase: true, trim: true },
  type: { type: String, required: true, enum: ['vidoe', 'article', 'image', 'audio', 'quiz'] },
  data: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

const CourseContent = model('content', contentSchema);
export default CourseContent;
