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

export interface College {
  college_id?: number
  college_name?: string
  is_delete?: boolean
  description?: string
  create_time?: Date
  update_time?: Date
}

export interface QueryCollege extends College, Page {}
