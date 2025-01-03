<script setup>
import { ref, unref, h, watch, computed, defineProps, defineEmits } from 'vue'
import { insertCase, editCase as editCaseApi } from '@/api/case'
import { createDiscreteApi } from 'naive-ui'
import lunisolar from 'lunisolar'
import { trigram_r } from '@/static/trigram.js'
import { getTrigramInfo } from '@/api/trigram'
import dayjs from 'dayjs'

const props = defineProps({
  modalMode: String,
  formData: Object,
  getDefaultFormData: Function
})
const emit = defineEmits(['handleClose', 'getInfo'])

const origin_trigram_detail = ref(null)
const luni = ref({
  lunarTime: '',
  gzTime: '',
  normalTime: '',
  beforeSolarTerm: '',
  afterSolarTerm: '',
})
const { message, dialog } = createDiscreteApi(['message', 'dialog'])
const caseForm = ref(props.getDefaultFormData())
const modalTitle = computed(() => {
  return props.modalMode === 'add' ? '新增案例' : '编辑案例'
})
const showPopover = ref(false)

//
const formRef = ref(null)
const rules = {
  problem: [
    {
      required: true,
      message: '请输入所问之事！',
      trigger: ['input', 'blur']
    },
    {
      trigger: ['input', 'blur'],
      validator(_rule, value) {
        if (value.length > 30) {
          return new Error('不能超过30个字符！')
        }
        return true
      }
    }
  ],
  shift_yao: [
    {
      required: true,
      message: '请输入动爻！',
      type: 'number',
      trigger: ['blur', 'input']
    }
  ],
  origin_trigram: [
    {
      required: true,
      message: '请选择主卦！',
      trigger: ['blur', 'change']
    }
  ],
  mid_trigram: {
    required: true,
    message: '请选择互卦！',
    trigger: ['blur', 'change']
  },
  final_trigram: {
    required: true,
    message: '请选择变卦！',
    trigger: ['blur', 'change']
  }
}

const handleConfirm = async () => {
  await formRef.value.validate()
  console.log(props.modalMode)
  if (props.modalMode === 'add') {
    insertCase(caseForm.value).then(() => {
      message.success('添加成功！')
      emit('handleClose')
      emit('getInfo')
    })
  } else if (props.modalMode === 'edit') {
    editCaseApi(caseForm.value).then(() => {
      message.success('修改成功！')
      emit('handleClose')
      emit('getInfo')
    })
  }
}

// 暂时不存卦的序号，用名称来
const trigramOptions = trigram_r.map((i) => ({
  label: i.trigram,
  value: i.trigram,
  trigram_num: i.trigram_num
}))
const trigramCategoryOptions = [
  {
    label: '先天卦',
    value: 0
  },
  {
    label: '后天卦',
    value: 1
  },
]

const onOriginTrigramUpdate = (_, { trigram_num }) => {
  console.log(trigram_num)
  getTrigramInfo({ trigram_num }).then((res) => {
    console.log(res)
    origin_trigram_detail.value = res.data
    caseForm.value.mid_trigram = res.data.mid_trigram
    if (caseForm.value.shift_yao) {
      caseForm.value.final_trigram = res.data[`final_trigram_${caseForm.value.shift_yao}`]
    }
  })
}

const onYaoUpdate = (val) => {
  console.log(val)
  if (caseForm.value.origin_trigram) {
    caseForm.value.final_trigram = origin_trigram_detail.value[`final_trigram_${val}`]
  }
}

