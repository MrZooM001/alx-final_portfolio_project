import { format } from 'date-fns';
import { signAccessToken, signRefreshToken } from '../helpers/jwtAuthHelpers.js';
import userModel from '../models/UserModel.js';
import courseModel from '../models/CourseModel.js';
import contentModel from '../models/ContentModel.js';
import categoryModel from '../models/CategoryModel.js';
import { getActiveSessions } from '../helpers/sessionHelpers.js';
import { chechPagination } from '../helpers/checkPaginationHelper.js';
import {
  validateRegisterUserSchema,
  validateUpdateUserSchema,
  validateUpdatePasswordSchema
} from '../helpers/schemaValidationHelpers.js';



class UsersController {
  static async registerUser(req, res) {
    try {
      const { email, firstName, lastName, role } = req.body;
      const validation = await validateRegisterUserSchema.validateAsync(req.body);

      const userExists = await userModel.findOne({ email });
      if (userExists) return res.status(409).json({ error: 'Email already exists' });

      const user = new userModel({
        email: validation.email,
        password: validation.password,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: new Date(validation.dateOfBirth),
        role: role.toLowerCase(),
      });

      const savedUser = await user.save();

      const accessToken = await signAccessToken(savedUser);
      const refreshToken = await signRefreshToken(savedUser);

      res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async registerBulkUsers(req, res) {
    try {
      const { bulk } = req.body;

      const users = bulk.map((user) => {
        const { email, password, firstName, lastName, role } = user;
        return {
          email,
          password,
          firstName,
          lastName,
          dateOfBirth: new Date(user.dateOfBirth),
          role: role.toLowerCase(),
        };
      });

      if (!users) {
        return res.status(400).json({ error: 'No bulk data provided' });
      }

      for (const user of users) {
        try {
          await validateRegisterUserSchema.validateAsync(user);
        } catch (validationEerr) {
          continue;
        }
      }

      for (const user of users) {
        const userExists = await userModel.findOne({ email: user.email });
        if (userExists) return res.status(400).json({ error: `Email ${user.email} already exists` });
        users.dateOfBirth = new Date(users.dateOfBirth);
      }

      await userModel.insertMany(users);

      res.status(201).json({ message: "Bulk users registered successfully" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }


  static async updateUser(req, res) {
    try {
      const userId = req.user._id;

      const validation = await validateUpdateUserSchema.validateAsync(req.body);

      const updatedUser = await userModel.findByIdAndUpdate(userId, {
        firstName: validation.firstName,
        lastName: validation.lastName,
      }, { new: true });

      if (!updatedUser) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({ updatedUser });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async updatePassword(req, res) {
    try {
      const userId = req.user._id;

      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const validation = await validateUpdatePasswordSchema.validateAsync(req.body);

      const isMatched = await user.isMatchedPassword(validation.currentPassword);
      if (!isMatched) return res.status(401).json({ error: 'Invalid current password' });

      if (validation.currentPassword === validation.newPassword) {
        return res.status(409).json({ error: 'New password cannot be the same as the current password' });
      }

      user.password = validation.newPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.error('Error updating password:', err.message);
      return res.status(400).json({ error: err.message });
    }



  }

  static async resetPassword(req, res) { }

  static async deleteUser(req, res) {
    try {
      const userId = req.params.userId;

      const deleted = await userModel.findByIdAndDelete(userId);
      if (!deleted) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Error deleting user:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async suspendUser(req, res) {
    try {
      const userId = req.params.userId;

      const user = await userModel.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.isSuspended = !user.isSuspended;
      await user.save();

      res.status(200).json({
        message: `User ${user.email} has been ${user.isSuspended ? 'suspended' : 'reactivated'} successfully`
      });
    } catch (err) {
      console.error('Error suspending user:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const { email, firstName, lastName, role } = req.query;
      const { page, limit } = chechPagination(req.query.page, req.query.limit)
      let totalUsers = await userModel.countDocuments();

      if (totalUsers === 0) {
        return res.status(404).json({ error: 'No users found' });
      }

      const matchQuery = {};

      if (email) {
        matchQuery.email = { $regex: email, $options: 'i' };
      }
      if (firstName) {
        matchQuery.firstName = { $regex: firstName, $options: 'i' };
      }
      if (lastName) {
        matchQuery.lastName = { $regex: lastName, $options: 'i' };
      }
      if (role) {
        matchQuery.role = { $regex: role, $options: 'i' };
      }

      const atomicOptions = [
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            role: 1,
            createdAt: 1,
            updatedAt: 1,
            dateOfBirth: 1,
            isSuspended: 1
          }
        }
      ];

      const users = await userModel.aggregate(atomicOptions);

      totalUsers = await userModel.countDocuments(matchQuery);

      if (!users || !users.length) {
        return res.status(404).json({ error: 'No users match your search' });
      }

      const response = users.map(user => ({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        dateOfBirth: format(new Date(user.dateOfBirth), 'd-M-yyyy'),
        isSuspended: user.isSuspended || false,
        createdAt: format(new Date(user.createdAt), 'd-M-yyyy'),
        updatedAt: format(new Date(user.updatedAt), 'd-M-yyyy'),
      }));

      res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        users: response
      });
    } catch (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getCreatedCoursesByCurrentInstructor(req, res) {
    try {
      const userId = req.user._id;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const { title, category, sortBy, sortOrder } = req.query;
      const { page, limit } = chechPagination(req.query.page, req.query.limit)

      let totalCourses = await courseModel.countDocuments({ instructor: user._id });
      if (totalCourses === 0) {
        return res.status(404).json({ error: 'No courses found' });
      }

      const matchQuery = { instructor: user._id };

      if (title) {
        matchQuery.$or = [
          { title: { $regex: title, $options: 'i' } },
          { description: { $regex: title, $options: 'i' } }
        ];
      }

      const sortField = sortBy || 'createdAt';
      const sortDirection = sortOrder === 'asc' ? 1 : -1;

      const atomicOptions = [
        { $match: matchQuery },
        { $sort: { [sortField]: sortDirection } },
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
            isPublic: 1,
            'category.name': 1,
            'instructor.firstName': 1,
            'instructor.lastName': 1,
            contents: { $size: '$contents' }
          }
        },
      ];

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
            isPublic: course.isPublic,
            createdAt: format(Date(course.createdAt), 'd-M-yyyy'),
            updatedAt: format(Date(course.updatedAt), 'd-M-yyyy'),
          }
        }));

      const cachedData = {
        totalFound,
        coursesFound: response
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
  static async getCreatedCourseByCurrentInstructorAndCourseId(req, res) {
    try {
      const userId = req.user._id;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const courseId = req.params.courseId;

      const course = await courseModel.findOne({ _id: courseId, instructor: user._id })
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


  static async updateUserRole(req, res) {
    try {
      const userId = req.params.userId;
      const { role } = req.query;

      if (!role) {
        return res.status(400).json({ error: 'Role is required' });
      }

      const updateRole = await userModel.findByIdAndUpdate(
        userId,
        { $set: { role: role } },
        { new: true }
      );

      if (!updateRole) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: `User role updated to ${updateRole.role} successfully` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }


}

export default UsersController;
