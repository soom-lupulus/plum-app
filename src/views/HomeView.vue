<script setup lang="jsx">
import { ref, unref, h, onMounted, computed, nextTick, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { NButton, createDiscreteApi } from 'naive-ui'
import { getCaseList, insertCase, removeCase, editCase as editCaseApi } from '@/api/case'
import { trigram_r } from '@/static/trigram.js'
import lunisolar from 'lunisolar'
import { isMobile } from '@/utils'
import { debounce } from 'lodash'
import { CheckCircleRegular, TimesCircleRegular, QuestionCircleRegular } from '@vicons/fa'

const { message, dialog } = createDiscreteApi(['message', 'dialog'])
const tableData = ref([])
const showModal = ref(false)
const modalMode = ref('add')
const caseForm = ref({
  problem: '',
  shift_yao: null,
  origin_trigram: '',
  mid_trigram: '',
  final_trigram: '',
  gz_time: '',
  d_time: '',
  gender: null,
  hint: '',
  outside_react: '',
  prediction: '',
  result: '',
  correct: null,
  pre_desc: '',
  rethink: ''
})
const luni = ref({
  lunarTime: '',
  gzTime: '',
  normalTime: ''
})
const searchProblem = ref('')
const formRef = ref(null)

function createColumns({ play }) {
  return !!isMobile()
    ? [
        {
          title: '卦题',
          key: 'problem',
        },
        {
          title: '对错',
          width: 60,
          key: 'correct',
          render({ correct }) {
            return typeof correct === 'number' ? (
              correct ? (
                <n-icon size="20" color="#499b70">
                  <CheckCircleRegular />
                </n-icon>
              ) : (
                <n-icon size="20" color="#d03050">
                  <TimesCircleRegular />
                </n-icon>
              )
            ) : (
              <n-icon size="20" color="#f6cc55">
                <QuestionCircleRegular />
              </n-icon>
            )
          }
        },
        {
          title: '操作',
          key: 'actions',
          width: 80,
          render(row) {
            return (
              <n-space>
                {/* <n-button size="small" onClick={() => play('info', row)}>
              查看
            </n-button> */}
                <n-button size="small" strong secondary onClick={() => play('edit', row)}>
                  修改
                </n-button>
                <n-button
                  size="small"
                  strong
                  secondary
                  type="error"
                  onClick={() => play('remove', row)}
                >
                  删除
                </n-button>
              </n-space>
            )
          }
        }
      ]
    : [
        {
          title: '卦题',
          key: 'problem'
        },
        {
          title: '性别',
          key: 'gender',
          width: 80,
          render(row) {
            return row.gender ? '男' : '女'
          }
        },
        {
          title: '动爻',
          key: 'shift_yao',
          width: 80
        },
        {
          title: '主卦',
          key: 'origin_trigram',
          width: 100
        },
        {
          title: '互卦',
          key: 'mid_trigram',
          width: 100
        },
        {
          title: '变卦',
          key: 'final_trigram',
          width: 100
        },
        {
          title: '干支',
          key: 'gz_time',
          ellipsis: {
            tooltip: true
          }
        },
        {
          title: '时间（农）',
          key: 'd_time',
          ellipsis: {
            tooltip: true
          }
        },
        {
          title: '提示',
          key: 'hint'
        },
        {
          title: '外应',
          key: 'outside_react',
          width: 80
        },
        {
          title: '预测',
          key: 'prediction',
          ellipsis: {
            tooltip: true
          }
        },
        {
          title: '反馈',
          key: 'result',
          ellipsis: {
            tooltip: true
          }
        },
        {
          title: '对错',
          key: 'correct',
          width: 80,
          render({ correct }) {
            return !!correct ? '正确' : '错误'
          }
        },
        // {
        //   title: '断卦逻辑',
        //   key: 'pre_desc'
        // },
        // {
        //   title: '反思',
        //   key: 'rethink'
        // },
        {
          title: '操作',
          key: 'actions',
          width: 150,
          render(row) {
            return (
              <n-space>
                {/* <n-button size="small" onClick={() => play('info', row)}>
              查看
            </n-button> */}
                <n-button size="small" strong secondary onClick={() => play('edit', row)}>
                  修改
                </n-button>
                <n-button
                  size="small"
                  strong
                  secondary
                  type="error"
                  onClick={() => play('remove', row)}
                >
                  删除
                </n-button>
              </n-space>
            )
          }
        }
      ]
}
const columns = ref(
  createColumns({
    play(mode, row) {
      if (mode === 'info') {
        message.info(`查看`)
      } else if (mode === 'edit') {
        editCase({ ...row })
      } else if (mode === 'remove') {
        dialog.warning({
          title: '警告',
          content: '你确定要删除这个案例吗？',
          positiveText: '确定',
          negativeText: '不确定',
          onPositiveClick: () => {
            removeCase(row.id).then((res) => {
              message.success('删除成功！')
              getInfo()
            })
          },
          onNegativeClick: () => {
            message.error('先不删除~')
          }
        })
      }
    }
  })
)

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

// 暂时不存卦的序号，用名称来
const trigramOptions = trigram_r.map((i) => ({ label: i.trigram, value: i.trigram }))

const modalTitle = computed(() => {
  return modalMode.value === 'add' ? '新增案例' : '编辑案例'
})

const addCase = () => {
  modalMode.value = 'add'
  showModal.value = true

  const d = lunisolar(new Date())
  luni.value = {
    lunarTime: d.format('lY年 lM(lL)lD lH時'), // 可取得阴历日期 '二〇二二年 六月(大)二十 未時'
    gzTime: d.format('cY cM cD cH'), // 可取得八字：'壬寅 丁未 壬申 丁未'
    normalTime: d.format('YYYY-MM-DD HH:mm:ss') // 2022-07-18 14:40:00
  }
  caseForm.value.gz_time = unref(luni.value.gzTime)
  caseForm.value.d_time = unref(luni.value.lunarTime)
  nextTick(() => {})
}

const editCase = (row) => {
  modalMode.value = 'edit'
  showModal.value = true
  caseForm.value = row
}

const handleClose = () => {
  showModal.value = false
  caseForm.value = {
    problem: '',
    shift_yao: null,
    origin_trigram: '',
    mid_trigram: '',
    final_trigram: '',
    gz_time: '',
    d_time: '',
    gender: null,
    hint: '',
    outside_react: '',
    prediction: '',
    result: '',
    correct: null,
    pre_desc: '',
    rethink: ''
  }
}

const handleConfirm = async () => {
  await formRef.value.validate()
  if (modalMode.value === 'add') {
    insertCase(caseForm.value).then((res) => {
      message.success('添加成功！')
      handleClose()
      getInfo()
    })
  } else if (modalMode.value === 'edit') {
    editCaseApi(caseForm.value).then((res) => {
      message.success('修改成功！')
      handleClose()
      getInfo()
    })
  }
}

const getInfo = (params) => {
  getCaseList(params).then((res) => {
    console.log(res.data)
    tableData.value = res.data
  })
}

onMounted(() => {
  getInfo()
})

watch(
  searchProblem,
  debounce((val, oldV) => {
    console.log(val)
    getInfo({ problem: val })
  }, 300)
)
</script>

<template>
  <main>
    <n-space>
      <n-button @click="addCase" class="addBtn" type="primary">新增案例</n-button>
      <n-input
        v-model:value="searchProblem"
        :clearable="true"
        type="text"
        placeholder="请输入搜索的卦题"
      />
    </n-space>
    <n-modal v-model:show="showModal" :on-after-leave="handleClose">
      <n-card
        style="width: 600px"
        :title="modalTitle"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <!-- <template #header-extra> 噢！ </template> -->
        <div class="form-wrapper">
          <n-form ref="formRef" :label-width="80" :model="caseForm" :rules="rules" :size="size">
            <n-form-item label="卦题" path="problem">
              <n-input v-model:value="caseForm.problem" placeholder="请输入问题" />
            </n-form-item>
            <n-form-item label="动爻" path="shift_yao">
              <n-input-number
                v-model:value="caseForm.shift_yao"
                :min="1"
                :max="6"
                placeholder="输入动爻"
              />
            </n-form-item>
            <n-form-item label="主卦" path="origin_trigram">
              <n-select
                v-model:value="caseForm.origin_trigram"
                :options="trigramOptions"
                placeholder="选择主卦"
                filterable
              />
            </n-form-item>
            <n-form-item label="互卦" path="mid_trigram">
              <n-select
                v-model:value="caseForm.mid_trigram"
                :options="trigramOptions"
                placeholder="选择互卦"
                filterable
              />
            </n-form-item>
            <n-form-item label="变卦" path="final_trigram">
              <n-select
                v-model:value="caseForm.final_trigram"
                :options="trigramOptions"
                placeholder="选择变卦"
                filterable
              />
            </n-form-item>
            <n-form-item label="干支" path="gz_time">
              <n-input v-model:value="caseForm.gz_time" placeholder="干支时间" />
            </n-form-item>
            <n-form-item label="时间" path="d_time">
              <n-input v-model:value="caseForm.d_time" placeholder="电话号码" />
            </n-form-item>
            <n-form-item label="性别" path="gender">
              <n-select
                v-model:value="caseForm.gender"
                :options="[
                  {
                    label: '男',
                    value: 1
                  },
                  {
                    label: '女',
                    value: 0
                  }
                ]"
                placeholder="选择性别"
              />
            </n-form-item>
            <n-form-item label="提示" path="hint">
              <n-input v-model:value="caseForm.hint" placeholder="请输入提示" />
            </n-form-item>
            <n-form-item label="外应" path="outside_react">
              <n-input v-model:value="caseForm.outside_react" placeholder="请输入外应" />
            </n-form-item>
            <n-form-item label="预测" path="prediction">
              <n-input
                v-model:value="caseForm.prediction"
                type="textarea"
                placeholder="请输入预测结果"
              />
            </n-form-item>
            <n-form-item label="断卦思路" path="pre_desc">
              <n-input
                v-model:value="caseForm.pre_desc"
                type="textarea"
                placeholder="请输入断卦的思路"
              />
            </n-form-item>
            <n-divider v-text="'卦后'" title-placement="right" />
            <n-form-item label="卦后反思" path="rethink">
              <n-input
                v-model:value="caseForm.rethink"
                type="textarea"
                placeholder="请输入断卦的反思收获"
              />
            </n-form-item>
            <n-form-item label="反馈" path="result">
              <n-input
                v-model:value="caseForm.result"
                type="textarea"
                placeholder="请输入实际的结果"
              />
            </n-form-item>
            <n-form-item label="对错" path="correct">
              <n-radio-group v-model:value="caseForm.correct" name="radiogroup">
                <n-space>
                  <n-radio
                    v-for="res in [
                      { label: '正确', value: 1 },
                      { label: '错误', value: 0 }
                    ]"
                    :key="res.label"
                    :value="res.value"
                  >
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
            <n-button @click="handleClose">取消</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
    <div>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="true"
        max-height="70vh"
        striped
      />
    </div>
  </main>
</template>
<style scoped lang="less">
.form-wrapper {
  height: 500px;
  overflow-y: scroll;
  padding-right: 20px;
}
main {
  .addBtn {
    margin-bottom: 20px;
  }
}

/* 针对平板设备的样式 */
@media screen and (max-width: 1024px) {
  .container {
    background: red;
  }
}
/* 当屏幕宽度小于600px时 移动端 */
@media screen and (max-width: 600px) {
  .container {
    background: yellow;
  }
}
</style>
