import { createApp } from 'vue'
import App from './App.vue'

import pinia from './store'
import router from './router'
import ElementPlus from './plugins/element-plus'
import directive from './directive/Index'

import 'animate.css'
import 'virtual:windi.css'
import '@assets/styles/index.scss'

import '@/permission'

import 'virtual:svg-icons-register'
import SvgIcon from '@components/SvgIcon/Index.vue'

const app = createApp(App)

app.use(pinia).use(router).use(ElementPlus).use(directive)

app.component('SvgIcon', SvgIcon)

app.mount('#app')
