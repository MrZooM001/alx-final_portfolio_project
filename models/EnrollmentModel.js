import { Schema, model } from 'mongoose';

const enrollmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'course', required: true },
  status: { type: String, enum: ['enrolled', 'completed', 'dropped'], default: 'enrolled' },
}, { timestamps: true });

const Enrollment = model('enrollment', enrollmentSchema);
export default Enrollment;
