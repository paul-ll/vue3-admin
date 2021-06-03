import router from '@/router'
import nProgress from 'nprogress'
import { getToken } from './utils/auth'
import store from '@/store'

nProgress.configure({ showSpinner: false })

const whiteList = ['/login'] // 白名单
router.beforeEach(async (to) => {
  nProgress.start()
  const hasToken = getToken()
  if (hasToken) { // 有token代表已登录
    if (to.path === '/login') {
      nProgress.done()
      return {
        path: '/',
        replace: true
      }
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        nProgress.done()
        return true
      }
      // 无用户信息和角色信息 就请求获取
      await store.dispatch('user/getUserInfo')
      // 获取权限路由
      const accessRoutes = await store.dispatch('permission/generateRoutes')
      // 动态注册路由
      accessRoutes.forEach(router.addRoute)

      // 触发重定向
      return to.fullPath
    }
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
