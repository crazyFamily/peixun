import { httpServe, dataHeaders } from '@/util/utils'

// 试点开启列表
export const fetchListFunctionSwitch = (params) =>
  httpServe('/fn/commons/functionSwitch/listOrExportFunctionSwitch', params)

// 试点开启导出
export const fetchExportFunctionSwitch = (params) =>
  httpServe('/fn/commons/functionSwitch/listOrExportFunctionSwitch', params, {
    headers: { responseType: 'blob' }
  })

// 根据id获取信息
export const fetchFindFunctionSwitchById = (params) =>
  httpServe('/fn/commons/functionSwitch/findFunctionSwitchById', params)

// 添加试点开启
export const fetchSaveFunctionSwitch = (params) =>
  httpServe('/fn/commons/functionSwitch/saveFunctionSwitch', params)

// 校验功能开关ID是否重复
export const fetchCheckFunctionId = (params) => 
  httpServe('/fn/commons/functionSwitch/checkFunctionId', params)

// 校验功能开关名称是否重复
export const fetchCheckFunctionName = (params) => 
  httpServe('/fn/commons/functionSwitch/checkFunctionName', params)

// 展示功能开关名称列表
export const fetchListFunctionName = (params) => 
  httpServe('/fn/commons/functionSwitch/listFunctionName', params)

// 删除功能开关
export const fetchRemoveFunction = (params) => httpServe('/fn/commons/functionSwitch/deleteFunctionSwitchById', params)