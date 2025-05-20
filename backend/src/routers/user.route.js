const Router = require("koa-router");
const {
    login
} = require("../controllers/user.controller");

const router = new Router({ prefix: "/user" });

router.post("/login", login);

module.exports = router;
