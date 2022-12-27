import axios from '../utils/request'
import { Course, QueryCourse } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const addCourse = (data: Course) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/course/insert`,
    data
  })
}

export const delCourse = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/course/delete/${id}`
  })
}

export const delBatchCourse = (ids: number[]) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/course/delete/batch`,
    data: { ids }
  })
}

export const updateCourse = (data: Course) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/course/update`,
    data
  })
}
export const getCourseAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/course/getAll`
  })
}

export const getCoursePage = (params: QueryCourse) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/course/getPage`,
    params
  })
}