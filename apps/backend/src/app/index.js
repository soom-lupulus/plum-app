const path = require("path");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
const jsonerror = require("koa-json-error");
const cors = require("@koa/cors");
const jwt = require("koa-jwt");
const { historyApiFallback } = require("koa2-connect-history-api-fallback");

const { connect, close } = require("../../lib/db/index");

// 路由
const caseRouter = require("../routers/case.route");
const trigramRouter = require("../routers/trigram.route");
const eightTrigramRouter = require("../routers/eightTrigram.route");
const userRouter = require("../routers/user.route");

const app = new Koa();

app
  .use(cors())
  .use(bodyParser())
  .use(jsonerror())
  // 1. 静态资源托管：必须放在 JWT 之前，这样访问页面和图片就不需要 Token
  .use(static(path.join(__dirname, "../../public")))

  // 2. 数据库连接（用连接池）
  .use(async (context, next) => {
    await next();
  })

  // 3. JWT 校验：放在静态资源之后，只保护后面的 API 路由
  .use(
    jwt({ secret: "yggisygg" }).unless({
      path: [
        /^\/user/, // 登录注册接口
        /^\/public/, // 如果你有公共资源
        /^\/manifest\.webmanifest$/, // PWA 必须放行
        /^\/sw\.js$/, // PWA 必须放行
      ],
    }),
  )

  // 4. 路由处理
  .use(caseRouter.routes())
  .use(trigramRouter.routes())
  .use(eightTrigramRouter.routes())
  .use(userRouter.routes())

  // 5. History Fallback：最后兜底，如果前面的路由和静态资源都没匹配到，再返回 index.html
  // 注意：放在最后是为了不干扰 API 接口的 404
  .use(historyApiFallback({ whiteList: ["/api"] }));

module.exports = app;
