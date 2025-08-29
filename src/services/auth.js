import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { Session } from '../models/session.js';
import crypto from 'crypto';

import { createSession } from '../utils/createSession.js';

import jwt from 'jsonwebtoken';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendEmail.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs';

const TEMPLATE_DIR_PATH = path.join(process.cwd(), 'src', 'templates');

const resetPasswordTemplate = fs
  .readFileSync(path.join(TEMPLATE_DIR_PATH, 'send-reset-email-password.html'))
  .toString();

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
  return user;
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

export const sendResetPasswordEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const host = getEnvVar(ENV_VARS.FRONTEND_DOMAIN);
  const token = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    getEnvVar(ENV_VARS.JWT_SECRET),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordLink = `${host}/reset-password?token=${token}`;

  const template = handlebars.compile(resetPasswordTemplate);

  const html = template({
    name: user.name,
    link: resetPasswordLink,
  });

  await sendMail({
    to: email,
    subject: 'Reset your password!',
    html,
  });
};

export const resetPassword = async (token, password) => {
  let payload;

  try {
    payload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
  } catch (err) {
    console.error(err);
    throw createHttpError(401, err.message);
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  user.password = await bcrypt.hash(password, 10);

  await user.save();
};
