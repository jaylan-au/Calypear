const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const componentTagController = require('../controllers/component-tag.js');


const router = express.Router();

router.get('/component/:componentId',celebrate({
  params: {
    componentId: Joi.string().required(),
  }
}),componentTagController.readAllForComponent);

router.post('/',celebrate({
  body: {
    component: Joi.string().required(),
    tagType: Joi.string().required(),
    value: Joi.string().allow(''),
  }
}),componentTagController.create);

router.delete('/:id',celebrate({
  params: {
    id: Joi.string().required()
  }
}),componentTagController.destroy);

module.exports = router;
