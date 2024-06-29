import {
  validateRegisterUserSchema, validateUpdateUserSchema, validateUpdatePasswordSchema
} from '../helpers/schemaValidationHelpers.js';
import { signAccessToken, signRefreshToken } from '../helpers/jwtAuthHelpers.js';
import userModel from '../models/UserModel.js';
import { getActiveSessions } from '../helpers/sessionHelpers.js';

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
      const userId = req.user.userId;

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
      const userId = req.user.userId;

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
}

export default UsersController;
