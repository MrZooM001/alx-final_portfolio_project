import Joi from 'joi';
import JoiDate from '@joi/date';

const extendedJoi = Joi.extend(JoiDate);

const validateRegisterUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().max(64),
  password: Joi.string().min(6).required().max(64),
  firstName: Joi.string().trim().max(64),
  lastName: Joi.string().trim().max(64),
  dateOfBirth: extendedJoi.date().format('D-M-YYYY').required().greater('1-1-1934').less('now').utc(),
  role: Joi.string().lowercase().valid('student', 'instructor').default('student'),
});

const validateLoginUserSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().max(64),
  password: Joi.string().required().max(64),
});

const validateUpdatePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required().max(64),
  newPassword: Joi.string().min(6).required().max(64),
});

const validateUpdateUserSchema = Joi.object({
  firstName: Joi.string().trim().max(64),
  lastName: Joi.string().trim().max(64),
});

const validateCourseSchema = Joi.object({
  title: Joi.string().required().lowercase().trim().min(6).max(64),
  description: Joi.string().required().max(1200),
  instructor: Joi.string().required(),
  contents: Joi.array(),
  category: Joi.string().required(),
  isPublic: Joi.boolean().default(false),
});

const validateContentSchema = Joi.object({
  title: Joi.string().required().lowercase().trim().min(6).max(64),
  type: Joi.string().required().valid('video', 'article', 'audio', 'quiz').default('article'),
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
