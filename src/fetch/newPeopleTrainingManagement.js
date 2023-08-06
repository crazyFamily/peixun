import { httpServe, dataHeaders } from '@/util/utils'


// 学员招募查询条件列表
export const fetchRecruitQryParam = (params) =>
  httpServe('/fn/xr/training/recruitQryParam', { data: params} )

// 学员招募列表(Y展示)
export const fetchListRecruit = (params) =>
  httpServe('/fn/xr/training/listRecruit', { data: { ...params, tips: 'Y' }}, { loading: 'LOADING_LIST_RECRUIT' } )

// 学员招募列表导出(N展示)
export const fetchExportRecruit = (params) =>
  httpServe('/fn/xr/training/listRecruit', { data: { ...params, tips: 'N' } }, { headers: { responseType: 'blob' } })

// 添加学员招募
export const fetchSaveRecruit = (params) =>
  httpServe('/fn/xr/training/saveRecruit', { data: params} )


// 学员列表(C查询)
export const fetchListRecruitUser = (params) =>
  httpServe('/fn/xr/training/user/listRecruitUser', { data: { ...params, requestType: 'C' }}, { loading: 'LOADING_LIST_RECRUIT_USER' } )

// 学员列表导出(E导出)
export const fetchExportRecruitUser = (params) =>
  httpServe('/fn/xr/training/user/listRecruitUser', { data: { ...params, requestType: 'E' } }, { headers: { responseType: 'blob' } })

// 保存修改学员
export const fetchSaveOrUpdateRecruitUser = (params) =>
  httpServe('/fn/xr/training/user/saveOrUpdateRecruitUser', { data: params} )

// 查询学员详情
export const fetchFindRecruitUserDetail = (params) =>
  httpServe('/fn/xr/training/user/findRecruitUserDetail', params )

// 学员报名-um号模糊查询用户列表
export const fetchListUserByUm = (params) =>
  httpServe('/fn/xr/training/user/listUserByUm', { data: params} )

// 学员报名-根据上级领导um查询姓名
export const fetchFindLeaderInfoByUm = (params) =>
  httpServe('/fn/xr/training/user/findLeaderInfoByUm', params )

// 提交学员
export const fetchSubmitRecruitUser = (params) =>
  httpServe('/fn/xr/training/user/submitRecruitUser', { data: params} )

// 删除学员
export const fetchDeleteRecruitUserBatch = (params) =>
  httpServe('/fn/xr/training/user/deleteRecruitUserBatch', { data: params} )

// 批量提交学员
export const fetchSaveOrCommitUserByIdBatch = (params) =>
  httpServe('/fn/xr/training/user/saveOrCommitUserByIdBatch', { data: params} )

// 学员报名-批量导入人员校验
// /tms-new/api/common/xr/training/user/importBatchRecruitUser
export const fetchCheckImportUserBatch = (params, options) =>
  httpServe('/common/xr/training/user/importBatchRecruitUser', params, {
    ...dataHeaders,
    ...options
  })

// 批量保存修改学员
export const fetchSaveOrCommitUserBatch = (params) =>
  httpServe('/fn/xr/training/user/saveOrCommitUserBatch', { data: params} )

// 失败名单导出
export const fetchExportFailUser = (params) => httpServe('/fn/xr/training/user/exportFailUser', params, { headers: { responseType: 'blob' } })


// ================================== 营养管理 ==================================

// 营养管理-关联培训班列表(Y展示)
export const fetchListNewStaffTraining = (params) =>
  httpServe('/fn/xr/training/offline/listNewStaffTraining', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_NEW_STAFF_TRAINING' } )

// 营养管理-关联培训班列表(N导出)
export const fetchExportNewStaffTraining = (params) =>
  httpServe('/fn/xr/training/offline/listNewStaffTraining', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 营养管理-导入学员评价
export const fetchAddTrainingClass = (params) =>
  httpServe('/fn/xr/training/offline/addTrainingClass', params )

// 营养管理-关联培训班列表查询
export const fetchListTrainingClass = (params) =>
  httpServe('/fn/xr/training/offline/listTrainingClass', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_TRAINING_CLASS' } )

// 营养管理-删除已关联培训班
export const fetchDeleteTrainingClass = (params) =>
  httpServe('/fn/xr/training/offline/deleteTrainingClass', params)

// 营养管理-学员评价详情查看
export const fetchNewStaffTrainingDetail = (params) =>
  httpServe('/fn/xr/training/offline/newStaffTrainingDetail', params)

// 营养管理-根据培训班id模糊匹配列表
export const fetchListClassByClassId = (params) =>
  httpServe('/fn/xr/training/offline/listClassByClassId', params )

// 营养管理-保存新人培养延期报备
export const fetchSaveNewStaffDelayApply = (params) =>
  httpServe('/fn/xr/training/offline/saveNewStaffDelayApply', { data: params } )

// 营养管理-查询延期报备审批链
export const fetchListDelayApplyChain = (params) =>
  httpServe('/fn/xr/training/offline/listDelayApplyChain', params)

// 
export const fetchImportBatchTrainingScore = (params, options) =>
httpServe('/common/xr/training/offline/importBatchTrainingScore', params, {
    ...dataHeaders,
    ...options
  })

// 培养管理-导入线上营学员成绩-导入
export const fetchHandleTrainingScore = (params) =>
  httpServe('/fn/xr/training/offline/handleTrainingScore', params)

// 培养管理-下载线上营学员成绩校验失败名单
export const fetchExportFailTrainingScore = (params) => 
  httpServe('/fn/xr/training/offline/exportFailTrainingScore', params, { headers: { responseType: 'blob' } })

// ================================== 报表-新人培养管理报表 ==================================
 
// 新人培养管理报表(Y展示)
export const fetchListXrTrainingRateReport = (params) =>
  httpServe('/fn/xr/training/report/listXrTrainingRateReport', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_TRAINING_RATE_REPORT' } )

// 新人培养管理报表(N导出)
export const fetchExportXrTrainingRateReport = (params) =>
  httpServe('/fn/xr/training/report/listXrTrainingRateReport', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })
  // httpServe('/fn/xr/training/offline/listDelayApplyChain', { data: params } )
  
// 数据看板-各机构线上营通过率及参训人数统计
export const fetchListOnlineTrainingRate = (params) => httpServe('/fn/xr/training/board/listOnlineTrainingRate', params)

// 数据看板-各机构线下营覆盖率统计
export const fetchListOfflineTrainingRate = (params) => httpServe('/fn/xr/training/board/listOfflineTrainingRate', params)

// 数据看板-学员层级人数占比统计
export const fetchListTrainingUserLevel = (params) => httpServe('/fn/xr/training/board/listTrainingUserLevel', params)

// 数据看板-学员条线人数占比统计
export const fetchListTrainingUserLine = (params) => httpServe('/fn/xr/training/board/listTrainingUserLine', params)

// 数据看板-根据能力层级查询年龄层占比
export const fetchListUserAgeByLevel = (params) => httpServe('/fn/xr/training/board/listUserAgeByLevel', params)
