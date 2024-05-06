import { fetchSelectMixedTrainingNum } from "@/fetch/establish"

export default {
  // 项目管理 vuex
  namespaced: true,
  state: {
    // 混合培训班统计数
    mixinsTrainingCount: {
      courseNum: 0,
      liveNum: 0,
      testNum: 0,
      caseNum: 0,
      assignmentNum: 0,
      subjectNum: 0
    }
  },
  mutations: {
    updateMininsTrainingCount(state, info) {
      state.mixinsTrainingCount = info
    }
  },
  actions: {
    getMixinsCountAsync({ state }, classId) {
      return new Promise((resolve, reject) => {
        const data = { classId }
        fetchSelectMixedTrainingNum({ data })
          .then((res) => {
            state.mixinsTrainingCount = res
            return resolve()
          })
          .catch((error) => {
            return reject(error)
          })
      })
    }
  },
  getters: {
    getMixinsTrainingCount: (state) => {
      return state.mixinsTrainingCount
    }
  }
}