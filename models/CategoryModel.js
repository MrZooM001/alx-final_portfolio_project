import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, lowercase: true, trim: true },
}, { timestamps: true });

const Category = model('category', categorySchema);
export default Category;
