const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
});
const Accounts = require('./models/Accounts')(sequelize, DataTypes);
const Messages = require('./models/Messages')(sequelize, DataTypes);

module.exports = {
    Accounts,
    Messages,
};