import { httpServe } from '@/util/utils'
// 资讯列表
export const fetchListRealInfo = (...params) =>
  httpServe('/fn/homeOperate/zx/listRealInfo', ...params)

// 置顶操作
export const fetchOrderRealInfoTop = (...params) =>
  httpServe('/fn/homeOperate/zx/orderRealInfoTop', ...params)

// 添加/编辑资讯
export const fetchSaveOrUpdateRealInfo = (...params) =>
  httpServe('/fn/homeOperate/zx/saveOrUpdateRealInfo', ...params)

// 详情
export const fetchFindRealInfo = (...params) =>
  httpServe('/fn/homeOperate/zx/findRealInfo', ...params)

// 批量删除
export const fetchDeleteRealInfo = (...params) =>
  httpServe('/fn/homeOperate/zx/deleteRealInfo', ...params)

// 查询资讯各类总量
export const fetchFinRealInfoCount = (...params) =>
  httpServe('/fn/homeOperate/zx/finRealInfoCount', ...params)

// 批量上下线
export const fetchUpdateRealInfoStatus = (...params) =>
  httpServe('/fn/homeOperate/zx/updateRealInfoStatus', ...params)

// 保存banner集合
export const fetchSaveHomePageBanner = (...params) =>
  httpServe('/fn/homeOperate/zx/saveHomePageBanner', ...params)

// 查询banner集合
export const fetchListHomePageBanner = (...params) =>
  httpServe('/fn/homeOperate/zx/listHomePageBanner', ...params)

// 上传接口
// export const fetchUpdateRealInfoStatus = (...params) => httpServe('/fn/homeOperate/zx/updateRealInfoStatus', ...params)