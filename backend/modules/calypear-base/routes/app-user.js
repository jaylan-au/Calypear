const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const appUserController = require('../controllers/app-user.js');
const appUserModel = require('../models/app-user.js');

const router = express.Router();

router.get('/',appUserController.search);
router.post('/',celebrate({
  body: {
    username: Joi.string().min(1).required(),
    authentication: Joi.string().min(1).required(),
  }
}),appUserController.create);

module.exports = router;
