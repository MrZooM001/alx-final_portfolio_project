import archivedCourseModel from '../models/ArchivedCourseModel.js';
import archivedContentModel from '../models/ArchivedContentModel.js';
import courseModel from '../models/CourseModel.js';
import httpErrors from 'http-errors';

const archiveCourseHelper = async (courseId) => {
  try {
    const course = await courseModel.findById(courseId).populate('contents');
    if (!course) throw httpErrors.NotFound('Course not found');

    const archivedCourse = new archivedCourseModel({
      _id: course._id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      category: course.category,
      contents: [],
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      archivedAt: Date.now(),
    });

    await archivedCourse.save();

    const archivedContents = await Promise.all(
      course.contents.map(async content => {
        const contents = new archivedContentModel({
          course: content.course,
          title: content.title,
          type: content.type,
          data: content.data,
          isPublic: content.isPublic,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
        });
        return await contents.save();
      }));

    archivedCourse.contents = archivedContents.map(content => content._id);
    await archivedCourse.save();

    return archivedCourse;
  } catch (err) {
    console.error('Error archiving course:', err.message);
    throw err;
  }
}

export { archiveCourseHelper };
