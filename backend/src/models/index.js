const { Sequelize } = require('sequelize');
const { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD } = require('../../config/default.config')
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
});
const CaseType = require('./case')
const TrigramType = require('./trigram')
const EightTrigramType = require('./eightTrigram')
const UserType = require('./user')

const Case = sequelize.define('Case', CaseType, {
    // 这是其他模型参数
    tableName: 'd_case'
});

const Trigram = sequelize.define('Trigram', TrigramType, {
    tableName: 'trigram'
})

const EightTrigram = sequelize.define('EightTrigram', EightTrigramType, {
    tableName: 'eight_trigram',
    timestamps: false
})

const User = sequelize.define('User', UserType, {
    tableName: 'user',
    timestamps: false
})

Case.sync({ alter: true })
Trigram.sync({ alter: true })
EightTrigram.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
    Case,
    Trigram,
    EightTrigram,
    User
}