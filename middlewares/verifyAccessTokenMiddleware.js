import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Access token is missing or invalid' });
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

export { verifyAccessToken };
