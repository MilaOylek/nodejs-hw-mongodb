import createHttpError from 'http-errors';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../services/auth.js';

export const handleRegisterUser = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user.toObject({ getters: true, virtuals: false }),
  });
};

export const handleLoginUser = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const handleRefreshSession = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw createHttpError(401, 'Unauthorized');
  }

  const session = await refreshUserSession(refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const handleLogoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    await logoutUser(refreshToken);
  }

  res.clearCookie('refreshToken');
  res.status(204).send();
};
