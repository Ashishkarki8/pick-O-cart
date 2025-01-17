import Joi from 'joi';

// Joi schema for login
const loginValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Option to disable TLD validation if needed
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.',
    }),
  password: Joi.string()
    .min(8) // Minimum 8 characters for better security
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters.',
      'any.required': 'Password is required.',
    }),
});

export default loginValidator;
