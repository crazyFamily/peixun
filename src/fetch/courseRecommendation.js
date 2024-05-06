import { dataHeaders, httpServe } from '@/util/utils'
// 训练营列表 - 查询
export const queryTrainingPage = (params) => httpServe('/fn/privatewealth/training/queryTrainingPage', params)
// 训练营 - 保存修改
export const saveTrainingInfo = (params) => httpServe('/fn/privatewealth/training/saveTrainingInfo', params)
// 训练营 - 详情
export const queryTrainingDetail = (params) => httpServe('/fn/privatewealth/training/queryTrainingDetail', params)
// 训练营 - 课表设置 - 线下培训
export const queryClassInfo = (params) => httpServe('/fn/privatewealth/training/queryClassInfo', params)
// 训练营 - 训练营上下架
export const upOrDownStatus = (params) => httpServe('/fn/privatewealth/training/upOrDownStatus', params)
//习题包 预保存
export const preSaveExerciseProject = (params) => httpServe('/fn/privatewealth/exerciseproject/preSaveExerciseProject', params)
//习题包 删除
export const deleteExerciseProjectById = (params) => httpServe('/fn/privatewealth/exerciseproject/deleteExerciseProjectById', params)
// 训练营 - 训练营删除
export const deleteTraining = (params) => httpServe('/fn/privatewealth/training/deleteTraining', params)

// 导出全部答题明细
export const fetchExportAllExamExercise = (params) =>
  httpServe('/fn/privatewealth/exam/exportAllExamExercise', params, {
    headers: { responseType: 'blob' }
  })

// 训练营-学员维度统计
export const fetchQueryTrainingUmStatistical = (params) => httpServe('/fn/privatewealth/training/queryTrainingUmStatistical', params)

// 训练营-训练营维度统计
export const fetchQueryTrainingStatistical = (params) => httpServe('/fn/privatewealth/training/queryTrainingStatistical', params)

// 训练营-数据统计-人员完成详情
export const fetchQueryTrainingUmDetail = (params) => httpServe('/fn/privatewealth/training/queryTrainingUmDetail', params)

// 训练营-数据统计-手工干预
export const fetchUpdateUmCompeteStatus = (params) => httpServe('/fn/privatewealth/training/updateUmCompeteStatus', params)

// 训练营-数据统计-数据导出
export const fetchExportTrainingStageStatistic = (params) =>
  httpServe('/fn/privatewealth/training/exportTrainingStageStatistic', params, { headers: { responseType: 'blob' } })

// 保存课包
export const fetchSaveProjectDraft = (params) => httpServe('/fn/privatewealth/project/saveProjectDraft', params)

// 课程详情
export const fetchSearchCourseByCourseId = (params) => httpServe('/fn/privatewealth/course/searchCourseByCourseId', params)

// 保存推送设置信息
export const fetchSavePushSetting = (params) => httpServe('/fn/privatewealth/push/savePushSetting', params)

// 上传推送人员名单
export const fetchUploadPushUsers = (params) => httpServe('/cFn/tkFileFunc/push/uploadPushUsers', params, dataHeaders)

// 用户推送
export const fetchPushToUser = (params) => httpServe('/fn/privatewealth/push/pushToUser', params)

// 分页查询推送记录
export const fetchListPushSettingHistory = (params) => httpServe('/fn/privatewealth/push/listPushSettingHistory', params)

// 分页查询或导出推送人员信息
export const fetchListPushUserInfos = (params, downloadFlag) => httpServe('/fn/privatewealth/push/listPushUserInfos', params, downloadFlag && { headers: { responseType: 'blob' }})

// 查询推送人员成功/失败/总数
export const fetchSearchPushResult = (params) => httpServe('/fn/privatewealth/push/searchPushResult', params)

// 批量删除推送人员
export const fetchDeleteBatchPushUser = (params) => httpServe('/fn/privatewealth/push/deleteBatchPushUser', params)

// 取消推送
export const fetchCancelPush = (params) => httpServe('/fn/privatewealth/push/cancelPush', params)

// 获取课程标签
export const APISelectCourseTagsForTk = '/fn/course/tag/selectCourseTagsForTk'
// 校验标签是否使用中
export const APICheckCourseTagIsRef = '/fn/course/tag/checkCourseTagIsRef'

// 获取智能推课机构列表
export const fetchListScOrg = (params) => httpServe('/fn/commons/privatewealth/listScOrg', params, dataHeaders)

// 获取便签数据
export const fetchSelectCourseTagsForReview = (params) => httpServe('/fn/course/tag/selectCourseTagsForReview', params, dataHeaders)

// 查询课程列表
export const fetchListTkCourses = (params) => httpServe('/fn/privatewealth/course/listTkCourses', params)

// 删除课程
export const fetchDeleteTkCourseByCourseId = (params) => httpServe('/fn/privatewealth/course/deleteTkCourseByCourseId', params)

// 复制课程
export const fetchCopyCourse = (params) => httpServe('/fn/privatewealth/course/copyCourse', params)

// 上下架
export const fetchModifyUplownStatus = (params) => httpServe('/fn/privatewealth/course/modifyUplownStatus', params)

