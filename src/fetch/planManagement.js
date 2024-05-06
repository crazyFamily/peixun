import { httpServe, dataHeaders } from '@/util/utils'

// 积分计算记录查询 / 导出
export const fetchCalPlanTotalInfo = (params) => httpServe('/fn/plan/annual/calPlanTotalInfo', params)

// 计划导出
export const fetchExportPlanPackages = (params) =>
  httpServe('/fn/plan/manage/exportPlanPackages', params, {
    headers: { responseType: 'blob' }
  })

// 计划撤回
export const fetchWithdrawPlanPackage = (params) =>
  httpServe('/fn/plan/annual/withdrawPlanPackage', params)

// 计划查询
export const fetchFindPackageInfo = (params) => httpServe('/fn/plan/annual/findPackageInfo', params, { loading: 'LOADING_FIND_PACKAGEINFO' })

// 查询培训班计划
export const fetchListPlanInfos = (params) => httpServe('/fn/plan/annual/listPlanInfos', params)

// 导出培训班计划
export const fetchReportPlanPackageClasses = (params) => httpServe('/fn/plan/annual/reportPlanPackageClasses', params, {
  headers: { responseType: 'blob' }
})

// 导出非培训班计划
export const fetchReportPlanPackageNonClasses = (params) =>
  httpServe('/fn/plan/annual/reportPlanPackageNonClasses', params, {
    headers: { responseType: 'blob' }
  })

// 删除计划
export const fetchDeletePlan = (params) => httpServe('/fn/plan/annual/deletePlan', params)

// 导出预留费用数据
export const fetchReportReverseFeePage = (params) =>
  httpServe('/fn/plan/annual/reportReverseFeePage', params, {
    headers: { responseType: 'blob' }
  })
  
  // 导出计划
export const fetchExportPlanInfo = (params) =>
  httpServe(
    '/planupload/exportPlanInfo',
    { params, responseType: 'blob' },
    { headers: { responseType: 'blob' } },
    'get'
  )

// 添加计划
export const fetchAddPlan = (params) => httpServe('/fn/plan/annual/addPlan', params)
// 更新计划
export const fetchUpdatePlan = (params) => httpServe('/fn/plan/annual/updatePlan', params)

// 查询计划详情
export const fetchFindPlanInfoDetail = (params) => httpServe('/fn/plan/annual/findPlanInfoDetail', params)

// 获取预留费用
export const fetchListReverseFee = (params) => httpServe('/fn/plan/annual/listReverseFee', params)

// 批量导入年度计划
export const fetchBatchplan = (params) => httpServe('/planupload/batchplan', params)

// 保存计划
export const fetchSubmitPlanPackage = (params) => httpServe('/fn/plan/annual/submitPlanPackage', params, { loading: 'LOADING_PLAN_SUBMIT' })

// 已分配计划查询
export const fetchQueryDispensePlanPage = (params) =>
  httpServe('/fn/plan/annual/queryDispensePlanPage', { data: { ...params.data, tip: 'Y' } })

