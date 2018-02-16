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

router.post('/',celebrate({
  body: Joi.object(archComponentModel.attributes).unknown()
}),archComponentController.create);

router.put('/:componentId',celebrate({
  params: {
    componentId: Joi.string().required(),
  },
  body: Joi.object(archComponentModel.attributes).unknown()
}),archComponentController.update);

router.delete('/:componentId',celebrate({
  params: {
    componentId: Joi.string().required()
  }
}),archComponentController.destroy);

module.exports = router;
