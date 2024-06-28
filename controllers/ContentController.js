import { format } from 'date-fns';
import { createContentItems } from '../helpers/createContentHelpers.js';
import { addContentToCourseHelper } from '../helpers/addContentToCourseHelper.js';
import contentModel from '../models/ContentModel.js';

class ContentController {
  static async addContentToCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to create a content!' });
      }

      const courseId = req.params.courseId;
      const savedContent = await addContentToCourseHelper(courseId, req.body)

      return res.status(200).json({ success: true, savedContent });
    } catch (err) {
      console.error('Error creating content:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

}

export default ContentController;
