<script setup>
import { ref, computed, watch } from 'vue'
import { calcCFigure, calcGFigure, getTrigramFromCFigure, getTrigramFromGFigure, getWuxingFromCFigure, getWuxingFromGFigure } from 'plum-cg'
import { wuxingColor } from '@/utils'

const props = defineProps({
    modalMode: String,
    formData: Object,
    currentEightTrigram: Object,
    eightTrigramArr: Array,
    singleTrigramArr: Array
})


const gz_timeArr = computed(() => {
    return props.formData.gz_time.split(' ')
})
const TIME_ARR = ['年', '月', '日', '时']
const origin_trigram_c_figure = ref('')
const origin_trigram_g_figure = ref('')
const origin_trigram_c_figure_trigram = ref([])
const origin_trigram_g_figure_trigram = ref([])
const origin_trigram_c_figure_trigram_wuxing = ref([])
const origin_trigram_g_figure_trigram_wuxing = ref([])

/**
 * 先后天卦判断
 */
const guashi = computed(() => num => {
    if (num === 0) return '先天卦'
    if (num === 1) return '后天卦'
    return '默认先天'
})


watch(() => props.currentEightTrigram, () => {
    const [shangguaName, xiaguaName] = props.singleTrigramArr
    const shangguaPrenum = props.currentEightTrigram.find(i => i.zh_name === shangguaName)?.pre_num
    const xiaguaPrenum = props.currentEightTrigram.find(i => i.zh_name === xiaguaName)?.pre_num
    if (shangguaPrenum && xiaguaPrenum) {
        const origin_trigram_str = `${shangguaPrenum}${xiaguaPrenum}${props.formData.shift_yao}`
        origin_trigram_c_figure.value = calcCFigure(origin_trigram_str)
        origin_trigram_g_figure.value = calcGFigure(origin_trigram_str)
        origin_trigram_c_figure_trigram.value = getTrigramFromCFigure(origin_trigram_c_figure.value)
        origin_trigram_g_figure_trigram.value = getTrigramFromGFigure(origin_trigram_g_figure.value)
        origin_trigram_c_figure_trigram.value.length !== 5 && origin_trigram_c_figure_trigram.value.unshift('')
        origin_trigram_g_figure_trigram.value.length !== 5 && origin_trigram_g_figure_trigram.value.unshift('')
        origin_trigram_c_figure_trigram_wuxing.value = getWuxingFromCFigure(origin_trigram_c_figure.value)
        origin_trigram_g_figure_trigram_wuxing.value = getWuxingFromGFigure(origin_trigram_g_figure.value)
        origin_trigram_c_figure_trigram_wuxing.value.length !== 5 && origin_trigram_c_figure_trigram_wuxing.value.unshift('')
        origin_trigram_g_figure_trigram_wuxing.value.length !== 5 && origin_trigram_g_figure_trigram_wuxing.value.unshift('')
    }
    console.log(origin_trigram_c_figure_trigram_wuxing.value);
}, {
    deep: true
})
/**
 * 卦的五行判断
 */
const trigram_wuxing = computed(() => trigram_name => props.eightTrigramArr.find(i => i.trigram_name === trigram_name)?.wuxing)
</script>

<template>
    <tbody>
        <tr>
            <th>事项</th>
            <td colspan="20">{{ props.formData.problem }}</td>
        </tr>
        <tr>
            <th>日期</th>
            <td colspan="20">{{ props.formData.d_time }}</td>
        </tr>
        <tr>
            <th>时间</th>
            <td colspan="20">{{ props.formData.c_time || '-' }}</td>
        </tr>
        <tr>
            <th>卦式</th>
            <td colspan="20">{{ guashi(props.formData.category) }}</td>
        </tr>
        <tr>
            <th>节气</th>
            <td colspan="20">{{ props.formData.solarTerm || '-' }}</td>
        </tr>
        <tr>
            <th>干支</th>
            <td colspan="5" v-for="(i, index) in gz_timeArr" :key="i + index"
                style="font-weight: bold;text-align: center;"
                :style="(index === 2 || index === 1) && { color: '#8B0000' }">
                {{ i + TIME_ARR[index] }}</td>
        </tr>
        <tr>
            <th>空亡</th>
            <td colspan="5" style="text-align: center;"
                v-for="(i, index) in (props.formData.missing || '- - - -').split(' ')" :key="i + index">{{ i }}</td>
        </tr>
        <tr>
            <th rowspan="4">策轨</th>
            <td colspan="10" style="text-align: center;">策数</td>
            <td colspan="10" style="text-align: center;">轨数</td>
        </tr>
        <tr>
            <td colspan="2" :key="i + index" v-for="(i, index) in origin_trigram_c_figure.toString().padStart(5, ' ')">
                {{
                    i }}</td>
            <td colspan="2" :key="i + index" v-for="(i, index) in origin_trigram_g_figure.toString().padStart(5, ' ')">
                {{
                    i }}</td>
        </tr>
        <tr>
            <td colspan="2" :key="i + index" v-for="(i, index) in origin_trigram_c_figure_trigram"
                :class="wuxingColor(trigram_wuxing(i))">{{ i }}</td>
            <td colspan="2" :key="i + index" v-for="(i, index) in origin_trigram_g_figure_trigram"
                :class="wuxingColor(trigram_wuxing(i))">{{ i }}</td>
        </tr>
        <tr>
            <td colspan="2" :key="i + index" v-for="(i, index) in origin_trigram_c_figure_trigram_wuxing"
                :class="wuxingColor(i)">{{ i }}</td>
            <td colspan="2" :key="i + index" v-for="(i, index) in origin_trigram_g_figure_trigram_wuxing"
                :class="wuxingColor(i)">{{ i }}</td>
        </tr>
        <tr>
            <th>结果</th>
            <td colspan="20">{{ props.formData.result || '-' }}</td>
        </tr>
        <!-- <tr>
          <th >神煞</th>
          <td colspan="4">HTML tables</td>
        </tr> -->
    </tbody>
</template>

<style lang="css" scoped>

th {
    color: #4f795f;
    white-space: nowrap;
}

th,
td {
    border: 1px solid rgb(160 160 160);
    padding: 0.5rem 0.5rem;
    text-align: center;
}

tbody>tr:nth-of-type(even) {
    background-color: rgb(237 238 242);
}

@media screen and (320px <=width < 375px) {
    th,
    td {
        padding: 0.3rem 0.4rem;
    }
}

@media screen and (375px <=width < 425px) {
    th,
    td {
        padding: 0.4rem 0.4rem;
    }
}

@media screen and (425px <=width < 768px) {
    th,
    td {
        padding: 0.1rem 0.4rem;
    }
}

@media screen and (768px <=width) {
    th,
    td {
        padding: 0.5rem 1.8rem;
    }
}
</style>