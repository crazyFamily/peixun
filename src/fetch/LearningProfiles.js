import { httpServe } from '@/util/utils'
// 我的档案-个人信息及个人概况
export const fetchGetBasicInfo = (...params) => httpServe('/fn/studyRecord/record/generalSituationInfo', ...params)
// 学习档案-按UM查询学习记录年度列表
export const fetchListRecordYear = (...params) => httpServe('/fn/studyRecord/record/listRecordYear', ...params)
// 我的档案-个人学习时间统计饼状图
export const fetchStudyHourPieChart = (...params) => httpServe('/fn/studyRecord/record/studyHourPieChartInfo', ...params)
// 我的档案-全行学时排名柱状图
export const fetchStudyHourRankBarChart = (...params) => httpServe('/fn/studyRecord/record/studyHourRankBarChartInfo', ...params)
// 我的档案-全行学时明细排名列表
export const fetchListStudyHourRank = (...params) => httpServe('/fn/studyRecord/record/studyHourRankInfo', ...params)
// 我的档案-年度参训情况
export const fetchListTrainingInfo = (...params) => httpServe('/fn/studyRecord/record/trainingRecordInfo', ...params)
// 我的档案-分页展示学习记录及导出
export const fetchListStudyRecord = ({ data }) =>
  httpServe('/fn/studyRecord/record/listStudyRecord', { data: { ...data, tip: 'Y' } }, { loading: 'LOADING_LEARNING_MORE_RECENT' })
export const fetchListStudyRecordExport = ({ data }) =>
  httpServe(
    '/fn/studyRecord/record/listStudyRecord',
    { data: { ...data, tip: 'N' } },
    { loading: 'LOADING_LEARNING_MORE_RECENT_EXPORT', headers: { responseType: 'blob' } }
  )
  
//  模糊查询用户
export const fetchListUserInfosContainLeaved = (params) => httpServe('/fn/user/listUserInfosContainLeaved', params)

// 学习档案-批量查询-按UM模糊查询当前用户权限范围的员工
export const fetchListUsersContainLeaveForStudyRecord = (params) => httpServe('/fn/studyRecord/record/listUsersContainLeaveForStudyRecord', params)

// 我的档案-分页展示汇总数据及导出
export const fetchListStudyRecordCollect = ({ data }) =>
  httpServe('/fn/studyRecord/record/listStudyRecordCollect', { data: { ...data, tip: 'Y' } }, { loading: 'LIST_STUDY_RECORD_COLLECT' })
export const fetchListStudyRecordCollectExport = ({ data }) =>
  httpServe(
    '/fn/studyRecord/record/listStudyRecordCollect',
    { data: { ...data, tip: 'N' } },
    { loading: 'LIST_STUDY_RECORD_COLLECT_EXPORT', headers: { responseType: 'blob' } }
  )

// 学习档案-批量查询-批量校验UM是否该管理员可以查询
export const fetchCheckUmListForStudyRecord = (...params) => httpServe('/fn/studyRecord/record/checkUmListForStudyRecord', ...params)