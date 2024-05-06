import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const SET_TRAINING_LIST = 'SET_TRAINING_LIST' // 课程配置信息
export const SET_APPROVAL_INFO = 'SET_APPROVAL_INFO' // 审批信息
export const SET_TRAINEE_INFO = 'SET_TRAINEE_INFO' //学员信息
export const SET_BASE_INFO = 'SET_BASE_INFO' // 训练营配置信息
export const UPDATE_DETAIL = 'UPDATE_DETAIL'
export const UPDATE_DETAIL_COPY = 'UPDATE_DETAIL_COPY'
export const SAVE_DRAFT = 'SAVE_DRAFT'
export const CLEAN_ERR = 'CLEAN_ERR'
export const SET_ERR = 'SET_ERR'
export const SUBMIT = 'SUBMIT'
export const CLEAR = 'CLEAR'
export const SET_APPROVAL_LIST = 'SET_APPROVAL_LIST'
export const OPERATE_STATUS = 'OPERATE_STATUS' // 当前用户的操作状态
export const SET_EOA_STATUS = 'SET_EOA_STATUS' // 当前用户的操作状态

import { saveTrainingInfo } from '@/fetch/courseRecommendation'
import { queryTrainingDetail } from '@/fetch/courseRecommendation'
// ifDraft		string	必须 是否保存草稿：'Y'是，'N'否

