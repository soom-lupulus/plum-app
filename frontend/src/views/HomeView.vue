<script setup lang="jsx">
import { ref, unref, h, onMounted, computed, nextTick, watch } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { NButton, createDiscreteApi } from 'naive-ui'
import { getCaseList, insertCase, removeCase, editCase as editCaseApi } from '@/api/case'
import { isMobile } from '@/utils'
import { debounce } from 'lodash'
import { CheckCircleRegular, TimesCircleRegular, QuestionCircleRegular } from '@vicons/fa'
import AmendContent from './AmendContent.vue'
import TrigramDetail from '@/components/page/TrigramDetail/TrigramDetail.vue'
import { useUserStore } from '@/stores'
import router from '@/router'

const userStore = useUserStore()
console.log(userStore.userInfo);

const route = useRoute()
const getDefaultFormData = () => ({
  problem: '',
  shift_yao: null,
  origin_trigram: undefined, // 选择框必须设置undefined才能显示placeholder
  mid_trigram: undefined,
  final_trigram: undefined,
  gz_time: '',
  d_time: '',
  c_time: '',
  missing: '',
  category: 0, // 默认先天
  gender: 1, // 默认男生
  hint: '',
  outside_react: '',
  prediction: '',
  result: '',
  correct: null,
  pre_desc: '',
  rethink: ''
})
const { message, dialog } = createDiscreteApi(['message', 'dialog'])
const tableData = ref([])
const showModal = ref(false)
const modalMode = ref('add')
const formData = ref(getDefaultFormData())

const searchProblem = ref('')

function createColumns({ play }) {
  return !!isMobile()
    ? [
      {
        title: '卦题',
        key: 'problem'
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
              <n-button size="small" strong secondary onClick={() => play('info', row)}>
                查看
              </n-button>
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
      // {
      //   title: '性别',
      //   key: 'gender',
      //   width: 80,
      //   render(row) {
      //     return row.gender ? '男' : '女'
      //   }
      // },
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
      // {
      //   title: '外应',
      //   key: 'outside_react',
      //   width: 80
      // },
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
        showCase({ ...row })
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

console.log(route.params);



const addCase = () => {
  modalMode.value = 'add'
  showModal.value = true
  formData.value = getDefaultFormData()
}

const editCase = (row) => {
  modalMode.value = 'edit'
  showModal.value = true
  formData.value = row
}

const showCase = (row) => {
  modalMode.value = 'info'
  showModal.value = true
  formData.value = row
}

const handleClose = () => {
  showModal.value = false
  formData.value = getDefaultFormData()
}

const getInfo = (params) => {
  getCaseList(params).then((res) => {
    console.log(res.data)
    tableData.value = res.data
  })
}

const logout = () => {
  localStorage.removeItem('token')
  router.replace('/login')
  message.warning('已退出，请重新登录！')
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
    <n-space :wrap="false">
      <n-button @click="addCase" class="addBtn" type="primary">新增案例</n-button>
      <n-input v-model:value="searchProblem" :clearable="true" type="text" placeholder="请输入搜索的卦题" />
      <div>
        <n-popconfirm @positive-click="logout" negative-text="点错了" positive-text="是的">
          <template #trigger>
            <n-button>{{ userStore.userInfo?.user_name }}</n-button>
          </template>
          确定要退出吗？
        </n-popconfirm>
      </div>
    </n-space>
    <n-modal v-model:show="showModal" :on-after-leave="handleClose">
      <trigram-detail v-if="modalMode === 'info'" :modalMode="modalMode" :formData="formData"
        :getDefaultFormData="getDefaultFormData" @handleClose="handleClose" @getInfo="getInfo"></trigram-detail>
      <amend-content v-else :modalMode="modalMode" :formData="formData" :getDefaultFormData="getDefaultFormData"
        @handleClose="handleClose" @getInfo="getInfo"></amend-content>
    </n-modal>
    <n-data-table :columns="columns" :data="tableData" :pagination="pagination" :bordered="true" max-height="70vh"
      striped />
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

.user-avatar {
  color: yellow;
  background-color: red;
  cursor: pointer;
}
</style>
