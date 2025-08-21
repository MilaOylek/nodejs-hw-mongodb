import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { Session } from '../models/session.js';
import { createSession } from '../utils/createSession.js';

export const registerUser = async (payload) => {
  const { email, password } = payload;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...payload, password: hashedPassword });

  return newUser;
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Unauthorized');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, 'Unauthorized');
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
    throw createHttpError(401, 'Session expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newSession = await createSession(session.userId);

  return newSession;
};

export const logoutUser = async (refreshToken) => {
  await Session.deleteOne({ refreshToken });
};
