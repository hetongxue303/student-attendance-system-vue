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

export interface QueryCollege extends College, Page {}

export interface QueryMajor extends Major, Page {}
