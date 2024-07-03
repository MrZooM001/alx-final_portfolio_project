import { format } from 'date-fns';
import redisClient from '../utils/redis.js';
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';
import categoryModel from '../models/CategoryModel.js';
import archivedCourseModel from '../models/ArchivedCourseModel.js';
import archivedContentModel from '../models/ArchivedContentModel.js';
import { chechPagination } from '../helpers/checkPaginationHelper.js';

class QueryController {
  static async getAllCourses(req, res) {
    try {
      const { title, instructor, category } = req.query;
      const { page, limit } = chechPagination(req.query.page, req.query.limit)

      const cacheKey = `courses:${page}:${limit}:${title || ''}:${instructor || ''}`;;

      let cachedCourses = await redisClient.get(cacheKey);

      let totalCourses = await courseModel.countDocuments({ isPublic: true });
      if (totalCourses === 0) {
        return res.status(404).json({ error: 'No courses found' });
      }

      const cachedTotalCourses = await redisClient.get('totalCourses');

      if (cachedCourses && cachedTotalCourses === totalCourses) {
        cachedCourses = JSON.parse(cachedCourses);
        return res.status(200).json({
          currentPage: page,
          totalPages: Math.ceil(cachedCourses.totalCourses / limit),
          totalCourses: cachedCourses.totalCourses,
          courses: cachedCourses.courses
        });
      }

      const matchQuery = { isPublic: true };

      if (title) {
        matchQuery.$or = [
          { title: { $regex: title, $options: 'i' } },
          { description: { $regex: title, $options: 'i' } }
        ];
      }

      const atomicOptions = [
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
        { $lookup: { from: 'users', localField: 'instructor', foreignField: '_id', as: 'instructor' } },
        { $unwind: '$category' },
        { $unwind: '$instructor' },
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
        },
      ];


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

      atomicOptions.push({
        $facet: {
          totalCourses: [{ $count: 'count' }],
          courses: [
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ]
        }
      });

      const results = await courseModel.aggregate(atomicOptions);

      totalCourses = results[0].totalCourses[0] ? results[0].totalCourses[0].count : 0;
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
        totalCourses,
        courses: response
      };

      await redisClient.set(cacheKey, JSON.stringify(cachedData), 3600);
      await redisClient.set('totalCourses', totalCourses.toString(), 3600);

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

  static async getContentById(req, res) {
    try {
      const { courseId, contentId } = req.params;
      const { title, type, isPublic } = req.query;
      let queryContent = [];


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
      queryContent = [...response];

      if (title) {
        const queryWords = title.split(' ').map(word => word.toLowerCase());
        queryContent = queryContent.filter(content =>
          queryWords.every(word => content.title.toLowerCase().includes(word)));
      }

      if (type) {
        queryContent = queryContent.filter(content => content.type === type);
      }


      res.status(200).json(queryContent);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

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

  static async getArchivedCourseById(req, res) {
    // try {
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

      console.log('################ DEBUG ################')
      console.log('1- archivedCourse', archivedCourse);
      console.log('################ End DEBUG ################')
    } else {
      archivedCourse = await archivedCourseModel.findOne({ _id: courseId, instructor: userId })
        .populate('category')
        .populate('instructor')
        .populate('contents');

      console.log('################ DEBUG ################')
      console.log('2- archivedCourse', archivedCourse);
      console.log('################ End DEBUG ################')
    }

    if (!archivedCourse || archivedCourse.length === 0) return res.status(404).json({ error: 'Course not found' });

    const contents = await archivedContentModel.find({ course: courseId });
    if (!contents) return res.status(404).json({ error: 'Content not found' });

    console.log('################ DEBUG ################')
    console.log('3- archivedCourse.category.name:', archivedCourse.category.name);
    console.log('################ End DEBUG ################')

    console.log('################ DEBUG ################')
    console.log('4- archivedCourse.instructor.firstName:', archivedCourse.instructor.firstName);
    console.log('################ End DEBUG ################')

    console.log('################ DEBUG ################')
    console.log('5- contents:', contents);
    console.log('################ End DEBUG ################')


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
    // } catch (err) {
    //   console.error('Error fetching courses:', err.message);
    //   return res.status(500).json({ error: err.message });
    // }
  }

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
