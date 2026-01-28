const { queryTrigram } = require("../services/trigram.service");
class TrigramController {
    // 获取卦的详情
    async getTrigramInfo(ctx, next) {
        const query = ctx.request.query
        const trigramInfo = await queryTrigram(query.trigram_num)
        ctx.body = {
            code: 200,
            msg: '查询成功！',
            data: trigramInfo,
        };
        return trigramInfo;
    }
}

module.exports = new TrigramController();
