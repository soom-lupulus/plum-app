<script setup>
import { ref, computed } from 'vue'
import { wuxingColor } from '@/utils'
import { ZHI, SHISHEN_LIUYAO } from '@/utils/const'

const props = defineProps({
    modalMode: String,
    formData: Object,
    currentEightTrigram: Array,
    trigramInfo: Object,
    eightTrigramArr: Array
})

const currentActiveTrigram = ref('zhu')
const yao_str = computed(() => (index, yIndex) => {
    return +(props.currentEightTrigram[index]?.yao_yy[yIndex]) ? '▀▀▀' : '▀\u00a0\u00a0\u00a0▀'
})

console.log(props.formData);


/**
 * 六爻纳甲计算
 */
const calc_nj = computed(() => (gua, yao, iszhugua = true) => {
    if (!props.trigramInfo) return [];
    // 拿到卦宫五行
    const gong_wuxing = props.eightTrigramArr.find(i => i.trigram_name === props.trigramInfo.zhu.trigram_home)?.wuxing

    let str = ''
    if (yao > 5 || yao < 0) throw '爻位错误'
    if (yao > 2) {
        if (iszhugua) {
            str = gua[0]?.outer_nj.split('')[yao - 3]
        } else {
            str = gua[4]?.outer_nj.split('')[yao - 3]
        }
    }
    else {
        if (iszhugua) {
            str = gua[1]?.inner_nj.split('')[yao]

        } else {
            str = gua[5]?.inner_nj.split('')[yao]
        }
    }
    const zhi_wuxing = ZHI[str].wuxing
    const shishen = SHISHEN_LIUYAO[gong_wuxing][ZHI[str].wuxing]
    return [str, zhi_wuxing, shishen]
})

// 世爻
const yao_shi = computed(() => {
    return props.trigramInfo?.zhu.yao_shi
})

// 应爻
const yao_ying = computed(() => {
    if (props.trigramInfo) return (props.trigramInfo.zhu.yao_shi + 3) % 6
    return -1
})

/**
 * 六神
 * 甲乙起青龙，丙丁起朱雀，戊起勾陈，己起螣蛇，庚辛起白虎，壬癸起玄武
 */
const six_god = computed(() => (yao_num) => {
    console.log(yao_num);

    const ganzhi = props.formData.gz_time
    if (!ganzhi) return ''
    const rizhu = ganzhi.split(' ')[2]
    const rigan = rizhu.charAt(0)
    console.log(rigan);

    const sg_map = {
        甲: '青龙',
        乙: '青龙',
        丙: '朱雀',
        丁: '朱雀',
        戊: '勾陈',
        己: '螣蛇',
        庚: '白虎',
        辛: '白虎',
        壬: '玄武',
        癸: '玄武',
    }
    const arr = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武']

    const index = arr.findIndex(i => i === sg_map[rigan])

    return arr[(index + yao_num) % arr.length]
})

</script>

