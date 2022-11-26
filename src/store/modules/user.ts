import { defineStore } from 'pinia'
import { UserStore } from '../../types/pinia'
import { getToken, removeToken, removeTokenTime } from '../../utils/auth'
import { local, session } from '../../utils/storage'

const userStore = defineStore('user', {
  state: (): UserStore => {
    return {
      authorization: getToken() || '',
      avatar: '',
      username: '',
      roles: [],
      permissions: []
    }
  },
  getters: {
    getAuthorization: (state) => state.authorization,
    getRoles: (state) => state.roles,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar
  },
  actions: {
    systemLogout() {
      this.$reset()
      removeToken()
      removeTokenTime()
      session.clear()
      local.clear()
    },
    fedLogOut() {
      this.authorization = ''
      removeToken()
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {})
    }
  },
  persist: {
    key: 'USER',
    storage: localStorage
  }
})

const useUser = userStore()

export default useUser
