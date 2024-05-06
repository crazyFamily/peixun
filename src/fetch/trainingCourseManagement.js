import { httpServe ,dataHeaders} from '@/util/utils'

// 获取结训列表
export const fetchListStudentInfos = (params) =>
  httpServe('/fn/classes/manager/afterTrain/listStudentInfos',{ data: params } , dataHeaders)

  

// 获取培训班-课表管理
export const fetchFindCourseManagerInfo = (params) =>
  httpServe('/fn/classes/manager/course/findCourseManagerInfo',{ data: params } , dataHeaders)

// 导出-培训班-课表管理 
export const downloadClassCourseByClassId = (params) =>
  httpServe('/classFileFunc/downloadClassCourseByClassId', params, {
    headers: { responseType: 'blob' }
  })

// 获取-培训班-学员管理
export const fetchListStudentAdjust = (params) =>
  httpServe('/fn/classes/manager/listStudentAdjust', params , dataHeaders)


// 获取-培训班-考勤管理
export const fetchListAttendanceRecords = (params) =>
  httpServe('/fn/classes/manager/attendance/listAttendanceRecords', params , dataHeaders)

// 结训管理-获取积分条件
export const fetchQueryIntergrationConfiguration = (params) =>
  httpServe('/fn/classes/manager/integration/queryIntergrationConfiguration', params , dataHeaders)

// 结训管理-导出
export const fetchExportListStudentInfos = (params) => 
  httpServe('/fn/classes/manager/afterTrain/exportListStudentInfos', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 结训管理-保存考勤条件
export const fetchClassAttendanceConditionSet = (params) =>
  httpServe('/fn/classes/manager/attendance/classAttendanceConditionSet', params , dataHeaders)

// 结训管理-保存积分条件
export const fetchClassIntegrationConditionSet = (params) =>
  httpServe('/fn/classes/manager/integration/classIntegrationConditionSet', params , dataHeaders)
// 培训班管理-查询培训班列表
export const fetchClassManagerList = (...params) =>
  httpServe('/fn/classes/manager/listClassManager', ...params, { loading: 'LOADING_ESTABLISH_CLASSMANAGEMENT_LIST' })
// 培训班管理-查询非培训班列表
export const fetchNoClassManagerList = (...params) =>
  httpServe('/fn/classes/manager/nonClass/listNonClassManager', ...params, { loading: 'LOADING_ESTABLISH_NOCLASSMANAGEMENT_LIST' })

// 培训班编辑 导入成功
export const fetchHandleSupplyment = (params)=>
  httpServe('/fn/classes/manager/afterTrain/addSuccAttendanceStudentList', params)
// 培训班编辑 手工批量导入
export const fetchImportBatchSupplyment =  (params) =>
  httpServe('/classFileFunc/attendanceSupplementBatchImport',  params,{...dataHeaders})
//培训班手工补录 失败导出
export const fetchExportFailSupplyment = (params)=>
  httpServe('/fn/classes/manager/nonClass/listNonClassManager', ...params)