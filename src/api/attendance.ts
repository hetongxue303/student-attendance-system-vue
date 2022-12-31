import axios from '../utils/request'
import { Attendance, QueryAttendance } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const addAttendance = (data: Attendance) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/attendance/insert`,
    data
  })
}
export const getStudentAttendancePage = (params: QueryAttendance) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/attendance/student/get/page`,
    params
  })
}

export const updateAttendance = (data: Attendance) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/attendance/update`,
    data
  })
}
export const delAttendance = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/attendance/delete/${id}`
  })
}
