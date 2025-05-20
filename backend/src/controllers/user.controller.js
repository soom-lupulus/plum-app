const { userLogin } = require("../services/user.service");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "yggisygg"; // 请更改为您自己的密钥

class UserController {
  async login(ctx, next) {
    const userInfo = ctx.request.body;    
    const user = await userLogin(userInfo);
    console.log(JSON.stringify(user));
    
    if (user) {
      const token = jwt.sign({...user}, SECRET_KEY, {
        expiresIn: "7d",
      });
      ctx.body = {
        code: 200,
        msg: "登录成功！",
        data: {
          token,
          user,
        }
      };
      return user;
    } else {
      ctx.status = 400
      ctx.body = {
        code: 400,
        msg: "用户名或密码错误，请联系管理员！",
        data: null,
      };
    }
  }
}

module.exports = new UserController();
