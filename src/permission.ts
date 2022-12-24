import router from './router'
import NProgress from './plugins/nProgress'
import { setBrowserTitle } from './utils/common'
import { getToken } from './utils/auth'
import { useUserStore } from './store/modules/user'

const REQUEST_WITHE_LIST: string[] = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()

  if (getToken() && userStore.getToken) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else if (REQUEST_WITHE_LIST.indexOf(to.path) !== -1) {
    userStore.systemLogout()
    next()
  } else {
    userStore.systemLogout()
    next(
      to.fullPath === '/dashboard' ? '/login' : `/login?redirect=${to.fullPath}`
    )
  }
})

router.afterEach(() => {
  NProgress.done()
  setBrowserTitle(router)
})
