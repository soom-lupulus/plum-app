const Router = require("koa-router");
const koaBody = require("koa-body");
const {
    getTrigramInfo
} = require("../controllers/Trigram.controller");

const router = new Router({ prefix: "/trigram" });

router.get("/detail", getTrigramInfo);

module.exports = router;
