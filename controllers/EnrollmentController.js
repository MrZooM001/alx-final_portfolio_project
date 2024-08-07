import enrollmentModel from '../models/EnrollmentModel.js';
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';

class EnrollmentController {
  static async enrollUserInCourse(req, res) {
    try {
      const courseId = req.params.courseId;
      const user = req.user;

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
        message: `successfully enrolled to course \'${course.title}\'`, enrollment
      });
    } catch (err) {
      console.error('Error enrolling user in course:', err.message);
      return res.status(500).json({ error: err.message });
    }

  }

  static async getEnrolledCoursesByUser(req, res) {
    try {
      const userId = req.user._id;

      const enrollments = await enrollmentModel.find({ user: userId })
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
    try {
      const courseId = req.params.courseId;
      const user = req.user;

      const course = await courseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (user._id === course.instructor.toString()) {
        return res.status(403).json({ error: 'You cannot enroll in your own course to disenroll from!' });
      }

      const enrollment = await enrollmentModel.findOneAndDelete({ user: user._id, course: courseId });
      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      return res.status(200).json({ message: `Successfully disenrolled from course \'${course.title}\'` });
    } catch (err) {
      console.error('Error disenrolling user from course:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async markContentAsCompleted(req, res) {
    try {
      const user = req.user;
      const contentId = req.params.contentId;

      const content = await contentModel.findById(contentId);
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }

      const enrollment = await enrollmentModel.findOne({ user: user._id, course: content.course });
      if (!enrollment) {
        return res.status(404).json({ error: 'You are not enrolled in the course' });
      }

      if (!enrollment.completedContents.includes(contentId)) {
        enrollment.completedContents.push(contentId);

        const totalCourseContents = await contentModel.countDocuments({ course: content.course });
        const completedCount = enrollment.completedContents.length;

        enrollment.isCompleted = completedCount === totalCourseContents;
        if (enrollment.isCompleted) enrollment.completedAt = new Date();

        // Get the percentage of completed contents
        enrollment.progress = (completedCount / totalCourseContents) * 100;

        await enrollment.save();
      }

      return res.status(200).json({
        message: 'Content has been successfully marked as complete',
        progress: enrollment.progress
      });
    } catch (err) {
      console.error('Error marking content as completed:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

}

export default EnrollmentController;
