import { format } from 'date-fns';
import { validateCourseSchema } from '../helpers/schemaValidationHelpers.js';
import { createContentItems } from '../helpers/createContentHelpers.js';
import { updateContentHelper } from '../helpers/updateContentHelper.js';
import { archiveCourseHelper } from '../helpers/archiveCourseHelper.js';
import { restoreCourseHelper } from '../helpers/restoreCourseHelper.js';
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';
import categoryModel from '../models/CategoryModel.js';
import archivedCourseModel from '../models/ArchivedCourseModel.js';
import archivedContentModel from '../models/ArchivedContentModel.js';

class CourseController {
  static async createCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'Only instructors can create a course!' });
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
      const courses = await courseModel.find({})
        .populate('category')
        .populate('instructor');

      if (!courses) return res.status(404).json({ error: 'Course not found' });

      const response = await Promise.all(
        courses.filter(course => course.isPublic === false)
          .map(async course => {
            const contentCount = await contentModel.countDocuments({ course: course._id });
            return {
              _id: course._id,
              title: course.title,
              description: course.description,
              category: course.category.name,
              instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
              contents: contentCount,
              createdAt: format(new Date(course.createdAt), 'd-M-yyyy'),
              updatedAt: format(new Date(course.updatedAt), 'd-M-yyyy'),
            }
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
        _id: course._id,
        title: course.title,
        description: course.description,
        category: course.category.name,
        instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
        createdAt: format(new Date(course.createdAt), 'd-M-yyyy'),
        updatedAt: format(new Date(course.updatedAt), 'd-M-yyyy'),
        isPublic: course.isPublic,
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
      const currentCourse = await courseModel.findById(courseId);
      if (!currentCourse) return res.status(404).json({ error: 'Course not found' });

      if (req.user.userId !== currentCourse.instructor.toString()) {
        return res.status(403).json({ error: 'This is not your course to update!' });
      }

      const { title, description, category, contents } = req.body;

      const catFromReq = await categoryModel.findOne({ name: category });
      let categoryId;

      if (!catFromReq) {
        const newCategory = new categoryModel({ name: category });
        const savedCategory = await newCategory.save();
        categoryId = savedCategory._id.toString();
      } else {
        categoryId = catFromReq._id.toString();
      }

      const course = await courseModel
        .findByIdAndUpdate(courseId,
          {
            $set: { title, description, category: categoryId }
          },
          { new: true }).populate('contents').populate('category').populate('instructor');

      if (!course) return res.status(404).json({ error: 'Course not found' });

      const updatedContents = await updateContentHelper(courseId, contents);

      course.contents = updatedContents.map(content => content._id);
      await course.save();

      const response = {
        title: course.title,
        description: course.description,
        category: course.category.name,
        createdBy: `${course.instructor.firstName} ${course.instructor.lastName}`,
        publishedOn: format(new Date(course.createdAt), 'd-M-yyyy'),
        lastUpdatedOn: format(new Date(course.updatedAt), 'd-M-yyyy'),
        contents: updatedContents.map(content => ({
          title: content.title,
          type: content.type,
          isPublic: content.isPublic,
          data: content.data,
        })),
      };

      res.status(200).json({ success: true, updatedCourse: response });
    } catch (err) {
      console.error('Error updating course:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async deleteCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to delete a course!' });
      }

      const courseId = req.params.courseId;
      const currentCourse = await courseModel.findById(courseId);
      if (!currentCourse) return res.status(404).json({ error: 'Course not found' });

      if (req.user.userId !== currentCourse.instructor.toString()) {
        return res.status(403).json({ error: 'This is not your course to delete!' });
      }

      const archiveCourse = await archiveCourseHelper(courseId);
      if (!archiveCourse) return res.status(500).json({ error: 'Course not deleted' });

      await contentModel.deleteMany({ course: courseId });
      await courseModel.findByIdAndDelete(courseId);

      res.status(200).json({ message: "Course deleted successfuly" });
    } catch (err) {
      console.error('Error deleting course:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async restoreCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to delete a course!' });
      }

      const courseId = req.params.courseId;
      const currentCourse = await archivedCourseModel.findById(courseId);

      if (!currentCourse || req.user.userId !== currentCourse.instructor.toString()) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const restoredCourse = await restoreCourseHelper(courseId);
      if (!restoredCourse) return res.status(500).json({ error: 'Course not restored' });

      await archivedContentModel.deleteMany({ course: courseId });
      await archivedCourseModel.findByIdAndDelete(courseId);

      res.status(200).json({ message: "Course restored successfuly" });
    } catch (err) {
      console.error('Error restoring course:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async fullDeleteCourse(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to delete a course!' });
      }

      const courseId = req.params.courseId;
      const currentCourse = await courseModel.findById(courseId);
      if (!currentCourse) return res.status(404).json({ error: 'Course not found' });

      if (req.user.userId !== currentCourse.instructor.toString()) {
        return res.status(403).json({ error: 'This is not your course to delete!' });
      }

      await contentModel.deleteMany({ course: courseId });
      await courseModel.findByIdAndDelete(courseId);

      res.status(200).json({ message: "Course deleted successfuly" });
    } catch (err) {
      console.error('Error deleting course:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getAllArchivedCourses(req, res) {
    try {
      const userRole = req.user.role;

      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to update a course!' });
      }

      const userId = req.user.userId;

      const archivedCourses = await archivedCourseModel.find({ instructor: userId })
        .populate('category')
        .populate('instructor');

      if (!archivedCourses) return res.status(404).json({ error: 'Course not found in the archive' });

      const response = await Promise.all(
        archivedCourses.map(async course => {
          const archivedContentsCount = await archivedContentModel.countDocuments({ course: course._id });
          return {
            _id: course._id,
            title: course.title,
            description: course.description,
            category: course.category.name,
            instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
            contents: archivedContentsCount,
            createdAt: format(new Date(course.createdAt), 'd-M-yyyy'),
            updatedAt: format(new Date(course.updatedAt), 'd-M-yyyy'),
            archivedAt: format(new Date(course.archivedAt), 'd-M-yyyy'),
          }
        }));

      res.status(200).json({ archivedCourses: response });
    } catch (err) {
      console.error('Error fetching archived courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getArchivedCourseById(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'You need to be a teacher to update a course!' });
      }

      const courseId = req.params.courseId;
      const userId = req.user.userId;

      console.log('################ DEBUG ################')
      console.log('userId', userId);
      console.log('################ End DEBUG ################')

      const archivedCourse = await archivedCourseModel.find({ _id: courseId, instructor: userId })
        .populate('category')
        .populate('instructor')
        .populate('contents');


      if (!archivedCourse || archivedCourse.length === 0) return res.status(404).json({ error: 'Course not found' });
      res.status(200).json(archivedCourse); // as break point for debugging

      // const contents = await contentModel.find({ course: courseId });

      // const response = {
      //   _id: archivedCourse._id,
      //   title: archivedCourse.title,
      //   description: archivedCourse.description,
      //   category: archivedCourse.category.name,
      //   instructor: `${archivedCourse.instructor.firstName} ${archivedCourse.instructor.lastName}`,
      //   createdAt: format(new Date(archivedCourse.createdAt), 'd-M-yyyy'),
      //   updatedAt: format(new Date(archivedCourse.updatedAt), 'd-M-yyyy'),
      //   isPublic: archivedCourse.isPublic,
      //   contents: contents.map(content => ({
      //     title: content.title,
      //     type: content.type,
      //     isPublic: content.isPublic,
      //     data: content.data,
      //   })),
      // };

      // res.status(200).json(response);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }


}

export default CourseController;
