const express = require('express');

let router = express.Router();
router.use('/arch-component',require('./arch-component'));
router.use('/component-relation',require('./component-relation'));
router.use('/admin/simple-type',require('./simple-type'));
module.exports = router;
