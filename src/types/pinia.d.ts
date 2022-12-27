export type appStore = {
  collapse: boolean
}

export type permissionStore = {
  menus: any[]
  routers: any[]
  permissions: string[]
}

export type settingsStore = {}

export type TabStore = {
  tabs: Array<any>
  activeName: string
  currentTabName: string
  isContextMenu?: boolean
}

export type UserStore = {
  authorization: string
  username: string
  avatar: string
  roles: string[]
  isAdmin: boolean
}
