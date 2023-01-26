const express = require('express');
const { Messages, Accounts } = require('../../../database/database');
const router = express.Router();

router.post('/fetch', async (req, res) => {
    try {
        if (!req.body.limit) return res.status(400).end();

        const rawMessages = await Messages.findAll({
            limit: Number(req.body.limit),
            offset: Number(req.body.offset ?? 0),
            order: [
                ['createdAt', 'DESC'],
            ],
        });

        const messages = [];
        for (const message of rawMessages) {
            const account = await Accounts.findByPk(message.user_id);
            if (!account) return;

            messages.push({
                id: message.id,
                user_id: account.id,
                username: account.username,
                content: message.content,
                avatar: account.avatar,
            });
        }

        return res.status(200).send(messages).end();
    }
    catch (error) {
        return res.status(500).send(error.message).end();
    }
});

module.exports = router;