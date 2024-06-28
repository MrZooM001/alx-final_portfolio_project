import { Schema, model } from 'mongoose';

const archivedContentSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'course', required: true },
  title: { type: String, required: true, lowercase: true, trim: true },
  type: { type: String, required: true, enum: ['video', 'article', 'image', 'audio', 'quiz'] },
  data: { type: Schema.Types.Mixed, required: true },
  isPublic: { type: Schema.Types.Boolean, default: false },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, default: new Date },
}, { collection: "archivedContents" });

const ArchivedContent = model('archivedContent', archivedContentSchema);
export default ArchivedContent;
