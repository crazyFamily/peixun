import { dataHeaders, httpServe } from '@/util/utils'
import { SERVER_BASEHOST } from '@/util/constants'

let mockUrl = 'http://localhost:9000'
if (process.env.VUE_APP_API_TYPE !== 'local') {
  mockUrl = SERVER_BASEHOST
}

// 潜才库查询
export const fetchQCSotreList = (params) =>
  httpServe('/fn/qc/foster/qCSotreList', {
    data: { ...params.data, tip: 'Y' }
  })

// 潜才库查询
export const fetchExportQCSotreList = (params) =>
  httpServe('/fn/qc/foster/qCSotreList', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 潜才查询条件搜索
export const fetchQCSotreQryParam = (params) => httpServe('/fn/qc/foster/qCSotreQryParam', params)

// 潜才查询权限列表
export const fetchQCAuthList = (params) =>
  httpServe('/fn/qc/foster/qCAuthList', {
    data: { ...params.data, tip: 'Y' }
  })

// 导出潜才查询权限列表
export const fetchExportQCAuthList = (params) =>
  httpServe('/fn/qc/foster/qCAuthList', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 潜才删除权限
export const fetchRemoveQCAuths = (params) => httpServe('/fn/qc/foster/removeQCAuths', params)

//潜才权限详情
export const fetchQCAuthDetail = (params) => httpServe('/fn/qc/foster/qCAuthDetail', params)

// 潜才新增或编辑权限
export const fetchAddOrEditQCAuth = (params) => httpServe('/fn/qc/foster/addOrEditQCAuth', params)

// 查询人员信息
export const fetchQryAuthUser = (params) => httpServe('/fn/qc/foster/qryAuthUser', params)

// 导出失败人员
export const fetchExportFailedUser = (params) =>
  httpServe('/fn/qc/foster/exportFailedUser', params, {
    headers: { responseType: 'blob' }
  })

// 批量导入潜才权限人员信息
export const fetchBatchImportAuthUsers = (params, options) =>
  httpServe('/common/qc/batchImportAuthUsers', params, {
    ...dataHeaders,
    ...options
  })

// 确认导入
export const fetchImportUser = (params) => httpServe('/fn/qc/foster/importUser', { ...params, tip: 'Y' })

// 查询方案列表
export const fetchQcFosterPlanList = (params) =>
  httpServe('/fn/qc/foster/qcFosterPlanList', {
    data: { ...params.data, tip: 'Y' }
  })

// 导出方案列表
export const fetchExportQcFosterPlanList = (params) =>
  httpServe('/fn/qc/foster/qcFosterPlanList', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 查询方案详情
export const fetchFosterPlanDetail = (params, options) =>
  httpServe('/fn/qc/foster/fosterPlanDetail', params, {
    ...options
  })

// 添加编辑培养方案
export const fetchAddOrEditFosterPlan = (params, options) =>
  httpServe('/fn/qc/foster/addOrEditFosterPlan', params, {
    ...options
  })

// 添加删除培养方案
export const fetchDeleteQcFosterPlan = (params, options) =>
  httpServe('/fn/qc/foster/deleteQcFosterPlan', params, {
    ...options
  })

// 获取登录用户权限下的潜才项目
export const fetchAuthProjectList = (params, options) =>
  httpServe('/fn/qc/foster/authProjectList', params, {
    ...options
  })

// 获取登录用户权限下的潜才项目
export const fetchQryUsers = (params) => httpServe('/fn/qc/foster/qryUsers', params)

// 潜才培养议题列表查询
export const fetchQcFosterSubjectList = (params) =>
  httpServe(
    '/fn/qc/foster/qcFosterSubjectList',
    {
      data: { ...params.data, tip: 'Y' }
    },
    {
      loading: 'LOADING_TALENTS_SUBJECT_LIST'
    }
  )

// 潜才培养导出议题列表
export const fetchExportQcFosterSubjectList = (params) =>
  httpServe(
    '/fn/qc/foster/qcFosterSubjectList',
    {
      data: { ...params.data, tip: 'N' }
    },
    {
      headers: { responseType: 'blob' }
    }
  )

// 议题详情
export const fetchQcFosterSubjectDetail = (params) => httpServe('/fn/qc/foster/qcFosterSubjectDetail', params)

// 添加编辑议题
export const fetchAddOrEditQcFosterSubject = (params) => httpServe('/fn/qc/foster/addOrEditQcFosterSubject', params)

// 导出上传失败信息
export const fetchExportFailData = (params) => httpServe('/commons/exportFail/exportFailData', params)

// 权限范围内的潜才培养方案数据
export const fetchQcFosterPlans = (params) => httpServe('/fn/qc/foster/qcFosterPlans', params)

// 导入议题战队成员
export const fetchQcSubjectTeam = (params) => httpServe('/common/qc/batchImportQcSubjectTeamUsers', params)

// 删除议题
export const fetchRemoveQcFosterSubjects = (params) => httpServe('/fn/qc/foster/removeQcFosterSubjects', params)

// 导入议题
// export const fetchBatchImportQcSubjects = (params) => httpServe('/common/qc/batchImportQcSubjects', params)

// 批量导入批量导入潜才议题战队信息
export const fetchBatchImportQcSubjectTeamsInfo = (params) => httpServe('/common/qc/batchImportQcSubjectTeamsInfo', params)

// 批量导入批量导入潜才议题
export const fetchBatchImportQcSubjects = (params) => httpServe('/common/qc/batchImportQcSubjects', params)

// 确认发送导入成功的议题
export const fetchHandleQcSubjectNew = (params) => httpServe('/fn/qc/foster/handleQcSubjectNew', { ...params, tip: 'Y' })

// 确认发送导入成功的战队信息
export const fetchHandleQcSubjectTeamsInfo = (params) => httpServe('/fn/qc/foster/handleQcSubjectTeamsInfo', { ...params, tip: 'Y' })

// 培养管理-查询学员是否已关联培训班
export const fetchCheckTrainingClass = (params) => httpServe('/fn/xr/training/offline/checkTrainingClass', params)

// 提交议题终审
export const fetchSaveQcFosterSubjectEvaluate = (params) => httpServe('/fn/qc/foster/saveQcFosterSubjectEvaluate', params)

// 查询学员评价列表-旧
export const fetchQcStudentEvaluateList = ({ data }) => httpServe('/fn/qc/foster/qcStudentEvaluateList', { data: { ...data, tip: 'Y' } })

// 查询学员评价列表
export const fetchListPlanTeamEvaluate = ({ data }) => httpServe('/fn/qc/foster/listPlanTeamEvaluate', { data: { ...data, tip: 'Y' } })
// 导出学员评价
export const fetchExportListPlanTeamEvaluate = ({ data }) =>
  httpServe(
    '/fn/qc/foster/listPlanTeamEvaluate',
    { data: { ...data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )

// 导出学员评价 - 旧
export const fetchExportStudentEvaluateList = ({ data }) =>
  httpServe(
    '/fn/qc/foster/qcStudentEvaluateList',
    { data: { ...data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )

// 批量导入学员
export const fetchBatchImportQcPlanTeamsEvaluate = (params) => httpServe('/common/qc/batchImportQcPlanTeamsEvaluate', params)

// 确认导入学员
export const fetchHandleQcPlanTeamsEvaluate = (params) => httpServe('/fn/qc/foster/handleQcPlanTeamsEvaluate', { ...params, tip: 'Y' })

// 批量导入学员评价 - 旧
export const fetchBatchImportQcStudentEvaluate = (params) => httpServe('/common/qc/batchImportQcStudentEvaluate', params)

// 导出失败学员
export const fetchExportFailedPlanTeamsEvaluate = (params) =>
  httpServe('/fn/qc/foster/exportFailedPlanTeamsEvaluate', params, {
    headers: { responseType: 'blob' }
  })

// 确认发送导入成功的学员评价
export const fetchHandleQcStudentEvaluate = (params) => httpServe('/fn/qc/foster/handleQcStudentEvaluate', { ...params, tip: 'Y' })

// 查询学员评价详情
export const fetchQcStudentEvaluateDetail = (params) => httpServe('/fn/qc/foster/qcStudentEvaluateDetail', params)

// 保存学员评价 - 旧
export const fetchSaveQcStudentEvaluate = (params) => httpServe('/fn/qc/foster/saveQcStudentEvaluate', params)

// 保存学员评价
export const fetchSavePlanTeamsEvaluate = (params) => httpServe('/fn/qc/foster/savePlanTeamsEvaluate', params)

// 导入学员信息
export const fetchBatchImportQcPlanTeams = (params) => httpServe('/common/qc/batchImportQcPlanTeams', params)
// 导出学员失败信息
export const fetchExportFailedPlanTeamsInfo = (params) =>
  httpServe('/fn/qc/foster/exportFailedPlanTeamsInfo', params, {
    headers: { responseType: 'blob' }
  })
// 确认添加学员
export const fetchHandleQcPlanTeamsInfo = (params) => httpServe('/fn/qc/foster/handleQcPlanTeamsInfo', params)
// 查询学员
export const fetchListPlanTeams = ({ data }) => httpServe('/fn/qc/foster/listPlanTeams', { data: { ...data, tip: 'Y' } })
// 导出学员
export const fetchExportListPlanTeams = ({ data }) =>
  httpServe(
    '/fn/qc/foster/listPlanTeams',
    { data: { ...data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )
// 删除学员
export const fetchDeletePlanTeams = (params) => httpServe('/fn/qc/foster/deletePlanTeams', params)

// 提交督办
export const fetchSaveSuperviseAndHandle = (params) => httpServe('/fn/qc/foster/saveSuperviseAndHandle', params)

// 查看督办
export const fetchFindSuperviseAndHandleDetail = (params) => httpServe('/fn/qc/foster/findSuperviseAndHandleDetail', params)
// 培养进展列表
export const fetchListFosterProgress = ({ data }) => httpServe('/fn/qc/foster/listFosterProgress', { data: { ...data, tip: 'Y' } })

// 培养进展列表导出
export const fetchExportListFosterProgress = ({ data }) =>
  httpServe(
    '/fn/qc/foster/listFosterProgress',
    { data: { ...data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )

// 培养进展反馈
export const fetchUpdateFosterProgress = (params) => httpServe('/fn/qc/foster/updateFosterProgress', params, { loading: 'LOADING_TANLENTS_PROGRESS' })

// 培养进展详情
export const fetchFosterProgressDetail = (params) => httpServe('/fn/qc/foster/fosterProgressDetail', params)

//  潜才项目进展收集
export const fetchSaveFosterProgress = (params) =>
  httpServe('/fn/qc/foster/saveFosterProgress', params, { loading: 'LOADING_TANLENTS_PROGRESS_CREATE' })