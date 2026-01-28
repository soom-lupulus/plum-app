const { Trigram } = require("../models/index");
// 使用模糊查询需要先引入Op
const seq = require("sequelize");
const Op = seq.Op;

class TrigramService {
  async queryTrigram(trigram_num) {
    try {
      return await Trigram.findByPk(trigram_num);
    } catch (error) {
      console.error("具体的 SQL 错误是：", error.message); // 这行会告诉你到底是表不存在还是字段不对
    }
  }
}

module.exports = new TrigramService();
