import httpErrors from 'http-errors';
import archivedCourseModel from '../models/ArchivedCourseModel.js';
import archivedContentModel from '../models/ArchivedContentModel.js';
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';

const restoreCourseHelper = async (courseId) => {
  try {
    const archivedCourse = await archivedCourseModel.findById(courseId).populate('contents');
    if (!archivedCourse) throw httpErrors.NotFound('Course not found');

    const restoredCourse = new courseModel({
      _id: archivedCourse._id,
      title: archivedCourse.title,
      description: archivedCourse.description,
      instructor: archivedCourse.instructor,
      category: archivedCourse.category,
      contents: [],
      isPublic: false,
      createdAt: archivedCourse.createdAt,
      updatedAt: Date.now(),
    });

    await restoredCourse.save();

    const restoredContent = await Promise.all(
      archivedCourse.contents.map(async content => {
        const contents = new contentModel({
          _id: content._id,
          course: content.course,
          title: content.title,
          type: content.type,
          data: content.data,
          isPublic: content.isPublic,
          createdAt: content.createdAt,
          updatedAt: Date.now(),
        });
        return await contents.save();
      }));

    restoredCourse.contents = restoredContent.map(content => content._id);
    await restoredCourse.save();

    return restoredCourse;
  } catch (err) {
    console.error('Error restoring course:', err.message);
    throw err;
  }
}

export { restoreCourseHelper };
