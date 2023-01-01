import axios from '../utils/request'
import { AttendanceRecord, QueryAttendanceRecord } from '../types/entity'

const baseApi = import.meta.env.VITE_BASIC_API

export const addAttendanceRecord = (data: AttendanceRecord) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/attendance-record/insert`,
    data
  })
}
export const studentAttendance = (data: AttendanceRecord) => {
  return axios({
    method: 'POST',
    url: `${baseApi}/attendance-record/student/attendance`,
    data
  })
}
export const getAttendanceRecordPage = (params: QueryAttendanceRecord) => {
  return axios({
    method: 'GET',
    url: `${baseApi}/attendance-record/get/page`,
    params
  })
}

export const updateAttendanceRecord = (data: AttendanceRecord) => {
  return axios({
    method: 'PUT',
    url: `${baseApi}/attendance-record/update`,
    data
  })
}
export const delAttendanceRecord = (id: number) => {
  return axios({
    method: 'DELETE',
    url: `${baseApi}/attendance-record/delete/${id}`
  })
}
