const express = require('express');
const router = express.Router();

router.use('/v1', require('./v1/index'));
router.use('/v99', require('./v99/index'));

module.exports = router;