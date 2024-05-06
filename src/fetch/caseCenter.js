import { dataHeaders, httpServe } from '@/util/utils'

// 查询案例列表
export const fetchListToCase = (params) =>
  httpServe('/fn/caseCenter/case/listToCase', params, { loading: 'LOADING_CASECENTER_MANAGE_LIST' })
// 删除案例
export const fetchRemoveCase = (params) =>
  httpServe('/fn/caseCenter/case/removeCase', params)
// 案例上下架
export const fetchUpOrDownStatus = (params) =>
  httpServe('/fn/caseCenter/case/caseUpOrDownStatus', params)
// 导出案例
export const fetchExportCaseInfoList = (params) =>
  httpServe('/fn/caseCenter/case/exportCaseInfoList', params, {
    headers: { responseType: 'blob' }
  })
// 获取案例详情
export const fetchDetailCase = (params) =>
  httpServe('/fn/caseCenter/case/detailCase', params)
// 更新案例优秀案例状态
export const fetchUpdatePerfect = (params) =>
  httpServe('/fn/caseCenter/case/updateCasePerfectStatusById', params)

// 编辑保存-用户常用自定义菜单
export const fetchSelectOrgTagList = `/fn/caseCenter/tag/selectOrgTagList`

export const fetchSelectOrgTagListFn = (params) =>
  httpServe('/fn/caseCenter/tag/selectOrgTagList', params)

// 案例推送--后管列表导出
export const fetchExportPushCaseList = (params) =>
  httpServe(`/fn/caseCenter/pushCase/exportPushCaseList`, params, {
    headers: { responseType: 'blob' }
  })

// 案例推送--后管列表查询
export const fetchListToPushCase = (params) =>
  httpServe('/fn/caseCenter/pushCase/listToPushCase', params)

// 案例推送--后管删除人员名单
export const fetchDeletePushCaseUser = (params) =>
  httpServe('/fn/caseCenter/pushCase/deletePushCaseUser', params)

// 案例推送--后管失败名单列表导出
export const fetchExportPushCaseFailUsersList = (params) =>
  httpServe('/fn/caseCenter/pushCase/exportPushCaseFailUsersList', params, {
    headers: { responseType: 'blob' }
  })

// 案例推送--后管导入人员名单
export const fetchBatchImportCasePushUsers = (params) =>
  httpServe('/common/caseCenter/batchImportCasePushUsers', params)

// 案例推送--后管手工添加名单
export const fetchInsertManulUsers = (params) =>
  httpServe('/fn/caseCenter/pushCase/insertManulUsers', params)

// 案例推送--后管批量删除
export const fetchBatchDeletePushCase = (params) =>
  httpServe('/fn/caseCenter/pushCase/batchDeletePushCase', params)

// 案例推送--后管撤回
export const fetchUpdatePushCaseStatus = (params) =>
  httpServe('/fn/caseCenter/pushCase/updatePushCaseStatus', params)

// 案例推送--后管新增或修改接口
export const fetchInsertPushCaseForSave = (params) =>
  httpServe('/fn/caseCenter/pushCase/insertPushCaseForSave', params, { loading: 'LOADING_CASE_PUSH_SAVE' })

// 案例推送--后管查询导入操作列表
export const fetchCasePushImportList = (params) =>
  httpServe('/fn/caseCenter/pushCase/casePushImportList', params)

// 案例推送--后管查询添加人员列表
export const fetchListToPushCaseUsers = (params) =>
  httpServe('/fn/caseCenter/pushCase/listToPushCaseUsers', params)

// 案例推送--后管查询详情
export const fetchPushCaseDetail = (params) =>
  httpServe('/fn/caseCenter/pushCase/pushCaseDetail', params)

// 案例推送--后管根据名称搜索人员
export const fetchListManulUsers = (params) =>
  httpServe('/fn/caseCenter/pushCase/listManulUsers', params)

// 案例推送--后管计算机构人数
export const fetchCountOrgPushCaseUser = (params) =>
  httpServe('/fn/caseCenter/pushCase/countOrgPushCaseUser', {
    ...params,
    type: 'C'
  })

// 案例推送--后管导出机构人员
export const fetchExportOrgPushCaseUser = (params) =>
  httpServe(
    '/fn/caseCenter/pushCase/countOrgPushCaseUser',
    { ...params, type: 'E' },
    {
      headers: { responseType: 'blob' }
    }
  )

