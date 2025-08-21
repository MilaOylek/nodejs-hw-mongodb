import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header is missing'));
  }

  const [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !accessToken) {
    return next(createHttpError(401, 'Invalid authorization header format'));
  }

  const session = await Session.findOne({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired = new Date() > session.accessTokenValidUntil;
  if (isAccessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  next();
};
