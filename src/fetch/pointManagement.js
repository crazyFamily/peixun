import { httpServe ,dataHeaders} from '@/util/utils'

// 获取评聘年度
export const fetchListEvaluationYear = (params) =>
  httpServe('/fn/trainer/setting/listEvaluationYear', params)

// 手工计算
export const fetchCalculateTrainersPoints = (params) =>
  httpServe('/fn/trainer/eval/calTrainersPoints', params)

// 积分计算记录查询 / 导出
export const fetchCalPointsList = (params) =>
  httpServe('/fn/trainer/eval/calPointsList', params)

// 导出积分计算
export const fetchExportCalPointsList = (params) =>
  httpServe('/fn/trainer/eval/calPointsList', params, {
    headers: { responseType: 'blob' }
  })

// 查询培训师积分
export const fetchSelectTrainersPoints = (params) =>
  httpServe('/fn/trainer/eval/listHandPoints', {
    data: { ...params.data, tip: 'Y' }
  })

// 导出培训师补录
export const fetchExportTrainersPoints = (params) =>
  httpServe(
    '/fn/trainer/eval/listHandPoints',
    { data: { ...params.data, tip: 'N' } },
    { headers: { responseType: 'blob' } }
  )

// 新增积分补录
export const fetchAddTrainersPoints = (params) =>
  httpServe('/fn/trainer/eval/submitHandPoints', params)
// 导入培训师积分
export const fetchImportTrainersPoints = (params) =>
  httpServe('/fn/courseFileFunc/internal/batchImport', params)

// 培训师积分汇总表
// export const fetchSelectTrainersTotalPoints = params => httpServe('/fn/trainer/eval/selectTrainersTotalPoints', {data: {...params.data, tip: 'Y'}})
export const fetchSelectTrainersTotalPoints = (params) =>
  httpServe('/fn/trainer/eval/listPointsSum', {
    data: { ...params.data, tip: 'Y' }
  })

// 培训师积分汇总表导出
export const fetchExportSelectTrainersTotalPoints = (params) =>
  httpServe(
    '/fn/trainer/eval/listPointsSum',
    { data: { ...params.data, tip: 'N' } },
    { headers: { responseType: 'blob' } }
  )

// 培训师积分明细表
// export const fetchSelectTrainersDetailPoints = params => httpServe('/fn/trainer/eval/selectTrainersDetailPoints', {data: {...params.data, tip: 'Y'}})
export const fetchSelectTrainersDetailPoints = (params) =>
  httpServe('/fn/trainer/eval/listPointsDetail', {
    data: { ...params.data, tip: 'Y' }
  })

// 导出培训师积分明细表
export const fetchExportSelectTrainersDetailPoints = (params) =>
  httpServe(
    '/fn/trainer/eval/listPointsDetail',
    { data: { ...params.data, tip: 'N' } },
    { headers: { responseType: 'blob' } }
  )

// 查询评聘年度列表
export const fetchYearList = () =>
  httpServe('/fn/trainer/setting/listEvaluationYear')

// 查询授课信息
export const fetchTrainingCourseInfo = (params) =>
  httpServe('/fn/trainer/eval/listTrainingCourseInfo', params)

// 积分补录附件下载
export const fetchPointsFileInfo = (params) =>
  httpServe('/fn/trainer/eval/showHandPointsFileInfo', params)

// 批量导入积分补录
export const fetchBatchImportHandPoints = (params, headers) =>
  httpServe('/common/trainer/batchImportHandPoints', params, headers)

// 批量导入积分补录错误信息查询/导出
export const fetchErrorImportHandPoints = (params, options) =>
  httpServe('/fn/trainer/eval/listErrorImportHandPoints', params, options)

// 积分补录 批量导入生成并显示附件
export const fetchShowImportHandPointsFileInfo = (params) =>
  httpServe('/fn/trainer/eval/showImportHandPointsFileInfo', params)

