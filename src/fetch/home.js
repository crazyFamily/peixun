import { httpServe } from '@/util/utils'
// 编辑保存-用户常用自定义菜单
export const fetchModifyEmployeeCustomMenu = params =>
  httpServe('/fn/system/func/modifyEmployeeCustomMenu', params)

// 查询-用户自定义常用菜单列表
export const fetchListUserCustomMenu = params =>
  httpServe('/fn/user/listUserCustomMenu', params)

// 查询banner集合
export const fetchListHomePageBanner = params =>
  httpServe('/fn/homeOperate/zx/listHomePageBanner', params)