import { httpServe } from '@/util/utils'
// 新增用户反馈
export const fetchSaveFeedback = (...params) =>
  httpServe('/fn/homeOperate/zx/saveFeedback', ...params)

// 用户个人问题反馈列表
export const fetchListUserFeedBack = (...params) =>
  httpServe('/fn/homeOperate/zx/listUserFeedBack', ...params)

// 问题反馈详情
export const fetchFindFeedBack = (...params) =>
  httpServe('/fn/homeOperate/zx/findFeedBack', ...params)

// 查询用户是否已读最新系统更新
export const fetchFindUserLastSystemUpdate = (...params) =>
  httpServe('/fn/homeOperate/zx/findUserLastSystemUpdate', ...params)

// 保存用户已读更新记录
export const fetchSaveUserLastSystemUpdate = (...params) =>
  httpServe('/fn/homeOperate/zx/saveUserLastSystemUpdate', ...params)

// 更新资讯浏览量
export const fetchAddRealInfoBrowseNum = (...params) =>
  httpServe('/fn/homeOperate/zx/addRealInfoBrowseNum', ...params)