import { format } from 'date-fns';
import { createContentItems } from '../helpers/createContentHelpers.js';
import { addContentToCourseHelper } from '../helpers/addContentToCourseHelper.js';
import contentModel from '../models/ContentModel.js';
import courseModel from '../models/CourseModel.js';

class ContentController {
  static async addContentToCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to create a content!' });
      }

      const courseId = req.params.courseId;
      const contentArray = req.body.contents;

      if (!Array.isArray(contentArray) || contentArray.length === 0) {
        throw new Error('Content should be an array of contents and not empty');
      }

      const course = await courseModel.findById(courseId);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      const savedContent = await addContentToCourseHelper(courseId, contentArray);

      return res.status(200).json({ success: true, savedContent });
    } catch (err) {
      console.error('Error creating content:', err.message);
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

}

export default ContentController;
