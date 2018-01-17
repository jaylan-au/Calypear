const Joi = require('Joi');
module.exports = {
  docType: 'relationtype',
  attributes: {
    typeName: Joi.string().min(1).required(),
  }
};
