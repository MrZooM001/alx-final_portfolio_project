import archivedCourseModel from '../models/ArchivedCourseModel.js';
import archivedContentModel from '../models/ArchivedContentModel.js';
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';

const archiveCourseHelper = async (courseId) => {
  try {
    const course = await courseModel.findById(courseId).populate('contents');
    if (!course) throw new Error('Course not found');

    const archivedCourse = new archivedCourseModel({
      _id: course._id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      category: course.category,
      contents: course.contents.map(content => content._id),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      archivedAt: Date.now(),
    });

    await archivedCourse.save();

    if (course.contents.length > 0) {
      const archivedContent = course.contents.map(content => new archivedContentModel({
        _id: content._id,
        course: content.course,
        title: content.title,
        type: content.type,
        data: content.data,
        isPublic: content.isPublic,
        createdAt: content.createdAt,
        updatedAt: Date.now(),
      }));

      await archivedContentModel.insertMany(archivedContent);
    }

    return archivedCourse;
  } catch (err) {
    console.error('Error archiving course:', err.message);
    throw err;
  }
}

export { archiveCourseHelper };
