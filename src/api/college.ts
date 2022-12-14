import axios from '../utils/request'
import { College, QueryCollege } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const addCollege = (data: College) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/college/insert`,
    data
  })
}

export const delCollege = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/college/delete/${id}`
  })
}

export const delBatchCollege = (ids: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/college/delete/batch`,
    data: { ids }
  })
}

export const updateCollege = (data: College) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/college/update`,
    data
  })
}
export const getCollegeAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/college/get/all`
  })
}

export const getCollegePage = (params: QueryCollege) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/college/get/page`,
    params
  })
}
