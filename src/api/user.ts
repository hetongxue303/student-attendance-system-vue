import axios from '../utils/request'

const baseApi = import.meta.env.VITE_BASIC_API

export interface up_email {
  email?: string
  code?: string
  password?: string
}

export interface up_password {
  old_password?: string
  new_password?: string
  confirm_password?: string
}

export const getUserAll = (role: number) => {
  // 1管理员 2教师 3学生
  return axios({
    method: 'GET',
    url: `${baseApi}/user/getAll/${role}`
  })
}

export const updateEmail = (data: up_email) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/user/update/email`,
    data
  })
}

export const updatePassword = (data: up_password) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/user/update/password`,
    data
  })
}
