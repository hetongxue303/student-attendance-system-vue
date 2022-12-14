import { defineStore } from 'pinia'
import { permissionStore } from '../../types/pinia'

export const usePermissionStore = defineStore('permission', {
  state: (): permissionStore => {
    return {
      menus: [
        {
          name: '首页',
          icon: 'index',
          path: '/dashboard'
        }
      ],
      routers: [],
      permissions: []
    }
  },
  getters: {
    getMenus: (state) => state.menus,
    getRouters: (state) => state.routers,
    getPermissions: (state) => state.permissions
  },
  actions: {},
  persist: {
    key: 'PERMISSION',
    storage: localStorage
  }
})
