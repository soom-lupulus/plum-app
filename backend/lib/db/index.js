const { Sequelize } = require('sequelize');
const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } = require('../../config/default.config')

const connect = async () => {
    // 连接数据库
    try {
        const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            dialect: 'mysql'
        });
        await sequelize.authenticate();
        console.log('链接成功!!!!');
        return sequelize
    } catch (error) {
        return error
    }

}

const close = async sequelize => {
    console.log(sequelize);
    await sequelize.close()
    console.log('数据库已关闭');
}

exports.connect = connect
exports.close = close
