import { httpServe, dataHeaders } from '@/util/utils'

// 查询新阶梯课表模板
export const fetchQueryLadderCourse = (params) =>
  httpServe('/fn/classes/lixiang/queryLadderCourse', params)

export const fetchQueryOutsideLadderCourse = (params) =>
  httpServe('/fn/classes/lixiang/queryOutsideLadderCourse', params)

// 培训管理--培训通知--查询学员通知
export const fetchQueryLatestClassStudentNotify = (params) =>
  httpServe('/fn/classes/manager/notify/queryLatestClassStudentNotify', params, dataHeaders)

// 培训管理--培训通知--查询讲师列表
export const fetchQueryCourseManagerList = (params) =>
  httpServe('/fn/classes/manager/notify/queryCourseManagerList', params, dataHeaders)

// 培训管理--培训通知--保存学员通知
export const fetchInsertClassStudentNotify = (params) =>
  httpServe('/fn/classes/manager/notify/insertClassStudentNotify', params, dataHeaders)

// 培训管理--培训通知--生成邀请信
export const fetchGenerateInvitation = (params) =>
  httpServe('/fn/classes/manager/course/generateInvitation', params, dataHeaders)

// 学员批量上传校验
export const fetchBatchClassStudent = (params) =>
  httpServe('/common/manager/batchClassStudent', params, { headers: dataHeaders.headers, loading: 'LOADING_BATCH_CLASS_STUDENT' })

// 查看立项信息
export const fetchLiXiangShowClass = (params) =>
  httpServe('/fn/classes/lixiang/showClass', params, dataHeaders)

// 查看评估信息
export const fetchFindClassEvaluate = (params) =>
  httpServe('/fn/classes/manager/eva/findClassEvaluate', params, dataHeaders)

// 预览评估信息
export const fetchFindClassEvaPreview = (params) =>
  httpServe('/fn/classes/manager/eva/findClassEvaPreview', params, dataHeaders)

// 查看自定义问卷
export const fetchCustomClassEvaDetail = (params) =>
  httpServe('/fn/classes/manager/eva/customClassEvaDetail', params, dataHeaders)

// 保存自定义问卷
export const fetchSaveCustomClassEva = (params) =>
  httpServe('/fn/classes/manager/eva/saveCustomClassEva', params, dataHeaders)

// 查询自定义模板列表
export const fetchListClassEvaPrivacyTemplate = (params) =>
  httpServe('/fn/classes/manager/eva/listClassEvaPrivacyTemplate', params, dataHeaders)

// 自定义模板重命名
export const fetchRenameClassEvaTemplate = (params) =>
httpServe('/fn/classes/manager/eva/renameClassEvaTemplate', params, dataHeaders)

// 删除自定义模板
export const fetchDeleteClassEvaTemplate = (params) =>
httpServe('/fn/classes/manager/eva/deleteClassEvaTemplate', params, dataHeaders)

// 查询自定义模板详情
export const fetchPrivacyTemplateDetail = (params) =>
httpServe('/fn/classes/manager/eva/privacyTemplateDetail', params, dataHeaders)

// 获取项目分类数据
export const fetchListClassProjectType = (params) => httpServe('/fn/classes/lixiang/listClassProjectType', params)
// 获取培训班立项列表
export const fetchListClassProjectList = (params) => httpServe('/fn/classes/lixiang/listClassProject', params, { loading: 'LOADING_ESTABLISH_PROJECT_LIST' })

// 获取计划数据
export const fetchListClassAssociatePlan = (params) => httpServe('/fn/plan/manage/listClassAssociatePlan', params)

// 查看历史问卷
export const fetchFindClassEvaHistoryPreview = (params) =>
  httpServe('/fn/classes/manager/eva/findClassEvaHistoryPreview', params, dataHeaders)

// 查看历史问卷
export const fetchClassEvaSupplyDetail = (params) =>
  httpServe('/fn/classes/manager/eva/classEvaSupplyDetail', params, dataHeaders)

// 补关联计划
export const fetchAssociationPlan = (params) => httpServe('/fn/classes/lixiang/associationPlan', params)

// 抄送人查询umId
export const fetchFindUmIdInfo = (params) =>
  httpServe('/fn/classes/manager/course/findUmIdInfo', params, dataHeaders)

