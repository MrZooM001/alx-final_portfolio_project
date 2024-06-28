import contentModel from '../models/ContentModel.js';
import { validateContentSchema } from '../helpers/schemaValidationHelpers.js';

const addContentToCourseHelper = async (courseId, contentData) => {
  try {
    const validation = await validateContentSchema.validateAsync(contentData);

    const contentExists = await contentModel.findOne({
      title: validation.title, course: courseId
    });

    if (contentExists.title === validation.title) {
      return res.status(409).json({
        error: 'Content with the same title already exists in this course'
      });
    }

    const content = new contentModel({
      course: courseId,
      title: validation.title,
      type: validation.type,
      data: validation.data,
    });

    const savedContent = await content.save();
    return savedContent;
  } catch (err) {
    console.error('Error adding content to course:', err.message);
    throw err;
  }
}

export { addContentToCourseHelper };
