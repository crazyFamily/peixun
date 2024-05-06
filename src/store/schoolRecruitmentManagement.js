export default {
    // 校招轮岗管理 vuex
    namespaced: true,
    state: {
      trainingPlanStatus: 'list',
      rotationTrainingStatus: 'list',
      // 用于编辑的入参
      currentEditCompProps: {},
      rotationComprops: {}
    },
    mutations: {
      /**
       * 切换状态
       * @param {*} status:string = 'list|config'
       */
      changeStatus(state, status) {
        state.trainingPlanStatus = status
      },
      changeRotationStatus(state, status) {
        state.rotationTrainingStatus = status
      }
    },
    actions: {
      /**
       * 打开/关闭列表|配置组件
       * @param {*} params = {
       *  classType?: string
       *  trainingPlanStatus?: string  在trainingPlanStatus为edit的情况下需要传id
       * }
       * @returns
       */
      changeTrainingPlanComp({ state, dispatch, commit }, params) {
        return new Promise(async (resolve, reject) => {
          try {
            state.currentEditCompProps = params
            commit('changeStatus', params.status)
            return resolve()
          } catch (error) {
            return reject(error)
          }
        })
      },
      changeRotationComp({ state, dispatch, commit }, params) {
        return new Promise(async (resolve, reject) => {
          try {
            state.rotationComprops = params
            commit('changeRotationStatus', params.status)
            return resolve()
          } catch (error) {
            return reject(error)
          }
        })
      }
    },
    getters: {
      getTrainingPlanStatus: (state) => state.trainingPlanStatus,
      getCurrentEditCompProps: (state) => state.currentEditCompProps,
      getRotationStatus: (state) => state.rotationTrainingStatus,
      getRotationCompProps: (state) => state.rotationComprops
    }
  }