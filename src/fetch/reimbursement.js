import {
  httpServe
} from '@/util/utils'


// 获取培训班
export const fetchSelectClassesInfo = (params) =>
  httpServe('/fn/reim/init/selectClassesInfo', params)

// 培训班非培训班费用报销发送预付款获取培训班信息
export const fetchSelectAdvancePay = `/fn/reim/init/selectClassesInfoForAdvancePay`
// 获取培训班 发送预付款获取培训班信息
export const fetchSelectClassesInfoForAdvancePay = (params) =>
  httpServe('/fn/reim/init/selectClassesInfoForAdvancePay', params)

//#region ------------------------------------ Fast 1.0 ------------------------------------

// ------------ 报销表列 ------------
// 请求我的报销列表
export const fetchMyReimburseList = (params) =>
  httpServe('/fn/reim/self/selectMyReimburseList', params)
// 请求报销状态筛选条件
export const fetchSelectReimDicts = (params) =>
  httpServe('/fn/reim/self/selectReimDicts', params)

// ------------ 发起报销/编辑报销 - 基本信息 ------------
// 请求成本中心列表
export const fetchSelectCostCenter = (params) =>
  httpServe('/fn/reim/init/selectCostCenter', params)
// 请求合同列表数据
export const fetchSelectReimContract = (params) =>
  httpServe('/fn/reim/init/selectReimContract', params)

// ------------ 发起报销/编辑报销 - 报销信息 - 报账明细 ------------

// ------------ 发起报销/编辑报销 - 报销信息 - 报账明细 - 费用信息 ------------ 
// 报账明细新增报销费用确定
export const fetchSelectReimCds = (params) =>
  httpServe('/fn/reim/init/selectReimAccountingSubjectCds', params)

// 查询关联专票列表
export const fetchSelectInvoice = (params) =>
  httpServe('/fn/reim/init/selectInvoice', params)

// 查询项目，产品，订单号公共数据
export const fetchSelectReimAssist = (params) =>
  httpServe('/fn/reim/init/selectReimAssist', params)

