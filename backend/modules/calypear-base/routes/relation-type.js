const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const relationTypeController = require('../controllers/relation-type.js');

const router = express.Router();
const requiresAuth = require('../lib/requires-auth.js');

//Validate the typeClass is supplied properly
router.get('/',relationTypeController.all);
router.post('/',requiresAuth,celebrate(
  {
    body: {
      typeName: Joi.string().required(),
      typeNameInverse: Joi.string().required(),
    }
  }
),relationTypeController.create);

router.put('/:typeId',celebrate(
  {
    params: {
      typeId: Joi.string().required(),
    },
    body: {
      typeName: Joi.string().required(),
      typeNameInverse: Joi.string().required(),
    }
  }
),relationTypeController.update);

router.delete('/:typeId',celebrate(
  {
    params: {
      typeId: Joi.string().required(),
    },
  }
), relationTypeController.destroy);

module.exports = router;
