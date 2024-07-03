import courseModel from '../models/CourseModel.js';
import enrollmentModel from '../models/EnrollmentModel.js';
import httpError from 'http-errors';

const isAdminOrEnrolled = async (userRole, userId, courseId) => {
  try {
    if (userRole !== 'admin') {
      if (userRole === 'instructor') {
        const isMyCourse = await courseModel.findOne({ _id: courseId, instructor: userId });
        if (!isMyCourse) {
          const enrollment = await enrollmentModel.findOne({ user: userId, course: courseId })
            .populate('course')
            .populate('user');

          if (!enrollment) {
            throw httpError.NotFound('No enrollments found');
          }
        }
        return true;
      } else {
        const enrollment = await enrollmentModel.findOne({ user: userId, course: courseId })
          .populate('course')
          .populate('user');

        if (!enrollment) {
          throw httpError.NotFound('No enrollments found');
        }
      }
    }
    return true;
  } catch (err) {
    console.error('Error checking admin or enrolled:', err.message);
    throw err;
  }
}

export { isAdminOrEnrolled };
