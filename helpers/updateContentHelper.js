import contentModel from '../models/ContentModel.js';
import { validateContentSchema } from '../helpers/schemaValidationHelpers.js';

const updateContentHelper = async (courseId, contents) => {
  const updatedContent = contents.map(async content => {
    const validation = await validateContentSchema.validateAsync(content);

    if (content._id) {
      const existedContent = await contentModel
        .findOneAndUpdate(
          { _id: content._id, courseId: courseId },
          { $set: { title: validation.title, type: validation.type, data: validation.data } },
          { new: true }
        );
      return existedContent;
    }

    const newContent = new contentModel({
      course: courseId,
      title: validation.title,
      type: validation.type,
      data: validation.data,
    });
    return await newContent.save();
  });

  return Promise.all(updatedContent);
}

export { updateContentHelper };
