import { RouteMeta } from 'vue-router'

export interface ILogin {
  username: string
  password: string
  code: string
  rememberMe: boolean
}

interface Page {
  currentPage: number
  pageSize: number
}

/**
 * 学院属性
 */
export interface College {
  college_id?: number
  college_name?: string
  is_delete?: boolean
  description?: string
  create_time?: Date
  update_time?: Date
}

/**
 * 专业属性
 */
export interface Major {
  major_id?: number
  major_name?: string
  is_delete?: boolean
  description?: string
  create_time?: Date
  update_time?: Date
}

/**
 * 课程属性
 */
export interface Course {
  course_id?: number
  teacher_id?: number
  teacher?: User
  course_name?: string
  count?: number
  choice?: number
  class_time?: number
  is_delete?: boolean
  description?: string
  create_time?: Date
  update_time?: Date
}

/**
 * 用户属性
 */
export interface User {
  user_id?: number
  username?: string
  password?: string
  nick_name?: string
  real_name?: string
  avatar?: string
  gender?: number
  email?: string
  phone?: number
  role?: number
  is_admin?: boolean
  is_enable?: boolean
  is_delete?: boolean
  description?: string
  create_time?: Date
  update_time?: Date
}

/**
 * 选课记录
 */
export interface Choice {
  choice_id?: number
  user_id?: number
  user?: User
  course_id?: number
  course?: Course
  score?: number
  is_quit?: boolean
  is_delete?: boolean
  status?: number
  description?: string
  create_time?: Date
  update_time?: Date
}

export interface Role {
  role_id?: number
  role_name?: string
  role_key?: string
  is_enable?: boolean
  is_delete?: boolean
  description?: string
  create_time?: Date
  update_time?: Date
}

export interface Menu {
  menu_id?: number
  menu_name?: string
  menu_title?: string
  menu_type?: number
  parent_id?: number
  path?: string
  component?: string
  sort?: number
  redirect?: string
  icon?: string
  per_key?: string
  is_show?: boolean
  is_sub?: boolean
  is_cache?: boolean
  is_delete?: boolean
  description?: string
  create_time?: Date
  update_time?: Date
}

export interface Attendance {
  attendance_id?: number
  user_id?: number
  user?: User
  course_id?: number
  course?: Course
  release_time?: Date
  end_time?: Date
  course_count?: number
  attendance_count?: number
  is_end?: boolean
  create_time?: Date
  update_time?: Date
}

export interface AttendanceRecord {
  attendance_record_id?: number
  user_id?: number
  user?: User
  attendance_id?: number
  attendance?: Attendance
  attendance_type?: number
  description?: string
}

export interface MenuVo {
  name: string
  icon: string
  path: string
  children?: Array<MenuVo>
}

export interface RouterVo {
  name?: string
  path?: string
  component?: string
  meta?: RouteMeta
  children?: Array<RouterVo>
}

export interface QueryCollege extends College, Page {}

export interface QueryMajor extends Major, Page {}

export interface QueryCourse extends Course, Page {}

export interface QueryUser extends User, Page {}

export interface QueryRole extends Role, Page {}

export interface QueryMenu extends Menu, Page {}

export interface QueryAttendance extends Attendance, Page {}

export interface QueryAttendanceRecord extends AttendanceRecord, Page {}

export interface QueryChoice extends Choice, Page {
  real_name?: string
  course_name?: string
}
