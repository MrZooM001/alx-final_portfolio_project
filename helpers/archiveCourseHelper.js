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

    console.log('############### Debug #################')
    console.log('Archived contents:', archivedContents);
    console.log('############### Debug #################')

    archivedCourse.contents = archivedContents.map(content => content._id);
    await archivedCourse.save();

    console.log('############### Debug #################')
    console.log('Archived course:', archivedCourse);
    console.log('############### Debug #################')

    return archivedCourse;
  } catch (err) {
    console.error('Error archiving course:', err.message);
    throw err;
  }
}

export { archiveCourseHelper };
