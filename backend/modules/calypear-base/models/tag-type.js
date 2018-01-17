const Joi = require('Joi');
module.exports = {
  docType: 'tagtype',
  attributes: {
    typeName: Joi.string().min(1).required(),
  }
};
