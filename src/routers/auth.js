import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../validation/auth.validation.js';
import { handleRegisterUser } from '../controllers/auth.js';
import { loginSchema } from '../validation/auth.validation.js';
import { handleLoginUser } from '../controllers/auth.js';
import { handleRefreshSession } from '../controllers/auth.js';
import { handleLogoutUser } from '../controllers/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(handleRegisterUser),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(handleLoginUser));

router.post('/refresh', ctrlWrapper(handleRefreshSession));

router.post('/logout', ctrlWrapper(handleLogoutUser));

export default router;
