/*
 * @Author: yuyunhao
 * @Date: 2021-11-18 20:48:25
 * @LastEditTime: 2021-11-18 21:30:04
 * @LastEditors: yuyunhao
 * @Description: 
 * @FilePath: \koaserver\src\services\life\photo\life.photo.service.js
 * 代码都是复制过来的，怎么会出错
 */
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
            }
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
    // async upload(name, files) {
    //     try {
    //         const readStream = fs.createReadStream(files.path)
    //         const filePath = path.join(process.cwd(), '/static/upload/')
    //         console.log(filePath);
    //         if (!fs.existsSync(filePath)) {
    //             console.log('不存在');
    //             // 创建文件夹  
    //         }
    //         const fileResource = filePath + `/${files.name}`
    //         const writeStream = fs.createWriteStream(fileResource)
    //         readStream.pipe(writeStream)
    //         return { success: 666 }
    //     } catch (error) {
    //         console.log(error);
    //         return error
    //     }

    // }
}

module.exports = new CaseService