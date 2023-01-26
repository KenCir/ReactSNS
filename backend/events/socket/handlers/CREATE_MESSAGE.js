const { Accounts, Messages } = require('../../../database/database');
const crypto = require('crypto');

/**
 * メッセージ作成
 * @param {import('../../../modules/logger').logger} logger
 * @param {{ email: string, content: string }} message
 */
module.exports = async (io, logger, message) => {
    logger.log(`Message: ${message.content}`);

    const account = await Accounts.findOne({
        where: {
            email: message.email,
        },
    });
    if (!account) return;

    const id = crypto.randomUUID();

    await Messages.create({ id: id, user_id: account.id, content: message.content });

    io.emit('CREATE_MESSAGE', {
        id: id,
        user_id: account.id,
        username: account.username,
        content: message.content,
        avatar: account.avatar,
    });
};