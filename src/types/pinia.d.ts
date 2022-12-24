export type appStore = {
  collapse: boolean
}

export type permissionStore = {
  isAdmin: boolean
  menus: Array<any>
  routers: Array<any>
}

export type settingsStore = {}

export type TabStore = {
  tabs: Array<any>
  activeName: string
  currentTabName: string
  isContextMenu?: boolean
}

export type UserStore = {
  token: string
  username: string
  avatar: string
  roles: string[]
  isAdmin: boolean
}
