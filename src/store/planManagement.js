import { fetchCalPlanTotalInfo, fetchFindPackageInfo, fetchFindPlanInfoDetail } from '@/fetch/planManagement'
import { fetchListPlanDict } from '@/fetch/public'
import { CopyObj } from '@/util/utils'
import { CLASS_TYPES_MAP, NOT_TRAINING_COURSE_TYPE, TRAINING_COURSE_TYPE } from '@/views/PlanManagement/enum'

const formatAnnualPackageInfo = (packageInfo, data) => {
  // 计划信息
  packageInfo = CopyObj(packageInfo)
  // 计划总期数
  packageInfo.totalAllTerm = data.totalAllTerm
  // 已执行期数
  packageInfo.completionPlanSum = data.completionPlanSum
  // 计划外期数
  packageInfo.outPlanSum = data.outPlanSum
  // 预计分摊人数
  packageInfo.apportionStu = data.apportionStu
  // 分摊期数
  packageInfo.apportionTerm = data.apportionTerm
  // 总预算
  packageInfo.totalPlanAmt = data.totalPlanAmt
  // 已立项未报账金额
  packageInfo.unPayedAmt = data.unPayedAmt
  // 报销流程中金额
  packageInfo.occupyAmt = data.occupyAmt
  // 已支出金额
  packageInfo.paidAmt = data.paidAmt
  return packageInfo
}

const formatTotalCountDatas = (totalDatas) => {
  // 拆分两个类型并装入store
  const data = { [TRAINING_COURSE_TYPE]: {}, [NOT_TRAINING_COURSE_TYPE]: {} }
  const baseData = {
    totalTerm: '',
    totalStu: '',
    totalFee: ''
  }
  data[TRAINING_COURSE_TYPE] = totalDatas.find((v) => Number(v.planClassType) === Number(CLASS_TYPES_MAP[TRAINING_COURSE_TYPE])) || { ...baseData }
  data[NOT_TRAINING_COURSE_TYPE] = totalDatas.find((v) => Number(v.planClassType) === Number(CLASS_TYPES_MAP[NOT_TRAINING_COURSE_TYPE])) || {
    ...baseData
  }
  return data
}

const BASE_ANNUAL_DATA = {
  annualStatus: 'info',
  // 年度计划查询对像集
  annualSearchForm: {},
  // 年度计划信息
  annualPlanInfo: {},
  // 计划信息
  annualPackageInfo: {},
  // 附件列表
  accessoryFiles: [],
  // 培训班数据
  annualClasses: [],
  // 非培训班数据
  annualNonclasses: [],
  baseSelectOptions: [],
  // 用于新增组件的入参结构
  currentEditCompProps: {},
  // 存储头部的查询参 orgName: 机构名, busiType: 条线/机构id, year: 年份, currentOrg: 当前选择的机构信息
  currentTopSearchParams: { orgName: '', busiType: [], year: '', currentOrg: {} },
  // 预留费用数据
  annualReverseFee: {},
  // 审批链
  annaulApprovalData: { chain: { auditUsers: '', auditUsersUm: '', approvalValue: '' }, remark: '' },
  // 计划总计数据
  annaulTotalPlanCount: {
    [TRAINING_COURSE_TYPE]: {},
    [NOT_TRAINING_COURSE_TYPE]: {}
  },
  // 被分配计划
  annualDispenseList: []
}

