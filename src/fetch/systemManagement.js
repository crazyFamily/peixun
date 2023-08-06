import { httpServe } from '@/util/utils'

// 管理单位列表(Y展示)
export const fetchListManagement = (params) =>
  httpServe('/fn/commons/management/listManagement', { data: { ...params, tips: 'Y' }}, { loading: 'LOADING_MANAGEMENT' } )

// 管理单位列表导出(N展示)
export const fetchExportManagement = (params) =>
  httpServe('/fn/commons/management/listManagement', { data: { ...params, tips: 'N' } }, { headers: { responseType: 'blob' } })

// 保存管理单位
export const fetchSaveManagement = (params) =>
  httpServe('/fn/commons/management/saveManagement', { data: params } )

// 删除学员
export const fetchDeleteManagementByManagementId = (params) =>
  httpServe('/fn/commons/management/deleteManagementByManagementId', { data: params} )

// 查询学员详情
export const fetchFindManagementDetail = (params) =>
  httpServe('/fn/commons/management/findManagementDetail', { data: params} )

// 通过管理单位ID查询其他管理单位已关联管理单位的机构
export const fetchFindOthersManagementOrgs = (params) =>
  httpServe('/fn/commons/management/findOthersManagementOrgs', { data: params } )

// 查询未关联管理单位的机构(Y展示)
export const fetchFindNoManagementOrgs = (params) =>
  httpServe('/fn/commons/management/findNoManagementOrgs', { data: { ...params, tips: 'Y' }}, { loading: 'LOADING_NOMANAGEMENT' } )

// 查询未关联管理单位的机构(N展示)
export const fetchExportNoManagementOrgs = (params) =>
  httpServe('/fn/commons/management/findNoManagementOrgs', { data: { ...params, tips: 'N' } }, { headers: { responseType: 'blob' } })

