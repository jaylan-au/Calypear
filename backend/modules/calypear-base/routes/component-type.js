const express = require('express');
const componentTypeController = require('../controllers/component-type.js');

const router = express.Router();
router.get('/',componentTypeController.all);
router.post('/',componentTypeController.create);
router.put('/:typeId',componentTypeController.update)
router.delete('/:typeId',componentTypeController.delete)

module.exports = router;
