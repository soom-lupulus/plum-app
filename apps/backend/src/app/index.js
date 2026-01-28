const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static')
const jsonerror = require('koa-json-error')
const cors = require('@koa/cors');
const jwt = require('koa-jwt');

const { connect, close } = require('../../lib/db/index')

// 路由
const caseRouter = require('../routers/case.route')
const trigramRouter = require('../routers/trigram.route')
const eightTrigramRouter = require('../routers/eightTrigram.route')
const userRouter = require('../routers/user.route')

const app = new Koa();
app
  .use(cors())
  .use(async (context, next) => {
    const sequelize = await connect()
    await next()
    // await close(sequelize)
  })
  .use(jsonerror())
  .use(bodyParser())
  .use(static(path.join(__dirname)))
  .use(jwt({ secret: 'yggisygg' }).unless({ path: [/^\/user/] }))
  .use(caseRouter.routes())
  .use(caseRouter.allowedMethods())
  .use(trigramRouter.routes())
  .use(trigramRouter.allowedMethods())
  .use(eightTrigramRouter.routes())
  .use(eightTrigramRouter.allowedMethods())
  .use(userRouter.routes())
  .use(userRouter.allowedMethods())

module.exports = app