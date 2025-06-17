import { ref, watch } from 'vue'
import * as shenshaUtils from '@/utils/shensha'
const useShensha = (rigan, dizhi) => {
  const data = ref([])

  /**-------吉神 */
  // 天乙贵人
  const onTianyiguiren = Boolean(shenshaUtils.tianyiguiren(rigan, dizhi))
  // 日禄：（临官之位）：财运、俸禄、福气。
  const onRilu = Boolean(shenshaUtils.lushen(rigan, dizhi))
  // 桃花
  const onTaohua = Boolean(shenshaUtils.taohua(rigan, dizhi))
  // 文昌
  const onWenchang = Boolean(shenshaUtils.wenchang(rigan, dizhi))
  // 华盖
  const onHuagai = Boolean(shenshaUtils.huagai(rigan, dizhi))

  /**-------凶神 */
  // 天罗
  const onTianluo = Boolean(shenshaUtils.tianluo(rigan, dizhi))
  // 地网
  const onDiwang = Boolean(shenshaUtils.diwang(rigan, dizhi))
  // 羊刃：（帝旺）：极端力量（吉为强，凶为暴）。
  const onYangren = Boolean(shenshaUtils.yangren(rigan, dizhi))
  // 灾煞：（冲克太岁）：血光、横灾。
  const onZaisha = Boolean(shenshaUtils.zaisha(rigan, dizhi))
  // 劫煞：意外灾祸、突发不顺。
  const onJiesha = Boolean(shenshaUtils.jiesha(rigan, dizhi))
  // 孤辰：孤独、六亲缘薄。
  const onGuchen = Boolean(shenshaUtils.gucheng(rigan, dizhi))
  // 寡宿：孤独、六亲缘薄。
  const onGuasu = Boolean(shenshaUtils.guashu(rigan, dizhi))
  // 勾绞煞：纠缠、拖累、口舌。

  /**------其他 */
  // 驿马
  const onYima = Boolean(shenshaUtils.yima(rigan, dizhi))
  // 将星：领导力、权威、事业成就。
  const onJiangxing = Boolean(shenshaUtils.jiangxing(rigan, dizhi))
  // 亡神：心神不安、遗失。
  const onWangshen = Boolean(shenshaUtils.wangshen(rigan, dizhi))
  // 天医
  const onTianyi = Boolean(shenshaUtils.tianyi(rigan, dizhi))

  data.value = [
    {
      name: '驿马',
      good: true,
      on: onYima,
      desc: `申子辰马在寅, 寅午戌马在申,\n巳酉丑马在亥, 亥卯未马在巳.\n查法：以年、日支查余三支`
    },
    {
      name: '天乙贵人',
      good: true,
      on: onTianyiguiren,
      desc: '甲戊并牛羊,乙己鼠猴乡,\n丙丁猪鸡位,壬癸兔蛇藏,\n庚辛逢虎马,此是贵人方.\n查法: 以日干年干起贵人, 地支见者为是'
    },
    {
      name: '禄神',
      good: true,
      on: onRilu,
      desc: '甲禄在寅,乙禄在卯, \n丙戊禄在巳,丁己禄在午,\n庚禄在申,辛禄在酉,\n壬禄在亥,癸禄在子.\n查法: 以日干查四支, 见之者为是.'
    },
    {
      name: '桃花',
      good: true,
      on: onTaohua,
      desc: '申子辰在酉,寅午戌在卯,\n巳酉丑在午,亥卯未在子.\n查法: 以年支或日支查四柱其它地支.'
    },
    {
      name: '文昌',
      good: true,
      on: onWenchang,
      desc: '甲乙巳午报君知, 丙戊申宫丁己鸡.\n庚猪辛鼠壬逢虎, 癸人见卯入云梯.\n查法: 以年干或日干为主,\n凡四柱中地支所见者为是'
    },
    {
      name: '华盖',
      good: true,
      on: onHuagai,
      desc: '寅午戌见戌, 亥卯未见未,\n申子辰见辰, 巳酉丑见丑.\n查法：以年支或日支为主,\n凡四柱中所见者为有华盖星.'
    },
    {
      name: '天罗',
      good: false,
      on: onTianluo,
      desc: '查法一：以年支/日支查余三支\n戌亥为天罗，辰巳为地网；\n戌见亥, 亥见戌为天罗；\n辰见巳, 巳见辰为地网。\n查法二：以年纳音查日支\n火命人逢戌亥为天罗, \n水土命逢辰巳为地网.\n采用查法一。'
    },
    {
      name: '地网',
      good: false,
      on: onDiwang,
      desc: '查法一：以年支/日支查余三支\n戌亥为天罗，辰巳为地网；\n戌见亥, 亥见戌为天罗；辰见巳, 巳见辰为地网。\n查法二：以年纳音查日支\n火命人逢戌亥为天罗, 水土命逢辰巳为地网.'
    },
    {
      name: '羊刃',
      good: false,
      on: onYangren,
      desc: '甲羊刃在卯, 乙羊刃在寅,\n丙戊羊刃在午, 丁己羊刃在巳,\n庚羊刃在酉, 辛羊刃在申,\n壬羊刃在子, 癸羊刃在亥.\n查法: 以日干为主, 四支见之者为是.'
    },
    {
      name: '灾煞',
      good: false,
      on: onZaisha,
      desc: '申子辰见午, 亥卯未见酉,\n寅午戌见子, 巳酉丑见卯.\n查法: 以年支为主, 四柱地支中见之者为是.'
    },
    {
      name: '劫煞',
      good: false,
      on: onJiesha,
      desc: '申子辰见巳, 亥卯未见申,\n寅午戌见亥, 巳酉丑见寅.\n查法: 以年柱或日柱为主, 四柱地支见之者为是.'
    },
    {
      name: '孤辰',
      good: false,
      on: onGuchen,
      desc: '亥子丑人, 见寅为孤, 见戌为寡.\n寅卯辰人, 见巳为孤, 见丑为寡.\n巳午未人, 见申为孤, 见辰为寡\n申酉戌人, 见亥为孤, 见未为寡.\n查法: 以年支为准, 四柱其它地支见者为是. 如巳年生人, 见申为孤辰, 见辰为寡宿.'
    },
    {
      name: '寡宿',
      good: false,
      on: onGuasu,
      desc: '亥子丑人, 见寅为孤, 见戌为寡.\n寅卯辰人, 见巳为孤, 见丑为寡.\n巳午未人, 见申为孤, 见辰为寡\n申酉戌人, 见亥为孤, 见未为寡.\n查法: 以年支为准, 四柱其它地支见者为是. 如巳年生人, 见申为孤辰, 见辰为寡宿.'
    },
    {
      name: '将星',
      good: true,
      on: onJiangxing,
      desc: ''
    },
    {
      name: '亡神',
      good: false,
      on: onWangshen,
      desc: '寅午戌见巳, 亥卯未见寅,\n巳酉丑见申, 申子辰见亥.\n查法: 以年日支查余三支.'
    },
    {
      name: '天医',
      good: true,
      on: onTianyi,
      desc: '寅见丑，卯见寅，辰见卯，巳见辰，\n午见巳，未见午，申见未，酉见申，\n戌见酉，亥见戌，子见亥，丑见子\n查法: 以月支查其它地支, 见者为是.'
    }
    // {
    //     name: '勾绞煞',
    //     good: false,
    //     on: onYima,
    //     desc: ''
    // },
  ]

  return data
}

export default useShensha
