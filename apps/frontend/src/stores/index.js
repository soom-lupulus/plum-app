import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userInfo= ref(null)
  const setUserInfo = data => userInfo.value = data

  return { userInfo, setUserInfo}
}, {
  persist: true
})
