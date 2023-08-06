import { formatLocationQuery } from '@/util/utils'
import Vue from 'vue'
import VueRouter from 'vue-router'
import $store from '../store'

//解决路由重复加载的问题
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error)
}

Vue.use(VueRouter)

// 批量导入
let routerModules = require.context('./modules/', false, /\.js$/)
export let routerSet = []

routerModules.keys().forEach((item) => {
  routerSet.push(...routerModules(item).default)
})

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: '首页',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/Home/Home')
  },
  ...routerSet
]

let keepaliveList = {}
routes.map((item) => {
  if (item.path === '/') return
  // 这里做个兼容处理，方便扩展
  let componentName = ''
  if (item.componentName) {
    componentName = item.componentName
  } else {
    // 去掉/后，就是和组件name同名的值，有些path的首字母不是大写，做一次转化
    let cn = item.path.replace('/', '').replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    componentName = cn
  }
  keepaliveList[item.path] = {
    title: item.title,
    routerName: item.name,
    componentName
  }
})

const router = new VueRouter({ routes })

export default router

export const allowKeepAlive = keepaliveList

if (process.env.VUE_APP_LOCAL !== '1') {
  router.beforeEach((to, from, next) => {
    if (to.path !== '/') {
      const query = formatLocationQuery()
      if(query.keep) return next()
      if (($store.state.userInfo?.menuInfoList.length ?? 0) > 0) {
        return next()
      } else {
        $store.commit('delKeepAlive', 0)
        const { name, query, path } = to
        const params = { name, query, path }
        return next({ name: 'Home', params })
      }
    }
    next()
  })
}

export const useRouter = () => {
  return router
}

export const useRoute = () => {
  return router.currentRoute
}
