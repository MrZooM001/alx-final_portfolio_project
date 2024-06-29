import { Schema, model } from 'mongoose';

const enrollmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'course', required: true },
  status: { type: String, enum: ['enrolled', 'completed', 'dropped'], default: 'enrolled' },
  enrolledAt: { type: Date, default: Date.now() },
  completedAt: { type: Date },
  droppedAt: { type: Date },
  progress: { type: Number, default: 0 },
  grade: { type: Number },
}, { timestamps: true });

const Enrollment = model('enrollment', enrollmentSchema);
export default Enrollment;
