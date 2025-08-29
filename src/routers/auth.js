import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  registerSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.validation.js';

import {
  handleRegisterUser,
  handleLoginUser,
  handleRefreshSession,
  handleLogoutUser,
  sendResetPasswordEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(handleRegisterUser),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(handleLoginUser),
);

router.post('/refresh', ctrlWrapper(handleRefreshSession));

router.post('/logout', ctrlWrapper(handleLogoutUser));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(sendResetPasswordEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
