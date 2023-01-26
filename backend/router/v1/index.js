const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Hello v1').end();
});

router.use('/account', require('./account/account'));
router.use('/message', require('./message/message'));

module.exports = router;