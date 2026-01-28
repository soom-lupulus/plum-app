/**
 * 五行颜色计算
 * @param wuxing 颜色
 */
export const wuxingColor = wuxing => {
    const maps = {
        金: 'jin',
        木: 'mu',
        水: 'shui',
        火: 'huo',
        土: 'tu',
    }
    return maps[wuxing]
}