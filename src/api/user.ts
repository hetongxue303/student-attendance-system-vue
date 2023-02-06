import axios from '../utils/request'
import { QueryUser, User } from '../types/entity'
import { encryptMD5 } from '../hook/encryptMD5'

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
    url: `${baseApi}/user/get/all/${role}`
  })
}
export const getUserByUsername = (username: string) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/user/get/username/${username}`
  })
}
export const getUserPage = (params: QueryUser) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/user/get/page`,
    params
  })
}

export const delUser = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/user/delete/${id}`
  })
}

export const addUser = (data: User) => {
  if (!data.password) {
    data.password = encryptMD5('123456') // 设置默认密码
  }
  return axios({
    method: 'POST',
    url: `${baseApi}/user/insert`,
    data
  })
}
export const updateUser = (data: User) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/user/update`,
    data
  })
}

export const delBatchUser = (data: Array<number>) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/user/delete/batch`,
    data: { data }
  })
}

export const getUserCenter = (username: string) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/user/center`,
    params: { username }
  })
}

export const updateUserPassword = (info: any) => {
  const data = {
    old_password: encryptMD5(info.oldPassword),
    new_password: encryptMD5(info.newPassword)
  }
  return axios({
    method: 'PUT',
    url: `${baseApi}/user/update/password`,
    data
  })
}
