const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const simpleTypeController = require('../controllers/simple-type.js');

const router = express.Router();
//Validate the typeClass is supplied properly
router.get('/:typeClass',celebrate(
  {
    params: {
      typeClass: Joi.string().lowercase().valid([
        'relationtype',
        'componenttype',
        'tagtype',
      ]).required(),
    }
  }
),simpleTypeController.all);
router.post('/:typeClass',celebrate(
  {
    params: {
      typeClass: Joi.string().lowercase().valid([
        'relationtype',
        'componenttype',
        'tagtype',
      ]).required(),
    },
    body: {
      typeName: Joi.string().required(),
    }
  }
),simpleTypeController.create);

router.route('/:typeClass/:typeId')
  .all(celebrate(
    {
      params: {
        typeClass: Joi.string().lowercase().valid([
          'relationtype',
          'componenttype',
          'tagtype',
        ]).required(),
        typeId: Joi.string().required(),
      },
    }
  )
).put(simpleTypeController.update)
  .delete(simpleTypeController.destroy);

module.exports = router;
