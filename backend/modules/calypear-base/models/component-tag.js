const Joi = require('Joi');
module.exports = {
  docType: 'componenttag',
  attributes: {
    component: Joi.string().required(),
    tagType: Joi.string().required(),
    value: Joi.string().required(),
  }
};
