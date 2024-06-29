import Joi from 'joi';
import JoiDate from '@joi/date';

const extendedJoi = Joi.extend(JoiDate);

const validateRegisterUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  dateOfBirth: extendedJoi.date().format('D-M-YYYY').required().greater('1-1-1934').less('now').utc(),
  role: Joi.string().lowercase().valid('student', 'instructor').default('student'),
});

const validateLoginUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().min(6).required(),
});

const validateUpdatePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

const validateUpdateUserSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
});

const validateCourseSchema = Joi.object({
  title: Joi.string().required().lowercase().trim().min(6),
  description: Joi.string().required(),
  instructor: Joi.string().required(),
  contents: Joi.array(),
  category: Joi.string().required(),
  isPublic: Joi.boolean().default(false),
});

const validateContentSchema = Joi.object({
  title: Joi.string().required().lowercase().trim().min(6),
  type: Joi.string().required().valid('video', 'article', 'image', 'audio', 'quiz').default('article'),
  data: Joi.any(),
  isPublic: Joi.boolean().default(false),
});

export {
  validateRegisterUserSchema,
  validateUpdateUserSchema,
  validateUpdatePasswordSchema,
  validateCourseSchema,
  validateContentSchema,
  validateLoginUserSchema
};
