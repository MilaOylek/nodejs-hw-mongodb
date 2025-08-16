import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, _res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(createError(400, 'Invalid ID format'));
    return;
  }
  next();
};
