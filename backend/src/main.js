/*
 * @Author: yuyunhao
 * @Date: 2021-10-22 21:07:59
 * @LastEditTime: 2021-11-18 19:35:39
 * @LastEditors: yuyunhao
 * @Description: 
 * @FilePath: \koaserver\src\main.js
 * 代码都是复制过来的，怎么会出错
 */



const {APP_PORT} = require('../config/default.config')
const app = require('./app/index')

app.listen(APP_PORT, () => {
  console.log(`正在监听${APP_PORT}`);
})
