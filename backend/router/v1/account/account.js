const { default: axios } = require('axios');
const sharp = require('sharp');
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { readFileSync, unlinkSync } = require('fs');
const { Accounts } = require('../../../database/database');
const logger = require('../../../modules/logger');
const router = express.Router();

// アカウント作成
router.post('/create', multer({ dest: `${__dirname}/../../../uploads` }).any(), async (req, res) => {
    try {
        if (!req.body.email || !req.body.username) return res.status(400).end();

        const account = await Accounts.findOne({
            where: { email: req.body.email },
        });
        // 既に存在していた場合は
        if (account) return res.status(400).send('The specified email account already exists').end();

        const id = crypto.randomUUID();

        if (req.files.length > 0) {
            sharp(`${__dirname}/../../../uploads/${req.files[0].filename}`)
                .webp()
                .resize(256, 256)
                .toFile(`${__dirname}/../../../uploads/${req.files[0].filename}.webp`, async (err) => {
                    if (err) logger.logger.err(err);

                    await axios.put(`${process.env.CLOUD_HOST}remote.php/dav/files/${process.env.CLOUD_USERNAME}/${process.env.CLOUD_FOLDER}/avatars/${id}.webp`,
                        readFileSync(`${__dirname}/../../../uploads/${req.files[0].filename}.webp`),
                        {
                            auth: {
                                username: process.env.CLOUD_USERNAME,
                                password: process.env.CLOUD_PASSWORD,
                            },
                        });

                    const result = await axios.post(`${process.env.CLOUD_HOST}/ocs/v2.php/apps/files_sharing/api/v1/shares?path=/${process.env.CLOUD_FOLDER}/avatars/${id}.webp&shareType=3`,
                        '',
                        {
                            auth: {
                                username: process.env.CLOUD_USERNAME,
                                password: process.env.CLOUD_PASSWORD,
                            },
                            headers: {
                                'OCS-APIRequest': true,
                            },
                        });

                    await Accounts.create({
                        id: id,
                        email: req.body.email,
                        username: req.body.username,
                        avatar: result.data.ocs.data.token,
                    });

                    res.status(200).end();

                    unlinkSync(`${__dirname}/../../../uploads/${req.files[0].filename}.webp`);
                    unlinkSync(`${__dirname}/../../../uploads/${req.files[0].filename}`);

                    return;
                });
        }
        else {
            await Accounts.create({
                id: id,
                email: req.body.email,
                username: req.body.username,
                avatar: null,
            });

            return res.status(200).end();
        }
    }
    catch (error) {
        return res.status(500).send(error.message).end();
    }
},
);

// アカウントアップデート
router.post('/update', multer({ dest: `${__dirname}/../../../uploads` }).any(), async (req, res) => {
    try {
        if (!req.body.id || !req.body.username) return res.status(400).end();

        const account = await Accounts.findByPk(req.body.id);
        // 既に存在していた場合は
        if (!account) return res.status(400).send('The specified id account does not exist').end();

        if (req.files.length > 0) {
            sharp(`${__dirname}/../../../uploads/${req.files[0].filename}`)
                .webp()
                .resize(256, 256)
                .toFile(`${__dirname}/../../../uploads/${req.files[0].filename}.webp`, async (err) => {
                    if (err) logger.logger.err(err);

                    await axios.put(`${process.env.CLOUD_HOST}remote.php/dav/files/${process.env.CLOUD_USERNAME}/${process.env.CLOUD_FOLDER}/avatars/${req.body.id}.webp`,
                        readFileSync(`${__dirname}/../../../uploads/${req.files[0].filename}.webp`),
                        {
                            auth: {
                                username: process.env.CLOUD_USERNAME,
                                password: process.env.CLOUD_PASSWORD,
                            },
                        });

                    const result = await axios.post(`${process.env.CLOUD_HOST}/ocs/v2.php/apps/files_sharing/api/v1/shares?path=/${process.env.CLOUD_FOLDER}/avatars/${req.body.id}.webp&shareType=3`,
                        '',
                        {
                            auth: {
                                username: process.env.CLOUD_USERNAME,
                                password: process.env.CLOUD_PASSWORD,
                            },
                            headers: {
                                'OCS-APIRequest': true,
                            },
                        });

                    await Accounts.update({
                        id: req.body.id,
                        username: req.body.username,
                        avatar: result.data.ocs.data.token,
                    }, {
                        where: {
                            id: req.body.id,
                        },
                    });

                    res.status(200).end();

                    unlinkSync(`${__dirname}/../../../uploads/${req.files[0].filename}.webp`);
                    unlinkSync(`${__dirname}/../../../uploads/${req.files[0].filename}`);

                    return;
                });
        }
        else {
            await Accounts.update({
                id: req.body.id,
                username: req.body.username,
                avatar: null,
            }, {
                where: {
                    id: req.body.id,
                },
            });

            return res.status(200).end();
        }
    }
    catch (error) {
        return res.status(500).send(error.message).end();
    }
},
);

router.post('/get', async (req, res) => {
    try {
        if (!req.body.email) return res.status(400).end();

        const account = await Accounts.findOne({ where: { email: req.body.email } });
        // 既に存在していない場合は
        if (!account) return res.status(404).send('The specified email account does not exist').end();

        return res.status(200).json({ id: account.id, email: account.email, username: account.username, avatar: account.avatar }).end();
    }
    catch (error) {
        return res.status(500).send(error.message).end();
    }
});

module.exports = router;
