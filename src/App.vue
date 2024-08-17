<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()
// 登录鉴权
const checkUser = () => {
  const ps = localStorage.getItem('ygg')
  if(ps !== 'yggisygg'){
    router.replace('/error')
  }
}

checkUser()
</script>
<template>
  <header>
    <h1>小卜两下</h1>
  </header>
  <RouterView />
</template>

<style scoped>
h1 {
  text-align: center;
  padding-bottom: 15px;
  font-family: '幼圆';
}
</style>
