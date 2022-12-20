require('dotenv').config();
const { readdirSync } = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const logger = require('morgan');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const socket = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL
    }
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Processイベント読み込み
readdirSync(path.join(__dirname, '/events/process/')).forEach((file) => {
    const event = require(path.join(__dirname, `/events/process/${file}`));
    const eventName = file.split('.')[0];
    process.on(eventName, event.bind(null));
    console.info(`Process ${eventName} event is Loading`);
});

// Socket.ioイベント読み込み
readdirSync(path.join(__dirname, '/events/socket/')).forEach((file) => {
    const event = require(path.join(__dirname, `/events/socket/${file}`));
    const eventName = file.split('.')[0];
    socket.on(eventName, event.bind(null));
    console.info(`Socket.io ${eventName} event is Loading`);
});

// Router読み込み
readdirSync(path.join(__dirname, '/router/')).forEach((file) => {
    const router = require(path.join(__dirname, `/router/${file}`));
    app.use(router.path, router.router);
    console.info(`Router ${router.path} is Loading`);
});

// 404
app.use(function (req, res, next) {
    res.status(404).end();
});

server.listen(process.env.PORT, () => console.log(`Server Listening http://localhost:${process.env.PORT}`));