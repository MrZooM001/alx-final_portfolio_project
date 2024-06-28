import { Schema, model } from 'mongoose';

const archivedCourseSchema = new Schema({
  title: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true },
  instructor: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  category: { type: Schema.Types.ObjectId, required: true, ref: 'category' },
  contents: [{ type: Schema.Types.ObjectId, ref: 'content' }],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, default: new Date},
  archivedAt: { type: Date, default: new Date},
}, { collection: "archivedCourses" });

const ArchivedCourse = model('archivedCourse', archivedCourseSchema);
export default ArchivedCourse;
