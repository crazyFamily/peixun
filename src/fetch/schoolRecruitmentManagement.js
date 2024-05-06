import { httpServe } from '@/util/utils'
// 培养方案配置页面-培养方案配置列表
export const fetchListFosterPlanConfig = (...params) => httpServe('/fn/admission/admissionConfig/listFosterPlanConfig', ...params)
// 培养方案配置页面-按轮岗岗位类型查询版本列表
export const fetchListConfigVersion = (...params) => httpServe('/fn/admission/admissionConfig/listConfigVersionByTransferPositionType', ...params)
// 培养方案配置页面-培养方案配置详情
export const fetchFosterPlanConfigDetail = (...params) => httpServe('/fn/admission/admissionConfig/fosterPlanConfigDetail', ...params)
// 培养方案配置页面-保存培养方案配置
export const fetchSaveFosterPlanConfig = (...params) => httpServe('/fn/admission/admissionConfig/saveFosterPlanConfig', ...params)
// 培养方案配置页面-按培养形式和项目ID查询对应的项目信息
export const fetchFindFosterProject = (...params) => httpServe('/fn/admission/admissionConfig/findFosterProject', ...params)
// 培养方案配置页面-删除培养方案
export const fetchDeleteFosterPlanConfig = (...params) => httpServe('/fn/admission/admissionConfig/deleteFosterPlanConfig', ...params)

// 轮岗培养-校招生轮岗培养名单列表
export const fetchListStudentAdmissionInfo = ({ data }) =>
  httpServe('/fn/admission/studentAdmission/listStudentAdmissionInfo', { data: { ...data, tip: 'Y' } }, { loading: 'LOADING_ROTATION_TRAINING_LIST' })
export const fetchListStudentAdmissionInfoExport = ({ data }) =>
  httpServe(
    '/fn/admission/studentAdmission/listStudentAdmissionInfo',
    { data: { ...data, tip: 'N' } },
    { loading: 'LOADING_ROTATION_TRAINING_EXPORT', headers: { responseType: 'blob' } }
  )
// 轮岗培养-校招生档案
export const fetchStudentAdmissionRecord = (...params) => httpServe('/fn/admission/studentAdmission/studentAdmissionRecord', ...params)
// 轮岗培养-根据用户权限展示不同校招轮岗管理查询条件
export const fetchAdmissionQryParam = (...params) => httpServe('/fn/admission/studentAdmission/admissionQryParam', ...params)

// 轮岗培养-查询轮岗阶段tabs
export const fetchTransferTabsList = (...params) => httpServe('/fn/admission/studentAdmission/listStudentTransferStage', ...params)

// 轮岗培养-培养方案详情
export const fetchFindFosterPlanDetail = (...params) => httpServe('/fn/admission/studentAdmission/findFosterPlanDetail', ...params)
// 轮岗培养-培养方案详情中文件上传
export const fetchUploadFileModality = (...params) => httpServe('/fn/admission/studentAdmission/uploadFileModality', ...params)
// 轮岗培养-培养方案详情中文件审核
export const fetchAuditFileModality = (...params) => httpServe('/fn/admission/studentAdmission/auditFileModality', ...params)
// 轮岗培养-导师评价详情
export const fetchFindTeacherEvaluateDetail = (...params) => httpServe('/fn/admission/studentAdmission/findTeacherEvaluateDetail', ...params)
// 轮岗培养-提交导师评价
export const fetchSaveTeacherEvaluate = (...params) => httpServe('/fn/admission/studentAdmission/saveTeacherEvaluate', ...params)
// 轮岗培养-获取导师评价详情数据
export const fetchFindFosterResultDetail = (...params) => httpServe('/fn/admission/studentAdmission/findFosterResultDetail', ...params)
// 轮岗培养-提交培养结果
export const fetchSaveFosterResult = (...params) => httpServe('/fn/admission/studentAdmission/saveFosterResult', ...params)
// 轮岗培养-批量校验培养结果
export const fetchImportBatchFosterResult = (...params) => httpServe('/common/admission/studentAdmission/importBatchFosterResult', ...params)
// 轮岗培养-批量导入培养结果
export const fetchSaveBatchFosterResult = (...params) => httpServe('/fn/admission/studentAdmission/saveBatchFosterResult', ...params)
// 轮岗培养-下载培养结果校验失败名单
export const fetchExportFailFosterResult = (params) =>
  httpServe('/fn/admission/studentAdmission/exportFailFosterResult', params, {
    loading: 'LOADING_ROTATION_TRAINING_FAIL_RESULT',
    headers: { responseType: 'blob' }
  })