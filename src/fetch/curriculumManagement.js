import { dataHeaders, httpServe } from '@/util/utils'

// 查询案例列表
export const fetchListLecturesRecord = (params) => httpServe('/fn/course/external/listLecturesRecord', params)
// 查询内部课程授课记录
export const fetchListInternalRecord = (params) => httpServe('/fn/course/internal/listInternalLecturesRecord', params)
// 获取使用过的标签
export const fetchListEngagedCourseTag = (params) => httpServe('/fn/course/external/listEngagedCourseTag', params)


// 新人培养管理报表(Y展示)
export const fetchListZnCourse = (params) =>
  httpServe('/fn/course/zn/listZnCourse', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_LIST_ZN_COURSE' } )

// 新人培养管理报表(N导出)
export const fetchExportZnCourse = (params) =>
  httpServe('/fn/course/zn/listZnCourse', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 批量删除知鸟课程
export const fetchDeleteZnCourse = (params) => 
  httpServe('/fn/course/zn/deleteZnCourse', { data: params })

// 编辑课程上传负责人
export const fetchUpdateCourseUploader = (params) => 
  httpServe('/fn/course/zn/updateCourseUploader', { data: params })

// 知鸟课程导入-校验
export const fetchImportZnCourse = (params, options) =>
  httpServe('/common/course/zn/importZnCourse', params, {
    ...dataHeaders,
    ...options
  })

// 知鸟课程导入-导入
export const fetchHandleZnCourse = (params) =>
  httpServe('/fn/course/zn/handleZnCourse', params)

// 知鸟课程导入-导出失败列表
export const fetchExportFailZnCourse = (params) => 
  httpServe('/fn/course/zn/exportFailZnCourse', params, { headers: { responseType: 'blob' } })

// 保存知鸟课件
export const fetchSaveZnCourseware = (params) =>
  httpServe('/fn/course/zn/saveZnCourseware', { data: params })

// 保存知鸟课件
export const fetchFindZnCourseware = (params) =>
  httpServe('/fn/course/zn/findZnCourseware', { data: params })