// 案例推送--后管案例推送人员案例报表数据
export const fetchStudyUsersRelaByCasePushData = (params) =>
  httpServe('/fn/caseCenter/pushCase/studyUsersRelaByCasePushData', {
    data: { ...params.data, tip: 'Y' }
  })

// 案例推送--导出后管案例推送人员案例报表数据
export const fetchExportStudyUsersRelaByCasePushData = (params) =>
  httpServe(
    '/fn/caseCenter/pushCase/studyUsersRelaByCasePushData',
    { data: { ...params.data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )

// 案例推送--后管案例推送报表数据
export const fetchQryCasePushReportData = (params) =>
  httpServe('/fn/caseCenter/pushCase/qryCasePushReportData', params)

// 案例推送--后管案例推送案例报表数据
export const fetchCasePushByCaseReportData = (params) =>
  httpServe('/fn/caseCenter/pushCase/casePushByCaseReportData', {
    data: { ...params.data, tip: 'Y' }
  })

// 案例推送--导出后管案例推送案例报表数据
export const fetchExportCasePushByCaseReportData = (params) =>
  httpServe(
    '/fn/caseCenter/pushCase/casePushByCaseReportData',
    { data: { ...params.data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )

// 案例推送--后管案例推送案例纬度人员报表数据
export const fetchStudyUsersByCasePushData = (params) =>
  httpServe('/fn/caseCenter/pushCase/studyUsersByCasePushData', {
    data: { ...params.data, tip: 'Y' }
  })

// 案例推送--导出后管案例推送案例纬度人员报表数据
export const fetchExportStudyUsersByCasePushData = (params) =>
  httpServe(
    '/fn/caseCenter/pushCase/studyUsersByCasePushData',
    { data: { ...params.data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )

// 案例活动-查询-片区和分行
export const fetchListHeroAreaOrg = (params) =>
  httpServe('/fn/heroCenter/hero/listHeroAreaOrg', params)

// 案例活动--列表查询
export const fetchListToHeroTrail = (params) =>
  httpServe('/fn/heroCenter/hero/listToHeroTrail', params)

// 案例活动--查看详情
export const fetchHeroTrailDetail = (params) =>
  httpServe('/fn/heroCenter/hero/heroTrailDetail', params)

// 案例活动--列表导出
export const fetchExportHeroTrailList = (params) =>
  httpServe('/fn/heroCenter/hero/exportHeroTrailList', params, {
    headers: { responseType: 'blob' }
  })

// 案例活动--批量上下架
export const fetchBatchUpdateTrailStatus = (params) =>
  httpServe('/fn/heroCenter/hero/batchUpdateTrailStatus', params)

// 案例活动--批量删除
export const fetchBatchDeleteHeroTrail = (params) =>
  httpServe('/fn/heroCenter/hero/batchDeleteHeroTrail', params)

// 英雄名单-查询-英雄列表
export const fetchListBaseHeroUsers = (params) =>
  httpServe('/fn/heroCenter/hero/listBaseHeroUsers', params)

// 案例活动--新增或者修改
export const fetchSaveHeroTrail = (params) =>
  httpServe('/fn/heroCenter/hero/saveHeroTrail', params)

/**
 * 案例中心 - 活动数据 - 活动排名
 */
// 案例活动-查询-片区和分行
export const fetchListAreaOrg = () =>
  httpServe('/fn/heroCenter/hero/listHeroAreaOrg')

// 活动排名--列表查询
export const fetchListToTrailRank = (params) =>
  httpServe('/fn/heroCenter/hero/listToHeroTrailRank', params)

// 活动排名--列表导出
export const fetchExportTrailRankList = (params) =>
  httpServe('/fn/heroCenter/hero/exportHeroTrailRankList', params, {
    headers: { responseType: 'blob' }
  })

// 案例点亮名单查询与导出
export const fetchHeroTrailWinningRecord = (params, options) =>
  httpServe('/fn/heroCenter/hero/listHeroTrailWinningRecord', params, options)

/**
 * 案例中心 - 活动数据 - 中奖名单
 */
// 英雄名单-查询-中奖列表
export const fetchHeroWinningRecord = (params, options) =>
  httpServe('/fn/heroCenter/hero/listHeroWinningRecord', params, options)
// 案例活动-批量导入案例
export const fetchBatchImportHeroTrails = (params) =>
  httpServe('/common/hero/batchImportHeroTrails', params, dataHeaders)

// 案例中心 - 活动数据 - 奖品库存列表
export const fetchListAwardStock = (params) =>
  httpServe('/fn/heroCenter/hero/listAwardStock', params)

/**
 * 案例中心 - 活动数据 - 英雄名单
 */
// 英雄名单-查询-英雄列表
export const fetchHeroUsers = (params) =>
  httpServe('/fn/heroCenter/hero/listBaseHeroUsers', params)

// 英雄名单列表导出
export const fetchExportHeroUsers = (params) =>
  httpServe('/fn/heroCenter/hero/exportHeroUsers', params, {
    headers: { responseType: 'blob' }
  })

// 英雄名单-更新-更新英雄有效状态
export const fetchUpdateHeroUserIfValid = (params) =>
  httpServe('/fn/heroCenter/hero/updateHeroUserIfValid', params)

// 英雄名单-查询-英雄详情
export const fetchFindHeroUserDetail = (params) =>
  httpServe('/fn/heroCenter/hero/findBaseHeroUserDetail', params)

// 英雄名单-更新-编辑更新英雄信息
export const fetchUpdateHeroUser = (params) =>
  httpServe('/fn/heroCenter/hero/updateHeroUser', params)

// 英雄名单-删除-删除英雄
export const fetchDeleteHeroUser = (params) =>
  httpServe('/fn/heroCenter/hero/deleteHeroUserBatch', params)

// 英雄名单-新增-新增英雄
export const fetchSaveHeroUser = (params) =>
  httpServe('/fn/heroCenter/hero/saveSingleHeroUser', params)

// 英雄名单批量上传校验
export const fetchBatchImportHeroUsers = (params) =>
  httpServe('/common/hero/batchImportInitHeroUsers', params, dataHeaders)

// 批量新增英雄名单
export const fetchSaveHeroUserBatch = (params) =>
  httpServe('/fn/heroCenter/hero/saveHeroUserBatch', params)

export const fetchListCasePushBelongOrgs = `/fn/caseCenter/pushCase/listCasePushBelongOrgs`

// 案例管理-语音课件转文字
export const fetchVoiceToText = (params) =>
  httpServe('/fn/caseCenter/case/voiceToText', params)

// 获取转译文字
export const fetchFindVoiceToTextList = (params) =>
  httpServe('/fn/caseCenter/case/findVoiceToTextList', params)

// 案例管理-上传txt/word文件获取内容
// export const fetchUploadCaseCourseTxt = '/common/file/uploadCaseCourseTxt'
export const fetchUploadCaseCourseTxt = (params, options) =>
  httpServe('/common/file/uploadCaseCourseTxt', params, options)

// // ========================== 首页设置 ==========================
// 获取模块信息
// /fn/caseCenter/homePage/findCaseHomePage
export const fetchFindCaseHomePage = (params) =>
  httpServe('/fn/caseCenter/homePage/findCaseHomePage', params)

// /fn/caseCenter/homePage/saveOrUpdateCaseHome
export const fetchSaveOrUpdateCaseHome = (params) =>
  httpServe('/fn/caseCenter/homePage/saveOrUpdateCaseHome', params)

// ========================== 案例专题 ==========================
// 案例专题-列表
export const fetchListZone = (params) =>
  httpServe('/fn/caseCenter/zoneManager/listZone', params)

// 案例专题-删除
export const fetchDeleteZone = (params) =>
  httpServe('/fn/caseCenter/zoneManager/deleteZone', params)

// 案例专题-根据id获取专题
export const fetchFindZoneById = (params) =>
  httpServe('/fn/caseCenter/zoneManager/findZoneById', params)


// ========================== 知鸟课程专题 ==========================
// 知鸟课程专题-列表
// /tms-new/api/fn/homeOperate/ZnZone/listZnZone
export const fetchListZnZone = (params) =>
  httpServe('/fn/homeOperate/ZnZone/listZnZone', params)

// 知鸟课程专题-添加/更新
export const fetchSaveOrUpdateZnZone = (params) =>
  httpServe('/fn/homeOperate/ZnZone/saveOrUpdateZnZone', params)

// 知鸟课程专题-删除
// /tms-new/api/fn/homeOperate/ZnZone/deleteZnZone
export const fetchDeleteZnZone = (params) =>
  httpServe('/fn/homeOperate/ZnZone/deleteZnZone', params)

// 知鸟课程专题-根据id获取专题
// /tms-new/api/fn/homeOperate/ZnZone/findZnZoneById
export const fetchFindZnZoneById = (params) =>
  httpServe('/fn/homeOperate/ZnZone/findZnZoneById', params)

// 知鸟课程专题-导入课程
// /tms-new/api/common/homeOperate/ZnZone/batchCheckZnCourse
export const fetchBatchCheckZnCourse = (params) =>
  httpServe('/common/homeOperate/ZnZone/batchCheckZnCourse', params)

// 资源选择器-查询知鸟课程专题列表
// /caseCenter/homePage/findZnZoneList
export const fetchFindZnZoneList = (params) =>
  httpServe('/fn/caseCenter/homePage/findZnZoneList', params)

// ========================== 案例类报表 ==========================
// 案例学习统计报表-按案例推送统计-列表
export const fetchListCasePush = (params) =>
  httpServe(
    '/fn/report/case/casePushStatisticsList',
    {
      data: { ...params, tip: 'Y' }
    },
    { loading: 'LOADING_CASE_PUSH_STATISTICS' }
  )
// 案例学习统计报表-按案例推送统计-列表
export const fetchListCasePushExport = (params) =>
  httpServe('/fn/report/case/casePushStatisticsList', {
    data: { ...params, tip: 'N' }
  },{
    headers: { responseType: 'blob' }
  })
// 案例学习统计报表-按机构统计-列表
export const fetchUpStatisticsList = (params) =>
  httpServe(
    '/fn/report/case/caseUpStatisticsList',
    {
      data: { ...params, tip: 'Y' }
    },
    { loading: 'LOADING_CASE_UP_STATISTICS' }
  )
// 案例学习统计报表-按机构统计-导出
export const fetchUpStatisticsListExport = (params) =>
  httpServe('/fn/report/case/caseUpStatisticsList', {
    data: { ...params, tip: 'N' }
  },{
    headers: { responseType: 'blob' }
  })

// 案例管理-查询已添加可见人群um用户
export const fetchFindCaseCrowdUmList = (params) => {
  if (params.request.type === 'E') {
    return httpServe('/fn/caseCenter/case/findCaseCrowdUmList', params, { headers: { responseType: 'blob' } } )
  } else {
    return httpServe('/fn/caseCenter/case/findCaseCrowdUmList', params)
  }
}

// 案例管理-可见人群-查询可见人群总人数情况
export const fetchFindCaseVisibleCount = (params) =>
  httpServe('/fn/caseCenter/case/findCaseVisibleCount', params)

// 案例管理-可见人群-查询已添加的临时用户列表
export const fetchListToCaseAddVisibleUsers = (params) =>
  httpServe('/fn/caseCenter/case/listToCaseAddVisibleUsers', params)

// 案例管理-可见人群-删除已添加的临时um用户（或清空）
export const fetchDeleteCaseVisibleUser = (params) =>
  httpServe('/fn/caseCenter/case/deleteCaseVisibleUser', params)

// 案例管理-可见人群-删除已保存um用户（或清空）
export const fetchDeleteCaseVisibleEffUser = (params) =>
  httpServe('/fn/caseCenter/case/deleteCaseVisibleEffUser', params)

// 案例管理-可见人群-新增um用户集合
export const fetchInsertCaseManulVisibleUsers = (params) =>
  httpServe('/fn/caseCenter/case/insertCaseManulVisibleUsers', params)

// 案例管理-可见人群-机构人员数量查询及导出人员
export const fetchCountCaseOrgUser = (params) => {
  if (params.type === 'E') {
    return httpServe('/fn/caseCenter/case/countCaseOrgUser', params, { headers: { responseType: 'blob' } } )
  } else {
    return httpServe('/fn/caseCenter/case/countCaseOrgUser', params)
  }
}

// 案例管理-可见人群-查询可选机构
export const fetchListCaseBelongOrgs = (params) =>
  httpServe('/fn/caseCenter/case/listCaseBelongOrgs', params)

// 案例管理--后管根据名称搜索人员
export const fetchListCaseManulUsers = (params) =>
  httpServe('/fn/caseCenter/case/listCaseManulUsers', params)

// 案例中心-查询已添加可见人群um用户
export const fetchFindColumneCrowdUmList = (params) => {
  if (params.request.type === 'E') {
    return httpServe('/fn/caseCenter/homePage/findColumneCrowdUmList', params, { headers: { responseType: 'blob' } } )
  } else {
    return httpServe('/fn/caseCenter/homePage/findColumneCrowdUmList', params)
  }
}


// 案例推送--后管根据名称搜索人员
export const fetchListColumnManulUsers = (params) =>
  httpServe('/fn/caseCenter/homePage/lisColumnManulUsers', params)

// 案例中心-可见人群-查询可见人群总人数情况
export const fetchFindColumnVisibleCount = (params) =>
  httpServe('/fn/caseCenter/homePage/findColumnVisibleCount', params)

// 案例中心-可见人群-查询已添加的临时用户列表
export const fetchListToColumnAddVisibleUsers = (params) =>
  httpServe('/fn/caseCenter/homePage/listToColumnAddVisibleUsers', params)

// 案例中心-可见人群-删除已添加的临时um用户（或清空）
export const fetchDeleteColumnVisibleUser = (params) =>
  httpServe('/fn/caseCenter/homePage/deleteColumnVisibleUser', params)

// 案例管理-可见人群-删除已保存um用户（或清空）
export const fetchDeleteColumnVisibleEffUser = (params) =>
  httpServe('/fn/caseCenter/homePage/deleteColumnVisibleEffUser', params)

// 案例中心-可见人群-新增um用户集合
export const fetchInsertColumnManulVisibleUsers = (params) =>
  httpServe('/fn/caseCenter/homePage/insertColumnManulVisibleUsers', params)

// 案例中心-可见人群-机构人员数量查询及导出人员
export const fetchCountColumnOrgUser = (params) => {
    if (params.type === 'E') {
      return httpServe('/fn/caseCenter/homePage/countColumnOrgUser', params, { headers: { responseType: 'blob' } } )
    } else {
      return httpServe('/fn/caseCenter/homePage/countColumnOrgUser', params)
    }
  }

// 案例中心-可见人群-查询可选机构
export const fetchListColumnBelongOrgs = (params) =>
  httpServe('/fn/caseCenter/homePage/listColumnBelongOrgs', params)

// 专题管理-评分专题报表-案例评分统计
export const fetchListEvaZoneCase = (params) => 
  httpServe('/fn/caseCenter/zoneManager/listEvaZoneCaseReport', params)
// 专题管理-评分专题报表-案例评分统计
export const fetchListEvaZoneCaseExport = (params) => 
  httpServe('/fn/caseCenter/zoneManager/listEvaZoneCaseReport', params, { headers: { responseType: 'blob' } } )
// 专题管理-评分专题报表-案例评分明细
export const fetchListEvaZoneCaseDetail = (params) => 
  httpServe('/fn/caseCenter/zoneManager/listEvaZoneCaseReportDetail', params)
// 专题管理-评分专题报表-案例评分明细
export const fetchListEvaZoneCaseDetailExport = (params) => 
  httpServe('/fn/caseCenter/zoneManager/listEvaZoneCaseReportDetail', params, { headers: { responseType: 'blob' } } )

// 案例中心-案例管理-报表-评分明细列表
export const fetchScoreCaseStatisticsReport = (params) => 
  httpServe('/fn/caseCenter/case/scoreCaseStatisticsReport', params, { loading: 'LOADING_CASECENTER_SCORETYPE_REP' })
// 案例中心-案例管理-报表-评分明细图表
export const fetchScoreChartData = (params) => 
  httpServe('/fn/caseCenter/case/scoreChartData', params)
// 案例中心-案例管理-报表-评分明细列表导出
export const fetchExportScoreCaseStatisticsReport = (params) => 
  httpServe('/fn/caseCenter/case/exportScoreCaseStatisticsReport', params, { headers: { responseType: 'blob' } } )

// 案例中心-标签管理-保存标签
export const fetchSaveTage = (params) => 
  httpServe('/fn/caseCenter/tag/saveTage', params)
// 案例中心-标签管理-查询标签列表
export const fetchListTags = (params) => 
  httpServe('/fn/caseCenter/tag/listTags', params)
// 案例中心-标签管理-查询标签列表
export const APIListTags = '/fn/caseCenter/tag/listTags'
// 案例中心-标签管理-查询标签列表
export const APICheckTagUsedStatus = '/fn/caseCenter/tag/checkTagUsedStatus'
// 案例中心-标签管理-调整标签顺序
export const fetchUpdateTagSort = (params) => httpServe('/fn/course/tag/updateTagSort', params)
// 批量导入课程标签校验
export const fetchTagBatchImport = (params) => httpServe('/common/caseCenter/tag/tagBatchImport', params)
// 导出失败列表标签
export const fetchExportFailList = (params) => httpServe('/fn/caseCenter/tag/exportFailList', params, { headers: { responseType: 'blob' } } )
// 批量导入课程标签新增确定
export const fetchSaveTagBatch = (params) => httpServe('/fn/caseCenter/tag/saveTagBatch', params)