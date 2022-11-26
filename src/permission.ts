import router from './router'
import NProgress from './plugins/nProgress'
import { setBrowserTitle } from './utils/common'

const REQUEST_WITHE_LIST: string[] = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
  setBrowserTitle(router)
})
