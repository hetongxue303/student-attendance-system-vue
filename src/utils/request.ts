import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElNotification } from 'element-plus'
import { getToken, removeToken, removeTokenTime } from './auth'
import NProgress from '../plugins/nProgress'
import { useUserStore } from '../store/modules/user'

axios.create({
  baseURL: import.meta.env.VITE_BASIC_HTTP,
  timeout: 10 * 1000,
  withCredentials: true,
  timeoutErrorMessage: 'timeout',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

axios.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    NProgress.start()
    if (getToken() && config.headers) {
      config.headers.authorization = getToken()
    }
    return config
  },
  (error: AxiosError) => {
    ElNotification.error(error.message || '请求错误')
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()
    return response
  },
  (error: AxiosError) => {
    const { message } = error
    const userStore = useUserStore()
    if (message.includes('500')) ElNotification.error('服务器异常')
    if (message.includes('401')) {
      userStore.systemLogout()
      window.location.replace('/login')
      ElNotification.error('登陆过期')
    }
    return Promise.reject(error)
  }
)

export default axios
