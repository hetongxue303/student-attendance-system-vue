import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElNotification } from 'element-plus'
import { getToken } from './auth'

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
    if (getToken() && config.headers) {
      config.headers.authorization = getToken()
    }
    return config
  },
  (error: any) => {
    ElNotification.error(error.message || '请求错误!')
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: any) => {
    let { message } = error
    if (message === 'Network Error') {
      message = '连接异常'
    } else if (message.includes('timeout')) {
      message = '请求超时'
    } else if (message === 'Request failed with status code 401') {
      message = '凭证过期'
    } else if (message === 'Request failed with status code 403') {
      message = error.response.data.message || '没有权限'
    }
    ElNotification.error(message)
    return Promise.reject(error)
  }
)

export default axios
