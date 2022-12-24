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

export const logout = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/logout`
  })
}
export const getAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/menu/getAll`
  })
}

export const getCenterInfo = (username: string) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/user/center`,
    params: { username }
  })
}
