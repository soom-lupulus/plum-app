const {
  insertCase,
  queryCaseList,
  removeCase,
  amendCase,
} = require("../services/case.service");
class CaseController {
  // 获取所有案例列表
  async getCaseList(ctx, next) {
    const query = ctx.request.query;
    const user = ctx.state.user;
    const caseList = await queryCaseList(query, user.dataValues.user_id);
    console.log(caseList.length);
    ctx.body = {
      code: 200,
      msg: "查询列表成功！",
      data: caseList,
    };
    return caseList;
  }
  // 添加案例
  async addCase(ctx, next) {
    const caseObj = ctx.request.body;
    const { user_id } = ctx.state.user.dataValues;
    const insertedCase = await insertCase({ ...caseObj, user_id });
    ctx.body = {
      code: 200,
      msg: "添加成功！",
      data: insertedCase,
    };
  }
  // 删除案例
  async deleteCase(ctx, next) {
    const { id } = ctx.request.query;
    const res = await removeCase(id);
    ctx.body = {
      code: 200,
      msg: "删除成功！",
      data: res,
    };
  }
  // 修改案例
  async editCase(ctx, next) {
    const row = ctx.request.body;
    const { user_id } = ctx.state.user.dataValues;
    const amendedCase = await amendCase({...row, user_id});
    ctx.body = {
      code: 200,
      msg: "修改成功！",
      data: amendedCase,
    };
  }
}

module.exports = new CaseController();
