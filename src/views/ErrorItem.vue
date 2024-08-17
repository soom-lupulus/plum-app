<script setup>
import { ref } from 'vue'
import {debounce} from 'lodash'
import { useRouter } from 'vue-router';

const router = useRouter()
const pazz = ref('')
const onPazzUpdate = debounce((val) => {
    if(val === 'yggisygg'){
        localStorage.setItem('ygg', 'yggisygg')
        router.replace('/')
    }
}, 300)
</script>

<template>
  <n-alert title="无权访问" type="error">
    不好意思，您无权访问，请尝试输入管理员密码
  </n-alert>
  <n-input
    class="nIpt"
    v-model:value="pazz"
    @update:value="onPazzUpdate"
    round
    placeholder="在此输入密码尝试访问"
  />
</template>

<style scoped>
.nIpt {
  margin: 20px 0;
}
</style>
