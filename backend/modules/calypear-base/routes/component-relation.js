const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const componentRelationController = require('../controllers/component-relation.js');
const ComponentRelationModel = require('../models/component-relation.js');
const requiresAuth = require('../lib/requires-auth.js');

const router = express.Router();

router.get('/component/:componentId',celebrate({
  params: {
    componentId: Joi.string().required(),
  }
}),componentRelationController.readAllForComponent);

router.post('/',requiresAuth,celebrate({
  body: {
    from: Joi.string().required(),
    relationType: Joi.string().required(),
    to: Joi.string().required(),
  }
}),componentRelationController.create);

router.delete('/:transaction',requiresAuth,celebrate({
  params: {
    transaction: Joi.string().required()
  }
}),componentRelationController.destroy);

module.exports = router;
