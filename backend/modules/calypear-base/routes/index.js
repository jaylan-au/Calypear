const express = require('express');

let router = express.Router();
router.use('/arch-component',require('./arch-component'));
router.use('/component-relation',require('./component-relation'));
router.use('/component-tag',require('./component-tag'));
router.use('/admin/relation-type',require('./relation-type'));
router.use('/admin/simple-type',require('./simple-type'));
module.exports = router;
