const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Hello v99').end();
});

module.exports = router;