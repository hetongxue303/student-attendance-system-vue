import axios from '../utils/request'

const baseApi = import.meta.env.VITE_BASIC_API

export const getUserAll = (role: number) => {
  // 1管理员 2教师 3学生
  return axios({
    method: 'GET',
    url: `${baseApi}/user/getAll/${role}`
  })
}
