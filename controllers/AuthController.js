import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from '../helpers/jwtAuthHelpers.js';
import { validateUserSchema, validateCourseSchema } from '../helpers/schemaValidationHelpers.js';
import userModel from '../models/UserModel.js';
import redisClient from '../utils/redis.js';

class AuthController {
  static async loginUser(req, res) {
    try {
      const validation = await validateUserSchema.validateAsync(req.body);

      const user = await userModel.findOne({ email: validation.email });
      if (!user) return res.status(401).json({ error: 'Email not found' });

      const isMatched = await user.isMatchedPassword(validation.password);

      if (!isMatched) return res.status(401).json({ error: 'Invalid Email or password' });

      const accessToken = await signAccessToken(user);
      const refreshToken = await signRefreshToken(user);
      res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async logoutUser(req, res, next) {
    try {
      const { refreshToken } = req.body;
      //########### Debug ###########
      console.log('1- refreshToken:', refreshToken);
      // ###########################
      if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required' });

      const userId = await verifyRefreshToken(refreshToken);
      //########### Debug ###########
      console.log('2- userId:', userId);
      // ###########################
      await redisClient.del(userId.toString());

      res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
