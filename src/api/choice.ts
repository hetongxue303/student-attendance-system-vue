import axios from '../utils/request'
import { Choice, QueryChoice, QueryCourse } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const addChoice = (data: Choice) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/choice/insert`,
    data
  })
}

export const delChoice = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/choice/delete/${id}`
  })
}

export const updateBatchChoice = (
  operate: boolean,
  choice_ids: Array<number>
) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/choice/update/batch`,
    data: { choice_ids, operate }
  })
}

export const updateChoice = (data: Choice) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/choice/update`,
    data
  })
}

export const getChoiceAll = () => {
  return axios({
    method: 'GET',
    url: `${baseApi}/choice/get/all`
  })
}

export const getChoicePage = (params: QueryChoice) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/choice/get/page`,
    params
  })
}
export const getChoiceByCourseId = (course_id: number) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/choice/get/course_id/${course_id}`
  })
}
export const getStudentChoicePage = (params: QueryChoice) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/choice/student/get/page`,
    params
  })
}