// 已分配计划导出
export const fetchExportDispensePlanPage = (params) =>
  httpServe(
    '/fn/plan/annual/queryDispensePlanPage',
    { data: { ...params.data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )

// 计划分配详情
export const fetchDispensePlanDetail = (params) => httpServe('/fn/plan/annual/dispensePlanDetail', params)

// 查询被分配计划
export const fetchQueryDispensePageByDept = ({data}) => httpServe('/fn/plan/annual/queryDispensePageByDept', {data: {...data, tip: 'Y'}})

// 导出被分配计划
export const fetchExportDispensePageByDept = ({ data }) =>
  httpServe(
    '/fn/plan/annual/queryDispensePageByDept',
    { data: { ...data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )

// 批量新增计划分配
export const fetchAddDispensePlan = (params) => httpServe('/fn/plan/annual/addDispensePlan', params)

// 删除计划分配
export const fetchDeleteDispensePlan = (params) => httpServe('/fn/plan/annual/deleteDispensePlan', params)

// 修改分配计划接口
export const fetchUpdateDispensePlan = (params) => httpServe('/fn/plan/annual/updateDispensePlan', params)

// ================================ 月度计划 ================================

// 学员招募列表(Y展示)
export const fetchSelectMonthPlanPage = (params) =>
  httpServe('/fn/plan/month/selectMonthPlanPage', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_MONTH_PLAN_PAGE' } )

// 学员招募列表导出(N展示)
export const fetchExportMonthPlanPage = (params) =>
  httpServe('/fn/plan/month/selectMonthPlanPage', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 月度计划-新增/编辑月度计划
export const fetchSelectMonthPlanInfo = (params) =>
  httpServe('/fn/plan/month/selectMonthPlanInfo', { data: params} )

// 月度计划-新增/编辑月度计划
export const fetchSaveOrUpdateMonthPlan = (params) =>
  httpServe('/fn/plan/month/saveOrUpdateMonthPlan', { data: params} )

// 月度计划-新增/编辑月度计划
export const fetchSelectEmailUserList = (params) =>
  httpServe('/fn/plan/month/selectEmailUserList', { data: params}, { loading: 'LOADING_SELECT_EMAIL_USER_LIST' } )

// 月度计划-批量删除月度计划
export const fetchDeleteMonthPlan = (params) =>
  httpServe('/fn/plan/month/deleteMonthPlan', { data: params} )

// 月度计划-查询固定节点列表
export const fetchSelectZhFixedOrg = (params) => httpServe('/fn/plan/month/selectZhFixedOrg', params)

// 月度计划-查询计划月度列表和权限
export const fetchSelectPlanMonthAndAuthority = (params) =>
  httpServe(
    '/fn/plan/month/selectPlanMonthAndAuthority',
    { data: params },
    { loading: 'LOADING_SELECT_PLAN_MONTH',}
  )
// export const fetchSelectPlanMonthAndAuthority = (params) =>
//   httpServe('/fn/plan/month/selectPlanMonthAndAuthority', { data: params} )


// 月度计划-计划明细查询列表及导出(Y展示)
// 标识：列表 list  导出 export
export const fetchSelectPlanMonthDetailList = (params) =>
  httpServe('/fn/plan/monthDetail/selectPlanMonthDetailList', { data: { ...params, tip: 'list' }}, { loading: 'LOADING_MONTH_PLAN_DETAIL_LIST' } )

// 月度计划-计划明细查询列表及导出(N展示)
export const fetchExportPlanMonthDetaillList = (params) =>
  httpServe('/fn/plan/monthDetail/selectPlanMonthDetailList', { data: { ...params, tip: 'export' } }, { headers: { responseType: 'blob' } })

// 月度计划-计划明细查询ById
export const fetchSelectPlanMonthDetail = (params) =>
  httpServe('/fn/plan/monthDetail/selectPlanMonthDetail', params )

// 月度计划-计划明细录入及编辑
export const fetchSavePlanMonthDetail = (params) =>
  httpServe('/fn/plan/monthDetail/savePlanMonthDetail', { data: params} )

// 月度计划-计划明细提交（选择明细数据）
export const fetchSubmitPlanMonthDetailById = (params) =>
  httpServe('/fn/plan/monthDetail/submitPlanMonthDetailById', params )

// 月度计划-计划明细提交查询（选择机构）
export const fetchSelectNoPlanDetailForOrg = (params) =>
httpServe('/fn/plan/monthDetail/selectNoPlanDetailForOrg', params )

// 月度计划-计划明细提交（选择机构）
export const fetchSubmitPlanMonthDetailByOrg = (params) =>
  httpServe('/fn/plan/monthDetail/submitPlanMonthDetailByOrg', params )

// 月度计划-计划明细查询培训班编号
export const fetchSelectClassInfoById = (params) =>
  httpServe('/fn/plan/monthDetail/selectClassInfoById', params )

// 月度计划-计划明细关联培训班ID
export const fetchCheckPlanDetail = (params) =>
  httpServe('/fn/plan/monthDetail/checkPlanDetail', params )

// 月度计划-计划明细删除
export const fetchDeletePlanMonthDetail = (params) =>
  httpServe('/fn/plan/monthDetail/deletePlanMonthDetail', params )


// 月度计划-计划明细查询涉及分行(返回所有分行)
export const fetchSelectAllBranchOrg = (params) =>
  httpServe('/fn/plan/monthDetail/selectAllBranchOrg', { data: params} )

// 月度计划-查看计划状态
export const fetchSelectMonthPlanPosterStatus = (params) =>
  httpServe('/fn/plan/monthDetail/selectMonthPlanPosterStatus', params )


// 月度计划-计划明细批量导入
export const fetchBatchImportPlanMonthDetail = (params, options) =>
  httpServe('/planupload/batchImportPlanMonthDetail', params, {
    ...dataHeaders,
    ...options
  })

// 月度计划-计划明细批量导入-保存
export const fetchSaveBatchImportPlanMonthDetail = (params) =>
  httpServe('/fn/plan/monthDetail/batchImportPlanMonthDetail', params )

// 月度计划-计划明细批量导入-下载失败
export const fetchExportFailPlanMonthDetail = (params) => 
  httpServe('/fn/plan/monthDetail/exportFailPlanMonthDetail', params, { headers: { responseType: 'blob' } })


// 月度计划-计划明细录入及编辑
export const fetchSaveMonthPlanDetail = (params) =>
  httpServe('/fn/plan/month/saveMonthPlanDetail', { detail: params} )
// 月度计划-查询月度计划看板
export const fetchSelectMonthPlanPoster = (params) =>
  httpServe('/fn/plan/month/selectMonthPlanPoster', params, { loading: 'LOADING_SELECT_MONTH_POSTER'})

// 月度计划-保存月度计划看板
export const fetchSaveMonthPlanPoster = (params) => httpServe('/fn/plan/month/saveMonthPlanPoster', params, {})

// 月度计划-发布、下架月度计划看板
export const fetchUpdatePlanPosterStatus = (params) => httpServe('/fn/plan/month/updatePlanPosterStatus', params, { loading: 'LOADING_UPDATE_PLAN_POSTER' })