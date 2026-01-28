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
