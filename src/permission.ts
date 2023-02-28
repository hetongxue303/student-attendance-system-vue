import router from './router'
import NProgress from './plugins/nProgress'
import { setBrowserTitle } from './utils/common'
import { getToken } from './utils/auth'
import { useUserStore } from './store/modules/user'

const REQUEST_WITHE_LIST: string[] = ['/login', '/register']

router.beforeEach((to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  // 判断是否登录
  if (getToken() && userStore.getAuthorization) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
    // 未登录 白名单放行 并清空登录信息
  } else if (REQUEST_WITHE_LIST.indexOf(to.path) !== -1) {
    userStore.systemLogout()
    next()
    // 未登录 返回/重定向登录页 并清空登录信息
  } else {
    userStore.systemLogout()
    next(
      to.fullPath === '/dashboard' ? '/login' : `/login?redirect=${to.fullPath}`
    )
  }
  NProgress.done()
})

router.afterEach(() => setBrowserTitle(router))
