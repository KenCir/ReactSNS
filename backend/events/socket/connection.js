const { readdirSync } = require('fs');
const path = require('path');

/**
 * @param {import('log4js').Logger} logger
 * @param {import('socket.io').Socket} socket
 */
module.exports = (logger, socket) => {
    logger.info(`connected from ${socket.handshake.headers.host} id: ${socket.id}`);

    // ハンドラを読み込んで登録
    readdirSync(path.join(process.cwd(), '/events/socket/handlers/')).forEach((file) => {
        const event = require(path.join(process.cwd(), `/events/socket/handlers/${file}`));
        const eventName = file.split('.')[0];
        socket.on(eventName, event.bind(null, logger));
    });

    socket.emit('READY');
};