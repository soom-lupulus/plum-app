const { Trigram } = require('../models/index')
// 使用模糊查询需要先引入Op
const seq = require('sequelize');
const Op = seq.Op;

class TrigramService {
    async queryTrigram(trigram_num) {
        return await Trigram.findByPk(trigram_num)
    }
}

module.exports = new TrigramService