import { format } from 'date-fns';
import redisClient from '../utils/redis.js';
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';
import categoryModel from '../models/CategoryModel.js';
import archivedCourseModel from '../models/ArchivedCourseModel.js';
import archivedContentModel from '../models/ArchivedContentModel.js';

class QueryController {
  static async getAllCourses(req, res) {
    try {
      let queryCourses = [];
      const totalCourses = await courseModel.countDocuments({ isPublic: true });
      const cachedCourses = await redisClient.get('allCourses');
      const cachedTotalCourses = await redisClient.get('totalCourses');

      if (cachedCourses && totalCourses === parseInt(cachedTotalCourses)) {
        queryCourses = [...JSON.parse(cachedCourses)];
      } else {
        const courses = await courseModel.find({ isPublic: true })
          .populate('category')
          .populate('instructor');

        if (!courses) return res.status(404).json({ error: 'No courses created yet!' });

        const response = await Promise.all(
          courses.filter(course => course.isPublic === true)
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

        await redisClient.set('allCourses', JSON.stringify(response), 3600);
        await redisClient.set('totalCourses', totalCourses.toString(), 3600);
        console.log('################ DEBUG ################')
        console.log('Set a new allCourses to Redis');
        console.log('################ End DEBUG ################')

        queryCourses = [...response];
      }

      const { title, instructor, limit } = req.query;
      const { page } = parseInt(req.query) || 1;

      if (title) {
        const queryWords = title.split(' ').map(word => word.toLowerCase());
        queryCourses = queryCourses.filter(course =>
          queryWords.every(word => course.title.toLowerCase().includes(word) ||
            course.description.toLowerCase().includes(word)));
      }

      if (instructor) {
        const queryWords = instructor.split(' ').map(name => name.toLowerCase());
        queryCourses = queryCourses.filter(course =>
          queryWords.every(name => course.instructor.toLowerCase().includes(name) ||
            course.instructor.toLowerCase().includes(name)));
      }

      res.status(200).json({ courses: queryCourses });
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getCourseById(req, res) {
    try {
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
          _id: content._id,
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

  static async getAllContentForCourse(req, res) {
    try {
      const courseId = req.params.courseId;

      const course = await courseModel.findById(courseId)
        .populate('category')
        .populate('instructor')
        .populate('contents');

      if (!course) return res.status(404).json({ error: 'Course not found' });

      const contents = await contentModel.find({ course: courseId });

      const response = {
        courseId: courseId,
        contents: contents.map(content => ({
          _id: content._id,
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

  static async getCourceContentById(req, res) {
    try {
      const { courseId, contentId } = req.params;

      const course = await courseModel.findById(courseId).populate('contents');
      if (!course) return res.status(404).json({ error: 'Course not found' });

      const content = await contentModel.findById(contentId);
      if (!content) return res.status(404).json({ error: 'Content not found' });

      const response = {
        _id: content._id,
        title: content.title,
        type: content.type,
        isPublic: content.isPublic,
        course: content.course,
        data: content.data,
      };

      // TODO:
      // Add search query parameters
      // by title, type and isPublic

      res.status(200).json(response);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

}

export default QueryController;
