import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { env } from 'process';
import redisClient from '../utils/redis.js';

dotenv.config();

const signAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    const options = {
      expiresIn: '1h',
      issuer: 'InnovativeLearningPlatform',
      audience: user._id.toString(),
    };

    JWT.sign(payload, env.ACCESS_TOKEN_SECRET, options, (err, token) => {
      if (err) {
        console.error('Error signing access token:', err.message);
        return reject(err);
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized, Bad Request' });
  }

  const token = authHeader.split(' ')[1];

  JWT.verify(token, env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      return next(res.status(401).json({ error: message }));
    }
    req.user = payload;
    next();
  });
};

const signRefreshToken = (user) => {
  return new Promise(async (resolve, reject) => {
    const payload = {};
    const options = {
      expiresIn: '1y',
      issuer: 'InnovativeLearningPlatform',
      audience: user._id.toString(),
    };

    JWT.sign(payload, env.REFRESH_TOKEN_SECRET, options, (err, token) => {
      if (err) {
        console.error('Error signing refresh token:', err.message);
        return reject(err);
      }

      try {
        redisClient.set(user._id.toString(), token, 365 * 24 * 60 * 60);
        resolve(token);
      } catch (redisErr) {
        console.error('Redis error:', redisErr.message);
        reject(redisErr);
      }
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(err);

      const userId = payload.aud;
      redisClient.get(userId, (err, result) => {
        if (err) {
          console.error('Redis error:', err.message);
          reject(err);
          return;
        }
        if (refreshToken === result) {
          return resolve(userId);
        }
        reject(err);
      });
    });
  });
};

export { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken };
