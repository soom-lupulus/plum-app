const Router = require("koa-router");
const koaBody = require("koa-body");
const {
    getEightTrigramInfo
} = require("../controllers/eightTrigram.controller");

const router = new Router({ prefix: "/eight" });

router.get("/detail", getEightTrigramInfo);

module.exports = router;
