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
  time?: number
  is_delete?: boolean
  description?: string
  create_time?: Date
  update_time?: Date
}

export interface User {
  user_id?: number
  username?: string
  password?: string
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

export interface QueryCollege extends College, Page {}

export interface QueryMajor extends Major, Page {}

export interface QueryCourse extends Course, Page {}

export interface QueryUser extends User, Page {}
