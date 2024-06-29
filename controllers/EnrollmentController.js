import enrollmentModel from '../models/EnrollmentModel.js';
import courseModel from '../models/CourseModel.js';

class EnrollmentController {
  static async enrollUserToCourse(req, res) {
    try {
      const courseId = req.params.courseId;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'You need to register/login to enroll in this course' });
      }

      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (user._id === course.instructor.toString()) {
        return res.status(403).json({ error: 'You cannot enroll in your own course!' });
      }

      const isEnrolled = await enrollmentModel.findOne({ user: user._id, course: courseId }).populate('course');

      if (isEnrolled) {
        return res.status(409).json({ error: 'You are already enrolled in this course' });
      }

      const enrollment = new enrollmentModel({
        user: user._id,
        course: courseId,
      });

      await enrollment.save();
      return res.status(200).json({
        message: `successfully enrolled to course "${course.title}"`, enrollment
      });
    } catch (err) {
      console.error('Error enrolling user in course:', err.message);
      return res.status(500).json({ error: err.message });
    }

  }

  static async getEnrolledCoursesByUser(req, res) {
    try {
      const studentId = req.user._id;

      const enrollments = await enrollmentModel.find({ user: studentId })
        .populate('course')
        .populate('user');

      if (!enrollments) {
        return res.status(404).json({ error: 'No enrollments found' });
      }

      const response = enrollments.map(nrolmnt => ({
        courseId: nrolmnt.course._id,
        title: nrolmnt.course.title,
        description: nrolmnt.course.description,
        instructor: `${nrolmnt.course.instructor.firstName} ${nrolmnt.course.instructor.lastName}`,
        category: nrolmnt.course.category.name,
        status: nrolmnt.status,
        enrolledAt: nrolmnt.enrolledAt
      }));

      return res.status(200).json({ enrollments: response });
    } catch (err) {
      console.error('Error fetching enrolled courses:', err.message);
      return res.status(500).json({ error: err.message });
    }

  }

  static async disenrollFromCourse(req, res) {

  }

}

export default EnrollmentController;
