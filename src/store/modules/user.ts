import { defineStore } from 'pinia'
import { UserStore } from '../../types/pinia'
import { getToken, removeToken, removeTokenTime } from '../../utils/auth'
import { local, session } from '../../utils/storage'
import { usePermissionStore } from './permission'
import { filterMenu } from '../../filter/menu'
import { useTabStore } from './tab'
import { useAppStore } from './app'

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
      this.authorization = `bearer ${data.access_token}`
      const { username, roles, menus, permissions, avatar, is_admin } =
        data.user
      if (roles && roles.length > 0) {
        this.roles = roles
        this.username = username
        this.avatar = avatar
        this.isAdmin = is_admin
      } else {
        this.roles = []
      }
      permissionStore.menus.push(...filterMenu(menus, 0))
      permissionStore.permissions = permissions
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
