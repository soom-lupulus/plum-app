const { EightTrigram } = require('../models/index')
// 使用模糊查询需要先引入Op
const seq = require('sequelize');
const Op = seq.Op;

class EightTrigramService {
    async queryEightTrigram() {
        return await EightTrigram.findAll()
    }
}

module.exports = new EightTrigramService