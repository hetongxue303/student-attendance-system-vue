import { defineStore } from 'pinia'
import { UserStore } from '../../types/pinia'
import { getToken, removeToken, removeTokenTime } from '../../utils/auth'
import { local, session } from '../../utils/storage'

export const useUserStore = defineStore('user', {
  state: (): UserStore => {
    return {
      token: getToken() || '',
      avatar: '',
      username: '',
      roles: [],
      isAdmin: false
    }
  },
  getters: {
    getToken: (state) => state.token,
    getRoles: (state) => state.roles,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
    getIsAdmin: (state) => state.isAdmin
  },
  actions: {
    setUserInfo(data: any) {
      this.token = data.access_token
      const { username, avatar, is_admin } = data.user
      // if (roles && roles.length > 0) {
      //   this.roles = roles
      this.username = username
      this.avatar = avatar
      this.isAdmin = is_admin
      // } else {
      //   this.roles = []
      // }
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
