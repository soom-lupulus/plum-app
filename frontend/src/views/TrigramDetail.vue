<script setup lang="jsx">
import { ref, unref, h, onMounted, computed, nextTick, watch, defineEmits } from 'vue'
// import theGods from 'lunisolar/plugins/theGods'
import { getEightTrigramInfo } from '@/api/eightTirgram'
import lunisolar from 'lunisolar'
import { trigram_r } from '@/static/trigram.js'
import { getTrigramInfo } from '@/api/trigram'
import { calcCFigure, calcGFigure, getTrigramFromCFigure, getTrigramFromGFigure, getWuxingFromCFigure, getWuxingFromGFigure } from 'plum-cg'

// lunisolar.extend(theGods)
const props = defineProps({
  modalMode: String,
  formData: Object
})
const emit = defineEmits(['handleClose'])


const eightTrigramArr = ref([])
const currentEightTrigram = ref([])
const trigramInfo = ref(null)
const currentActiveTrigram = ref('zhu')
const origin_trigram_c_figure = ref('')
const origin_trigram_g_figure = ref('')
const origin_trigram_c_figure_trigram = ref([])
const origin_trigram_g_figure_trigram = ref([])
const origin_trigram_c_figure_trigram_wuxing = ref([])
const origin_trigram_g_figure_trigram_wuxing = ref([])
console.log(props.formData);

const gz_timeArr = computed(() => {
  return props.formData.gz_time.split(' ')
})
const singleTrigramArr = computed(() => {
  const pureTrigram = ['乾为天', '兑为泽', '离为火', '震为雷', '巽为风', '坎为水', '艮为山', '坤为地']
  const isPure = str => pureTrigram.includes(str)
  const { origin_trigram, mid_trigram, final_trigram } = props.formData
  return ((isPure(origin_trigram) ? origin_trigram.slice(-1).repeat(2) : origin_trigram.slice(0, 2)) +
    (isPure(mid_trigram) ? mid_trigram.slice(-1).repeat(2) : mid_trigram.slice(0, 2)) +
    (isPure(final_trigram) ? final_trigram.slice(-1).repeat(2) : final_trigram.slice(0, 2))
  ).split('')
  // return (props.formData.origin_trigram.slice(0, 2) + props.formData.mid_trigram.slice(0, 2) + props.formData.final_trigram.slice(0, 2)).split('')
})
watch(() => currentEightTrigram, () => {
  const [shangguaName, xiaguaName] = singleTrigramArr.value
  const shangguaPrenum = currentEightTrigram.value.find(i => i.zh_name === shangguaName)?.pre_num
  const xiaguaPrenum = currentEightTrigram.value.find(i => i.zh_name === xiaguaName)?.pre_num
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
const yao_str = computed(() => (index, yIndex) => {
  return +(currentEightTrigram.value[index]?.yao_yy[yIndex]) ? '▀▀▀' : '▀\u00a0\u00a0\u00a0▀'
})

const calc_nj = computed(() => (gua, yao, iszhugua = true) => {
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



  console.log(yao);
  console.log(str);

  return str
})

const guashi = computed(() => num => {
  if (num === 0) return '先天卦'
  if (num === 1) return '后天卦'
  return '默认先天'
})

const trigram_wuxing = computed(() => trigram_name => eightTrigramArr.value.find(i => i.trigram_name === trigram_name)?.wuxing)

const wuxingColor = wuxing => {
  const maps = {
    金: 'jin',
    木: 'mu',
    水: 'shui',
    火: 'huo',
    土: 'tu',
  }
  return maps[wuxing]
}
const TIME_ARR = ['年', '月', '日', '时']

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
  <n-card closable @close="emit('handleClose')" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <div>
      <table class="d-table" style="width: 100%; border-collapse: collapse;">
        <!-- 总列数 = 标题1列 + 数据10列 = 11列 -->
        <colgroup>
          <col style="width: 1%;"> <!-- 标题列固定最小宽度 -->
          <col> <!-- 数据区自适应 -->
        </colgroup>
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
        <tfoot>
          <tr>
            <td colspan="20">
              <div class="gua_box">
                <div class="zhugua" @click="currentActiveTrigram = 'zhu'">
                  <p :class="{ shiftYaoCi: currentActiveTrigram === 'zhu' }">【主卦】</p>
                  <p>{{ props.formData.origin_trigram }}</p>
                  <div v-for="(item, i) in 6" v-bind:key="i"
                    :class="{ shiftYao: props.formData.shift_yao === 6 - (+i) }">
                    <span>{{ calc_nj(currentEightTrigram, 6 - item) }}</span>
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
                    <span>{{ calc_nj(currentEightTrigram, 6 - item, false) }}</span>
                    <span class="yao_item">{{ yao_str(4, i) }}</span>
                  </div>
                  <div v-for="(item, i) in 3" :key="i">
                    <span>{{ calc_nj(currentEightTrigram, 3 - item, false) }}</span>
                    <span class="yao_item">{{ yao_str(5, i) }}</span>
                  </div>
                  <p>{{ trigramInfo?.bian.trigram_home }}宫</p>

                </div>
              </div>
              <!-- <div>五行旺衰</div> -->
              <div class="wangshuaiWrapper">
                <div>
                  <div :class="wuxingColor(currentEightTrigram[0]?.wuxing)">{{ currentEightTrigram[0]?.wuxing }}</div>
                  <div :class="wuxingColor(currentEightTrigram[1]?.wuxing)">{{ currentEightTrigram[1]?.wuxing }}</div>
                </div>
                <div>
                  <div :class="wuxingColor(currentEightTrigram[2]?.wuxing)">{{ currentEightTrigram[2]?.wuxing }}</div>
                  <div :class="wuxingColor(currentEightTrigram[3]?.wuxing)">{{ currentEightTrigram[3]?.wuxing }}</div>
                </div>
                <div>
                  <div :class="wuxingColor(currentEightTrigram[4]?.wuxing)">{{ currentEightTrigram[4]?.wuxing }}</div>
                  <div :class="wuxingColor(currentEightTrigram[5]?.wuxing)">{{ currentEightTrigram[5]?.wuxing }}</div>
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
      </table>
    </div>

  </n-card>
</template>

<style scoped lang="less">
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
    top: 4px;
  }
}

