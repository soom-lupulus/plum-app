const fs = require('fs');
const path = require('path');

const { DB_HOST, DB_PORT, DB_NAME, BASE_URL } = require('../../config/default.config');
const { Case } = require('../models/index')
// const { context } = require('../../../app');
// 使用模糊查询需要先引入Op
const seq = require('sequelize');
const Op = seq.Op;

class CaseService {
    async queryCaseList({ problem = '' }, user_id) {
        return await Case.findAll({
            where: {
                problem: {
                    [Op.like]: `%${problem}%`
                },
                user_id
            },
            order: [['createdAt', 'DESC']]
        })
        
    }
    async insertCase(example) {
        return await Case.create(example);
    }
    async removeCase(id) {
        const toBeRemoved = await Case.findByPk(id);
        return await toBeRemoved.destroy()
        // SELECT * FROM post WHERE authorId = 2;
    }
    async amendCase(row) {
        const toBeAmended = await Case.findByPk(row.id);
        return await toBeAmended.update(row)
    }
}

module.exports = new CaseService