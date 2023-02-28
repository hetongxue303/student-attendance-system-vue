import { defineStore } from 'pinia'
import { UserStore } from '../../types/pinia'
import {
  getToken,
  removeToken,
  removeTokenTime,
  setToken,
  setTokenTime
} from '../../utils/auth'
import { local, session } from '../../utils/storage'
import { usePermissionStore } from './permission'
import { useTabStore } from './tab'
import { useAppStore } from './app'
import { filterMenu, filterRouter } from '../../filter/permission'

export const useUserStore = defineStore('user', {
  state: (): UserStore => {
    return {
      authorization: getToken() || '',
      avatar: '',
      username: '',
      roles: [],
      isAdmin: false
    }
  },
  getters: {
    getAuthorization: (state) => state.authorization,
    getRoles: (state) => state.roles,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
    getIsAdmin: (state) => state.isAdmin
  },
  actions: {
    setUserInfo(data: any) {
      const permissionStore = usePermissionStore()
      const { access_token, expire_time, user } = data
      setToken(`bearer ${access_token}`)
      setTokenTime(new Date().getTime() + expire_time)
      this.authorization = `bearer ${access_token}`
      if (user.roles && user.roles.length > 0) {
        this.roles = user.roles
        this.username = user.username
        this.avatar = user.avatar
        this.isAdmin = user.is_admin
      } else {
        this.roles = []
      }
      permissionStore.rawMenu = user.menus
      permissionStore.menuItem = filterMenu(user.menus, 0)
      permissionStore.routers = filterRouter(user.menus)
      // permissionStore.setRouter()
    },
    systemLogout() {
      removeToken()
      removeTokenTime()
      usePermissionStore().$reset()
      useTabStore().$reset()
      useAppStore().$reset()
      session.clear()
      local.clear()
      this.$reset()
    },
    fedLogOut() {
      removeToken()
      removeTokenTime()
      this.$reset()
    }
  },
  persist: {
    key: 'USER',
    storage: localStorage
  }
})