.shiftYaoCi {
  color: red;
  font-weight: bold;
}

.jin {
  color: rgb(214, 214, 61);
}

.mu {
  color: rgb(71, 219, 13);
}

.shui {
  color: rgb(82, 154, 246);
}

.huo {
  color: rgb(218, 73, 73);
}

.tu {
  color: rgb(131, 90, 3);
}

// .n-card > .n-card__content{
//   padding: 10px !important;
// }
.d-table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

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

td:last-of-type {
  text-align: center;
}

tbody>tr:nth-of-type(even) {
  background-color: rgb(237 238 242);
}

tfoot th {
  text-align: right;
}

tfoot td {
  font-weight: bold;
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


@media screen and (320px <=width < 375px) {

  .d-table {
    font-size: 0.6rem;
  }

  .wangshuaiWrapper {
    font-size: 1rem;
  }

  th,
  td {
    padding: 0.3rem 0.4rem;
  }
}

@media screen and (375px <=width < 425px) {

  .d-table {
    font-size: 0.8rem;
  }

  .wangshuaiWrapper {
    font-size: 1.5rem;
  }

  th,
  td {
    padding: 0.4rem 0.4rem;
  }
}

@media screen and (425px <=width < 1024px) {

  .d-table {
    font-size: 1rem;
  }

  .wangshuaiWrapper {
    font-size: 1.8rem;
  }

  th,
  td {
    padding: 0.5rem 0.5rem;
  }
}
</style>
