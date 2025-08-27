import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { Session } from '../models/session.js';
import crypto from 'crypto';

import { createSession } from '../utils/createSession.js';

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({ userId: user._id });
  const session = await createSession(user._id);
  return session;
};

export const refreshUserSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionExpired = new Date() > session.refreshTokenValidUntil;
  if (isSessionExpired) {
    await Session.deleteOne({ _id: session._id });
    throw createHttpError(401, 'Session expired');
  }

  await Session.deleteOne({ _id: session._id });
  const newSession = await createSession(session.userId);

  return newSession;
};

export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};
