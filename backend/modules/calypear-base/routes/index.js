const express = require('express');

let router = express.Router();
router.use('/arch-component',require('./arch-component'));
router.use('/component-type',require('./component-type'));

module.exports = router;
