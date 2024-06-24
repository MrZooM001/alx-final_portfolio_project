import Joi from 'joi';

const validateUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  dateOfBirth: Joi.date().greater('1-1-1934').less('now'),
  role: Joi.string().valid('student', 'instructor', 'admin').default('student'),
});

const validateCourseSchema = Joi.object({
  title: Joi.string().required().lowercase().trim(),
  description: Joi.string().required(),
  instructor: Joi.string().required(),
  content: Joi.string(),
  isPublic: Joi.boolean().default(false),
});

export { validateUserSchema, validateCourseSchema };