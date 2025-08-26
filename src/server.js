import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.routes.js';
import router from './routers/index.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pino());
  app.use(cookieParser());

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  // app.use('/api/auth', authRouter);
  // app.use('/api/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