watch(
  () => props.modalMode,
  (val, oldV) => {
    if (props.modalMode === 'add') {
      const d = lunisolar(new Date())
      const beforeSolarTerm = lunisolar().recentSolarTerm(0)
      const afterSolarTerm = lunisolar().recentSolarTerm(1)
      luni.value = {
        lunarTime: d.format('lY年 lM(lL)lD lH時'), // 可取得阴历日期 '二〇二二年 六月(大)二十 未時'
        gzTime: d.format('cY cM cD cH'), // 可取得八字：'壬寅 丁未 壬申 丁未'
        normalTime: d.format('YYYY-MM-DD HH:mm:ss'), // 2022-07-18 14:40:00
        beforeSolarTermName: beforeSolarTerm[0].name,
        beforeSolarTermTime: dayjs(Date.parse(beforeSolarTerm[1])).format("YYYY.MM.DD"),
        afterSolarTermName: afterSolarTerm[0].name,
        afterSolarTermTime: dayjs(Date.parse(afterSolarTerm[1])).format("YYYY.MM.DD"),
      }
      caseForm.value.gz_time = unref(luni.value.gzTime)
      caseForm.value.d_time = unref(luni.value.lunarTime)
      caseForm.value.c_time = lunisolar().format('YYYY-MM-DD  HH:mm:ss')
      caseForm.value.missing = lunisolar().char8.year.missing.toString().replace(',', '') + ' ' + lunisolar().char8.month.missing.toString().replace(',', '') + ' ' + lunisolar().char8.day.missing.toString().replace(',', '') + ' ' + lunisolar().char8.hour.missing.toString().replace(',', '')
      caseForm.value.solarTerm = unref(luni).beforeSolarTermName + unref(luni).beforeSolarTermTime + '~' + unref(luni).afterSolarTermName + unref(luni).afterSolarTermTime
      // nextTick(() => {})
    } else if (props.modalMode === 'edit') {
      caseForm.value = props.formData
    }
  },
  { deep: true, immediate: true }
)
</script>
<template>
  <n-card style="width: 600px" :title="modalTitle" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <template #header-extra>
      <n-popover :show="showPopover" placement="bottom" trigger="manual" @update:show="handleUpdateShow">
        <template #trigger>
          <svg @click="showPopover = !showPopover" t="1735903840241" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="4373" data-darkreader-inline-fill="" width="30" height="30">
            <path d="M81.408 512.512A430.592 430.592 0 1 0 512 81.92a430.592 430.592 0 0 0-430.592 430.592z"
              fill="#FFD05A" p-id="4374" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffdd6a;">
            </path>
            <path
              d="M107.52 491.008c0 228.864 179.712 413.696 400.896 413.696s400.896-185.344 400.896-413.696-179.712-413.696-400.896-413.696S107.52 262.144 107.52 491.008z"
              fill="#FFE04A" p-id="4375" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffe961;">
            </path>
            <path
              d="M512 953.856a441.4464 441.4464 0 0 1-172.032-34.816A453.888 453.888 0 0 1 199.68 824.832a430.08 430.08 0 0 1-94.72-140.288 442.4192 442.4192 0 0 1 0-344.064A455.68 455.68 0 0 1 199.68 200.192a441.6512 441.6512 0 0 1 484.352-94.72A455.68 455.68 0 0 1 824.32 200.192a440.32 440.32 0 0 1 129.536 312.32 441.4464 441.4464 0 0 1-34.816 172.032 435.2 435.2 0 0 1-94.72 140.288 443.648 443.648 0 0 1-140.288 94.72 460.2368 460.2368 0 0 1-172.032 34.304z m0-861.184a422.8608 422.8608 0 0 0-163.328 32.768 411.136 411.136 0 0 0-133.12 90.112 434.0224 434.0224 0 0 0-90.112 133.12 413.6448 413.6448 0 0 0-32.768 163.328 422.8608 422.8608 0 0 0 32.768 163.328 405.76 405.76 0 0 0 90.112 133.12 434.0224 434.0224 0 0 0 133.12 90.112 413.6448 413.6448 0 0 0 163.328 32.768 422.8608 422.8608 0 0 0 163.328-32.768 405.76 405.76 0 0 0 133.12-90.112 434.0224 434.0224 0 0 0 90.112-133.12 413.6448 413.6448 0 0 0 32.768-163.328 422.8608 422.8608 0 0 0-32.768-163.328 411.136 411.136 0 0 0-90.112-133.12 434.0224 434.0224 0 0 0-133.12-90.112 422.8608 422.8608 0 0 0-163.328-32.768z"
              fill="#545971" p-id="4376" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path
              d="M385.024 185.856c0 23.04 57.344 40.96 126.976 40.96s126.976-18.432 126.976-40.96-57.344-40.96-126.976-40.96-126.976 18.944-126.976 40.96z"
              fill="#FFF0B3" p-id="4377" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffffa0;">
            </path>
            <path
              d="M225.28 619.008c0 16.896 23.04 30.72 51.2 30.72s51.2-13.824 51.2-30.72-23.04-30.72-51.2-30.72-51.2 13.824-51.2 30.72zM696.832 619.008c0 16.896 23.04 30.72 51.2 30.72s51.2-13.824 51.2-30.72-23.04-30.72-51.2-30.72-51.2 13.824-51.2 30.72z"
              fill="#FCBD83" p-id="4378" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffc87f;">
            </path>
            <path
              d="M589.6704 754.7904a33.9968 33.9968 0 0 0-27.648-13.4656h-0.7168a38.6048 38.6048 0 0 0-30.72 13.4656 17.0496 17.0496 0 0 0-3.584 17.0496c4.3008 9.216 16.3328 9.9328 29.1328 10.6496h12.7488c9.9328 0 19.8656-1.4336 23.4496-9.216 3.0208-5.6832 2.304-11.3664-2.6624-18.4832z m-33.3312 19.1488c-14.2336-0.6656-27.6992-2.0992-19.2-12.7488 9.2672-11.3664 34.0992-16.3328 45.4656-0.7168s-11.3664 13.4656-26.2656 13.4656z"
              fill="#545971" p-id="4379" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path
              d="M562.0224 759.04a24.1664 24.1664 0 0 0-15.36 5.12c2.0992 0 5.632 0.7168 10.6496 0.7168h2.816a113.5616 113.5616 0 0 0 15.616 0 15.36 15.36 0 0 0-13.7216-5.8368zM270.6432 362.3424a4.096 4.096 0 0 1-2.816-0.7168 10.24 10.24 0 0 1-7.1168-12.7488c12.0832-39.7824 55.3472-62.464 96.512-51.2A10.24 10.24 0 1 1 351.5392 317.44a58.0608 58.0608 0 0 0-70.9632 36.864 9.8816 9.8816 0 0 1-9.9328 8.0384zM677.2736 311.9616a11.3664 11.3664 0 0 1-7.7824-3.584 57.6512 57.6512 0 0 0-80.1792-2.0992 10.5472 10.5472 0 0 1-14.2336-15.36 79.36 79.36 0 0 1 109.312 3.5328 10.24 10.24 0 0 1-0.7168 14.8992 8.8576 8.8576 0 0 1-6.4 2.6112z"
              fill="#545971" p-id="4380" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path
              d="M169.2672 802.6112c-24.1152 13.4656-69.5296 7.1168-100.0448-13.4656-108.5952-61.7472-30.72-273.2544 39.7312-231.3728 0 0 43.3152-25.6 58.2144 17.0496 0 0 38.2976-24.832 48.9472 16.9984 11.3664 45.4144-43.9808 31.9488-48.9472 104.3456 10.6496 24.1152 45.4144 65.28 2.0992 106.4448"
              fill="#FFE04A" p-id="4381" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffe961;">
            </path>
            <path
              d="M135.936 820.3776a139.6224 139.6224 0 0 1-73.1136-22.016C25.2416 776.3456 4.6592 735.8976 4.6592 684.0832 4.6592 626.6368 30.72 568.32 64.9728 548.5568a46.08 46.08 0 0 1 43.9808-2.8672c8.5504-3.5328 25.6-9.9328 41.8816-3.5328a44.1344 44.1344 0 0 1 21.2992 18.432 46.5408 46.5408 0 0 1 31.232-1.3824q17.0496 6.4 23.3984 29.7984c7.1168 27.648-7.0656 40.448-19.8656 51.2s-26.2656 22.6816-29.0816 53.9136c1.3824 2.8672 3.5328 6.4 5.12 9.9328 13.4656 24.8832 36.1984 65.9968-6.4 106.496-0.7168 0.6656-1.4336 1.3824-2.1504 1.3824a81.92 81.92 0 0 1-38.4512 8.448z m-46.08-257.6384a27.5456 27.5456 0 0 0-14.1824 4.2496c-27.6992 15.616-49.7152 68.1472-49.7152 117.0944 0 25.6 6.4 71.68 48.2816 95.8464 0 0 0.7168 0 0.7168 0.6656 26.9824 17.7664 66.56 24.1664 88.0128 13.5168 29.0816-28.416 14.1824-56.064 1.3824-80.2304a130.5088 130.5088 0 0 1-7.0656-14.1824 11.9808 11.9808 0 0 1-0.7168-5.12c2.816-42.5472 22.016-58.88 36.1984-70.9632 12.032-9.7792 17.152-14.0288 12.6976-29.696a22.272 22.272 0 0 0-9.9328-15.36c-7.7824-2.816-19.8656 2.816-22.6816 5.12a10.8032 10.8032 0 0 1-9.216 1.4336 11.3664 11.3664 0 0 1-6.4-6.5536c-2.8672-8.4992-7.1168-14.1824-13.5168-16.3328-10.5984-3.5328-24.832 2.1504-29.0816 5.12a9.5744 9.5744 0 0 1-10.6496 0 27.5456 27.5456 0 0 0-14.1824-4.608z"
              fill="#545971" p-id="4382" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path d="M112.64 557.056c-22.7328 14.8992-51.2 43.3152-43.3152 85.8624" fill="#FFE04A" p-id="4383"
              data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffe961;"></path>
            <path
              d="M69.2224 653.568a11.3152 11.3152 0 0 1-10.6496-8.448c-6.4-37.632 10.6496-73.1136 48.2816-96.512a10.8032 10.8032 0 1 1 11.3152 18.432c-16.9984 9.9328-45.4144 34.7648-38.2976 73.8304a10.24 10.24 0 0 1-8.4992 12.032 2.6112 2.6112 0 0 1-2.1504 0.6656z"
              fill="#545971" p-id="4384" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path d="M169.984 571.2384c14.8992-5.12-61.0304 27.6992-48.9472 86.5792" fill="#FFE04A" p-id="4385"
              data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffe961;"></path>
            <path
              d="M121.0368 668.4672a11.3152 11.3152 0 0 1-10.6496-8.4992c-5.12-24.1152 0-60.3136 51.2-94.4128a9.6768 9.6768 0 0 1 5.12-4.2496c9.9328-3.5328 14.1824 2.8672 14.8992 5.12a11.7248 11.7248 0 0 1-6.4 15.616c-34.048 22.7328-48.9472 47.5648-43.9808 73.8304a11.008 11.008 0 0 1-8.4992 12.7488z"
              fill="#545971" p-id="4386" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path
              d="M475.7504 486.4c0 40.96-30.72 75.2128-68.864 75.2128S337.92 528.384 337.92 486.4s30.72-75.264 68.8128-75.264S475.7504 445.44 475.7504 486.4"
              fill="#FFFFFF" p-id="4387" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffffff;">
            </path>
            <path
              d="M406.8864 568.8832c-41.8304 0-75.9296-36.9152-75.9296-82.3296S365.056 404.48 406.8864 404.48s75.9808 36.6592 75.9808 81.92-34.0992 82.4832-75.9808 82.4832z m0-149.76c-34.048 0-61.7472 30.72-61.7472 68.1472s27.6992 68.096 61.7472 68.096 61.7472-30.72 61.7472-68.096-27.648-68.1472-61.7472-68.1472z"
              fill="#545971" p-id="4388" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path
              d="M464.384 512c0 20.48-14.8992 37.5808-34.048 37.5808S396.2368 532.48 396.2368 512s14.9504-37.632 34.0992-37.632S464.384 491.52 464.384 512"
              fill="#545971" p-id="4389" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path
              d="M697.856 486.4c0 40.96-30.72 75.2128-68.8128 75.2128S560.1792 528.384 560.1792 486.4s30.72-75.264 68.864-75.264S697.856 445.44 697.856 486.4"
              fill="#FFFFFF" p-id="4390" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #ffffff;">
            </path>
            <path
              d="M629.0432 568.8832c-41.8816 0-76.0832-36.9152-76.0832-82.4832s34.2016-81.92 76.0832-81.92 75.9296 37.3248 75.9296 81.92-34.2528 82.4832-75.9296 82.4832z m0-149.76c-34.048 0-61.7472 30.72-61.7472 68.1472s27.6992 68.096 61.7472 68.096 61.7472-31.232 61.7472-68.8128-27.6992-67.4304-61.7472-67.4304z"
              fill="#545971" p-id="4391" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path
              d="M686.5408 512c0 20.48-14.8992 37.5808-34.0992 37.5808s-34.048-16.9984-34.048-37.5808 14.8992-37.632 34.048-37.632 34.0992 17.0496 34.0992 37.632"
              fill="#545971" p-id="4392" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4959a6;">
            </path>
            <path
              d="M896 32.768a101.9904 101.9904 0 0 0-80.2304 17.408 105.5232 105.5232 0 0 0-43.8272 69.12 21.9648 21.9648 0 0 0 43.3152 7.168 56.32 56.32 0 0 1 25.6-40.0896A61.44 61.44 0 0 1 936.96 145.2544a60.9792 60.9792 0 0 1-46.08 51.6608 76.4928 76.4928 0 0 0-56.7296 59.8016l-5.12 28.4672a21.9648 21.9648 0 1 0 43.3152 7.168l5.12-28.4672a29.1328 29.1328 0 0 1 23.552-24.0128A106.3424 106.3424 0 0 0 896 32.768zM815.2576 352.9728a26.3168 26.3168 0 1 0 35.84-10.24 26.3168 26.3168 0 0 0-35.84 10.24z"
              fill="#373740" p-id="4393" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #4f5659;">
            </path>
          </svg>
        </template>
        <div>
          <n-table size="small" :bordered="true" :single-line="true" :single-column="true" :striped="true">
            <thead>
              <tr>
                <th>乾</th>
                <th>兑</th>
                <th>离</th>
                <th>震</th>
                <th>巽</th>
                <th>坎</th>
                <th>艮</th>
                <th>坤</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>天</td>
                <td>泽</td>
                <td>火</td>
                <td>雷</td>
                <td>风</td>
                <td>水</td>
                <td>山</td>
                <td>地</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
                <td>8</td>
              </tr>
            </tbody>
          </n-table>
        </div>
      </n-popover>

    </template>
    <div class="form-wrapper">
      <n-form ref="formRef" :label-width="80" :model="caseForm" :rules="rules" :size="size">
        <n-form-item label="卦题" path="problem">
          <n-input v-model:value="caseForm.problem" placeholder="请输入问题" />
        </n-form-item>
        <n-form-item label="卦式" path="category">
          <n-select v-model:value="caseForm.category" :options="trigramCategoryOptions" placeholder="请选择卦式" />
        </n-form-item>
        <n-form-item label="动爻" path="shift_yao">
          <n-input-number v-model:value="caseForm.shift_yao" :min="1" :max="6" placeholder="输入动爻"
            @update:value="onYaoUpdate" />
        </n-form-item>
        <n-form-item label="主卦" path="origin_trigram">
          <n-select v-model:value="caseForm.origin_trigram" :options="trigramOptions" placeholder="选择主卦"
            @update:value="onOriginTrigramUpdate" filterable />
        </n-form-item>
        <n-form-item label="互卦" path="mid_trigram">
          <n-select v-model:value="caseForm.mid_trigram" :options="trigramOptions" placeholder="选择互卦" filterable
            disabled />
        </n-form-item>
        <n-form-item label="变卦" path="final_trigram">
          <n-select v-model:value="caseForm.final_trigram" :options="trigramOptions" placeholder="选择变卦" filterable
            disabled />
        </n-form-item>
        <!-- <n-form-item label="爻辞" path="yao_content">
              <n-input
                v-model:value="caseForm.yao_content"
                type="textarea"
                readonly
              />
            </n-form-item> -->
        <n-form-item label="干支" path="gz_time">
          <n-input v-model:value="caseForm.gz_time" placeholder="干支时间" />
        </n-form-item>
        <n-form-item label="农历" path="d_time">
          <n-input v-model:value="caseForm.d_time" placeholder="时间" />
        </n-form-item>
        <n-form-item label="阳历" path="c_time">
          <n-input v-model:value="caseForm.c_time" placeholder="时间" />
        </n-form-item>
        <n-form-item label="空亡" path="missing">
          <n-input v-model:value="caseForm.missing" placeholder="地支空亡" />
        </n-form-item>
        <n-form-item label="节气" path="solarTerm">
          <n-input v-model:value="caseForm.solarTerm" placeholder="节气" />
        </n-form-item>
        <n-form-item label="性别" path="gender">
          <n-select v-model:value="caseForm.gender" :options="[
            {
              label: '男',
              value: 1
            },
            {
              label: '女',
              value: 0
            }
          ]" placeholder="选择性别" />
        </n-form-item>
        <n-form-item label="提示" path="hint">
          <n-input v-model:value="caseForm.hint" placeholder="请输入提示" />
        </n-form-item>
        <n-form-item label="外应" path="outside_react">
          <n-input v-model:value="caseForm.outside_react" placeholder="请输入外应" />
        </n-form-item>
        <n-form-item label="预测" path="prediction">
          <n-input v-model:value="caseForm.prediction" type="textarea" placeholder="请输入预测结果" />
        </n-form-item>
        <n-form-item label="断卦思路" path="pre_desc">
          <n-input v-model:value="caseForm.pre_desc" type="textarea" placeholder="请输入断卦的思路" />
        </n-form-item>
        <n-divider v-text="'卦后'" title-placement="right" />
        <n-form-item label="卦后反思" path="rethink">
          <n-input v-model:value="caseForm.rethink" type="textarea" placeholder="请输入断卦的反思收获" />
        </n-form-item>
        <n-form-item label="反馈" path="result">
          <n-input v-model:value="caseForm.result" type="textarea" placeholder="请输入实际的结果" />
        </n-form-item>
        <n-form-item label="对错" path="correct">
          <n-radio-group v-model:value="caseForm.correct" name="radiogroup">
            <n-space>
              <n-radio v-for="res in [
                { label: '正确', value: 1 },
                { label: '错误', value: 0 }
              ]" :key="res.label" :value="res.value">
                {{ res.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
      </n-form>
    </div>

    <template #footer>
      <n-space>
        <n-button @click="handleConfirm" type="primary">确认</n-button>
        <n-button @click="emit('handleClose')">取消</n-button>
      </n-space>
    </template>
  </n-card>
</template>
