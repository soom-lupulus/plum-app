const { DataTypes } = require('sequelize');
module.exports = {
    // 在这里定义模型属性
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    problem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    origin_trigram: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mid_trigram: {
        type: DataTypes.STRING,
    },
    final_trigram: {
        type: DataTypes.STRING,
    },
    shift_yao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    d_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.INTEGER,
    },
    gz_time: {
        type: DataTypes.STRING,
    },
    prediction: {
        type: DataTypes.STRING,
    },
    result: {
        type: DataTypes.STRING,
    },
    hint: {
        type: DataTypes.STRING,
    },
    pre_desc: {
        type: DataTypes.STRING,
    },
    correct: {
        type: DataTypes.INTEGER,
    },
    rethink: {
        type: DataTypes.STRING,
    },
    outside_react: {
        type: DataTypes.STRING,
    },
    // 节气
    solarTerm: {
        type: DataTypes.STRING,
    },
    // 卦式：先后天
    category: {
        type: DataTypes.INTEGER,
    },
    // 空亡
    missing: {
        type: DataTypes.STRING,
    },
    // 简单易懂的精确时间
    c_time: {
        type: DataTypes.STRING,
    },
    user_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
}