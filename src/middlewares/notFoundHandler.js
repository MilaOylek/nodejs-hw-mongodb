import createError from 'http-errors';

export const notFoundHandler = (_req, _res, next) => {
  next(createError(404, 'Route not found'));
};
