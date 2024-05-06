import { httpServe } from '@/util/utils'
// 请求课程列表
export const fetchGetCourses = (params) =>
  httpServe('/fn/ladder/course/listLadderCourse', params)

export const fetchListCasePushBelongOrgs = `/fn/caseCenter/pushCase/listCasePushBelongOrgs`
//新增、编辑课程
export const fetchChangeCourses = (params) =>
  httpServe('/fn/ladder/course/findLadderCourseByCourseId', params)
//课程-查询阶梯课程详情
export const fetchFindCourseDetail = (params) =>
  httpServe('/fn/ladder/course/findLadderCourseByCourseId', params)
//课程-授权详情
export const fetchListGrantLecturerInfo = (params) =>
  httpServe('/fn/ladder/course/listGrantLecturerInfo', params)
//课程-授权详情导出
export const fetchExportGrantLecturerInfo = (params) =>
  httpServe('/fn/ladder/course/listGrantLecturerInfo', params, {
    headers: { responseType: 'blob' }
})
//课程-使用详情
export const fetchListGrantClassInfo = (params) =>
  httpServe('/fn/ladder/course/listGrantClassInfo', params)
//课程-使用详情导出
export const fetchExportGrantClassInfo = (params) =>
  httpServe('/fn/ladder/course/listGrantClassInfo', params, {
    headers: { responseType: 'blob' }
})