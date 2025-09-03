import { Router } from 'express';
import contactsRouter from './contacts.routes.js';
import authRouter from './auth.js';
import docsRouter from './docs.js';

const router = Router();

console.log('📌 Main router initialized');

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);
router.use('/api-docs', docsRouter);

export default router;