// 查询差旅订单列表函数
export const fetchSelectReimTripOrders = (params) =>
  httpServe('/fn/reim/init/selectReimTripOrders', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 报账明细 - 收款人信息 ------------ 
// 查询供应商列表函数
export const fetchSelectReimSupplier = (params) =>
  httpServe('/fn/reim/init/selectReimSupplier', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 报账明细 - 附件信息 ------------ 
// 查询附件信息
export const fetchDelFileByUdmpids = (params) =>
  httpServe('/fn/reim/init/delFileByUdmpids', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 挂账信息 ------------ 
// 挂账大小类查询函数
export const fetchSelectSuspendType = (params) =>
  httpServe('/fn/reim/init/selectSuspendType', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 核销信息 ------------ 
// 挂账单列表数据查询
export const fetchSelectReimCancel = (params) =>
  httpServe('/fn/reim/init/selectReimCancel', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 差旅信息 ------------ 
// 差旅信息 - 选择人员查询函数
export const fetchSelectReimTripPerson = (params) =>
  httpServe('/fn/reim/init/selectReimTripPerson', params)

// ------------ 发起报销/编辑报销 - 报销信息 - 保存 ------------ 

export const insertReimForSave = (params) =>
  httpServe('/fn/reim/init/insertReimForSave', params)

// ------------ 发起报销/编辑报销 - 报销信息 - 提交 ------------ 
export const insertReim = (params) =>
  httpServe('/fn/reim/init/insertReim', params)

//#endregion



//#region ------------------------------------ Fast 2.0 ------------------------------------

// ------------ 报销表列 ------------

// 获取城市
export const fetchSelectFastReimCity = (params) =>
  httpServe('/fn/reim/initFast/selectFastReimCity', params)

// 查询发起报销的培训班详细信息1.0
export const fetchInitSelectClassesInfo = `/fn/reim/init/selectClassesInfo`
// 查询发起报销的培训班详细信息2.0
export const API_SELECT_FAST_CLASSES_INFO = `/fn/reim/initFast/selectFastClassesInfo`
export const fetchSelectFastClassesInfo = (params) => httpServe(API_SELECT_FAST_CLASSES_INFO, params, { loading: 'LOADING_CASECENTER_MANAGE_LIST', allRes: true })

// 培训班非培训班费用报销发送预付款获取培训班信息
export const fetchSelectFastAdvancePay = `/fn/reim/initFast/selectFastClassesInfoForAdvancePay`
// 获取培训班 发送预付款获取培训班信息
export const fetchSelectFastClassesInfoForAdvancePay = (params) =>
  httpServe('/fn/reim/initFast/selectFastClassesInfoForAdvancePay', params)

// 请求我的报销列表
export const fetchFastMyReimburseList = (params) =>
  httpServe('/fn/reim/selfFast/selectFastMyReimburseList', params)
// 请求报销状态筛选条件
export const fetchSelectFastReimDicts = (params) =>
  httpServe('/fn/reim/selfFast/selectFastReimDicts', params)

// ------------ 发起报销/编辑报销 - 基本信息 ------------
// 请求成本中心列表
export const fetchSelectFastCostCenter = (params) =>
  httpServe('/fn/reim/initFast/selectFastCostCenter', params)
// 请求合同列表数据
export const fetchSelectFastReimContract = (params) =>
  httpServe('/fn/reim/initFast/selectFastReimContract', params)

// ------------ 发起报销/编辑报销 - 报销信息 - 报账明细 ------------

// ------------ 发起报销/编辑报销 - 报销信息 - 报账明细 - 费用信息 ------------ 
// 报账明细新增报销费用确定
export const fetchFastSelectReimCds = (params) =>
  httpServe('/fn/reim/initFast/selectFastReimAccountingSubjectCds', params)

// 查询关联专票列表
export const fetchSelectFastInvoice = (params) =>
  httpServe('/fn/reim/initFast/selectFastInvoice', params)

// 查询项目，产品，订单号公共数据
export const fetchSelectFastReimAssist = (params) =>
  httpServe('/fn/reim/initFast/selectFastReimAssist', params)

// 查询差旅订单列表函数
export const fetchSelectFastReimTripOrders = (params) =>
  httpServe('/fn/reim/initFast/selectFastReimTripOrders', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 报账明细 - 收款人信息 ------------ 
// 查询供应商列表函数
export const fetchSelectFastReimSupplier = (params) =>
  httpServe('/fn/reim/initFast/selectFastReimSupplier', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 报账明细 - 附件信息 ------------ 
// 查询附件信息
export const fetchDelFastFileByUdmpids = (params) =>
  httpServe('/common/fileFast/delFastFileByUdmpids', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 挂账信息 ------------ 
// 挂账大小类查询函数
export const fetchSelectFastSuspendType = (params) =>
  httpServe('/fn/reim/initFast/selectFastSuspendType', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 核销信息 ------------ 
// 挂账单列表数据查询
export const fetchSelectFastReimCancel = (params) =>
  httpServe('/fn/reim/initFast/selectFastReimCancel', params)


// ------------ 发起报销/编辑报销 - 报销信息 - 差旅信息 ------------ 
// 差旅信息 - 选择人员查询函数
export const fetchSelectFastReimTripPerson = (params) =>
  httpServe('/fn/reim/initFast/selectFastReimTripPerson', params)

// 差旅信息 - 选择人员查询函数
export const uploadTripInfoList = (params) =>
  httpServe('/common/reim/uploadTripInfoList', params)

  

// ------------ 发起报销/编辑报销 - 报销信息 - 保存 ------------ 

export const insertFastReimForSave = (params) =>
  httpServe('/fn/reim/initFast/insertFastReimForSave', params)

// ------------ 发起报销/编辑报销 - 报销信息 - 提交 ------------ 

export const insertFastReim = (params) =>
  httpServe('/fn/reim/initFast/insertFastReim', params)

// ------------ 机构报销费用查询 - 查看报销单号 - 影像 ------------ 

export const fetchFastReimVideo = (params) =>
  httpServe('/fn/reim/initFast/downloadFastReimVideo', params)

// ------------ 我的报销 - 删除 ------------ 

export const fetchDeleteFastReimburseInfo = (params) =>
  httpServe('/fn/reim/selfFast/deleteFastReimburseInfo', params)
// ------------ 查看报销 - 查看打印单 ------------ 

export const fetchPrintFastReim = (params) =>
  httpServe('/fn/reim/initFast/printFastReim', params)
  
export const fetchFindFailReason = (params) =>
  httpServe('/fn/reim/selfFast/findReimFailReason', params)
  
//#endregion

export const fetchSelectUploadFileInfo = (params) =>
  httpServe('/fn/reim/classes/selectUploadFileInfo', params)