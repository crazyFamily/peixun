import { httpServe } from '@/util/utils'
// 模糊查询用户
export const fetchListUserByUmOrName = (...params) =>
  httpServe('/fn/ladder/lecturer/listUserByUmOrName', ...params)
// 讲师列表查询
export const fetchListLadderLecturer = (...params) =>
  httpServe('/fn/ladder/lecturer/listLadderLecturer', ...params)
// 讲师列表导出
export const fetchListExportLadderLecturer = (...params) =>
  httpServe('/fn/ladder/lecturer/listLadderLecturer', ...params, {
    headers: { responseType: 'blob' }
  })
// 新增讲师以及授权
export const fetchAddAuthLecturer = (...params) =>
  httpServe('/fn/ladder/lecturer/addAuthLecturer', ...params)
// 批量校验讲师授权
export const fetchBatchCheckLecturers = (...params) =>
  httpServe('/common/ladder/lecturer/batchCheckLecturers', ...params)
// 更新讲师状态（启用，冻结）
export const fetchUpdateLecturerStatus = (...params) =>
  httpServe('/fn/ladder/lecturer/updateLecturerStatus', ...params)
// 批量删除讲师
export const fetchDeleteLecturerBatch = (...params) =>
  httpServe('/fn/ladder/lecturer/deleteLecturerBatch', ...params)
// 批量新增讲师授权
export const fetchBatchAddAuthLecturer = (...params) =>
  httpServe('/fn/ladder/lecturer/batchAddAuthLecturer', ...params)
// 讲师-根据课程id或名称查询课程
export const fetchListCourseByCourseInfo = (...params) =>
  httpServe('/fn/ladder/lecturer/listCourseByCourseInfo', ...params)
// 讲师-讲师授权列表
export const fetchListAuthRecord = (...params) =>
  httpServe('/fn/ladder/lecturer/listAuthRecord', ...params)
// 讲师-讲师授权列表导出
export const fetchExportListAuthRecord = (...params) =>
  httpServe('/fn/ladder/lecturer/listAuthRecord', ...params, {
    headers: { responseType: 'blob' }
  })
// 讲师-讲师详情
export const fetchFindLecturerDetail = (...params) =>
  httpServe('/fn/ladder/lecturer/findLecturerDetail', ...params)
// 讲师-取消授权
export const fetchDeleteAuth = (...params) =>
  httpServe('/fn/ladder/lecturer/deleteAuth', ...params)
// 讲师-导出全部明细
export const fetchExportAllAuthRecord = (...params) =>
  httpServe('/fn/ladder/lecturer/exportAllAuthRecord', ...params, {
    headers: { responseType: 'blob' }
  })
// 讲师-授课记录
export const fetchListGrantCourse = (...params) =>
  httpServe('/fn/ladder/lecturer/listGrantCourse', ...params)
// 讲师-授课记录导出
export const fetchExportListGrantCourse = (...params) =>
  httpServe('/fn/ladder/lecturer/listGrantCourse', ...params, {
    headers: { responseType: 'blob' }
  })

// 讲师授课明细
// /tms-new/api/fn/ladder/lecturer/listGrantCourseDetail
export const fetchListGrantCourseDetail = (...params) =>
  httpServe('/fn/ladder/lecturer/listGrantCourseDetail', ...params)
// 讲师-授课记录导出
export const fetchExportListGrantCourseDetail = (...params) =>
  httpServe('/fn/ladder/lecturer/listGrantCourseDetail', ...params, {
    headers: { responseType: 'blob' }
  })

// 讲师授课评价明细列表或导出
// /tms-new/api/fn/report/teacher/lecturerEvaluateDetailList
export const fetchLecturerEvaluateDetailList = (...params) =>
  httpServe('/fn/report/teacher/lecturerEvaluateDetailList', ...params, { loading: 'LOADING_LECTURER_EVALUATE_DETAIL_LIST' })
// 讲师-授课记录导出
export const fetchExportLecturerEvaluateDetailList = (...params) =>
  httpServe('/fn/report/teacher/lecturerEvaluateDetailList', ...params, {
    headers: { responseType: 'blob' }
  })

