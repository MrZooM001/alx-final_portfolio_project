import { startSession } from 'mongoose';
import { validateCourseSchema } from '../helpers/schemaValidationHelpers.js';
import createContentItems from '../helpers/createContentHelpers.js'
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';
import categoryModel from '../models/CategoryModel.js';

class CourseController {
  static async createCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (userRole !== 'instructor') {
        return res.status(401).json({ error: 'You need to be a teacher to create a course!' });
      }

      req.body.instructor = req.user.userId;

      const validation = await validateCourseSchema.validateAsync(req.body);

      const courseExists = await courseModel.findOne({ title: validation.title });
      if (courseExists) return res.status(400).json({ error: 'Course with the same title already exists' });

      const session = await startSession();
      session.startTransaction();

      const category = new categoryModel({
        name: validation.category
      });

      const savedCategory = await category.save({ session });

      const course = new courseModel({
        title: validation.title,
        description: validation.description,
        instructor: req.body.instructor,
        category: savedCategory._id
      });

      const savedCourse = await course.save({ session });

      const contents = req.body.content;
      if (!contents) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: 'The course must contain at least one content' })
      };

      const contentItems = await createContentItems(savedCourse._id, contents);
      savedCourse.content = contentItems;

      await savedCourse.save({ session });
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ sucess: true, savedCourse });
    } catch (err) {
      console.error('Error creating course:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default CourseController;