// 保存更新邀请函感谢函
export const fetchSaveEmailInviteThankInfo = (params) =>
  httpServe('/fn/classes/manager/course/saveEmailInviteThankInfo', params, dataHeaders)

// 发送邀请函感谢函
export const fetchSendInvitation = (params) =>
  httpServe('/fn/classes/manager/course/sendInvitation', params, dataHeaders)

// 感谢函预览下载
// export const fetchExportEvaByTeacherNoAndCourse = (params) =>
//   httpServe('/fn/classes/manager/course/exportEvaByTeacherNoAndCourse', params, dataHeaders)
export const fetchExportEvaByTeacherNoAndCourse = (params) =>
  httpServe('/fn/classes/manager/course/exportEvaByTeacherNoAndCourse', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 导出分摊导入失败结果
export const fetchExportFailShareFee = (params) => httpServe('/fn/classes/lixiang/exportFailShareFee', params, { headers: { responseType: 'blob' } })

// ============================================ 培训班管理 ============================================
// 培训班编辑 - 学员管理 - 列表查询
export const fetchListStudentAdjust = (params) =>
  httpServe('/fn/classes/manager/listStudentAdjust', params, { loading: 'LOADING_STUDENT_ADJUST' })

// 培训班编辑 - 学员管理 - 列表导出
// 导出文件：'培训班学员导出.xls'
export const fetchExportClassStudent = (params) =>
  httpServe('/fn/classes/manager/exportClassStudent', params, { headers: { responseType: 'blob' } })

// 培训班编辑 - 学员管理 - 删除学员
export const fetchDeleteStudent = (params) =>
  httpServe('/fn/classes/manager/deleteStudent', params)

// 培训班编辑 - 学员管理 - 添加学员 - 提交
export const fetchManagerCommit = (params) =>
  httpServe('/fn/classes/manager/managerCommit', params)

// 培训班编辑 - 学员管理 - 添加学员 - 查询学员列表
export const fetchListEmployeeInfo = (params) =>
  httpServe('/fn/user/listEmployeeInfo', { data: params })
  
  
// 培训班编辑 - 学员管理 - 培训评价列表导出(Y展示)
export const fetchListStudentFosterEvaluate = (params) =>
  httpServe('/fn/classes/manager/listStudentFosterEvaluate', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_STUDENT_FOSTER_EVALUATE' } )

// 培训班编辑 - 学员管理 - 培训评价列表导出(N展示)
export const fetchExportStudentFosterEvaluate = (params) =>
  httpServe('/fn/classes/manager/listStudentFosterEvaluate', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 培训班编辑 - 学员管理 - 培训评价 - 批量删除培养评价
export const fetchDeleteStudentFosterEvaluate = (params) =>
  httpServe('/fn/classes/manager/deleteStudentFosterEvaluate', { data: params })
  
// 培训班编辑 - 学员管理 - 培训评价 - 保存
export const fetchSaveStudentFosterEvaluate = (params) =>
  httpServe('/fn/classes/manager/saveStudentFosterEvaluate', { data: params })
  
// 培训班编辑 - 学员管理 - 培训评价 - 按ID查询培养评价详情
export const fetchFindStudentFosterEvaluateById = (params) =>
  httpServe('/fn/classes/manager/findStudentFosterEvaluateById', { data: params })
  
// 培训班编辑 - 学员管理 - 培训评价 - 按ID查询培养评价详情
export const fetchFindStudentFosterEvaluateAction = (params) =>
  httpServe('/fn/classes/manager/findStudentFosterEvaluateAction', { data: params })

// 学员培养评价-批量校验培养评价
export const fetchImportBatchStudentFosterEvaluate = (params, options) =>
httpServe('/common/classes/manager/importBatchStudentFosterEvaluate', params, {
    ...dataHeaders,
    ...options
  })

// 学员培养评价-批量导入培养评价
export const fetchBatchHandleStudentFosterEvaluate = (params) =>
  httpServe('/fn/classes/manager/batchHandleStudentFosterEvaluate', params)

// 学员培养评价-导出失败培养评价
export const fetchExportFailFosterEvaluate = (params) => 
  httpServe('/fn/classes/manager/exportFailFosterEvaluate', params, { headers: { responseType: 'blob' } })
  
// 1、混合培训知鸟课程、知鸟直播、知鸟考试、案例列表查询：
export const fetchSelectMixedTrainingPage = ({ data }) =>
  httpServe(
    '/fn/classes/mixed/selectMixedTrainingPage',
    { data: { ...data, tip: 'Y' } },
    {  loading: 'LOADING_SELECT_MIXED_TRAINING_PAGE' }
  )

export const fetchExportSelectMixedTrainingPage = ({ data }) =>
  httpServe(
    '/fn/classes/mixed/selectMixedTrainingPage',
    { data: { ...data, tip: 'N' } },
    {  loading: 'LOADING_EXPORT_COMPLETE_DETAIL', headers: { responseType: 'blob' } }
  )

// 6、完成明细列表查询/导出：
export const fetchTrainingCompleteDetail = ({ data }) =>
  httpServe(
    '/fn/classes/mixed/trainingCompleteDetail',
    { data: { ...data, tip: 'Y' } },
    {  loading: 'LOADING_TRAINING_COMPLETE_DETAIL' }
  )

// 导出明细
  export const fetchExportTrainingCompleteDetail = ({ data }) =>
    httpServe(
      '/fn/classes/mixed/trainingCompleteDetail',
      { data: { ...data, tip: 'N' } },
      {
        loading: 'LOADING_TRAINING_COMPLETE_DETAIL',
        headers: { responseType: 'blob' }
      }
    )
  
// 查询知鸟课程
export const fetchSelectZnCourseList = (params) =>
httpServe('/fn/classes/mixed/selectZnCourseList', params, {  loading: 'LOADING_SELECT_ZNCOURSE_LIST' })

// 2、混合培训添加知鸟课程、知鸟直播、知鸟考试、案例：
export const fetchSaveMixedTraining = (params) =>
  httpServe('/fn/classes/mixed/saveMixedTraining', params, {  loading: 'LOADING_SAVE_MIXED_TRAINING' })
  
//  混合培训-批量设置结训条件 
export const fetchUpdateFinishCondition = (params) =>
  httpServe('/fn/classes/mixed/updateFinishCondition', params, {  loading: 'LOADING_UPDATE_FINISH_CONDITION' })

  // 9、调整混合培训顺序：
export const fetchUpdateTrainingSortNo = (params) =>
  httpServe('/fn/classes/mixed/updateTrainingSortNo', params, {  loading: 'LOADING_UPDATE_TRAINING_SORT_NO' })

// 7、知鸟直播详情数据：
export const fetchSelectZnLiveDetail = (params) =>
  httpServe('/fn/classes/mixed/selectZnLiveDetail', params, {  loading: 'LOADING_SELECT_ZN_LIVE_DETAIL' })

  // 4、查询知鸟直播列表：
export const fetchSelectZnLiveList = (params) =>
  httpServe('/fn/classes/mixed/selectZnLiveList', params, {  loading: 'LOADING_SELECT_ZN_LIVE_LIST' })

// 4、查询知鸟考试列表：
export const fetchSelectZnTestList = (params) =>
  httpServe('/fn/classes/mixed/selectZnTestList', params, {  loading: 'LOADING_SELECT_ZN_TEST_LIST' })

// 混合培训-混合培训数量查询 
export const fetchSelectMixedTrainingNum = (params) =>
  httpServe('/fn/classes/mixed/selectMixedTrainingNum', params, {  loading: 'LOADING_SELECT_MIXED_TRAININGNUM' })

  // 混合培训-混合培训数量查询 
export const fetchDeleteBatchClassTraining = (params) =>
  httpServe('/fn/classes/mixed/deleteBatchClassTraining', params, { loading: 'LOADING_DELETE_BATCH_CLASS_TRAINING' })
  
//  混合培训-导出完成明细
export const fetchExportCompleteDetail = (params) =>
httpServe('/fn/classes/mixed/exportCompleteDetail', params, { loading: 'LOADING_EXPORT_COMPLETE_DETAIL', headers: { responseType: 'blob' } })

// 混合培训-查询是否在白名单人员中 
export const fetchQueryWhiteList = (params) => httpServe('/fn/classes/mixed/queryWhiteList', params, { loading: 'LOADING_QUERY_WHITE_LIST' })


