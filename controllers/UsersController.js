import { validateUserSchema, validateCourseSchema } from '../helpers/schemaValidationHelpers.js';
import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from '../helpers/jwtAuthHelpers.js';
import userModel from '../models/UserModel.js';

class UsersController {
  static async registerUser(req, res) {
    try {
      const { email, firstName, lastName, role } = req.body;
      const validation = await validateUserSchema.validateAsync(req.body);

      const userExists = await userModel.findOne({ email });
      if (userExists) return res.status(400).json({ error: 'email already exists' });

      const user = new userModel({
        email: validation.email,
        password: validation.password,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: validation.dateOfBirth,
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
}

export default UsersController;
