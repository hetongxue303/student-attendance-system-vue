import { defineStore } from 'pinia'
import { settingsStore } from '../../types/pinia'

const settingsStore = defineStore('settings', {
  state: (): settingsStore => {
    return {}
  },
  getters: {},
  actions: {},
  persist: {
    key: 'SETTINGS',
    storage: localStorage
  }
})

const useSettings = settingsStore()

export default useSettings