<template>
    <tfoot>
        <tr>
            <td colspan="20">
                <div class="gua_box">
                    <div class="zhugua" @click="currentActiveTrigram = 'zhu'">
                        <p :class="{ shiftYaoCi: currentActiveTrigram === 'zhu' }">【主卦】</p>
                        <p>{{ props.formData.origin_trigram }}</p>
                        <div v-for="(item, i) in 6" v-bind:key="i"
                            :class="{ shiftYao: props.formData.shift_yao === 6 - (+i), shiYao: yao_shi === 6 - Number(i), yingYao: yao_ying === 6 - Number(i) }">
                            <span class="small_size">{{ six_god(6 - item) }}</span>
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 6 - item)[2] }}</span>
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 6 - item)[0] }}</span>
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 6 - item)[1] }}</span>
                            <span class="yao_item">{{ yao_str(~~(i / 3), i % 3) }}</span>
                        </div>
                        <p>{{ trigramInfo?.zhu.trigram_home }}宫</p>
                        <!-- <div v-for="(item, i) in 3">{{ currentEightTrigram[1].yao_yy[i] ? '▀▀▀▀▀' : '▀▀&nbsp;&nbsp;&nbsp;▀▀'}}</div> -->
                    </div>
                    <div class="hugua" @click="currentActiveTrigram = 'hu'">
                        <p :class="{ shiftYaoCi: currentActiveTrigram === 'hu' }">【互卦】</p>
                        <p>{{ props.formData.mid_trigram }}</p>
                        <div v-for="(item, i) in 3" :key="i">
                            <span class="yao_item">{{ yao_str(2, i) }}</span>
                        </div>
                        <div v-for="(item, i) in 3" :key="i">
                            <span class="yao_item">{{ yao_str(3, i) }}</span>
                        </div>
                        <p>{{ trigramInfo?.hu.trigram_home }}宫</p>

                    </div>
                    <div class="biangua" @click="currentActiveTrigram = 'bian'">
                        <p :class="{ shiftYaoCi: currentActiveTrigram === 'bian' }">【变卦】
                        </p>
                        <p>{{ props.formData.final_trigram }}</p>
                        <div v-for="(item, i) in 3" :key="i">
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 6 - item, false)[2] }}</span>
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 6 - item, false)[0] }}</span>
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 6 - item, false)[1] }}</span>
                            <span class="yao_item">{{ yao_str(4, i) }}</span>
                        </div>
                        <div v-for="(item, i) in 3" :key="i">
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 3 - item, false)[2] }}</span>
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 3 - item, false)[0] }}</span>
                            <span class="small_size">{{ calc_nj(currentEightTrigram, 3 - item, false)[1] }}</span>
                            <span class="yao_item">{{ yao_str(5, i) }}</span>
                        </div>
                        <p>{{ trigramInfo?.bian.trigram_home }}宫</p>

                    </div>
                </div>
                <!-- <div>五行旺衰</div> -->
                <div class="wangshuaiWrapper">
                    <div>
                        <div :class="wuxingColor(currentEightTrigram[0]?.wuxing)">{{
                            currentEightTrigram[0]?.wuxing
                        }}</div>
                        <div :class="wuxingColor(currentEightTrigram[1]?.wuxing)">{{
                            currentEightTrigram[1]?.wuxing
                        }}</div>
                    </div>
                    <div>
                        <div :class="wuxingColor(currentEightTrigram[2]?.wuxing)">{{
                            currentEightTrigram[2]?.wuxing
                        }}</div>
                        <div :class="wuxingColor(currentEightTrigram[3]?.wuxing)">{{
                            currentEightTrigram[3]?.wuxing
                        }}</div>
                    </div>
                    <div>
                        <div :class="wuxingColor(currentEightTrigram[4]?.wuxing)">{{
                            currentEightTrigram[4]?.wuxing
                        }}</div>
                        <div :class="wuxingColor(currentEightTrigram[5]?.wuxing)">{{
                            currentEightTrigram[5]?.wuxing
                        }}</div>
                    </div>
                </div>
                <!-- <p>爻辞</p> -->
                <div class="word_box">
                    <article>
                        {{ trigramInfo?.[currentActiveTrigram].trigram_content }}
                    </article>
                    <article>

                        <p v-for="i in 6" :key="i" :class="{ shiftYaoCi: props.formData.shift_yao === i }">
                            <n-popover trigger="click" :width="250">
                                <template #trigger>
                                    <span>{{
                                        trigramInfo?.[currentActiveTrigram][`yao_content_${i}`] }}</span>
                                </template>
                                <span>{{
                                    trigramInfo?.[currentActiveTrigram][`yao_content_baihua_${i}`] }}</span>
                            </n-popover>
                        </p>
                    </article>
                </div>
            </td>
        </tr>
    </tfoot>
</template>

<style scoped>
.shiftYao {
    color: red;
    position: relative;

    &::before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: rgb(52, 135, 243);
        position: absolute;
        left: -20px;
        top: 0.35rem;
    }
}

.shiYao {
    position: relative;

    &::after {
        content: '世';
        display: inline-block;
        position: absolute;
        right: -1rem;
        top: 0.1rem;
        font-size: 0.7rem;
    }
}

.yingYao {
    position: relative;

    &::after {
        content: '应';
        display: inline-block;
        position: absolute;
        right: -1rem;
        top: 0.1rem;
        font-size: 0.7rem;
    }
}

.small_size {
    font-size: 0.7rem;
}

.shiftYaoCi {
    color: red;
    font-weight: bold;
}

tfoot th {
    text-align: right;
}

tfoot td {
    font-weight: bold;
    text-align: center;
}

.wangshuaiWrapper {
    display: flex;
    justify-content: space-evenly;
    font-size: 1.5rem;

    div {
        font-weight: bold;
    }
}

.gua_box {
    display: flex;
    justify-content: space-evenly;
    cursor: pointer;
}

.word_box {
    padding-top: 10px;

    article {
        display: flex;
        flex-direction: column;
        word-wrap: break-word;
        text-align: start;

        >p {
            padding: 2px 0;
        }
    }
}

.yao_item {
    vertical-align: sub;
    margin-left: 3px;
}

th,
td {
    border: 1px solid rgb(160 160 160);
    padding: 0.5rem 0.5rem;
    text-align: center;
}

@media screen and (320px <=width < 375px) {
    .wangshuaiWrapper {
        font-size: 1rem;
    }
}

@media screen and (375px <=width < 425px) {
    .wangshuaiWrapper {
        font-size: 1.5rem;
    }
}

@media screen and (425px <=width < 768px) {
    .wangshuaiWrapper {
        font-size: 1.5rem;
    }

    .shiftYao::before {
        top: 0.6rem;
    }

    .small_size {
        font-size: 0.8rem;
    }

    .shiYao::after {
        top: 0.2rem;
        font-size: 0.8rem;
    }

    .yingYao::after {
        top: 0.2rem;
        font-size: 0.8rem;
    }
}

@media screen and (768px <=width) {
    .wangshuaiWrapper {
        font-size: 2rem;
    }
}
</style>