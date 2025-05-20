const { DataTypes } = require('sequelize');
module.exports = {
    // 在这里定义模型属性
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    pazz_word: {
        type: DataTypes.STRING,
        allowNull: false
    },
}