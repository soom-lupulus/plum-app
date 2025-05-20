const { queryEightTrigram } = require("../services/EightTrigram.service");
class EightTrigramController {
    // 获取八卦的详情
    async getEightTrigramInfo(ctx, next) {
        const query = ctx.request.query
        const eightTrigramInfo = await queryEightTrigram()
        ctx.body = {
            code: 200,
            msg: '查询成功！',
            data: eightTrigramInfo,
        };
        return eightTrigramInfo;
    }
}

module.exports = new EightTrigramController();
