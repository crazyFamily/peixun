
// 报名状态:0待报名 / 1已报名
// 待报名
export const REGISTRATION_STATUS_TODO = '0'
export const REGISTRATION_STATUS_TODO_LABEL = '待报名'

// 已报名
export const REGISTRATION_STATUS_DONE = '1'
export const REGISTRATION_STATUS_DONE_LABEL = '已报名'

// 报名状态选项
export const REGISTRATION_STATUS_OPTIONS = [
  {
    label: REGISTRATION_STATUS_TODO_LABEL,
    value: REGISTRATION_STATUS_TODO
  },
  {
    label: REGISTRATION_STATUS_DONE_LABEL,
    value: REGISTRATION_STATUS_DONE
  }
]

// ====================== 学员报名 ======================
// 线上营类型
export const ONLINE_TYPE_OPTIONS = [
  { value: '1' , label: '战神/战狼', },
  { value: '2' , label: '战英', }
]
export const NOT_PASS_ONLINE = '不通过'
// 补考成绩审核状态：0审核不通过，1审核通过
export const ONT_ONLINERESITSTATUS = '0'
export const PASS_ONLINERESITSTATUS = '1'
// 补考成绩审核状态：0审核不通过，1审核通过，2未上传，3已上传
export const ONLINERESITSTATUS_OPTIONS = [
  { value: '0' , label: '审核不通过', },
  { value: '1' , label: '审核通过', },
  { value: '2' , label: '未上传', },
  { value: '3' , label: '已上传', },
]
export const ONLINE_TG_STATUS_OPTIONS = [
  { value: '0' , label: '不通过', },
  { value: '1' , label: '通过', },
  { value: '2' , label: '未导入成绩', },
]

// 类别
export const RECRUIT_TYPE_OPTIONS = [
  { value: '1' , label: '社招', },
  { value: '2' , label: '校招', }
]

// 条线
export const BLGSTRIPLINE_OPTIONS = [
  { value: '1' , label: '大零售', },
  { value: '2' , label: '大对公', },
  { value: '3' , label: '大内控', },
  { value: '4' , label: '大行政', },
  { value: '5' , label: '资金同业', },
  { value: '6' , label: 'IT', },
  { value: '7' , label: '开放银行', }
]

// 报名状态: 0 未提交 / 1 已提交
// 待报名
export const SUBMIT_STATUS_TODO = '0'
export const SUBMIT_STATUS_TODO_LABEL = '未提交'

// 已报名
export const SUBMIT_STATUS_DONE = '1'
export const SUBMIT_STATUS_DONE_LABEL = '已提交'

// 报名状态选项
export const SUBMIT_STATUS_OPTIONS = [
  {
    label: SUBMIT_STATUS_TODO_LABEL,
    value: SUBMIT_STATUS_TODO
  },
  {
    label: SUBMIT_STATUS_DONE_LABEL,
    value: SUBMIT_STATUS_DONE
  }
]

// 逾期状态 1:已逾期 / 0:未逾期
export const OVERDUE_STATUS_WYQ = '0'
export const OVERDUE_STATUS_YYQ = '1'
export const OVERDUE_STATUS_OPTIONS = [
  { label: '未逾期', value: OVERDUE_STATUS_WYQ },
  { label: '已逾期', value: OVERDUE_STATUS_YYQ }
]

// 逾期状态 1:已参训 / 0:未参训
export const TRAINING_STATUS_WCX = '0'
export const TRAINING_STATUS_YCX = '1'
export const TRAINING_STATUS_OPTIONS = [
  { label: '未参训', value: TRAINING_STATUS_WCX },
  { label: '已参训', value: TRAINING_STATUS_YCX }
]

// 在职状态 N 在职/ Y 离职，数据实时更新，支持列表页筛
export const IS_LEAVED_ZS = 'N'
export const IS_LEAVED_LZ = 'Y'
export const IS_LEAVED_OPTIONS = [
  { label: '在职', value: IS_LEAVED_ZS },
  { label: '离职', value: IS_LEAVED_LZ }
]