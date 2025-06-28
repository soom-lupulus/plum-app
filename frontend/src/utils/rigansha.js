/**
 * 天贼
 * @param rigan 日干
 * @return
 */
function tianzei(rigan) {
    const matchPairs = {
        甲: '辰',
        乙: '午',
        丙: '申',
        丁: '亥',
        戊: '寅',
        己: '辰',
        庚: '午',
        辛: '申',
        壬: '亥',
        癸: '寅'
    }
    return matchPairs[rigan]
}
/**
 * 日盗
 * @param rigan 日干
 * @return
 */
function ridao(rigan) {
    const matchPairs = {
        甲: '子',
        乙: '亥',
        丙: '卯',
        丁: '申',
        戊: '巳',
        己: '子',
        庚: '亥',
        辛: '卯',
        壬: '申',
        癸: '巳'
    }
    return matchPairs[rigan]
}
/**
 * 天盗
 * @param rigan 日干
 * @return
 */
function tiandao(rigan) {
    const matchPairs = {
        甲: '子',
        乙: '亥',
        丙: '卯',
        丁: '申',
        戊: '巳',
        己: '子',
        庚: '亥',
        辛: '卯',
        壬: '申',
        癸: '巳'
    }
    return matchPairs[rigan]
}
/**
 * 鲁都
 * @param rigan 日干
 * @return
 */
function ludu(rigan) {
    const matchPairs = {
        甲: '未',
        乙: '午',
        丙: '申',
        丁: '亥',
        戊: '寅',
        己: '未',
        庚: '午',
        辛: '申',
        壬: '亥',
        癸: '寅'
    }
    return matchPairs[rigan]
}
/**
 * 游都
 * @param rigan 日干
 * @return
 */
function youdu(rigan) {
    const matchPairs = {
        甲: '丑',
        乙: '子',
        丙: '寅',
        丁: '巳',
        戊: '申',
        己: '丑',
        庚: '子',
        辛: '寅',
        壬: '巳',
        癸: '申'
    }
    return matchPairs[rigan]
}

/**
 * 干德
 * @param rigan 日干
 * @return
 */
function gande(rigan) {
    const matchPairs = {
        甲: '寅',
        乙: '申',
        丙: '巳',
        丁: '亥',
        戊: '巳',
        己: '寅',
        庚: '申',
        辛: '巳',
        壬: '亥',
        癸: '巳'
    }
    return matchPairs[rigan]
}
/**
 * 禄神:
 * 甲禄在寅, 乙禄在卯, 丙戊禄在巳, 丁己禄在午, 庚禄在申, 辛禄在酉, 壬禄在亥, 癸禄在子.
 * 查法: 以日干查四支, 见之者为是.
 *
 * @param rigan 日干
 * @return
 */
function lushen(rigan) {
    const matchPairs = {
        甲: '寅',
        乙: '卯',
        丙: '巳',
        丁: '午',
        戊: '巳',
        己: '午',
        庚: '申',
        辛: '酉',
        壬: '亥',
        癸: '子'
    }
    return matchPairs[rigan]
}

/**
 * 羊刃:
 *  甲羊刃在卯, 乙羊刃在寅,
 *  丙戊羊刃在午, 丁己羊刃在巳,
 *  庚羊刃在酉, 辛羊刃在申,
 *  壬羊刃在子, 癸羊刃在亥.
 * 查法: 以日干为主, 四支见之者为是.
 *
 * @param rigan 日干
 * @return
 */
function yangren(rigan) {
    const matchPairs = {
        甲: '卯',
        乙: '寅',
        丙: '午',
        丁: '巳',
        戊: '午',
        己: '巳',
        庚: '酉',
        辛: '申',
        壬: '子',
        癸: '亥'
    }

    return matchPairs[rigan]
}

/**
 * 文昌贵人:
 * 甲乙巳午报君知, 丙戊申宫丁己鸡.
 * 庚猪辛鼠壬逢虎, 癸人见卯入云梯.
 *
 * 查法: 以年干或日干为主, 凡四柱中地支所见者为是
 *
 * @param rigan 年干/日干
 * @return
 */
function wenchang(rigan) {
    const matchPairs = {
        甲: '巳',
        乙: '午',
        丙: '申',
        丁: '酉',
        戊: '申',
        己: '酉',
        庚: '亥',
        辛: '子',
        壬: '寅',
        癸: '卯'
    }
    return matchPairs[rigan]
}

function muyu(rigan) {
    const matchPairs = {
        甲: '子',
        乙: '巳',
        丙: '卯',
        丁: '申',
        戊: '卯',
        己: '申',
        庚: '午',
        辛: '亥',
        壬: '酉',
        癸: '寅'
    }
    return matchPairs[rigan]
}

export {
    tianzei,
    ridao,
    tiandao,
    ludu,
    youdu,
    gande,
    lushen,
    yangren,
    wenchang,
    muyu
}