import router from '@/router'
import nProgress from 'nprogress'
import { getToken } from './utils/auth'

nProgress.configure({ showSpinner: false })

const whiteList = ['/login'] // 白名单
router.beforeEach((to) => {
  nProgress.start()
  const hasToken = getToken()
  console.log(hasToken, 'hasToken')
  if (hasToken) { // 有token代表已登录
    if (to.path === '/login') {
      nProgress.done()
      return {
        path: '/',
        replace: true
      }
    }
    nProgress.done()
    return true
  } else {
    if (whiteList.includes(to.path)) {
      nProgress.done()
      return true
    }
    nProgress.done()
    return {
      path: '/login',
      query: {
        redirect: to.path,
        ...to.query
      }
    }
  }
})

router.afterEach(() => {
  nProgress.done()
})
