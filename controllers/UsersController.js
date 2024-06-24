import { validateUserSchema, validateCourseSchema } from '../helpers/schemaValidation.js';
import userModel from '../models/UserModel.js';

class UsersController {
  static async registerUser(req, res, next) {
    try {
      const {
        email, password, firstName, lastName, role,
      } = req.body;
      const validation = await validateUserSchema.validateAsync(req.body);

      // if (!validation.email) return res.status(400).json({ error: 'Missing email' });;
      // if (!validation.password) return res.status(400).json({ error: 'Missing password' });

      const userExists = await userModel.findOne({ email });
      if (userExists) return res.status(400).json({ error: 'email already exists' });

      const user = new userModel({
        email: validation.email,
        password: validation.password,
        firstName: firstName,
        lastName: lastName,
        role: role,
      });
      const savedUser = await user.save();
      res.status(201).json({ success: true, user: savedUser.email });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

export default UsersController;
