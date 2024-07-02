import { format } from 'date-fns';
import {
  validateRegisterUserSchema, validateUpdateUserSchema, validateUpdatePasswordSchema
} from '../helpers/schemaValidationHelpers.js';
import { signAccessToken, signRefreshToken } from '../helpers/jwtAuthHelpers.js';
import userModel from '../models/UserModel.js';
import { getActiveSessions } from '../helpers/sessionHelpers.js';
import { chechPagination } from '../helpers/checkPaginationHelper.js';
import redisClient from '../utils/redis.js';



class UsersController {
  static async registerUser(req, res) {
    try {
      const { email, firstName, lastName, role } = req.body;
      const validation = await validateRegisterUserSchema.validateAsync(req.body);

      const userExists = await userModel.findOne({ email });
      if (userExists) return res.status(400).json({ error: 'email already exists' });

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

  static async getActiveUsers(req, res) {
    try {
      const activeUsers = await getActiveSessions();
      res.status(200).json({ activeUsers });
    } catch (err) {
      return res.status(400).json({ error: `Failed to retrieve active users, ${err.message}` });
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

      res.status(200).json({ success: true, updatedUser });
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


}

export default UsersController;
