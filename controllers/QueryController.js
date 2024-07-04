import { format } from 'date-fns';
import redisClient from '../utils/redis.js';
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';
import enrollmentModel from '../models/EnrollmentModel.js';
import categoryModel from '../models/CategoryModel.js';
import archivedCourseModel from '../models/ArchivedCourseModel.js';
import archivedContentModel from '../models/ArchivedContentModel.js';
import { chechPagination } from '../helpers/checkPaginationHelper.js';
import { isAdminOrEnrolled } from '../helpers/userIsAdminOrEnrolledHelper.js'

class QueryController {
  //Get all published courses
  static async getAllCourses(req, res) {
    try {
      const { title, instructor, category } = req.query;
      const { page = 1, limit = 10 } = chechPagination(req.query.page, req.query.limit)

      const matchQuery = {};
      const totalCourses = await courseModel.countDocuments();

      if (title) {
        matchQuery.$or = [
          { title: { $regex: title, $options: 'i' } },
          { description: { $regex: title, $options: 'i' } }
        ];
      }

      if (instructor) {
        const instructorRegex = new RegExp(instructor, 'i');
        atomicOptions.push({
          $match: {
            $or: [
              { 'instructor.firstName': instructorRegex },
              { 'instructor.lastName': instructorRegex }
            ]
          }
        });
      }

      if (category) {
        const catRegex = new RegExp(category, 'i');
        atomicOptions.push({
          $match: {
            $or: [
              { 'category.name': catRegex }
            ]
          }
        });
      }

      const atomicOptions = [
        { $match: matchQuery },
        { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
        { $lookup: { from: 'users', localField: 'instructor', foreignField: '_id', as: 'instructor' } },
        { $unwind: '$category' },
        { $unwind: '$instructor' },
        {
          $facet: {
            totalCourses: [{ $count: 'count' }],
            courses: [
              { $sort: { createdAt: -1 } },
              { $skip: (page - 1) * limit },
              { $limit: limit },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  'category.name': 1,
                  'instructor.firstName': 1,
                  'instructor.lastName': 1,
                  contents: { $size: '$contents' }
                }
              }
            ]
          }
        }
      ];

      const results = await courseModel.aggregate(atomicOptions);

      const totalFound = results[0].totalCourses[0] ? results[0].totalCourses[0].count : 0;
      const courses = results[0].courses;

      if (!courses || !courses.length) {
        return res.status(404).json({ error: 'No courses matches your search' });
      }

      const response = await Promise.all(
        courses.map(async course => {
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

      const cachedData = {
        totalFound,
        courses: response
      };

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses,
        courses: cachedData
      });
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // Get course by ID
  static async getCourseById(req, res) {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const courseId = req.params.courseId;

      const isAuthorized = await isAdminOrEnrolled(userRole, userId, courseId);

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
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

  // Get all contents for a course by ID
  static async getAllContentForCourse(req, res) {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const courseId = req.params.courseId;

      const isAuthorized = await isAdminOrEnrolled(userRole, userId, courseId);

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
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

  // Get course content by Content ID
  static async getContentById(req, res) {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;
      const { courseId, contentId } = req.params;

      const isAuthorized = await isAdminOrEnrolled(userRole, userId, courseId);

      const content = await contentModel.findOne({ _id: contentId, course: courseId });
      if (!content) {
        return res.status(404).json({ error: 'Course/Content not found' });
      }

      const response = {
        _id: content._id,
        course: content.course,
        title: content.title,
        type: content.type,
        isPublic: content.isPublic,
        data: content.data,
      };

      res.status(200).json({ content: response });
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(err.statusCode).json({ error: err.message });
    }
  }

  // Get all archived courses created by the logged in user as instructor
  static async getArchivedCoursesByInstructor(req, res) {
    try {
      const userRole = req.user.role;

      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(403).json({ error: 'Access is denied' });
      }

      const userId = req.user._id;

      const archivedCourses = await archivedCourseModel.find({ instructor: userId })
        .populate('category')
        .populate('instructor');

      if (!archivedCourses) return res.status(404).json({ error: 'No archived courses found' });

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

  // Get archived course by ID
  static async getArchivedCourseById(req, res) {
    try {
      const userRole = req.user.role;
      if (!['instructor', 'admin'].includes(userRole)) {
        return res.status(401).json({ error: 'Access is denied' });
      }

      const courseId = req.params.courseId;
      const userId = req.user._id;

      let archivedCourse = [];

      if (userRole === 'admin') {
        archivedCourse = await archivedCourseModel.findOne({ _id: courseId })
          .populate('category')
          .populate('instructor')
          .populate('contents');
      } else {
        archivedCourse = await archivedCourseModel.findOne({ _id: courseId, instructor: userId })
          .populate('category')
          .populate('instructor')
          .populate('contents');
      }

      if (!archivedCourse || archivedCourse.length === 0) return res.status(404).json({ error: 'Course not found' });

      const contents = await archivedContentModel.find({ course: courseId });
      if (!contents) return res.status(404).json({ error: 'Content not found' });

      const response = {
        _id: archivedCourse._id,
        title: archivedCourse.title,
        description: archivedCourse.description,
        category: archivedCourse.category.name,
        instructor: `${archivedCourse.instructor.firstName} ${archivedCourse.instructor.lastName}`,
        createdAt: format(new Date(archivedCourse.createdAt), 'd-M-yyyy'),
        updatedAt: format(new Date(archivedCourse.updatedAt), 'd-M-yyyy'),
        isPublic: archivedCourse.isPublic,
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

  // Get all archived courses
  static async getAllArchivedCourses(req, res) {
    try {
      const archivedCourses = await archivedCourseModel.find({})
        .populate('category')
        .populate('instructor');

      if (!archivedCourses) return res.status(404).json({ error: 'No archived courses found' });

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
      const totalArchivedCourses = await archivedCourseModel.countDocuments();

      res.status(200).json({ total: totalArchivedCourses, archivedCourses: response });
    } catch (err) {
      console.error('Error fetching archived courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

}

export default QueryController;
