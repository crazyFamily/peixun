import { TRAINING_COURSE_TYPE as trainingType, NOT_TRAINING_COURSE_TYPE as notTrainingType } from '../Establish/enum'
import { EOA_DONE as eoaDone } from '../CourseRecommendation/enum'


export const APPLY_EOA_DOING = '02001'
export const APPLY_EOA_DONE = '02002'
export const TRAINING_COURSE_TYPE = trainingType
export const NOT_TRAINING_COURSE_TYPE = notTrainingType
export const RESERVED = 'reserved'
// 对应后端的数据结构值 0非培训班1培训班2预留费用
export const CLASS_TYPES_MAP = {
  [NOT_TRAINING_COURSE_TYPE]: '0',
  [TRAINING_COURSE_TYPE]: '1',
  [RESERVED]: '2'
}


// 零售
const TEMPLATE_LS = 'LS'
// 非零
const TEMPLATE_FL = 'FL'
// 金服
const TEMPLATE_JF = 'JF'
// 橙信
const TEMPLATE_CX = 'CX'
// 导出模板的条线表,需求变更，零售计划导入模板也是采用非零的
export const PLAN_LINE_MAP = {
  [TEMPLATE_LS]: 'PLAN_FL',
  [TEMPLATE_FL]: 'PLAN_FL',
  [TEMPLATE_JF]: 'PLAN_JF',
  [TEMPLATE_CX]: 'PLAN_CX'
}


// 阶梯类型的培训
export const LADDER_TRAIN_TYPE = '02001'
// 项目性培训
export const PROJECT_TRAIN_TYPE = '02000'
// 大学专班
export const COLLEGE_TRAIN_TYPE = '02002'
// 培训类型：02000：项目性培训、02001：阶梯培训、02002：大学专班
export const TRAIN_TYPE_OPTIONS = [
  { value: PROJECT_TRAIN_TYPE, label: '项目性培训' },
  { value: LADDER_TRAIN_TYPE, label: '阶梯培训' },
  { value: COLLEGE_TRAIN_TYPE, label: '大学专班' },
]

// 审批完成状态
export const EOA_DONE = eoaDone


// 看板上架状态
export const MONTHLY_DASHBOARD_STATUE_SUBMIT = '1'
// 看板下架状态
export const MONTHLY_DASHBOARD_STATUE_SOLDOUT = '2'
// 看板未提交状态
export const MONTHLY_DASHBOARD_STATUE_UNSUBMIT = '0'
// 发布
export const MONTHLY_ON_LINE = '1'
// 下架
export const MONTHLY_OFF_LINE = '2'

// 线上类型-战神战狼
export const ONLINE_TYPE_ZSZL = '1'
// 线上类型-战英
export const ONLINE_TYPE_ZY = '2'
// 社招
export const SOCIAL_RERUITEMNT = '1'
// 校招
export const SCHOOL_RERUITEMNT = '2'

// 是否映射关系
export const YES_STATUS = 'Y'
export const NO_STATUS = 'N'
export const YES_INT = '1'
export const NO_INT = '0'
// 月度计划明细录入状态
export const SUBMIT_STATUS_OPTIONS = [
  { value: YES_STATUS, label: '已执行', code: YES_INT },
  { value: NO_STATUS, label: '延期', code: NO_INT  },
  { value: NO_STATUS, label: '取消', code: NO_INT  },
]
export const CANCEL = '3'
export const DELAY = '2'
// 月度计划明细检视执行情况
export const CHECK_STATUS_OPTIONS = [
  { value: YES_INT, label: '已执行' },
  { value: DELAY, label: '延期执行' },
  { value: CANCEL, label: '取消' },
]