import { CopyObj } from "@/util/utils"

export default {
  // 报销中心 vuex
  namespaced: true,
  state: {
    baseInfo: {},
    costCenterInfo: {}
  },
  mutations: {
    updateBaseInfo: (state, data) => {
      state.baseInfo = CopyObj(data)
    },
    updateCostCenterInfo: (state, data) => {
      state.costCenterInfo = CopyObj(data)
    }
  },
  actions: {},
  getters: {
    getBaseInfo: (state) => {
      return state.baseInfo
    },
    getCostCenterInfo: (state) => {
      return state.costCenterInfo
    }
  }
}
