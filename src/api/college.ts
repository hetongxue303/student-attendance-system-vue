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

export const delBatchCollege = (idss: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/college/delete/batch`,
    data: { ids: idss }
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
    url: `${baseApi}/college/getAll`
  })
}

export const getCollegePage = (params: QueryCollege) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/college/getPage`,
    params
  })
}
