import axios from '../utils/request'

const baseApi = import.meta.env.VITE_BASIC_API

export const getMenuLazyTree = (parent_id: number) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/menu/get/tree/lazy`,
    params: { parent_id }
  })
}
export const getOneMenuByRoleId = (role_id: number) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/menu/get/one`,
    params: { role_id }
  })
}