export const TrainingCampTypesObj = {
  course: '课程',
  exam: '考试',
  class: '线下培训班',
  task: '作业'
}
export const TrainingCampTypes = Object.keys(TrainingCampTypesObj)
export const defaultData = () => {
  return {
    id: null, //	string	非必须训练营id(修改时必传)
    trainingName: '', //	string	必须 训练营名称
    introduce: '', //string	必须 描述
    backgroundUdmp: '', //	string	必须背景图udmp
    ifNotShow: 'N', // 配置专区(是否在底层资产专区展示, N默认不展示, Y展示)
    orgId: '', //	string	必须 所属机构id
    classAdviserUms: [], //		string []	必须 班主任um列表
    startTime: '', //	开始时间	string	必须 开始时间
    endTime: '', //	string	 必须 结束时间
    trainingAbility: '', //	string	 必须 培训能力
    auditUsers: '', //	string	非必须eoa审批用户（多个um号用分号分隔）：umid;umid
    auditUsersUm: '', //string	非必须eoa审批链：name(umid)->name(umid)
    auditUsersName: '', //	string	非必须eoa审批姓名：name->name
    umIds: [], //	number []	必须训练营学员um列表
    studentVOList: [], //	学员信息
    trainingStageList: [],
    //UI使用
    loading: false, // 接口请求状态
    traineeInfo: {
      // 学员管理信息
      list: [
        { um: '', name: '', department: '', createTime: '2022-01-01 11:11' }
      ]
    },
    classInfoDTOList: [], // 培训班负责人列表
    operateStatus: '',
    eoaStatus: '',
  }
}
// 复制时需要置空的字段
const copyEmptyKey = ['id', 'startTime', 'endTime', 'classAdviserUms', 'classAdviserUmsArr', 'trainingStageList', 'studentVOList', 'auditUsers', 'auditUsersUm', 'auditUsersName']
function computedSeries(list) {
  return list.map((item) => {
    if (item.type === 'series') {
      computedSeries(item.stageSeriesList)
    }
    if (item.type === 'class') {
      item.relationId = ''
      item.content = ''
      item.courseList = []
    }
    item.id = null
    return item
  })
}
export default {
  state: defaultData(),
  mutations: {
    [CLEAR](state, data) {
      Object.keys(data).forEach((key) => {
        state[key] = data[key]
      })
      console.log('CLEAR', state);
    },
    [SET_BASE_INFO](state, baseInfo) {
      Object.keys(baseInfo).forEach((key) => {
        state[key] = baseInfo[key]
      })
      console.log('state after base info ', state)
    },
    [SET_TRAINING_LIST](state, list) {
      state.trainingStageList = list
    },
    [SET_APPROVAL_INFO](state, { auditUsers, auditUsersUm, auditUsersName }) {
      state.auditUsers = auditUsers
      state.auditUsersUm = auditUsersUm
      state.auditUsersName = auditUsersName
    },
    [SET_TRAINEE_INFO](state, { umIds }) {
      state.umIds = umIds
    },
    [UPDATE_DETAIL](state, detailInfo) {
      state.loading = false
      // 训练营详情信息
      Object.keys(detailInfo).forEach((key) => {
        state[key] = detailInfo[key]
      })
      const classAdviserUms = JSON.parse(detailInfo.classAdviserUms || '{}')
      state.classAdviserUms = _.keys(classAdviserUms)
      state.classAdviserUmsArr = _.keys(classAdviserUms).map((key) => ({
        um: key,
        name: classAdviserUms[key]
      }))
      console.log('UPDATE_DETAIL', state)
    },
    // 复制信息
    [UPDATE_DETAIL_COPY](state, detailInfo) {
      state.loading = false
      // 训练营详情信息
      Object.keys(detailInfo).forEach((key) => {
        if (!copyEmptyKey.includes(key)) {
          state[key] = detailInfo[key]
        }
        if (key === 'trainingStageList') {
          const list = detailInfo[key].map((item, index) => {
            const stageSeriesList = computedSeries(item.stageSeriesList)
            item.startTime = null
            item.endTime = null
            item.id = null
            return {
              ...item,
              name: String(index + 1),
              stageSeriesList,
              timeRange:
                item.startTime && item.endTime
                  ? [item.startTime, item.endTime]
                  : ''
            }
          })
          state[key] = list
        }
      })
      console.log('UPDATE_DETAIL', state, detailInfo)
    },
    [SET_ERR](state, error) {
      // state['validate'] = { ...error, error }
      state['error'] = error
    },
    // [CLEAN_ERR](state, { active: index }) {
    //   state['validate'] = _.omit(state.validate, index)
    // }
    [SET_APPROVAL_LIST](state, data) {
      const { classInfoDTOList } = state
      let flatList = []
      function cycle(list = []) {
        list.forEach(item => {
          if (item.stageSeriesList?.length > 0) {
            cycle(item.stageSeriesList)
          } else {
            flatList.push(item)
          }
        })
      }
      cycle(data)
      const classList = flatList.filter(item => item.type === 'class')
      const res = classList.map(item => {
        const info = (classInfoDTOList || []).find(i => i.classId === item.relationId)
        console.log('info', info);
        // 存在相同的 线下培训
        if (info) {
          return {
            relationId: info.classId,
            applyName: info.applyName,
            applyUmId: info.applyUmId
          }
        } else {
          return {
            relationId: item.relationId,
            applyName: item.applyName,
            applyUmId: item.applyUmId
          }
        }
      })
      console.log('SET_APPROVAL_LIST', flatList, classList, classInfoDTOList);
      console.log('SET_APPROVAL_LIST', res);
      state.classInfoDTOList = res
    },
    [OPERATE_STATUS](state, data) {
      state.operateStatus = data
    },
    [SET_EOA_STATUS](state, data) {
      state.eoaStatus = data
    }
  },
  actions: {
    [SAVE_DRAFT](state, data) {
      //调用 训练营保存草稿接口
      console.log('SAVE_DRAFT', data)
    },
    [SUBMIT]({ state, commit, rootState }, { type, id }) {
      //调用 训练营提交接口
      return new Promise(async function (resolve, reject) {
        if (state.error) {
          resolve(false)
        }
        const fields = [
          'trainingName',
          'introduce',
          'backgroundUdmp',
          'ifNotShow',
          'orgId',
          'classAdviserUms',
          'startTime',
          'endTime',
          'trainingAbility',
          'auditUsers',
          'auditUsersUm',
          'auditUsersName',
          'umIds',
          'trainingStageList'
        ]

        const submitData = _.pick(state, fields)
        try {
          await saveTrainingInfo({ ifDraft: type, data: { ...submitData, id: id } })
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    },
    async getDetailData({ state, commit, rootState }, { id, copy }) {
      state.loading = true
      const data = await queryTrainingDetail({ id })
      copy ? commit(UPDATE_DETAIL_COPY, data) : commit(UPDATE_DETAIL, data)
    }
  },
  getters: {},
  modules: {}
}