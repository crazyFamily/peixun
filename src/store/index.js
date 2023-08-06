import { CopyObj } from '@/plugins/until'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import app from './app'
import trainingCampStore from './trainingCamp'
import reimbursed from './reimbursed'
import planManagement from './planManagement'
import caseCenter from './caseCenter'
import establish from './establish'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      reducer: (data) => ({ userInfo: data.userInfo })
    })
  ],
  state: {
    userInfo: { menuInfoList: [] },
    keepAliveComponents: [],
    activeIndex: -1,
    refreshQueue: []
  },
  mutations: {
    setUserInfo(state, userInfo) {
      // 处理角色ID
      if (!userInfo.roleIds) {
        userInfo.roleIds = []
      } else {
        userInfo.roleIds = userInfo.roleIds.split(',')
      }
      state.userInfo = userInfo
    },
    addKeepAlive(state, item) {
      state.keepAliveComponents.push(item)
    },
    // keepalive对象更新
    updateKeepAliveComponents(state, { row, index }) {
      const datas = CopyObj(state.keepAliveComponents)
      datas[index] = row
      state.keepAliveComponents = datas
    },
    // 设置路由title, 用于更新页签名称
    setRouteTitle(state, title) {
      const row = state.keepAliveComponents[state.activeIndex]
      this.commit('updateKeepAliveComponents', { row: { ...row, title }, index: state.activeIndex })
    },
    delKeepAlive(state, item) {
      const index = state.keepAliveComponents.findIndex((v) => v.path === item.path)
      if (index > -1) {
        state.keepAliveComponents.splice(index, 1)
      }
    },
    changeKeepAlive(state, data) {
      const { index, key, value } = data
      state.keepAliveComponents[index][key] = value || ''
    },
    changeIndex(state, index) {
      state.activeIndex = index
    },
    updateQueue(state, name) {
      const data = CopyObj(state.refreshQueue)
      data.push(name)
      state.refreshQueue = Array.from(new Set(data))
    },
    removeQueue(state, name) {
      state.refreshQueue = state.refreshQueue.filter((row) => row !== name)
    }
  },
  actions: {},
  getters: {
    keepAliveComponents: (state) => {
      return state.keepAliveComponents.filter((v) => !v.notShow)
    },
    getRefreshQueue: ({ refreshQueue }) => {
      return refreshQueue
    },
    getUserInfo: (state) => {
      return state.userInfo
    }
  },
  modules: {
    app,
    trainingCamp: trainingCampStore,
    reimbursed,
    planManagement,
    caseCenter,
    establish
  }
})
