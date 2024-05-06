import { CopyObj } from "@/plugins/until"

export default {
  namespaced: true,
  state: {
    loaddingFlags: {},
    isFullScreen: false,
    asideCollapse: true
  },
  mutations: {
    /**
     *
     * @param {*} state vuex-state
     * @param {*} data: Object
     * {
     *    key: String 需要查找的keyName
     *    status: Boolean loading状态开启(true)还是关闭(false)
     * }
     */
    updateLoadingStatus: (state, data) => {
      if (data.status === true && state.loaddingFlags.hasOwnProperty([data.key])) {
        console.warn('存在有重复的loading keyName: ', data.key)
        return
      }
      const maps = CopyObj(state.loaddingFlags)
      maps[data.key] = data.status
      // 如果请求已完成，那就认为不需要这个状态标识，可去掉
      if (data.status === false) {
        Reflect.deleteProperty(maps, data.key)
      }
      state.loaddingFlags = maps
    },
    updateFullScreenStatus: (state, status) => {
      state.isFullScreen = status
    },
    // 变更侧边展开收起状态
    updateAsideCollapse(state, value) {
      state.asideCollapse = value
    }
  },
  actions: {},
  getters: {
    getLoadingFlags: (state) => {
      return (key) => Boolean(state.loaddingFlags[key])
    },
    getFullScreenStatus: (state) => {
      return state.isFullScreen
    },
    getAsideCollapse: (state) => {
      return state.asideCollapse
    }
  }
}