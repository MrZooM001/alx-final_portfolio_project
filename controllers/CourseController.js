import { format } from 'date-fns';
import { validateCourseSchema } from '../helpers/schemaValidationHelpers.js';
import { createContentItems } from '../helpers/createContentHelpers.js'
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';
import categoryModel from '../models/CategoryModel.js';

class CourseController {
  static async createCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to create a course!' });
      }

      req.body.instructor = req.user.userId;

      const validation = await validateCourseSchema.validateAsync(req.body);

      const courseExists = await courseModel.findOne({ title: validation.title });
      if (courseExists) return res.status(400).json({ error: 'Course with the same title already exists' });

      const catFromReq = await categoryModel.findOne({ name: validation.category });
      let categoryId;

      if (!catFromReq) {
        const category = new categoryModel({
          name: validation.category
        });

        const savedCategory = await category.save();
        categoryId = savedCategory._id.toString();
      } else {
        categoryId = catFromReq._id.toString();
      }

      const course = new courseModel({
        title: validation.title,
        description: validation.description,
        instructor: req.body.instructor,
        category: categoryId.toString(),
      });

      const savedCourse = await course.save();

      const contents = validation.contents;
      if (!contents) {
        return res.status(400).json({ error: 'The course must contain at least one content' })
      };

      const contentIds = await createContentItems(savedCourse._id.toString(), contents);
      savedCourse.contents = contentIds;

      await savedCourse.save();

      return res.status(200).json({ sucess: true, savedCourse });
    } catch (err) {
      console.error('Error creating course:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getAllCourses(req, res) {
    try {
      const courses = await courseModel.find({}).populate('category').populate('instructor');

      const response = courses.filter(course => course.isPublic === false)
        .map(course => ({
          title: course.title,
          description: course.description,
          category: course.category.name,
          createdBy: `${course.instructor.firstName} ${course.instructor.lastName}`,
          //publishedOn: format(new Date(course.createdAt), 'd-M-yyyy'),
          lastUpdatedOn: format(new Date(course.updatedAt), 'd-M-yyyy'),
          //isPublic: course.isPublic
        }));

      res.status(200).json(response);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getCourseById(req, res) {
    try {
      // const userRole = req.user.role;
      // if (!['instructor', 'admin'].includes(userRole)) {
      //   return res.status(401).json({ error: 'You need to be a teacher to update a course!' });
      // }

      const courseId = req.params.courseId;

      const course = await courseModel.findById(courseId)
        .populate('category')
        .populate('instructor')
        .populate('contents');

      if (!course) return res.status(404).json({ error: 'Course not found' });

      const contents = await contentModel.find({ course: courseId });

      const response = {
        title: course.title,
        description: course.description,
        category: course.category.name,
        createdBy: `${course.instructor.firstName} ${course.instructor.lastName}`,
        //publishedOn: format(new Date(course.createdAt), 'd-M-yyyy'),
        lastUpdatedOn: format(new Date(course.updatedAt), 'd-M-yyyy'),
        //isPublic: course.isPublic
        contents: contents.map(content => ({
          title: content.title,
          type: content.type,
          isPublic: content.isPublic,
          data: content.data,
        })),
      };

      res.status(200).json(response);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to update a course!' });
      }

      const courseId = req.params.courseId;
      const updatedCourse = req.body;

      const course = await courseModel.findByIdAndUpdate(courseId, updatedCourse, { new: true }).populate('contents');

      if (!course) return res.status(404).json({ error: 'Course not found' });

      return res.status(200).json({ success: true, course });
    } catch (err) {
      console.error('Error updating course:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

}

export default CourseController;
