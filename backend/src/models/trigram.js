const { DataTypes } = require('sequelize');
module.exports = {
    // 在这里定义模型属性
    trigram_num: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    trigram: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mid_trigram: {
        type: DataTypes.STRING,
        allowNull: false
    },
    final_trigram_1: {
        type: DataTypes.STRING,
    },
    final_trigram_2: {
        type: DataTypes.STRING,
    },
    final_trigram_3: {
        type: DataTypes.STRING,
    },
    final_trigram_4: {
        type: DataTypes.STRING,
    },
    final_trigram_5: {
        type: DataTypes.STRING,
    },
    final_trigram_6: {
        type: DataTypes.STRING,
    },
    final_trigram_e: {
        type: DataTypes.STRING,
    },
    reverse_trigram: {
        type: DataTypes.STRING,
    },
    rotate_trigram: {
        type: DataTypes.STRING,
    },
    trigram_content: {
        type: DataTypes.STRING,
    },
    yao_content_1: {
        type: DataTypes.STRING,
    },
    yao_content_2: {
        type: DataTypes.STRING,
    },
    yao_content_3: {
        type: DataTypes.STRING,
    },
    yao_content_4: {
        type: DataTypes.STRING,
    },
    yao_content_5: {
        type: DataTypes.STRING,
    },
    yao_content_6: {
        type: DataTypes.STRING,
    },
    yao_content_e: {
        type: DataTypes.STRING,
    },
    trigram_home: {
        type: DataTypes.STRING,
    },
    yao_content_baihua_1: {
        type: DataTypes.STRING,
    },
    yao_content_baihua_2: {
        type: DataTypes.STRING,
    },
    yao_content_baihua_3: {
        type: DataTypes.STRING,
    },
    yao_content_baihua_4: {
        type: DataTypes.STRING,
    },
    yao_content_baihua_5: {
        type: DataTypes.STRING,
    },
    yao_content_baihua_6: {
        type: DataTypes.STRING,
    },
}