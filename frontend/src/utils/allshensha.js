import { gande, ludu, lushen, muyu, ridao, tiandao, tianzei, wenchang, yangren, youdu } from './rigansha'
/**
 * 
 * @param {string} ganzhi 传干支：乙巳 壬午 癸亥 己未
 */
export const allshensha = (ganzhi) => {
    const ganzhiArr = ganzhi.split(' ')
    const ganzhiobj = {
        gan: {
            year: ganzhiArr[0][0],
            month: ganzhiArr[1][0],
            day: ganzhiArr[2][0],
            hour: ganzhiArr[3][0],
        },
        zhi: {
            year: ganzhiArr[0][1],
            month: ganzhiArr[1][1],
            day: ganzhiArr[2][1],
            hour: ganzhiArr[3][1],
        }
    }
    const seasonMap = {
        spring: '寅卯辰',
        summer: '巳午未',
        autumn: '申酉戌',
        winter: '亥子丑',
    }
    const season = (() => {
        const s = ganzhiobj.zhi.month
        for (const ss in seasonMap) {
            if (seasonMap[ss].includes(s)) {
                return ss
            }
        }
        return null
    })()

    const _zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    const nainshaMap = ['太岁', '太阳', '丧门', '六合', '官符', '小耗', '大耗', '岁墓', '岁虎', '福德', '吊客', '病符']
    const currentnianzhiIndex = _zhi.findIndex(j => j === ganzhiobj.zhi.year)
    const currentyuezhiIndex = _zhi.findIndex(j => j === ganzhiobj.zhi.month)
    // 元辰 阳男阴女冲前，阴男阳女在冲后
    // 三煞：劫煞、灾煞、岁煞
    const zaisha = nianzhi => {
        const matchGroups = {
            申子辰: '午',
            亥卯未: '酉',
            巳酉丑: '卯',
            寅午戌: '子',
        }
        return matchGroups[Object.keys(matchGroups).find(i => i.includes(ganzhiobj.zhi.year))]
    }

    // 季煞
    const jishaMap = {
        天赦: ['戊寅', '甲午', '戊申', '甲子'],
        孤辰: ['巳', '申', '亥', '寅'],
        寡宿: ['丑', '辰', '未', '戌'],
        天喜: ['戌', '丑', '辰', '未'],
        天耳: ['戌', '丑', '辰', '未'],
        火鬼: ['午', '酉', '子', '卯'],
        浴盆: ['辰', '未', '戌', '丑'],
        天目: ['辰', '未', '戌', '丑'],
        龙神: ['辰', '未', '戌', '丑'],
        皇书: ['寅', '巳', '申', '亥'],
        转煞: ['卯', '午', '酉', '子'],
    }
    // 月煞
    const yueshaMap = ['月建', '天龙', '天医', '死神', '死气', '', '月破', '', '地医', '', '生气', '血支']
    // 日煞
    const rishazhiMap = {
        申子辰: '寅亥巳辰酉子',
        亥卯未: '巳寅申未子卯',
        巳酉丑: '亥申寅丑午酉',
        寅午戌: '申巳亥戌卯午'
    }
    const rishaMap = ['驿马', '亡神', '劫煞', '华盖', '桃花', '将星']
    const riganshaArr = [
        ['干禄', lushen(ganzhiobj.gan.day)],
        ['阳刃', yangren(ganzhiobj.gan.day)],
        ['文昌', wenchang(ganzhiobj.gan.day)],
        ['沐浴', muyu(ganzhiobj.gan.day)],
        ['干德', gande(ganzhiobj.gan.day)],
        ['游都', youdu(ganzhiobj.gan.day)],
        ['鲁都', ludu(ganzhiobj.gan.day)],
        ['天盗', tiandao(ganzhiobj.gan.day)],
        // ['日盗', ridao(ganzhiobj.gan.day)],
        ['天贼', tianzei(ganzhiobj.gan.day)],
    ]
    return {
        niansha: nainshaMap.map((i, index) => {
            return [i, _zhi[(currentnianzhiIndex + index) % 12]]
        }).concat([['灾煞', zaisha(ganzhiobj.zhi.year)]]),
        jisha: Object.entries(jishaMap).map(item => {
            const currentSeason = {
                spring: 0,
                summer: 1,
                autumn: 2,
                winter: 3,
            }
            return [item[0], item[1][currentSeason[season]]]
        }),
        yuesha: yueshaMap.map((i, index) => {
            return [i, _zhi[(currentyuezhiIndex + index) % 12]]
        }).filter(j => j[0]),
        risha: rishaMap.map((i, index) => {
            return [i, rishazhiMap[Object.keys(rishazhiMap).find(j => j.includes(ganzhiobj.zhi.day))][index]]
        }).concat(riganshaArr)
    }
}