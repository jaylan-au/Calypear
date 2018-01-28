const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const componentRelationController = require('../controllers/component-relation.js');
const ComponentRelationModel = require('../models/component-relation.js');

const router = express.Router();

router.get('/component/:componentId',celebrate({
  params: {
    componentId: Joi.string().required(),
  }
}),componentRelationController.readAllForComponent);

router.post('/',celebrate({
  body: Joi.object(ComponentRelationModel.attributes).unknown()
}),componentRelationController.create);

router.delete('/:transaction',celebrate({
  params: {
    componentId: Joi.string().required()
  }
}),componentRelationController.destroy);

module.exports = router;
