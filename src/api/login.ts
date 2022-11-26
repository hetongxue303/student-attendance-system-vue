import * as qs from 'qs'
import axios from '../utils/request'
import { settings } from '../settings'

const baseApi = settings.BASE_API

// 获取验证码
export const getCaptcha = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/auth/captchaImage`
  })
}

// 登录处理
export const login = (data: any) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/auth/login`,
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
