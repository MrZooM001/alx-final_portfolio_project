import contentModel from '../models/ContentModel.js';

const createContentItems = async (courseId, contents) => {
  const contentItems = [];

  for (const content of contents) {
    const newContent = new contentModel({
      course: courseId,
      title: content.title,
      type: content.type,
      data: content.data,
    });

    const savedContent = await newContent.save();
    contentItems.push(savedContent._id);
  }

  return contentItems;
}

export { createContentItems };