// 积分补录 提交批量导入补录
export const fetchSubmitImportHandPoint = (params) =>
  httpServe('/fn/trainer/eval/submitImportHandPoints', params)


// 积分管理页 查询学员积分排名
export const fetchQueryStudentIntergration =(params) =>
  // httpServe('http://22.16.25.92:8080/tms-new/api/fn/classes/manager/integration/queryStudentIntergration',params)  
  httpServe('/fn/classes/manager/integration/queryStudentIntergration',params)

// 积分管理页 校验知鸟考试
export const fetchVolidateZnTest =(params,options) =>
  httpServe('/fn/classes/manager/integration/volidateZnTest',params,options = {allRes:true})
  // httpServe('http://22.16.25.92:8080/tms-new/api/fn/classes/manager/integration/volidateZnTest',params)  

// 积分管理页 上传文件批量导入积分
export const fetchUpLoadIntergrationTeamplate =(params) =>
  httpServe('/classFileFunc/classStudentsIntegrationBatchImport',params,{...dataHeaders})
  // httpServe('http://22.16.25.92:8080/tms-new/api/classFileFunc/classStudentsIntegrationBatchImport',params,{...dataHeaders})  
 

// 积分管理页 培训班管理学员展示列表中学员批量加分
export const fetchBatchAddIntergration = (params) =>
  httpServe('/fn/classes/manager/integration/batchAddStuIntergration',params)
  // httpServe('http://22.16.25.92:8080/tms-new/api/fn/classes/manager/integration/batchAddStuIntergration',params)  


// 积分管理页面 查看匹配知鸟考试名单中的学员
export const fetchQueryZNExamStudent = (params) =>
  httpServe('/fn/classes/manager/integration/queryStudentZnScore',params)
  // httpServe('http://22.16.25.92:8080/tms-new/api/fn/classes/manager/integration/queryStudentZnScore',params)  


// 积分管理页 查看培训班积分项
export const fetchQueryClassIntergrationConfig =(params) =>
  httpServe('/fn/classes/manager/integration/queryClassIntergrationConfig',params)
  // httpServe('http://22.16.24.35:8080/tms-new/api/fn/classes/manager/integration/queryClassIntergrationConfig',params) 


// 积分管理页 根据知鸟考试编号同步学员知鸟考试分数
export const fetchModifyScoreByTestId = (params, options) =>
  httpServe('/fn/classes/manager/integration/modifyScoreByTestId',params , options = {allRes:true})
  // httpServe('http://22.16.25.92:8080/tms-new/api/fn/classes/manager/integration/modifyScoreByTestId',params)  

// 积分管理页 积分模板下载
export const fetchClassIntegrationTeamplate =(params) =>
httpServe('/fn/common/file/download/classIntegrationTeamplate',params) 
// httpServe('http://22.16.25.92:8080/tms-new/api/common/file/download/classIntegrationTeamplate',params) 

// 积分管理页 配置积分项
export const fetchConfigClassIntergration =(params) =>
httpServe('/fn/classes/manager/integration/classIntergrationConfig',params)
// httpServe('http://22.16.24.35:8080/tms-new/api/fn/classes/manager/integration/classIntergrationConfig',params) 

// 积分管理页 培训班管理学员展示列表中编辑全部
export const fetchUpdateAllStudentIntergration = (params) =>
httpServe('/fn/classes/manager/integration/updateAllStudentIntergration',params)
// httpServe('http://22.16.25.92:8080/tms-new/api/fn/classes/manager/integration/updateAllStudentIntergration',params) 

// 积分管理页 导出培训班学员积分展示列表
export const fetchExportClassStudentIntergrationList = (params) =>
httpServe('/fn/common/file/download/exportClassStudentIntergrationList',params)
// httpServe('http://22.16.25.92:8080/tms-new/api/common/file/download/exportClassStudentIntergrationList',params) 