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

const blackListRefreshToken = async (token) => {
  const payload = JWT.decode(token);
  if (!payload) throw new Error('Invalid Token');

  const expiration = payload.exp;
  const currentTime = Math.floor(Date.now() / 1000);
  const ttl = expiration - currentTime;

  if (ttl > 0) {
    await redisClient.set(`blacklist:${token}`, token, ttl);
  }
};

const isBlackListed = async (token) => {
  const result = await redisClient.get(`blacklist:${token}`);
  return result !== null;
};

const signRefreshToken = (user) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const options = {
      expiresIn: '24h',
      issuer: 'InnovativeLearningPlatform',
      audience: user._id.toString(),
    };

    JWT.sign(payload, env.REFRESH_TOKEN_SECRET, options, async (err, token) => {
      if (err) {
        console.error('Error signing refresh token:', err.message);
        return reject(err);
      }

      try {
        const result = await redisClient.set(user._id.toString(), token, 24 * 60 * 60);
        if (result) {
          resolve(token);
        } else {
          throw new Error('Failed to set token in Redis');
        }
      } catch (redisErr) {
        console.error('Redis error:', redisErr.message);
        return reject(redisErr);
      }
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, env.REFRESH_TOKEN_SECRET, async (err, payload) => {
      if (err) return reject(err);

      const userId = payload.aud;

      try {
        const isBlackListedToken = await isBlackListed(refreshToken);
        if (isBlackListedToken) {
          return reject(new Error('Invalid refresh token'));
        }

        const result = await redisClient.get(userId);
        if (refreshToken === result) {
          resolve(userId)
        } else {
          reject(new Error('Invalid refresh token'));
        }
      } catch (redisErr) {
        console.error('Redis error:', redisErr.message);
        return reject(redisErr);
      }
    });
  });
};

export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  blackListRefreshToken,
  isBlackListed,
};
