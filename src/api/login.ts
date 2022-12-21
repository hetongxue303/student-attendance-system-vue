import * as qs from 'qs'
import axios from '../utils/request'

const baseApi = import.meta.env.VITE_BASIC_API

// 获取验证码
export const getCaptcha = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/captchaImage`
  })
}

// 登录处理
export const login = (data: any) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/login`,
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 注销处理
export const logout = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/auth/logout`
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/user/getUserInfo`
  })
}

// 刷新token
export const refreshToken = () => {
  return axios({
    method: 'POST',
    url: `${baseApi}/user/refreshToken`
  })
}
