import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../validation/auth.validation.js';
import { handleRegisterUser } from '../controllers/auth.js';
import { loginUserSchema } from '../validation/auth.validation.js';
import { handleLoginUser } from '../controllers/auth.js';
import { handleRefreshSession } from '../controllers/auth.js';
import { handleLogoutUser } from '../controllers/auth.js';

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

export default router;
