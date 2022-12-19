require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./router/auth'));
app.use(function (req, res, next) {
    res.status(404).end('404');
});

app.listen(process.env.PORT, () => console.log(`Server Listening http://localhost:${process.env.PORT}`));