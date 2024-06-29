import httpErrors from 'http-errors';
import contentModel from '../models/ContentModel.js';
import { validateContentSchema } from '../helpers/schemaValidationHelpers.js';

const addContentToCourseHelper = async (courseId, contentArray) => {
  try {
    const validation = await Promise.all(contentArray.map(
      contentData => validateContentSchema.validateAsync(contentData))
    );

    const contentExists = await contentModel.find({ course: courseId });

    const existingTitles = contentExists.map(content => content.title);

    const duplicates = validation.filter(content => existingTitles.includes(content.title));

    if (duplicates.length > 0) {
      const duplTitle = duplicates.map(content => content.title);
      throw httpErrors.Conflict(`Content(s) with the same title already exist in this course: ${duplTitle.join(', ')}`);
    }

    const newContents = validation.map(contentData => new contentModel({
      course: courseId,
      title: contentData.title,
      type: contentData.type,
      data: contentData.data,
      isPublic: contentData.isPublic,
    }));

    const savedContent = await contentModel.insertMany(newContents);

    return savedContent;
  } catch (err) {
    console.error('Error adding content to course:', err.message);
    throw err;
  }
}

export { addContentToCourseHelper };