export default {
  // 计划管理 vuex
  namespaced: true,
  state: {
    ...CopyObj(BASE_ANNUAL_DATA)
  },
  mutations: {
    /**
     * 切换状态
     * @param {*} status:string = 'info|edit'
     */
    changeStatus(state, status) {
      state.annualStatus = status
    },
    // 数据重置
    resetAnnualDatas(state) {
      const data = CopyObj(BASE_ANNUAL_DATA)
      Object.keys(data).forEach(key => {
        state[key] = data[key]
      })
    },
    // 查询条件有变更的时候进行更新
    updateSearchParams(state, params) {
      state.currentTopSearchParams = Object.assign({}, state.currentTopSearchParams, CopyObj(params))
    },
    // 更新附件列表
    updateAccessoryFiles(state, files) {
      state.accessoryFiles = CopyObj(files)
    },
    // 更新审批链数据
    updateApprovalData(state, data) {
      state.annaulApprovalData = CopyObj(data)
    }
  },
  actions: {
    // 获取年度计划信息
    getAnnualPlanInfo({ state }, params) {
      return new Promise((resolve, reject) => {
        fetchFindPackageInfo(params)
          .then((res) => {
            state.annualPlanInfo = res || {}
            state.annualPackageInfo = formatAnnualPackageInfo(res.planPackage || {}, res)
            state.accessoryFiles = res.files
            state.annualClasses = res.classes
            state.annualNonclasses = res.nonclasses
            state.annualDispenseList = res.dispenseList
            state.annualReverseFee = res.reverseFee
            res?.planCal && (state.annaulTotalPlanCount = formatTotalCountDatas(res?.planCal))
            return resolve()
          })
          .catch((error) => {
            return reject(error)
          })
      })
    },
    // 获取字典表数据，用于培训班/非培训班查询项，业务模块和关键岗位之类的
    getBaseInfoSelectOptions({ state }, params) {
      console.log(params, '===>> params')
      return new Promise((resolve, reject) => {
        fetchListPlanDict(params)
          .then((res) => {
            state.baseSelectOptions = res
            return resolve()
          })
          .catch((error) => {
            return reject(error)
          })
      })
    },
    // 获取计划明细
    getPlanDetailInfo({ state }, params) {
      return new Promise((resolve, reject) => {
        const data = {
          planId: params.annualPlanId,
          dept: state.annualPackageInfo?.blgDept,
          line: state.annualPackageInfo?.blgStripLine
        }
        fetchFindPlanInfoDetail(data)
          .then((res) => {
            return resolve(res)
          })
          .catch((error) => {
            return reject()
          })
      })
    },
    // 组装编辑组件的数据结构
    formatEditCompProps({ state, dispatch }, params) {
      return new Promise(async (resolve, reject) => {
        try {
          const fetchParams = {
            type: params.classType,
            line: state.annualPlanInfo?.blgStripLine || state.currentTopSearchParams?.busiType[0]
          }
          await dispatch('getBaseInfoSelectOptions', fetchParams)
          if (!state.annualPlanInfo) return resolve({})
          // 使用currentTopSearchParams是为了兼容没有计划信息的时候，后端返回为空的状态
          const currentEditCompProps = CopyObj({
            dept: state.annualPackageInfo?.blgDept || state.currentTopSearchParams.busiType[1],
            // 不传则认为是新增
            pageState: params.planStatus || 'create',
            data: {},
            classType: params.classType,
            selectOptions: state.baseSelectOptions,
            blgDeptName: state.annualPackageInfo?.blgDeptName || state.currentTopSearchParams.blgDeptName,
            blgStripLine: state.annualPackageInfo?.blgStripLine || state.currentTopSearchParams.busiType[0],
            year: state.annualPackageInfo?.planYear || state.currentTopSearchParams.year,
            currentOrg: state.currentTopSearchParams.currentOrg || {}
          })

          if (params.planStatus === 'edit') {
            currentEditCompProps.data = await dispatch('getPlanDetailInfo', params)
          }

          state.currentEditCompProps = currentEditCompProps
          return resolve(currentEditCompProps)
        } catch (error) {
          return reject(error)
        }
      })
    },
    /**
     * 打开/关闭编辑组件
     * @param {*} params = {
     *  classType?: string
     *  status: 'info|edit'
     *  planStatus?: 'create|edit'
     *  annualPlanId?: string  在planStatus为edit的情况下需要传id
     * }
     * @returns
     */
    changeAnnualEditComp({ state, dispatch, commit }, params) {
      return new Promise(async (resolve, reject) => {
        try {
          params.status === 'edit' && (await dispatch('formatEditCompProps', params))
          commit('changeStatus', params.status)
          return resolve()
        } catch (error) {
          return reject(error)
        }
      })
    },
    // 获取总计数据
    getTotalCountDatas({ state }, classTypeList) {
      return new Promise(async (resolve, reject) => {
        fetchCalPlanTotalInfo({ packageId: state.annualPackageInfo.planPackageId, classTypeList: classTypeList })
          .then((res) => {
            state.annaulTotalPlanCount = formatTotalCountDatas(res)
            return resolve()
          })
          .catch((error) => {
            return reject(error)
          })
      })
    }
  },
  getters: {
    getAnnualStatus: (state) => state.annualStatus,
    getAnnualInfo: (state) => state.annualPlanInfo,
    getAnnualPackageInfo: (state) => state.annualPackageInfo,
    getAnnualClasses: (state) => state.annualClasses,
    getNnnualNonclasses: (state) => state.annualNonclasses,
    getCurrentEditCompProps: (state) => state.currentEditCompProps,
    getAccessoryFiles: (state) => state.accessoryFiles,
    getAnnualReverseFee: (state) => state.annualReverseFee,
    getCurrentTopSearchParams: (state) => state.currentTopSearchParams,
    getAnnaulApprovalData: (state) => state.annaulApprovalData,
    getAnnaulTotalPlanCount: (state) => state.annaulTotalPlanCount,
    getAnnualDispenseList: (state) => state.annualDispenseList
  }
}