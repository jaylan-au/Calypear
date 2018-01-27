const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const archComponentController = require('../controllers/arch-component.js');
const archComponentModel = require('../models/arch-component.js');

const router = express.Router();

router.get('/',archComponentController.search);
router.get('/:componentId',celebrate({
  params: {
    componentId: Joi.string().required(),
  }
}),archComponentController.read);

router.post('/:componentId',celebrate({
  params: {
    componentId: Joi.string().required(),
  },
  body: archComponentModel.attributes
}),archComponentController.create);

router.put('/:componentId',celebrate({
  params: {
    componentId: Joi.string().required(),
  },
  body: archComponentModel.attributes
}),archComponentController.update);

router.delete('/:componentId',celebrate({
  params: {
    componentId: Joi.string().required()
  }
}),archComponentController.delete);

module.exports = router;