// 是否纳入合规理财
export const fetchModifyFinanceCompliance = (params) => httpServe('/fn/privatewealth/course/modifyFinanceCompliance', params)

// 导出课程
export const fetchExportCourseExcelByCondition = (params) =>
  httpServe('/fn/privatewealth/course/exportCourseExcelByCondition', params, {
    headers: { responseType: 'blob' }
  })

// 查询考试信息
export const fetchQueryExamInfoPage = (params) => httpServe('/fn/privatewealth/exam/queryExamInfoPage', params)

// 查询大类资产标签列表和综合产品标签列表
export const fetchSelectAssetTagAndProductTag = (params) => httpServe('/fn/privatewealth/exerciseinfo/selectAssetTagAndProductTag', params)

// 查询习题列表-用于习题包添加习题和习题列表分页查询
export const fetchSelectExerciseInfoListForProjectByPage = (params) =>
  httpServe('/fn/privatewealth/exerciseinfo/selectExerciseInfoListForProjectByPage', params)

// 导出习题库/习题包
export const fetchExportExerciseInfoList = (params) => httpServe('/fn/privatewealth/exerciseinfo/exportExerciseInfoList', params, {
  headers: { responseType: 'blob' }
})

// 查习题包
export const fetchSelectExerciseListInProjectByPage = (params) =>
  httpServe('/fn/privatewealth/exerciseproject/selectExerciseListInProjectByPage', params)

// 获取H5页面配置数据
export const fetchGetProjectH5Detail = (params) => httpServe('/fn/privatewealth/project/getProjectH5Detail', params)

// 查询课包列表
export const fetchListToProject = (params) => httpServe('/fn/privatewealth/project/listToProject', params)

// 获取课包详情
export const fetchDetailToProject = (params) => httpServe('/fn/privatewealth/project/detailToProject', params)

// 课包H5页面保存
export const fetchSaveProjectH5Page = (params) => httpServe('/fn/privatewealth/project/saveProjectH5Page', params)

// H5分享页面保存
export const fetchSaveOrUpdateH5Page = (params) => httpServe('/fn/privatewealth/commonH5Page/saveOrUpdateH5Page', params)

// 查询H5页面
export const fetchGetCommonH5Detail = (params) => httpServe('/fn/privatewealth/commonH5Page/getCommonH5Detail', params)

// 考勤签到
// 分页查询考勤列表
export const fetchQueryAttendancePage = (params) => httpServe('/fn/privatewealth/attendance/queryAttendancePage', params)
// 开始考勤保存考勤信息
export const fetchSaveAttendanceInfo = (params) => httpServe('/fn/privatewealth/attendance/saveAttendanceInfo', params)
// 生成考勤二维码链接
export const fetchGetAttendanceQrCode = (params) => httpServe('/fn/privatewealth/attendance/getAttendanceQrCode', params)
// 完成考勤
export const fetchFinishAttendance = (params) => httpServe('/fn/privatewealth/attendance/finishAttendance', params)
// 删除考勤
export const fetchDeleteAttendance = (params) => httpServe('/fn/privatewealth/attendance/deleteAttendance', params)
// 导出学员打卡记录
export const fetchExportAttendanceStudent = (params) => httpServe('/fn/privatewealth/attendance/exportAttendanceStudent', params, {
  headers: { responseType: 'blob' }
})
// 手工补录考勤
export const fetchAddBatchAttendanceRecord = (params) => httpServe('/fn/privatewealth/attendance/addBatchAttendanceRecord', params)
// 查询学员考勤列表
export const fetchQueryAttendanceStudentPage = (params) => httpServe('/fn/privatewealth/attendance/queryAttendanceStudentPage', params)
// 清空学员打卡记录
export const fetchClearAttendanceRecord = (params) => httpServe('/fn/privatewealth/attendance/clearAttendanceRecord', params)
// 检查陪练剧本ID合法性及返回剧本名
export const fetchCheckPlaybookIdAndGetName = (params) => httpServe('/fn/privatewealth/training/checkPlaybookIdAndGetName', params)
// 是否显示AI练um号推送按钮
export const fetchIsShowAIPushButton = (params) => httpServe('/fn/privatewealth/push/isShowAIPushButton', params)
// AI练um号推送
export const fetchPushUmToAi = (params) => httpServe('/fn/privatewealth/push/pushUmToAi', params)
// 分页查询笔记列表
export const fetchCommentList = (params) => httpServe('/fn/privatewealth/comment/selectCommentPage', params)
// 查询笔记详情
export const fetchCommentDetail = (params) => httpServe('/fn/privatewealth/comment/selectCommentInteractionInfo', params)
// 笔记导出
export const fetchExportComment = (params) => httpServe('/fn/privatewealth/comment/exportCommentInteraction', params, { 
  headers: { responseType: 'blob' }
})
// 笔记或评论批量启动
export const fetchProcessBatchKickOff = (params) => httpServe('/fn/privatewealth/comment/processBatchKickOff', params)
// 笔记或者评论批量屏蔽
export const fetchProcessBatchShield = (params) => httpServe('/fn/privatewealth/comment/processBatchShield', params)
