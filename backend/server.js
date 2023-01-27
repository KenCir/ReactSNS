require('dotenv').config();
const { readdirSync } = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const logger = require('morgan');
const socketIO = require('socket.io');
const log4js = require('./modules/logger');
const app = express();
const server = http.Server(app);
const socket = socketIO(server, {
    cors: {
        origin: '*',
    },
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(log4js.express);

// CORSを許可する
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/api', require('./router/index'));

// 404
// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
    res.status(404).end();
});

// Processイベント読み込み
readdirSync(path.join(__dirname, '/events/process/')).forEach((file) => {
    const event = require(path.join(__dirname, `/events/process/${file}`));
    const eventName = file.split('.')[0];
    process.on(eventName, event.bind(null, log4js.logger));
    log4js.logger.info(`Process ${eventName} event is Loading`);
});

// Socket.ioイベント読み込み
readdirSync(path.join(__dirname, '/events/socket/'), { withFileTypes: true }).filter(dirent => dirent.isFile()).map(dirent => dirent.name).forEach((file) => {
    const event = require(path.join(__dirname, `/events/socket/${file}`));
    const eventName = file.split('.')[0];
    socket.on(eventName, event.bind(null, socket, log4js.logger));
    log4js.logger.info(`Socket.io ${eventName} event is Loading`);
});

server.listen(process.env.PORT, process.env.HOST, () => log4js.logger.info(`Server Listening http://localhost:${process.env.PORT}`));