import { httpServe } from '@/util/utils'

// 查询案例列表
export const fetchListRemit = (params) =>
  httpServe('/fn/spark/listSparkApplicationByUser', params)

// 查找EOA
export const fetchListFixedChain = (params) =>
  httpServe('/fn/commons/eoa/listFixedChain', params)

// 当前用户豁免/延期申请记录查询
export const fetchListSparkApplicationByUser = (params) =>
  httpServe('/fn/spark/listSparkApplicationByUser', params)

// 提交申请
export const fetchListSparkApply = (params) =>
  httpServe('/fn/spark/sparkApply', params)

// 检查UM
export const fetChcheckUmIdIsValid = (params) =>
  httpServe('/fn/user/checkUmIdIsValid', params)
// 申请管理-权限管理列表查询
export const fetchListPermissionManager = (params) =>
  httpServe('/fn/spark/listSparkPermissionManager', { data: { ...params, isShow: 'Y' } })
// 申请管理-权限管理列表导出
export const fetchExportPermissionManager = (params) =>
  httpServe('/fn/spark/listSparkPermissionManager', { data: { ...params, isShow: 'N' } }, {
    headers: { responseType: 'blob' }
  })
// 申请管理-豁免/延期申请记录列表导出
export const fetchExportByRemit = (params) =>
  httpServe('/fn/spark/listRemit', { data: { ...params, isShow: 'N' } }, {
    headers: { responseType: 'blob' }
  })
// 申请管理-豁免/延期申请记录列表查询
export const fetchListUserByUmOrName = (params) =>
  httpServe('/fn/spark/listRemit', { data: { ...params, isShow: 'Y' } })
// 申请管理-操作（申请权限）关闭开启
export const fetchAdjustApplyStatus = (...params) =>
  httpServe('/fn/spark/adjustApplyStatus', ...params)
// 申请管理-查看申请记录
export const fetchPersonApplyDetail = (...params) =>
  httpServe('/fn/spark/personApplyDetail', ...params)
  
// 校验审批状态
export const fetchVerificationStatus = (...params) =>
  httpServe('/fn/spark/verificationStatus', ...params)
