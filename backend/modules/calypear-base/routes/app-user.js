const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const appUserController = require('../controllers/app-user.js');
const appUserModel = require('../models/app-user.js');
const requiresAuth = require('../lib/requires-auth.js');

const router = express.Router();

router.get('/',requiresAuth,appUserController.search);
router.get('/currentUser',appUserController.currentUser);

router.post('/',requiresAuth,celebrate({
  body: {
    username: Joi.string().min(1).required(),
    authentication: Joi.string().min(1).required(),
  }
}),appUserController.create);

router.put('/:appUserId',requiresAuth,celebrate({
  params: {
    appUserId: Joi.string().min(1).required(),
  },
  body: {
    username: Joi.string().min(1).required(),
    authentication: Joi.string().min(1).required(),
  }
}),appUserController.update);

router.put('/:appUserId/changepassword',requiresAuth,celebrate({
  params: {
    appUserId: Joi.string().min(1).required(),
  },
  body: {
    authentication: Joi.string().min(1).required(),
  }
}),appUserController.updateAuthentication);

router.delete('/:appUserId',requiresAuth,celebrate({
  params: {
    appUserId: Joi.string().min(1).required(),
  },
}),appUserController.delete)


module.exports = router;
