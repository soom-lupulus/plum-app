/*
 * @Author: yuyunhao
 * @Date: 2021-11-18 19:52:30
 * @LastEditTime: 2021-12-11 02:25:04
 * @LastEditors: yuyunhao
 * @Description:
 * @FilePath: \koaserver\src\routers\life\life.route.js
 * 代码都是复制过来的，怎么会出错
 */
const Router = require("koa-router");
const koaBody = require("koa-body");
const {
  addCase,
  getCaseList,
  deleteCase,
  editCase
} = require("../controllers/case.controller");

const router = new Router({ prefix: "/case" });

/**
 * 上传照片
 */
// router.post("/photo/upload", koaBody({ multipart: true }), upload);

router.get("/list", getCaseList);
router.post("/add", addCase);
router.post("/del", deleteCase);
router.post("/edit", editCase);

module.exports = router;
