import Joi from "joi";

// to validate the data  before it reaches the database or controller.
// paila joi validation ani controller ani controller ley schema use garera pathaucha db ma

const userValidator = Joi.object({
  userName: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/)
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Username cannot be empty',
      'string.pattern.base': 'Username can only contain letters and spaces',
      'string.min': 'Username must have at least 3 characters',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Joi: Username is required',  
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{9,15}$/)
    .messages({
      'string.pattern.base': 'Phone number must be between 9 and 15 digits',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),

  role: Joi.string()
    .valid('user', 'admin')
    .default('admin')
    .messages({
      'any.only': 'joi: Role must be one of: user, or admin',
    }),
  
//   gender: Joi.string()
//     .valid('male', 'female', 'other')
//     .required()
//     .messages({
//       'any.only': 'Gender must be one of: male, female, or other',
//       'any.required': 'joi: Gender is required',
//     }),
  
//   address: Joi.object({
//     district: Joi.string().required().messages({
//       'string.empty': 'District cannot be empty',
//       'any.required': 'District is required',
//     }),
//     city: Joi.string().optional(),
//     place: Joi.string().required().messages({
//       'string.empty': 'Place cannot be empty',
//       'any.required': 'Place is required',
//     }),
//   }).required().messages({
//     'any.required': 'Address is required',
//   }),

  profilePicture: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile picture must be a valid URI',
    }),

  socialLinks: Joi.object({
    twitter: Joi.string().uri().optional().messages({
      'string.uri': 'Twitter link must be a valid URI',
    }),
    linkedin: Joi.string().uri().optional().messages({
      'string.uri': 'LinkedIn link must be a valid URI',
    }),
    github: Joi.string().uri().optional().messages({
      'string.uri': 'GitHub link must be a valid URI',
    }),
  }).optional(),
  notificationPreferences: Joi.object({
    email: Joi.boolean().default(true),
    push: Joi.boolean().default(true),
  }).optional(),
//   subscribed: Joi.boolean().default(false),
  createdAt: Joi.date().default(() => new Date()), // Fixed default
  updatedAt: Joi.date().default(() => new Date()), // Fixed default
});

export default userValidator;

