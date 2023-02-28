import { defineStore } from 'pinia'
import { permissionStore } from '../../types/pinia'
import router from '../../router'

export const usePermissionStore = defineStore('permission', {
  state: (): permissionStore => {
    return {
      rawMenu: [],
      menuItem: [],
      routers: [],
      permissions: []
    }
  },
  getters: {
    getRawMenu: (state) => state.rawMenu,
    getMenuItem: (state) => state.menuItem,
    getRouters: (state) => state.routers,
    getPermissions: (state) => state.permissions
  },
  actions: {
    setRouter() {
      this.routers.forEach((item) => {
        if (!router.hasRoute(item.name as string)) router.addRoute('main', item)
      })
    },
    clearRouter() {
      this.routers.forEach((item) => {
        if (item.name !== '/dashboard') router.removeRoute(item.name as string)
      })
    }
  },
  persist: {
    key: 'PERMISSION',
    storage: localStorage
  }
})
