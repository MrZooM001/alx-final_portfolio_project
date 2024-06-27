import contentModel from '../models/ContentModel.js';

const createContentItems = async (courseId, contents) => {
  if (!Array.isArray(contents)) throw new Error('Contents should be an array');

  try {
    const contentItems = contents.map(content => new contentModel({
      course: courseId,
      title: content.title,
      type: content.type,
      data: content.data,
    }));

    const savedContents = await contentModel.insertMany(contentItems);
    return savedContents.map(content => content._id);
  } catch (err) {
    console.error('Error creating content items:', err.message);
    throw err;
  }
}

export { createContentItems };
