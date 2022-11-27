import { defineStore } from 'pinia'
import { settingsStore } from '../../types/pinia'

export const useSettingsStore = defineStore('settings', {
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
