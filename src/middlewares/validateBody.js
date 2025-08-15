import createError from 'http-errors';

const validateBody = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    next(createError(400, error.details[0].message));
    return;
  }
  next();
};

export default validateBody;
