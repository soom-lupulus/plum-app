const { DataTypes } = require("sequelize");
module.exports = {
    // 在这里定义模型属性
    trigram_name: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    pre_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    after_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    thing: {
        type: DataTypes.STRING,
    },
    zh_name: {
        type: DataTypes.STRING,
    },
    wuxing: {
        type: DataTypes.STRING,
    },
    gan: {
        type: DataTypes.STRING,
    },
    zhi: {
        type: DataTypes.STRING,
    },
    yao_yy: {
        type: DataTypes.STRING,
    },
    yy: {
        type: DataTypes.INTEGER,
    },
    inner_nj: {
        type: DataTypes.STRING,
    },
    outer_nj: {
        type: DataTypes.STRING,
    },
    // createdAt: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.DATE, // 使用当前时间戳
    //     allowNull: false
    // },
    // updatedAt: {
    //     type: DataTypes.DATE,
    //     defaultValue: DataTypes.DATE,
    //     allowNull: false
    // },
};
