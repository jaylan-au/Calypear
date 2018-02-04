const Joi = require('Joi');
module.exports = {
  docType: 'relationtype',
  attributes: {
    typeName: Joi.string().min(1).required(),
    typeNameInverse: Joi.string().min(1).required(),
  }
};
