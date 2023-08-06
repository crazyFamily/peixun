import { httpServe, dataHeaders } from '@/util/utils'
// um或姓名模糊查询已评价人员
export const fetchListCaseEvaUser = (...params) =>
  httpServe('/fn/report/case/eva/listCaseEvaUser', ...params)
// 新增评委-单个新增
export const fetchSaveJudges = (...params) =>
  httpServe('/fn/report/case/eva/saveOrUpdateJudges', ...params)
// 新增评委-批量新增
export const fetchSaveJudgesBatch = (...params) =>
  httpServe('/fn/report/case/eva/saveOrUpdateJudgesBatch', ...params)
// 评委列表或列表导出
export const fetchListJudges = (...params) => httpServe('/fn/report/case/eva/listJudges', ...params, { loading: 'LOADING_JUDGES' })
// 评委列表导出
export const fetchExportListJudges = (...params) =>
  httpServe('/fn/report/case/eva/listJudges', ...params, {
    headers: { responseType: 'blob' }
  })
// 评委列表或列表导出
export const fetchDeleteJudges = (...params) =>
  httpServe('/fn/report/case/eva/deleteJudges', ...params)
// 案例评分报表明细列表或导出
export const fetchListCaseEvaReport = (...params) => httpServe('/fn/report/case/eva/listCaseEvaReport', ...params, { loading: 'LOADING_CASE_EVA_REPORT' })
// 案例评分报表明细导出
export const fetchExportListCaseEvaReport = (...params) =>
  httpServe('/fn/report/case/eva/listCaseEvaReport', ...params, {
    headers: { responseType: 'blob' }
  })
// 获取 业务条线 业务类型 客群 下拉选项
export const fetchCaseTagInfoList = (params) =>
  httpServe('/fn/caseCenter/tag/selectCaseTagInfoList', params)
// 校验导入评委名单
export const fetchBatchCheckJudges = (params) =>
  httpServe('/common/case/eva/batchCheckJudges', params)
// 评委评分记录
export const fetchListJudgesEva = (params) => httpServe('/fn/report/case/eva/listJudgesEva', params, { loading: 'LOADING_JUDGES_EVA' })
// 评委评分记录导出
export const fetchExportListJudgesEva = (params) =>
  httpServe('/fn/report/case/eva/listJudgesEva', params, {
    headers: { responseType: 'blob' }
  })

// 获取培训立项清单数据
export const fetchItemList = (params) =>
  httpServe(
    '/fn/report/class/itemList',
    {
      data: { ...params.data, tip: 'Y' }
    },
    { loading: 'LOADING_ITEM_LIST' }
  )

