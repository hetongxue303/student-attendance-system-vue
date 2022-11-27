import { defineStore } from 'pinia'
import { appStore } from '../../types/pinia'

export const useAppStore = defineStore('app', {
  state: (): appStore => {
    return {
      collapse: false
    }
  },
  getters: {
    getCollapse: (state) => state.collapse
  },
  actions: {
    setCollapse(status: boolean) {
      this.collapse = status
    }
  },
  persist: {
    key: 'APP',
    storage: localStorage
  }
})
