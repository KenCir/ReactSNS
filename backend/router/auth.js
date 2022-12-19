const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/signin', async (req, res) => {
    if (!req.body.email || !req.body.password) return res.status(400).end();

    const email = req.body.email;
    const password = req.body.password;


});