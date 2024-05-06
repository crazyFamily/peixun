import { httpServe } from '@/util/utils'
// 模块添加案例-查询可添加案例列表
export const fetchFindUpCaseList = (params) =>
  httpServe('/fn/caseCenter/homePage/findUpCaseList', params)

// 模块添加专题-查询专题列表
export const fetchFindZoneList = (params) =>
  httpServe('/fn/caseCenter/homePage/findZoneList', params)

// 案例首页-新增或编辑首页
export const fetchSaveOrUpdateCaseHome = (params) =>
  httpServe('/fn/caseCenter/homePage/saveOrUpdateCaseHome', params)