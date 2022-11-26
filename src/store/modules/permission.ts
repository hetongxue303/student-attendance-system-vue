import { defineStore } from 'pinia'
import { permissionStore } from '../../types/pinia'

const permissionStore = defineStore('permission', {
  state: (): permissionStore => {
    return {
      isAdmin: false,
      menus: [],
      routers: []
    }
  },
  getters: {
    getIsAdmin: (state) => state.isAdmin,
    getMenus: (state) => state.menus,
    getRouters: (state) => state.routers
  },
  actions: {},
  persist: {
    key: 'PERMISSION',
    storage: localStorage
  }
})

const usePermission = permissionStore()

export default usePermission
