import { defineStore } from 'pinia'
import { permissionStore } from '../../types/pinia'

export const usePermissionStore = defineStore('permission', {
  state: (): permissionStore => {
    return {
      menus: [],
      routers: [],
      permissions: []
    }
  },
  getters: {
    getMenus: (state) => state.menus,
    getRouters: (state) => state.routers,
    getPermission: (state) => state.permissions
  },
  actions: {},
  persist: {
    key: 'PERMISSION',
    storage: localStorage
  }
})
