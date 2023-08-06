export default {
    // 案例推送 vuex
    namespaced: true,
    state: {
      remindInfo: {}
    },
    mutations: {
      // 更新提醒数据
      updateRemindInfo(state, data) {
        state.remindInfo = {
          ...data
        }
      }
    },
    getters: {
      getRemindInfo: (state) => state.remindInfo
    }
  }
  