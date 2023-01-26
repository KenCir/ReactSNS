/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('messages', {
        /**
         * id
         * 衝突回避のためUUIDで
         */
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        /**
         * ユーザーID
         */
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        /**
         * メッセージコンテンツ
         */
        content: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
    }, {
    });
};