import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElNotification } from 'element-plus'
import { getToken } from './auth'
import NProgress from '../plugins/nProgress'

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
    if (message.includes('500')) ElNotification.error('服务器异常')
    return Promise.reject(error)
  }
)

export default axios
