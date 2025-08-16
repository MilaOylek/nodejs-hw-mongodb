import Joi from 'joi';

export const contactFilterSchema = Joi.object({
  type: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean().truthy('true').falsy('false'),
});

export const parseFilterParams = (query) => {
  const { error, value } = contactFilterSchema.validate(query, {
    stripUnknown: true,
  });

  if (error) {
    console.error('Validation Error:', error.details);
  }

  return value;
};
