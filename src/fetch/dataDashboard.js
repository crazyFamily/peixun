import { dataHeaders, httpServe } from '@/util/utils'

// 查询培训班日历
export const fetchClassCalendar = (params) =>
  httpServe('/fn/data/board/classCalendar', params, { loading: 'LOADING_CLASS_CALENDAR' })
  // baseURL: 'http://localhost:9000'

// 培训计划执行数据统计
export const fetchStatisticPlanInfo = (params) => httpServe('/fn/data/board/statisticPlanInfo', params, { loading: 'LOADING_STATISTIC_PLAN_INFO' })
// baseURL: 'http://localhost:9000'

// 培训项目数量统计
export const fetchStatisticClassNum = (params) => httpServe('/fn/data/board/statisticClassNum', params, { loading: 'LOADING_STATISTIC_CLASS_NUM' })
// baseURL: 'http://localhost:9000'

// 人均学时统计
export const fetchStatisticAvgStudy = (params) =>
  httpServe('/fn/data/board/statisticAvgStudy', params, { loading: 'LOADING_STATISTIC_AVG_STUDY' })
  // baseURL: 'http://localhost:9000'

// 案例产出
export const fetchStatisticCaseNum = (params) =>
  httpServe('/fn/data/board/statisticCaseNum', params, { loading: 'LOADING_STATISTIC_CASE_NUM' })
  // baseURL: 'http://localhost:9000'

// 案例学习
export const fetchStatisticCaseStudy = (params) =>
  httpServe('/fn/data/board/statisticCaseStudy', params, { loading: 'LOADING_STATISTIC_CASE_STUDY' })
  // baseURL: 'http://localhost:9000'

// 项目分布统计
export const fetchStatisticClassDistribution = (params) =>
  httpServe('/fn/data/board/statisticClassDistribution', params, { loading: 'LOADING_STATISTIC_CLASS_DISTRIBUTION' })
  // baseURL: 'http://localhost:9000'

// 年度学时
export const fetchStatisticTotalStudy = (params) =>
  httpServe('/fn/data/board/statisticTotalStudy', params, { loading: 'LOADING_STATISTIC_TOTAL_STUDY' })
  // baseURL: 'http://localhost:9000'
