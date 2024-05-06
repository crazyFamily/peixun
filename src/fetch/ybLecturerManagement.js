import { httpServe } from '@/util/utils'
// **************************************************************************************************************************************************************
/**
 * 公用
 */
// 查询一级分行信息
export const fetchQueryFirstOrg = params => httpServe('/fn/yb/teacher/queryFirstOrg', params)
// 根据um查询一级分行及职位信息
export const fetchGetFirstOrgNameAndPostName = params => httpServe('/fn/yb/teacher/getFirstOrgNameAndPostName', params)
export const fetchGetFirstOrgNameAndPostNamePlus = params => httpServe('/fn/yb/teacher/getFirstOrgNameAndPostNamePlus', params)
// 查询审批信息
export const fetchQueryApprove = params => httpServe('/fn/yb/approve/queryApprove', params)
// 获取证书荣誉模版列表
export const fetchListDataCode = params => httpServe('/fn/system/func/listDataCode', params)
// **************************************************************************************************************************************************************
/**
 * 银保讲师信息管理
 */
// 查询讲师信息
export const fetchQueryYears = params => httpServe('/fn/yb/yearPoint/queryYears', params)
// 查询讲师信息
export const fetchQueryTeacher = params => httpServe('/fn/yb/teacher/queryTeacher', params)
// 查询最近两年的年份
export const fetchQueryLastTwoYear = params => httpServe('/fn/yb/teacher/queryLastTwoYear', params)
// 新增讲师基本信息
export const fetchAddTeacher = params => httpServe('/fn/yb/teacher/addTeacher', params)
// 更新讲师信息
export const fetchUpdateTeacher = params => httpServe('/fn/yb/teacher/updateTeacher', params)
// 删除讲师信息
export const fetchDeleteTeacher = params => httpServe('/fn/yb/teacher/deleteTeacher', params)
// 讲师信息导出
export const fetchExportTeacher = params => httpServe('/fn/yb/teacher/exportTeacher', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 讲师信息批量数据导入
export const fetchImportBatchTeacherDatas = params => httpServe('/fn/yb/teacher/importBatchTeacherDatas', params)
// 讲师审批
export const fetchTeacherApprove = params => httpServe('/fn/yb/teacher/teacherApprove', params)
// 批量审批
export const fetchBatchApprove = params => httpServe('/fn/yb/approve/batchApprove', params)
// **************************************************************************************************************************************************************
/**
 * 银保讲师授课/分享管理
 */
// 查询讲师授课分享
export const fetchQueryTeacherCourse = params => httpServe('/fn/yb/teacherCourse/queryTeacherCourse', params)
// 新增讲师授课分享信息
export const fetchAddTeacherCourse = params => httpServe('/fn/yb/teacherCourse/addTeacherCourse', params)
// 更新讲师授课分享信息
export const fetchUpdateTeacherCourse = params => httpServe('/fn/yb/teacherCourse/updateTeacherCourse', params)
// 删除讲师授课分享信息
export const fetchDeleteTeacherCourse = params => httpServe('/fn/yb/teacherCourse/deleteTeacherCourse', params)
// 讲师授课分享信息导出
export const fetchExportTeacherCourse = params => httpServe('/fn/yb/teacherCourse/exportTeacherCourse', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 讲师授课/分享信息批量数据导入
export const fetchImportBatchTeacherCourseDatas = params => httpServe('/fn/yb/teacherCourse/importBatchTeacherCourseDatas', params)
// 讲师授课/分享审批
export const fetchTeacherCourseApprove = params => httpServe('/fn/yb/teacherCourse/teacherCourseApprove', params)
// **************************************************************************************************************************************************************
/**
 * 银保讲师课程研发管理
 */
// 查询课程研发信息
export const fetchQueryCourseDevelop = params => httpServe('/fn/yb/courseDevelop/queryCourseDevelop', params)
// 新增课程研发信息
export const fetchAddCourseDevelop = params => httpServe('/fn/yb/courseDevelop/addCourseDevelop', params)
// 更新课程研发信息
export const fetchUpdateCourseDevelop = params => httpServe('/fn/yb/courseDevelop/updateCourseDevelop', params)
// 删除课程研发信息
export const fetchDeleteCourseDevelop = params => httpServe('/fn/yb/courseDevelop/deleteCourseDevelop', params)
// 讲师课程研发信息导出
export const fetchExportCourseDevelop = params => httpServe('/fn/yb/courseDevelop/exportCourseDevelop', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 讲师课程研发信息批量数据导入
export const fetchImportBatchCourseDevelopDatas = params => httpServe('/fn/yb/courseDevelop/importBatchCourseDevelopDatas', params)
// 讲师课程研发审批
export const fetchCourseDevelopApprove = params => httpServe('/fn/yb/courseDevelop/courseDevelopApprove', params)
// **************************************************************************************************************************************************************
/**
 * 从培训班导入
 */
// 保金培训班查询
export const fetchQueryClass = params => httpServe('/fn/yb/class/queryClass', params)
// 导出保金培训班列表
export const fetchExportClassList = params => httpServe('/fn/yb/class/exportClassList', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 培训班课程查询
export const fetchQueryCourse = params => httpServe('/fn/yb/class/queryCourse', params)
// 新增讲师和授课信息批量导入
export const fetchBatchImportTeacherCourse = (...params) => httpServe('/fn/yb/teacherCourse/batchImportTeacherCourse', ...params, { loading: 'LOADING_BATCHIMPORTTEACHERCOURSE' })
// **************************************************************************************************************************************************************
/**
 * 分行培训班管理
 */
// 查询分行培训班信息
export const fetchQueryBranchClassInfo = params => httpServe('/fn/yb/branchClass/queryBranchClassInfo', params)
// 新增分行培训班信息
export const fetchAddBranchClassInfo = params => httpServe('/fn/yb/branchClass/addBranchClassInfo', params)
// 分行培训班信息数据批量导入
export const fetchImportBatchBranchClassInfoDatas = params => httpServe('/fn/yb/branchClass/importBatchBranchClassInfoDatas', params)
// 导出分行培训班信息
export const fetchExportBranchClassInfo = params => httpServe('/fn/yb/branchClass/exportBranchClassInfo', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 查询已经关联的授课分享课程
export const fetchQueryLinkedCourse = params => httpServe('/fn/yb/branchClass/queryLinkedCourse', params)
// 修改分行培训班信息
export const fetchUpdateBranchClassInfo = params => httpServe('/fn/yb/branchClass/updateBranchClassInfo', params)
// 删除分行培训班信息
export const fetchDeleteBranchClassInfo = params => httpServe('/fn/yb/branchClass/deleteBranchClassInfo', params)
// **************************************************************************************************************************************************************
/**
 * 培训班关联课程中查询讲师授课信息
 */
// 培训班关联课程中查询讲师授课信息
export const fetchQueryCourseForClass = params => httpServe('/fn/yb/branchClass/queryCourseForClass', params)
// 培训班id关联讲师授课
export const fetchLinkClassIdToCourse = params => httpServe('/fn/yb/branchClass/linkClassIdToCourse', params)
// **************************************************************************************************************************************************************
/**
 * 管理学员
 */
// 查询分行培训班学员信息
export const fetchQueryBranchStudent = params => httpServe('/fn/yb/branchStudent/queryBranchStudent', params)
// 新增分行培训班学员
export const fetchAddBranchStudent = params => httpServe('/fn/yb/branchStudent/addBranchStudent', params)
// 分行培训班学员信息数据批量导入
export const fetchImportBatchBranchStudentDatas = params => httpServe('/fn/yb/branchStudent/importBatchBranchStudentDatas', params)
// 导出分行培训班学员信息
export const fetchExportBranchStudent = params => httpServe('/fn/yb/branchStudent/exportBranchStudent', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 修改分行培训班学员信息
export const fetchUpdateBranchStudent = params => httpServe('/fn/yb/branchStudent/updateBranchStudent', params)
// 删除分行培训班学员信息
export const fetchDeleteBranchStudent = params => httpServe('/fn/yb/branchStudent/deleteBranchStudent', params)
// 批量删除培训班学员
export const fetchClearClassStudents = params => httpServe('/fn/yb/branchStudent/clearClassStudents', params)
// **************************************************************************************************************************************************************
/**
 * 讲师授权管理
 */
// 查询学员课程关系信息
export const fetchQueryStudentCourseInfo = params => httpServe('/fn/yb/studentCourse/queryStudentCourseInfo', params)
// 批量删除学员课程关系信息
export const fetchBatchDeleteStudentCourseInfo = params => httpServe('/fn/yb/studentCourse/batchDeleteStudentCourseInfo', params)
// 导出学员课程关系信息
export const fetchExportStudentCourseInfo = params => httpServe('/fn/yb/studentCourse/exportStudentCourseInfo', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 删除学员课程关系信息
export const fetchDeleteStudentCourseInfo = params => httpServe('/fn/yb/studentCourse/deleteStudentCourseInfo', params)
// 批量导入学员课程关系信息
export const fetchImportBatchStudentCourseInfoDatas = params => httpServe('/fn/yb/studentCourse/importBatchStudentCourseInfoDatas', params)
// **************************************************************************************************************************************************************
/**
 * 银保培训荣誉管理
 */
// 银保培训荣誉查询
export const fetchQueryHonorInfo = params => httpServe('/fn/yb/honorInfo/queryHonorInfo', params)
// 银保培训荣誉新增
export const fetchAddHonorInfo = params => httpServe('/fn/yb/honorInfo/addHonorInfo', params, { loading: 'LOADING_ADDHONORINFO' })
// 培训荣誉信息批量数据导入
export const fetchImportBatchHonorInfoDatas = params => httpServe('/fn/yb/honorInfo/importBatchHonorInfoDatas', params)
// 银保培训荣誉导出
export const fetchExportHonorInfo = params => httpServe('/fn/yb/honorInfo/exportHonorInfo', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 银保培训荣誉修改
export const fetchUpdateHonorInfo = params => httpServe('/fn/yb/honorInfo/updateHonorInfo', params, { loading: 'LOADING_UPDATEHHONORINFO' })
// 银保培训荣誉删除
export const fetchDeleteHonorInfo = params => httpServe('/fn/yb/honorInfo/deleteHonorInfo', params)
// **************************************************************************************************************************************************************
/**
 * 银保培训荣誉类别管理
 */
// 查询荣誉类别
export const fetchQueryHonorCtgy = params => httpServe('/fn/yb/honorCtgy/queryHonorCtgy', params)
// 新增荣誉类别
export const fetchAddHonorCtgy = params => httpServe('/fn/yb/honorCtgy/addHonorCtgy', params)
// 导出荣誉类别
export const fetchExportHonorCtgy = params => httpServe('/fn/yb/honorCtgy/exportHonorCtgy', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 更新荣誉类别
export const fetchUpdateHonorCtgy = params => httpServe('/fn/yb/honorCtgy/updateHonorCtgy', params)
// 删除荣誉类别
export const fetchDeleteHonorCtgy = params => httpServe('/fn/yb/honorCtgy/deleteHonorCtgy', params)
// **************************************************************************************************************************************************************
/**
 * 知鸟课程目录
 */
// 查询知鸟课程目录业务专区
export const fetchQueryBusinessZone = params => httpServe('/fn/yb/znCourse/queryBusinessZone', params)
// 查询知鸟课程目录
export const fetchQueryZnCourseCatalogue = params => httpServe('/fn/yb/znCourse/queryZnCourseCatalogue', params)
// 批量更新知鸟课程目录状态
export const fetchBatchUpdateStatus = params => httpServe('/fn/yb/znCourse/batchUpdateStatus', params)
// 新增知鸟课程目录
export const fetchAddZnCourseCatalogue = params => httpServe('/fn/yb/znCourse/addZnCourseCatalogue', params)
// 知鸟课程目录数据批量导入
export const fetchImportBatchZnCourseCatalogueDatas = params => httpServe('/fn/yb/znCourse/importBatchZnCourseCatalogueDatas', params)
// 知鸟课程目录数据批量导入
export const fetchBatchUpdateCourseCataLogue = params => httpServe('/fn/yb/znCourse/batchUpdateCourseCatalogue', params)
// 导出知鸟课程目录
export const fetchExportZnCourseCatalogue = params => httpServe('/fn/yb/znCourse/exportZnCourseCatalogue', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 修改知鸟课程目录
export const fetchUpdateZnCourseCatalogue = params => httpServe('/fn/yb/znCourse/updateZnCourseCatalogue', params)
// 删除知鸟课程目录
export const fetchDeleteZnCourseCatalogue = params => httpServe('/fn/yb/znCourse/deleteZnCourseCatalogue', params)
// **************************************************************************************************************************************************************
/**
 * 知鸟业务专区
 */
// 查询知鸟业务专区
export const fetchQueryZnBusinessZone = params => httpServe('/fn/yb/znZone/queryZnBusinessZone', params)
// 新增知鸟业务专区
export const fetchAddZnBusinessZone = params => httpServe('/fn/yb/znZone/addZnBusinessZone', params)
// 导出知鸟业务专区
export const fetchExportZnBusinessZone = params => httpServe('/fn/yb/znZone/exportZnBusinessZone', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 修改知鸟业务专区
export const fetchUpdateZnBusinessZone = params => httpServe('/fn/yb/znZone/updateZnBusinessZone', params)
// 删除知鸟业务专区
export const fetchDeleteZnBusinessZone = params => httpServe('/fn/yb/znZone/deleteZnBusinessZone', params)
// **************************************************************************************************************************************************************
/**
 * 内勤人力清单
 */
// 查询内勤人力信息
export const fetchQueryOfficeStaffInfo = params => httpServe('/fn/yb/officeStaff/queryOfficeStaffInfo', params)
// 新增内勤人力信息
export const fetchAddOfficeStaffInfo = params => httpServe('/fn/yb/officeStaff/addOfficeStaffInfo', params)
// 内勤人力信息数据批量导入
export const fetchImportBatchOfficeStaffInfoDatas = params => httpServe('/fn/yb/officeStaff/importBatchOfficeStaffInfoDatas', params)
// 导出内勤人力信息
export const fetchExportOfficeStaffInfo = params => httpServe('/fn/yb/officeStaff/exportOfficeStaffInfo', { data: { ...params.data, tip: 'N' } }, { headers: { responseType: 'blob' } })
// 修改内勤人力信息
export const fetchUpdateOfficeStaffInfo = params => httpServe('/fn/yb/officeStaff/updateOfficeStaffInfo', params)
// 删除内勤人力信息
export const fetchDeleteOfficeStaffInfo = params => httpServe('/fn/yb/officeStaff/deleteOfficeStaffInfo', params)
// **************************************************************************************************************************************************************
/**
 * 好课推荐管理
 */
// 查询好课推荐信息
export const fetchQueryCourseRecommend = params => httpServe('/fn/yb/courseRecommend/queryCourseRecommend', params)
// 更改好课推荐信息排序/生效字段
export const fetchUpdateCourseRecommendSortWeight = params => httpServe('/fn/yb/courseRecommend/updateCourseRecommendSortWeight', params)
// 批量删除好课推荐信息
export const fetchDeleteCourseRecommend = params => httpServe('/fn/yb/courseRecommend/deleteCourseRecommend', params)
// 查询知鸟课程信息
export const fetchQueryZnCourseInfo = params => httpServe('/fn/yb/courseRecommend/queryZnCourseInfo', params)
// 批量导入知鸟课程好课推荐
export const fetchImportCourseDatas = params => httpServe('/fn/yb/courseRecommend/importCourseDatas', params)
// 查询知鸟直播信息
export const fetchQueryZnLiveInfo = params => httpServe('/fn/yb/courseRecommend/queryZnLiveInfo', params)
// 批量导入知鸟直播好课推荐
export const fetchImportLiveDatas = params => httpServe('/fn/yb/courseRecommend/importLiveDatas', params)
// **************************************************************************************************************************************************************
/**
 * 培训速递内容管理
 */
// http://arena-luna.fat.qa.pab.com.cn/#/contract-design/interlayer/list?appId=70109&subSysCode=AMS-RLM
// 查询培训速递信息
export const fetchQueryTrainNotice = params => httpServe('/fn/yb/trainNotice/queryTrainNotice', params)
// 查询用户默认信息
export const fetchGetFirstOrgByCurrentUm = params => httpServe('/fn/yb/trainNotice/getFirstOrgByCurrentUm', params)
// 新增培训速递信息
export const fetchAddTrainNotice = params => httpServe('/fn/yb/trainNotice/addTrainNotice', params)
// 修改培训速递信息
export const fetchUpdateTrainNotice = params => httpServe('/fn/yb/trainNotice/updateTrainNotice', params)
// 删除培训速递信息
export const fetchDeleteTrainNotice = params => httpServe('/fn/yb/trainNotice/deleteTrainNotice', params)
// **************************************************************************************************************************************************************
/**
 * 发布总结管理
 */
// http://arena-luna.fat.qa.pab.com.cn/#/contract-design/interlayer/detils?pagePathOrigin=%2Fcontract-design%2Finterlayer%2Fdetils&id=460128&appId=70109&subSysCode=AMS-RLM
// 查询培训班总结信息列表
export const fetchQueryClassSummary = params => httpServe('/fn/yb/offlineTrain/queryClassSummary', params)
// 新增培训班总结信息(仅供造数据使用) 
export const fetchPublishSummary = params => httpServe('/fn/yb/offlineTrain/publishSummary', params)
// 修改培训班总结信息
export const fetchUpdateSummary = params => httpServe('/fn/yb/offlineTrain/updateSummary', params)
// 删除培训班总结信息
export const fetchDeleteSummary = params => httpServe('/fn/yb/offlineTrain/deleteSummary', params)
// **************************************************************************************************************************************************************
/**
 * 学习专题管理
 */
// http://arena-luna.fat.qa.pab.com.cn/#/contract-design/interlayer/detils?pagePathOrigin=%2Fcontract-design%2Finterlayer%2Fdetils&id=476714&appId=70109&subSysCode=AMS-RLM
// 是否本人
export const fetchGetDefaultPrincipal = params => httpServe('/fn/yb/smartCourse/studySpecial/getDefaultPrincipal', params)
// 查询专题信息
export const fetchQueryStudySpecial = params => httpServe('/fn/yb/smartCourse/studySpecial/queryStudySpecial', params)
// 新增专题
export const fetchAddStudySpecial = params => httpServe('/fn/yb/smartCourse/studySpecial/addStudySpecial', params)
// 修改专题
export const fetchUpdateStudySpecial = params => httpServe('/fn/yb/smartCourse/studySpecial/updateStudySpecial', params)
// 删除专题
export const fetchDeleteStudySpecial = params => httpServe('/fn/yb/smartCourse/studySpecial/deleteStudySpecial', params)
// 查询专题推送名单
export const fetchQuerySpecialPushUser = params => httpServe('/fn/yb/smartCourse/specialPushUser/querySpecialPushUser', params)
// 批量删除推送名单人员
export const fetchBatchDeleteSpecialPushUser = params => httpServe('/fn/yb/smartCourse/specialPushUser/batchDeleteSpecialPushUser', params)
// // 批量新增推送名单人员
// export const fetchBatchAddSpecialPushUser = params => httpServe('/fn/yb/smartCourse/specialPushUser/batchAddSpecialPushUser', params)
// 通过专题ID查询主题信息列表
export const fetchQuerySpecialThemeBySpecialId = params => httpServe('/fn/yb/smartCourse/specialTheme/querySpecialThemeBySpecialId', params)
// 新增主题
export const fetchAddSpecialTheme = params => httpServe('/fn/yb/smartCourse/specialTheme/addSpecialTheme', params)
// 修改主题
export const fetchUpdateSpecialThemeById = params => httpServe('/fn/yb/smartCourse/specialTheme/updateSpecialThemeById', params)
// 删除主题
export const fetchDeleteSpecialThemeById = params => httpServe('/fn/yb/smartCourse/specialTheme/deleteSpecialThemeById', params)
// 查询配置课程信息
export const fetchQueryThemeCourseByThemeId = params => httpServe('/fn/yb/smartCourse/themeCourse/queryThemeCourseByThemeId', params)
// 查询课程信息
export const fetchQueryThemeZnCourseInfo = params => httpServe('/fn/yb/smartCourse/themeCourse/queryThemeZnCourseInfo', params)
// 查询直播信息
export const fetchQueryThemeZnLiveInfo = params => httpServe('/fn/yb/smartCourse/themeCourse/queryThemeZnLiveInfo', params)
// 批量新增课程
export const fetchAddThemeCourseData = params => httpServe('/fn/yb/smartCourse/themeCourse/addThemeCourseData', params)
// 批量删除课程信息
export const fetchRemoveThemeCourseById = params => httpServe('/fn/yb/smartCourse/themeCourse/removeThemeCourseById', params)
// 批量修改课程信息
export const fetchUpdateThemeCourseData = params => httpServe('/fn/yb/smartCourse/themeCourse/updateThemeCourseData', params)
// **************************************************************************************************************************************************************
/**
 * 继续教育学习明细
 */
// 继续教育-查询个人的学习明细
export const fetchQueryPersonStudyDetail = params => httpServe('/fn/yb/continuingEducation/queryPersonStudyDetail', params)
// **************************************************************************************************************************************************************