import { signAccessToken, signRefreshToken, verifyRefreshToken, blackListRefreshToken } from '../helpers/jwtAuthHelpers.js';
import { validateLoginUserSchema } from '../helpers/schemaValidationHelpers.js';
import userModel from '../models/UserModel.js';
import redisClient from '../utils/redis.js';

class AuthController {
  static async loginUser(req, res, next) {
    try {
      const validation = await validateLoginUserSchema.validateAsync(req.body);

      const user = await userModel.findOne({ email: validation.email });
      if (!user) return res.status(401).json({ error: 'Email not found' });

      const isMatched = await user.isMatchedPassword(validation.password);
      if (!isMatched) return res.status(401).json({ error: 'Invalid Email or password' });

      const accessToken = await signAccessToken(user);
      const refreshToken = await signRefreshToken(user);

      res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      res.status(400).json({ error: err.message });
      next(err);
    }
  }

  static async logoutUser(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized, Bad Request' });
      }

      const userId = await verifyRefreshToken(refreshToken);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized, Bad Request' });
      }

      await redisClient.del(`user:${userId}`);

      await blackListRefreshToken(refreshToken);

      res.status(204).json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error('Error during logout:', err.message);
      next(err);
      return res.status(500).json({ error: err.message });
    }
  }

}

export default AuthController;
