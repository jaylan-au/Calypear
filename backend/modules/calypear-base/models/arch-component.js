const Joi = require('Joi');
module.exports = {
  docType: 'archcomponent',
  attributes: {
    componentName: Joi.string().min(1).required(),
    componentType: Joi.string().required(),
    alternativeNames: Joi.string(),
    description: Joi.string().allow(''),
    tranche: Joi.string(),
  }
};
