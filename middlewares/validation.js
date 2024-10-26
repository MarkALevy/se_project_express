const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

module.exports.validateItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "imageUrl" field must be filled in',
      'string.uri': 'The "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'The "Email" field must be filled in',
      'string.email': ' The "Email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "Password" field must be filled in',
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "Avatar" field must be filled in',
      'string.uri': 'The "Avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      'string.empty': 'The "Email" field must be filled in',
      'string.email': ' The "Email" field must be a valid email address',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'The "Password" field must be filled in',
    }),
  }),
});

module.exports.validateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'The minimum length of the "name" field is 2',
      'string.max': 'The maximum length of the "name" field is 30',
      'string.empty': 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      'string.empty': 'The "Avatar" field must be filled in',
      'string.uri': 'The "Avatar" field must be a valid url',
    }),
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().length(24).hex().messages({
      'string.empty': 'The "itemId" field is required',
      'string.length': 'The required length of the "itemId" field is 24',
      'string.hex': 'The "itemId" field must be in valid format',
    }),
  }),
});
