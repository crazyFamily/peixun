import { httpServe } from '@/util/utils'
// 模板列表
export const fetchListTemplateManege = (...params) =>
  httpServe('/fn/system/func/listTemplateManege', ...params)

// 添加模板
export const fetchAddTemplateManege = (...params) =>
  httpServe('/fn/system/func/addTemplateManege', ...params)

// 删除模板
export const fetchDeleteTemplateManege = (...params) =>
  httpServe('/fn/system/func/deleteTemplateManege', ...params)

// 根据模板CODE查询udmp
export const fetchDownTemplate = (...params) =>
  httpServe('/fn/system/func/downTemplate', ...params)

// 判断部门归属
export const fetchCheckZone = (...params) =>
  httpServe('/fn/plan/annual/checkZone', ...params)
