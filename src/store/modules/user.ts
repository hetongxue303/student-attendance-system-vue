import { defineStore } from 'pinia'
import { UserStore } from '../../types/pinia'
import { getToken, removeToken, removeTokenTime } from '../../utils/auth'
import { local, session } from '../../utils/storage'
import { usePermissionStore } from './permission'
import { filterMenu } from '../../filter/menu'

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
      this.$reset()
      removeToken()
      removeTokenTime()
      session.clear()
      local.clear()
    }
  },
  persist: {
    key: 'USER',
    storage: localStorage
  }
})
