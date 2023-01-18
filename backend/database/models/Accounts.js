/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('accounts', {
        /**
         * id
         * 衝突回避のためUUIDで
         */
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        /**
         * 生メールアドレス
         * 流石に255文字は超えんやろ(適当)
         */
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        /**
         * ユーザー名
         */
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
    });
};