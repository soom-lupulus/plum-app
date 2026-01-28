const { User } = require('../models/index')
// 使用模糊查询需要先引入Op
const seq = require('sequelize');
const Op = seq.Op;

class UserService {
    async userLogin({userName, passWord}) {
        return await User.findOne({
            where: {
                user_name: userName,
                pazz_word: passWord
            }
        })
    }
}

module.exports = new UserService