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
      // ############### Debug ############## 
      console.log(isMatched);
      // #################################### 
      if (!isMatched) return res.status(401).json({ error: 'Invalid Email or password' });

      const accessToken = await signAccessToken(user);
      // ############### Debug ############## 
      console.log(accessToken);
      // #################################### 
      const refreshToken = await signRefreshToken(user);
      // ############### Debug ############## 
      console.log('refreshToken\t', refreshToken);
      // #################################### 
      res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async logoutUser(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized, Bad Request' });
      }

      const userId = await verifyRefreshToken(refreshToken);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized, Bad Request' });
      }

      await redisClient.del(userId);
      res.status(204).json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Error during logout:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default AuthController;
