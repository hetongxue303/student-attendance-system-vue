import axios from '../utils/request'
import { Menu, QueryMenuTree } from '../types/entity'
import { MenuDto } from '../types/element'

const baseApi = import.meta.env.VITE_BASIC_API

export const getMenuLazyTree = (parent_id: number) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/menu/get/tree/lazy`,
    params: { parent_id }
  })
}

export const updateMenuShow = (data: Menu) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/menu/update/show`,
    data
  })
}

export const deleteMenu = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/menu/delete/${id}`
  })
}
export const getOneMenuByRoleId = (role_id: number) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/menu/get/one`,
    params: { role_id }
  })
}
export const getMenuTreeList = (params?: QueryMenuTree) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/menu/tree`,
    params
  })
}
export const updateMenuPermission = (data: {
  role_id: number
  data: number[]
}) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/menu/update/permission`,
    data
  })
}
