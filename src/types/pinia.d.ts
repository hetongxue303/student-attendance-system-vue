import { Menu, MenuVo, RouterVo } from './entity'
import { MenuDto } from './element'
import { RouteRecordRaw } from 'vue-router'

export type appStore = {
  collapse: boolean
}

export type permissionStore = {
  rawMenu: Menu[]
  menuItem: MenuDto[]
  routers: RouteRecordRaw[]
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
