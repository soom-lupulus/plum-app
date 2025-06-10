<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getEightTrigramInfo } from '@/api/eightTirgram'
import { trigram_r } from '@/static/trigram.js'
import { getTrigramInfo } from '@/api/trigram'
import TableBody from './TableBody.vue'
import TableFoot from './TableFoot.vue'

const props = defineProps({
    modalMode: String,
    formData: Object
})
const eightTrigramArr = ref([])
const currentEightTrigram = ref([])
const trigramInfo = ref(null)


const singleTrigramArr = computed(() => {
    const pureTrigram = ['乾为天', '兑为泽', '离为火', '震为雷', '巽为风', '坎为水', '艮为山', '坤为地']
    const isPure = str => pureTrigram.includes(str)
    const { origin_trigram, mid_trigram, final_trigram } = props.formData
    if (!origin_trigram) return []
    return ((isPure(origin_trigram) ? origin_trigram.slice(-1).repeat(2) : origin_trigram.slice(0, 2)) +
        (isPure(mid_trigram) ? mid_trigram.slice(-1).repeat(2) : mid_trigram.slice(0, 2)) +
        (isPure(final_trigram) ? final_trigram.slice(-1).repeat(2) : final_trigram.slice(0, 2))
    ).split('')
})



onMounted(() => {
    getEightTrigramInfo().then(res => {
        eightTrigramArr.value = res.data
        currentEightTrigram.value = singleTrigramArr.value.map(j => res.data.find(i => i.zh_name === j))
    })
    // 获取卦的详情
    const trigramNames = [props.formData.origin_trigram, props.formData.mid_trigram, props.formData.final_trigram]
    const trigrampks = trigramNames.map(i => ({ trigram_num: trigram_r.find(j => j.trigram === i).trigram_num }))
    const p = trigrampks.map(pk => getTrigramInfo(pk))
    Promise.all(p).then(([zhu, hu, bian]) => {
        trigramInfo.value = {
            zhu: zhu.data,
            hu: hu.data,
            bian: bian.data,
        }
    })
})
</script>

<template>
    <table class="d-table" style="width: 100%; border-collapse: collapse;">
        <!-- 总列数 = 标题1列 + 数据10列 = 11列 -->
        <colgroup>
            <col style="width: 1%;"> <!-- 标题列固定最小宽度 -->
            <col> <!-- 数据区自适应 -->
        </colgroup>
        <TableBody :eightTrigramArr="eightTrigramArr" :currentEightTrigram="currentEightTrigram"
            :singleTrigramArr="singleTrigramArr" v-bind="props" />
        <TableFoot :trigramInfo="trigramInfo" :currentEightTrigram="currentEightTrigram" v-bind="props" />
    </table>
</template>

<style scoped lang="less">
.d-table {
    border-collapse: collapse;
    border: 2px solid rgb(140 140 140);
    font-family: sans-serif;
    font-size: 0.8rem;
    letter-spacing: 1px;
}

@media screen and (320px <=width < 375px) {
    .d-table {
        font-size: 0.6rem;
    }
}

@media screen and (375px <=width < 425px) {
    .d-table {
        font-size: 0.8rem;
    }
}

@media screen and (425px <=width < 768px) {
    .d-table {
        font-size: 1rem;
    }
}

@media screen and (768px <=width) {
    .d-table {
        font-size: 1.5rem;
    }
}
</style>