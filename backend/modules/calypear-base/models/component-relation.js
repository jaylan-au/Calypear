const Joi = require('Joi');
module.exports = {
  docType: 'componentrelation',
  attributes: {
    from: Joi.string().required(),
    relationType: Joi.string().required(),
    to: Joi.string().required(),
    transaction: Joi.string().required(),
    inverse: Joi.boolean().required(),
  }
};