// 讲师授课评价明细列表或导出
// /fn/report/teacher/lecturerEvaluateList
export const fetchLecturerEvaluateList = (...params) => httpServe('/fn/report/teacher/lecturerEvaluateList', ...params, { loading: 'LOADING_LECTURER_EVALUATE_LIST' })
// 讲师-授课记录导出
export const fetchExportLecturerEvaluateList = (...params) =>
  httpServe('/fn/report/teacher/lecturerEvaluateList', ...params, {
    headers: { responseType: 'blob' }
  })

// 课程-模糊查询阶梯课程列表
export const fetchListLadderCourse = (...params) =>
  httpServe('/fn/ladder/course/listOrExportLadderCourse', ...params)
// 课程-模糊查询阶梯课程导出
export const fetchExportListLadderCourse = (...params) =>
  httpServe('/fn/ladder/course/listOrExportLadderCourse', ...params, {
    headers: { responseType: 'blob' }
  })
// 课程-新增阶梯课程
export const fetchAddLadderCourse = (...params) =>
  httpServe('/fn/ladder/course/addLadderCourse', ...params)
// 课程-修改阶梯课程
export const fetchUpdateLadderCourse = (...params) =>
  httpServe('/fn/ladder/course/updateLadderCourse', ...params)
// 课程-查询阶梯课程详情
export const fetchFindLadderCourseByCourseId = (...params) =>
  httpServe('/fn/ladder/course/findLadderCourseByCourseId', ...params)

// 课表-保存标准课表模板
export const fetchSaveLadderCourse = (...params) =>
  httpServe('/fn/ladder/scheduleTemplate/addLadderScheduleTemplate', ...params)
// 课表-保存标准课表模板
export const fetchUpdateSchedule = (...params) =>
  httpServe('/fn/ladder/scheduleTemplate/updateLadderScheduleTemplate', ...params)
// 课表-按ID查询课表详情
export const fetchFindLadderDetail = (...params) =>
  httpServe('/fn/ladder/scheduleTemplate/findLadderScheduleTemplateByTemplateId', ...params)
// 课表-标准课表模板列表
export const fetchListLadder = (...params) =>
  httpServe('/fn/ladder/scheduleTemplate/listLadderScheduleTemplate', ...params)
// 课表-根据ID批量删除课表
export const fetchDeleteLadders = (...params) =>
  httpServe('/fn/ladder/scheduleTemplate/deleteLadderScheduleTemplateByTemplateIds', ...params)
// 课表-课程模板批量导入
export const fetchBatchLadders = (...params) =>
  httpServe('/common/ladder/scheduleTemplate/batchCheckScheduleTemplates', ...params)
// 课程-删除课程
export const fetchDeleteLadderCourse = (params) =>
  httpServe('/fn/ladder/course/deleteLadderCourseByCourseId', params)
// 按ID查询课表名称
export const fetchSelectByCourseId = (params) =>
  httpServe('/fn/ladder/course/selectScheduleTemplateByCourseId', params)


// 覆盖率报表-覆盖情况列表
export const fetchCoverSituation = (params) =>
  httpServe('/fn/ladder/rateReport/listLadderCoverSituation', { request: { ...params, isShow: 'Y' } }, { loading: 'LOADING_COVER_SITUATION' })
// 覆盖率报表-覆盖情况列表
export const fetchExportCoverSituation = (params) =>
  httpServe('/fn/ladder/rateReport/listLadderCoverSituation', { request: { ...params, isShow: 'N' } }, {
    headers: { responseType: 'blob' }
  })
// 覆盖率报表-变化趋势
export const fetchVariationTrend = (params) =>
  httpServe('/fn/ladder/rateReport/listLadderVariationTrend', { request: params })
// 覆盖率报表-导出培训明细详情
export const fetchExportTrainDetails = (params) =>
  httpServe('/fn/ladder/rateReport/exportLadderTrainDetails', { request: params }, {
    headers: { responseType: 'blob' }
  })
