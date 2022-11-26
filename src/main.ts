import { createApp } from 'vue'
import App from './App.vue'

import pinia from './store'
import router from './router'
import ElementPlus from './plugins/element-plus'

import '@assets/styles/index.scss'
import 'virtual:windi.css'
import 'animate.css'

import '@/permission'

const app = createApp(App)

app.use(pinia).use(router).use(ElementPlus)

app.mount('#app')
