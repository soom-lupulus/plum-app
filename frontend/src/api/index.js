import axios from 'axios'
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(['message'])
import router from '@/router'

const instance = axios.create({
  baseURL: `http://${window.location.hostname}:8887`,
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const { status } = error.response
    switch (status) {
      // token过期直接跳转登录页
      case 401:
        localStorage.removeItem('token')
        router.replace('/')
        break
      default:
        break
    }
    message.error(error.message)
    // message.error(error.response.data.message)
    return Promise.reject(error)
  }
)

export default instance
