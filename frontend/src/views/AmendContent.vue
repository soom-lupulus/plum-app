<script setup>
import { ref, unref, h, watch, computed, defineProps, defineEmits } from 'vue'
import { insertCase, editCase as editCaseApi } from '@/api/case'
import { createDiscreteApi } from 'naive-ui'
import lunisolar from 'lunisolar'
import { trigram_r } from '@/static/trigram.js'
import { getTrigramInfo } from '@/api/trigram'
import dayjs from 'dayjs'
import IconTutorial from '@/components/icons/IconTutorial.vue'

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
          <icon-tutorial @click="showPopover = !showPopover" />
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
          <n-select v-model:value="caseForm.origin_trigram" :options="trigramOptions" placeholder="请选择主卦"
            @update:value="onOriginTrigramUpdate" filterable />
        </n-form-item>
        <n-form-item label="互卦" path="mid_trigram">
          <n-select v-model:value="caseForm.mid_trigram" :options="trigramOptions" placeholder="请选择互卦" filterable
            disabled />
        </n-form-item>
        <n-form-item label="变卦" path="final_trigram">
          <n-select v-model:value="caseForm.final_trigram" :options="trigramOptions" placeholder="请选择变卦" filterable
            disabled />
        </n-form-item>
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
        <!-- <n-form-item label="断卦思路" path="pre_desc">
          <n-input v-model:value="caseForm.pre_desc" type="textarea" placeholder="请输入断卦的思路" />
        </n-form-item> -->
        <n-divider title-placement="left"></n-divider>
        <!-- <n-form-item label="卦后反思" path="rethink">
          <n-input v-model:value="caseForm.rethink" type="textarea" placeholder="请输入断卦的反思收获" />
        </n-form-item> -->
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
