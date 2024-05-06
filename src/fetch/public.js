import { httpServe, dataHeaders } from '@/util/utils'
// 查询法定节假日
export const fetchGetHoliday = (params) => httpServe('/fn/trainer/eval/getHoliday', params)

// 根据UMID查询UM名
export const fetchUserInfos = (params) => httpServe('/fn/user/listUserInfos', params)

// 查询组织机构
export const fetchSelectTree = (params) => httpServe('/fn/caseCenter/pushCase/listCasePushBelongOrgs', params)

// 查询用户组织机构树
export const fetchUserOrgTree = (params) => httpServe('/fn/user/selectTree', params)

// 查询固定的用户组织机构树
export const API_SELECT_FIXED_TREE = '/fn/user/selectFixedTree'

// 查计划机构树(当前仅适用于查询计划模块的机构树)
export const API_SELECT_ASSOCIATE_PLAN_TREE = '/fn/user/selectAssociatePlanTree'
export const fetchFixedTree = (params) => httpServe('/fn/user/selectFixedTree', params)

// 查询组织机构树(所有节点)
export const APIAllTree = '/fn/user/selectAllTree'
export const fetchAllTree = (params) => httpServe(APIAllTree, params)


// 上传附件， 类型支持多
export const fetchUploadNewFile = (params, options) =>
  httpServe('/common/file/uploadNewFile', params, {
    ...dataHeaders,
    ...options
  })

// 上传接口，只支持jpg/png
export const APIUploadPicFile = '/common/file/uploadPicFile'

// 获取计划字典表
export const fetchListPlanDict = (params) => httpServe('/fn/plan/annual/listPlanDict', params)

// 批量上传组件导出
export const fetchExportFailData = (params) =>
  httpServe('/fn/commons/exportFail/exportFailData', params, {
    headers: { responseType: 'blob' }
  })

// 获取UDMP的TOKEN
export const fetchGiveUdmpToken = (params) => httpServe('/common/file/giveUdmpToken', params)

// 上传文件至UDMP
export const fetchUploadFileToUdmp = (params, options) =>
  httpServe('', params, {
    ...dataHeaders,
    ...options,
    baseURL: 'http://up.pabosuat.sdb.com.cn'
  })

// 获取角色列表
export const fetchListSelectRole = (params) => httpServe('/fn/system/roleApply/listSelectRole', params)

// 查询角色ID
export const fetchSelectRoleIdByRoleNameAndBusiType = (params) => httpServe('/fn/user/selectRoleIdByRoleNameAndBusiType', params)

// 获取新人培养机构树
export const fetchListXrAllTree = (params) => httpServe('/fn/user/listXrAllTree', params)

// 查找EOA
export const fetchListFixedChain = (params) => httpServe('/fn/commons/eoa/listFixedChain', params)


// 上传图片
export const fetchCourseImgUpload = (params) => httpServe('/common/lixiang/shareFee', params)
  
// 获取udmp预约接口返回的关键信息
export const fetchUdmpReserve = (params) => httpServe('/fn/commons/udmp/udmpReserve', params)

// 文档确认接口
export const fetchUDMPEnsureDoc = (params) => httpServe('/fn/commons/udmp/ensureDoc', params)

// 文档获取接口
export const fetchUDMPDownload = (params) => httpServe('/fn/commons/udmp/getDocuments', params,{ loading: 'LOADING_FETCH_UDMP_DOWNLOAD' })