// 导出培训立项清单数据
export const fetchExportItemList = (params) =>
  httpServe(
    '/fn/report/class/itemList',
    {
      data: { ...params.data, tip: 'N' }
    },
    { headers: { responseType: 'blob' } }
    )
  
  // 请求培训班和非培训班子类别
  export const fetchListClassType = () =>
    httpServe('/fn/classes/lixiang/listClassType', {})
  // 获取星火计划统计表阶段列表
  export const fetchListSparkStatistics = (url, params) =>
    httpServe(
      url,
      {
        data: { ...params.data, tip: 'Y' }
      },
      {
        loading: 'LOADING_LIST_CLASS_TYPE'
      }
    )
  // 导出星火计划统计表阶段列表
  export const fetchExportSparkStatistics = (url,params) =>
  httpServe(url,{
    data: { ...params.data, tip: 'N' }
  },
  { headers: { responseType: 'blob' } }
  )
  
  // 培训计划明细报表
  export const fetchListPlanDetail = ({ data }) =>
    httpServe('/fn/plan/manage/listPlanDetail', { data: { ...data, tips: 'list' } }, { loading: 'LOADING_LISTPLAN' })
  // 培训计划明细报表-导出
  export const fetchExportListPlanDetail = ({ data }) =>
    httpServe('/fn/plan/manage/listPlanDetail', { data: { ...data, tips: 'report' } }, { headers: { responseType: 'blob' } })
  
  // 计划管理-->查询计划外培训项目明细表
  export const fetchListExternalPlanDetail = ({ data }) =>
    httpServe('/fn/plan/manage/listExternalPlanDetail', { data: { ...data, tips: 'list' } }, { loading: 'LOADING_EXTERNAL_PLAN' })
  // 计划外培训项目明细表-导出
  export const fetchExportListExternalPlanDetail = ({ data }) =>
    httpServe('/fn/plan/manage/listExternalPlanDetail', { data: { ...data, tips: 'report' } }, { headers: { responseType: 'blob' } })
  
  // 计划管理-->查询培训计划执行明细表
  export const fetchListPlanClassDetail = ({ data }) =>
    httpServe('/fn/plan/manage/listPlanClassDetail', { data: { ...data, tips: 'list' } }, { loading: 'LOADING_TRAINING_PLANEXECUTE_REPORT' })
  // 培训计划执行明细表-导出
  export const fetchExportListPlanClassDetail = ({ data }) =>
    httpServe('/fn/plan/manage/listPlanClassDetail', { data: { ...data, tips: 'report' } }, { headers: { responseType: 'blob' } })
  
  // 培训项目结训与报销及时性统计表
  export const fetchListClassAndReimSituation = ({ data }) =>
    httpServe('/fn/report/process/listClassAndReimSituation', { data: { ...data, tips: 'N' } }, { loading: 'LOADING_CLASS_REIMSITUATION' })
  
  // 导出培训项目结训与报销及时性统计表
  export const fetchExportListClassAndReimSituation = ({ data }) =>
  httpServe('/fn/report/process/listClassAndReimSituation', { data: { ...data, tips: 'Y' } }, { headers: { responseType: 'blob' } })

  // 潜才进度报表
  export const fetchListQcTrainingProcessReport = ({ data }) =>
    httpServe('/fn/qc/report/listQcTrainingProcessReport', { data: { ...data, tip: 'N' } }, { loading: 'LOADING_TRAINING_PROCESS_REPORT' })
  
  // 导出潜才进度报表
  export const fetchExportListQcTrainingProcessReport = ({ data }) =>
  httpServe('/fn/qc/report/listQcTrainingProcessReport', { data: { ...data, tip: 'Y' } }, { headers: { responseType: 'blob' } })
  
  // 网点孵化导师明细报表
  export const fetchMentorMoneyDetail = (params) => httpServe('/fn/report/teacher/mentorMoneyDetail', params, { loading: 'LOADING_TUTORALLOWANCE' })
  
  // 网点孵化导师统计报表
  export const fetchMentorAllowance = (params) => httpServe('/fn/report/teacher/mentorAllowance', params, { loading: 'LOADING_TUTORALLOWANCESTATISTICS' })
  
  // 机构培训项目统计报表
  export const fetchTrainStatisticList = (params) => httpServe('/fn/report/class/trainStatisticList', params, { loading: 'LOADING_TRAIN_STATISTIC_LIST' })
  
  export const fetchFaceToTrain = (params) => httpServe('/fn/report/class/faceToTrain', params, { loading: 'LOADING_FACETOTRAIN' })
  
  // 机构直播基本资料报表
  export const fetchBankZBDetail = (params) => httpServe('/fn/report/process/bankZBDetail', params, { loading: 'LOADING_BANK_ZB_DETAIL' })
  
  // 学习任务完成明细表
  export const fetchOrgStaffList = (params) => httpServe('/fn/report/process/orgStaffList', params, { loading: 'LOADING_ORGSTAFF_LIST' })
  
  // 学习记录明细表
  export const fetchListPersonalStudyRecord = (params) =>
    httpServe('/fn/report/process/listPersonalStudyRecord', params, { loading: 'LOADING_PERSONAL_STUDY_RECORD' })
  
  // 新员工培训报表-覆盖率查询
  export const fetchListOrgEmpTraining = (params) => httpServe('/fn/report/process/listOrgEmpTraining', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_NEWSTAFF_COVERAGE' })
  export const fetchListOrgEmpTrainingExport = (params) => httpServe('/fn/report/process/listOrgEmpTraining', { data: { ...params, tip: 'N' }},{ headers: { responseType: 'blob' } })
  // 新员工培训报表-明细查询
  export const fetchListNewEmpTraining = (params) => httpServe('/fn/report/process/listNewEmpTraining', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_NEWSTAFF_DETAIL' })
  export const fetchListNewEmpTrainingExport = (params) => httpServe('/fn/report/process/listNewEmpTraining', { data: { ...params, tip: 'N' }},{ headers: { responseType: 'blob' } })
  // 新员工培训报表-机构对应关系配置
  export const fetchListOrgConfig = (params) => httpServe('/fn/report/process/listOrgConfig', params)
  // 新员工培训报表-分行机构列表
  export const fetchListOrgZone = (params) => httpServe('/fn/report/process/listOrgZone', params)
  // 新员工培训报表-编辑机构对应关系配置
  export const fetchEditOrgConfig = (params) => httpServe('/fn/report/process/editOrgConfig', params)
    
  // 案例学习报表-按案例
  export const fetchCaseStatisticsList = (params) => httpServe('/fn/report/case/caseStatisticsList', params, { loading: 'LOADING_CASE_STATISTICS' })
  
  // 案例学习报表-按机构
  export const fetchCaseUpStatisticsList = (params) =>
  httpServe('/fn/report/case/caseUpStatisticsList', params, { loading: 'LOADING_CASE_UP_STATISTICS' })
  
  // 案例学习报表-按人员
  export const fetchCaseEmployeeStatisticsList = (params) =>
    httpServe('/fn/report/case/caseEmployeeStatisticsList', params, { loading: 'LOADING_CASE_EMPLOYEE_STATISTICS' })
    
  // 消费者台账
  export const fetchListConsumerismClassManager = (params) =>
    httpServe('/fn/classes/manager/listConsumerismClassManager', params, { loading: 'LOADING_CONSUMERISM_CLASS_MANAGER' })
  
  // ================== 支行长 kpi ==================
  
  // 查询或导出支行长参训率列表(Y展示)
  export const fetchQueryBranchRatePage = (params) =>
    httpServe('/fn/report/branch/queryBranchRatePage', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_BRANCH_RATE' })
  
  // 查询或导出支行长参训率列表(N展示)
  export const fetchExportBranchRatePage = (params) =>
    httpServe('/fn/report/branch/queryBranchRatePage', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })
  
  
  // 查询或导出支行长名单(Y展示)
  export const fetchQueryBranchUserPage = (params) =>
  httpServe('/fn/report/branch/queryBranchUserPage', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_BRANCH_USERNAME' })

  // 查询或导出支行长名单(N展示)
  export const fetchExportBranchUserPage = (params) =>
    httpServe('/fn/report/branch/queryBranchUserPage', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })
  
  
  // 查询或导出支行长培训班列表(Y展示)
  export const fetchQueryBranchClassPage = (params) =>
    httpServe('/fn/report/branch/queryBranchClassPage', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_BRANCH_CLASS' })
  
  // 查询或导出支行长培训班列表(N展示)
  export const fetchExportBranchClassPage = (params) =>
    httpServe('/fn/report/branch/queryBranchClassPage', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })
  
  // 校验培训班编号是否正确
  export const fetchCheckBranchClass = (params) =>
    httpServe('/fn/report/branch/checkBranchClass', params)
  
  // 删除支行长培训班
  export const fetchDeleteBranchClass = (params) =>
    httpServe('/fn/report/branch/deleteBranchClass', params)
  
  // 新增支行长培训班
  export const fetchBatchAddBranchClass = (params) =>
    httpServe('/fn/report/branch/batchAddBranchClass', params)
  
    
  // 批量导入支行长培训班
  export const fetchImportBatchBranchClass = (params, options) =>
    httpServe('/common/report/branch/importBatchBranchClass', params, {
      ...dataHeaders,
      ...options
    })
  
  
  // 提交导入支行长培训班数据
  export const fetchSaveImportBranchClass = (params) =>
    httpServe('/fn/report/branch/saveImportBranchClass', params)
  
  // 导出支行长培训班失败列表
  export const fetchExportFailBranchClass = (params) =>
    httpServe('/fn/report/branch/exportFailBranchClass', params, { headers: { responseType: 'blob' } })
  
  
  // =================================== 阶梯覆盖率查询 ===================================
  
  // 查询岗位维度覆盖率查询(Y展示)
  export const fetchListLadderCoverSituationByOrg = (params) =>
    httpServe('/fn/ladder/rateReport/listLadderCoverSituationByOrg', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_LADDER_COVERBYORG' })
  
  //导出岗位维度覆盖率查询(N展示)
  export const fetchExportLadderCoverSituationByOrg = (params) =>
  httpServe('/fn/ladder/rateReport/listLadderCoverSituationByOrg', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })


  // 查询岗位维度覆盖率查询(Y展示)
  export const fetchListLadderCoverByJob = (params) =>
    httpServe('/fn/ladder/rateReport/listLadderCoverByJob', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_LADDER_COVERBYJOB' })
  
  //导出岗位维度覆盖率查询(N展示)
  export const fetchExportLadderCoverByJob = (params) =>
    httpServe('/fn/ladder/rateReport/listLadderCoverByJob', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })
  
  
  // 查询岗位维度覆盖率查询(Y展示)
  export const fetchListHeldClass = (params) =>
  httpServe('/fn/ladder/rateReport/listHeldClass', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_HELD_CLASS' })
  
  //导出岗位维度覆盖率查询(N展示)
  export const fetchExportHeldClass = (params) =>
  httpServe('/fn/ladder/rateReport/listHeldClass', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })
  
  // =========================== 人员名单 ===========================
  
  // 覆盖率报表-人员名单-人员列表查询/导出(Y展示)
  export const fetchListCoverUser = (params) =>
  httpServe('/fn/ladder/rateReport/listCoverUser', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_COVERAGE_USER' })
  
  // 覆盖率报表-人员名单-人员列表查询/导出(N展示)
  export const fetchExportCoverUser = (params) =>
  httpServe('/fn/ladder/rateReport/listCoverUser', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })
  
  // 覆盖率报表-人员名单-删除
  export const fetchDeleteCoverUser = (params) =>
    httpServe('/fn/ladder/rateReport/deleteCoverUser', params)
  
  // 覆盖率报表-人员名单-批量导入
  // /tms-new/api/common/ladder/rateReport/importBatchLadderCoverUser
  // /fn/ladder/rateReport/importBatchLadderCoverUser
  export const fetchImportBatchLadderCoverUser = (params, options) =>
    httpServe('/common/ladder/rateReport/importBatchLadderCoverUser', params, {
      ...dataHeaders,
      ...options
    })
  
  // 覆盖率报表-人员名单-校验失败名单下载
  export const fetchExportFailUser = (params) =>
  httpServe('/fn/ladder/rateReport/exportFailUser', params, { headers: { responseType: 'blob' } })
  
  // 覆盖率报表-人员名单-根据um或姓名查询人员信息集合
  
  export const fetchFindCoverUser = (params) =>
  httpServe('/fn/ladder/rateReport/findCoverUser', { data: params })

// 覆盖率报表-人员名单-批量导入-保存
export const fetchSaveCoverUserByIdBatch = (params) =>
  httpServe('/fn/ladder/rateReport/saveCoverUserByIdBatch', { data: params })

// 覆盖率报表-人员名单-保存
export const fetchSaveOrUpdateCoverUser = (params) =>
  httpServe('/fn/ladder/rateReport/saveOrUpdateCoverUser', { data: params })

// =========================== 权限管理 ===========================
// 岗位维度覆盖率查询-权限管理(Y展示)
export const fetchListCoverageManage = (params) =>
httpServe('/fn/ladder/rateReport/listCoverageManage', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_COVERAGE_MANAGE' })

//导出岗位维度覆盖率查询-权限管理(N展示)
export const fetchExportCoverageManage = (params) =>
httpServe('/fn/ladder/rateReport/listCoverageManage', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })


// 岗位维度覆盖率查询-权限管理-删除
export const fetchDeleteCoverageManageByIds = (params) =>
  httpServe('/fn/ladder/rateReport/deleteCoverageManageByIds', { data: params })

// 岗位维度覆盖率查询-权限管理-保存
export const fetchSaveCoverageManageInfo = (params) =>
  httpServe('/fn/ladder/rateReport/saveCoverageManageInfo', { data: params })

// 岗位维度覆盖率查询-权限管理-保存
export const fetchFindScopeAuthority = (params) =>
  httpServe('/fn/ladder/rateReport/findScopeAuthority', { data: params })

// 非培训班-录入资料查看-立项附件
export const fetchSelectUploadFileInfo = (params) =>
  httpServe('/fn/reim/classes/selectUploadFileInfo', params)

// 非培训班-录入资料查看-录入资料
export const fetchSelectReimLiveNo = (params) =>
  httpServe('/fn/reim/classes/selectReimLiveNo', params)

// ============================== 新员工面授-培训班管理 ==============================

// 查询或导出支行长培训班列表(Y展示)
export const fetchListNewEmpTrainingClass = (params) =>
  httpServe('/fn/report/process/listNewEmpTrainingClass', { data: { ...params, tip: 'Y' }}, { loading: 'LOADING_BRANCH_CLASS' })

// 查询或导出支行长培训班列表(N展示)
export const fetchExportNewEmpTrainingClass = (params) =>
httpServe('/fn/report/process/listNewEmpTrainingClass', { data: { ...params, tip: 'N' } }, { headers: { responseType: 'blob' } })

// 校验培训班编号是否正确
export const fetchCheckNewEmpTrainingClass = (params) =>
  httpServe('/fn/report/process/checkNewEmpTrainingClass', params)

// 删除支行长培训班
export const fetchDeleteNewEmpTrainingClass = (params) =>
  httpServe('/fn/report/process/deleteNewEmpTrainingClass', params)

// 新增支行长培训班
export const fetchSaveNewEmpTrainingClass = (params) =>
  httpServe('/fn/report/process/saveNewEmpTrainingClass', params)

// 批量导入支行长培训班
export const fetchImportBatchNewEmpTrainingClass = (params, options) =>
  httpServe('/common/report/process/importBatchNewEmpTrainingClass', params, {
    ...dataHeaders,
    ...options
  })

// 提交导入支行长培训班数据
export const fetchImportNewEmpTrainingClass = (params) =>
  httpServe('/fn/report/process/importNewEmpTrainingClass', params)
  
  // 导出支行长培训班失败列表
  export const fetchExportFailNewEmpTrainingClass = (params) =>
  httpServe('/fn/report/process/exportFailNewEmpTrainingClass', params, { headers: { responseType: 'blob' } })
  
// 阶梯培训计划分配报表查询
export const fetchListDeptDispensePlan = ({ data }) =>
  httpServe(
    '/fn/plan/annual/listDeptDispensePlan',
    { data: { ...data, tip: 'Y' } },
    { loading: 'LOADING_DEPT_DISPENSE_PLAN' }
  )
  
// 阶梯培训计划分配报表导出
export const fetchExportDeptDispensePlan = ({ data }) => httpServe('/fn/plan/annual/listDeptDispensePlan', { data: { ...data, tip: 'N' } }, { headers: { responseType: 'blob' }, loading: 'LOADING_EXPORT_DEPT_DISPENSE_PLAN' })

// 阶梯培训计划分配报表详情
export const fetchDeptDispensePlanDetail = ({ data }) =>
  httpServe('/fn/plan/annual/deptDispensePlanDetail', { data }, { loading: 'LOADING_DEPT_DISPENSE_PLAN_DETAIL' })

// 阶梯培训计划分配报表导出明细
export const fetchExportDispensePlanDetail = ({ data }) =>
  httpServe(
    '/fn/plan/annual/exportDispensePlanDetail',
    { data },
    { headers: { responseType: 'blob' }, loading: 'LOADING_EXPORT_DEPT_DISPENSE_PLAN_DETAIL' }
  )
          