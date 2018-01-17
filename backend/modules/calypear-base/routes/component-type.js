const express = require('express');
const componentTypeController = require('../controllers/component-type.js');

const router = express.Router();
router.get('/',componentTypeController.all);
router.put('/',componentTypeController.create);

module.exports = router;
