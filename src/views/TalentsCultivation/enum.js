import { EVALUATION_TYPE_OPTIONS, EVALUATION_TYPE_OPTIONS_WTX } from '../Establish/enum'
export const TALENT_STEP = ['方案创建', '议题创建', '议题终审', '培养进展管理', '学员评价']
export const TYPE_TOTAL = '0'
export const TYPE_HEADQUARTER = '28001'
export const TYPE_LINE = '28002'
export const TYPE_ORG = '28003'
export const UPLOAD_FILE_TYPE = ['rar', 'zip', '7z', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'jpg']
export const TYPE_TEACHER = 0

export const PROJECT_STATUS_TODO = '0'
export const PROJECT_STATUS_DONE = '1'
export const PROJECT_STATUS_WAITING = '2'
export const PROJECT_STATUS = {
  [PROJECT_STATUS_TODO]: '待提交',
  [PROJECT_STATUS_DONE]: '已提交',
  [PROJECT_STATUS_WAITING]: '待创建'
}

export const PROJECT_STATUS_OPTIONS = [
  {
    label: PROJECT_STATUS[PROJECT_STATUS_TODO],
    value: PROJECT_STATUS_TODO
  },
  {
    label: PROJECT_STATUS[PROJECT_STATUS_DONE],
    value: PROJECT_STATUS_DONE
  },
  {
    label: PROJECT_STATUS[PROJECT_STATUS_WAITING],
    value: PROJECT_STATUS_WAITING
  }
]

export const EVALUATE_STATUS_WAITING = '01'
export const EVALUATE_STATUS_DONE = '02'
export const EVALUATE_STATUS = {
  [EVALUATE_STATUS_WAITING]: '待终审',
  [EVALUATE_STATUS_DONE]: '已终审'
}

export const SCHEME_TYPE_LIST = [
  { label: '已提交', value: PROJECT_STATUS_DONE },
  { label: '待提交', value: PROJECT_STATUS_TODO },
  { label: '待创建', value: PROJECT_STATUS_WAITING }
]

export const UNIT_TYPE_LIST = [
  {
    label: '全部',
    value: TYPE_TOTAL
  },
  {
    label: '总行',
    value: TYPE_HEADQUARTER
  },
  {
    label: '机构',
    value: TYPE_ORG
  },
  {
    label: '条线',
    value: TYPE_LINE
  }
]

export const PROJECT_TYPE_YNSL = '28001'
export const PROJECT_TYPE_YNBYY_LINE = '28002'
export const PROJECT_TYPE_YNBYY_ORG = '28003'
export const PROJECT_TYPE_OPTIONS = [
  { value: PROJECT_TYPE_YNSL, label: '耀你闪亮' },
  { value: PROJECT_TYPE_YNBYY_LINE, label: '耀你不一样(条线)' },
  { value: PROJECT_TYPE_YNBYY_ORG, label: '耀你不一样(机构)' }
]

// ------- 议题方向 -------
export const SUBJECT_DIRECTION_NS = '01'
export const SUBJECT_DIRECTION_DG = '02'
export const SUBJECT_DIRECTION_FX = '03'
export const SUBJECT_DIRECTION_KJ = '04'
export const SUBJECT_DIRECTION_ZJTY = '05'
export const SUBJECT_DIRECTION_GSLD = '06'
export const SUBJECT_DIRECTION_QT = '07'
// 零售/对公/风险/科技/资金同业/公私联动/其它
export const SUBJECT_DIRECTION_OPTIONS = [
  { value: SUBJECT_DIRECTION_NS, label: '零售' },
  { value: SUBJECT_DIRECTION_DG, label: '对公' },
  { value: SUBJECT_DIRECTION_FX, label: '风险' },
  { value: SUBJECT_DIRECTION_KJ, label: '科技' },
  { value: SUBJECT_DIRECTION_ZJTY, label: '资金同业' },
  { value: SUBJECT_DIRECTION_GSLD, label: '公私联动' },
  { value: SUBJECT_DIRECTION_QT, label: '其它' }
]

// ------- 督办状态 -------
export const DB_STATUS_NS = 'N'
export const DB_STATUS_DG = 'Y'
// “待督办”/“已督办”
export const DB_STATUS_OPTIONS = [
  { value: DB_STATUS_NS, label: '待督办' },
  { value: DB_STATUS_DG, label: '已督办' }
]

export const TALENTS_EVALUATION_TYPE_OPTIONS = EVALUATION_TYPE_OPTIONS
export const TALENTS_EVALUATION_TYPE_OPTIONS_WTX = EVALUATION_TYPE_OPTIONS_WTX
export const FEEDBACK_DONE = '1'
export const FEEDBACK_TODO = '0'
export const FEEDBACK_OPTIONS = [
  {
    value: FEEDBACK_DONE,
    label: '已反馈'
  },
  {
    value: FEEDBACK_TODO,
    label: '待反馈'
  }
]

export const TANLENTS_PROJECT_STATUS_TODO = '0'
export const TANLENTS_PROJECT_STATUS_DOING = '1'
export const TANLENTS_PROJECT_STATUS_DONE = '2'
export const TANLENTS_PROJECT_STATUS = [
  {
    value: TANLENTS_PROJECT_STATUS_TODO,
    label: '未启动'
  },
  {
    value: TANLENTS_PROJECT_STATUS_DOING,
    label: '培养中'
  },
  {
    value: TANLENTS_PROJECT_STATUS_DONE,
    label: '已结项'
  }
]

// 30010 总行潜才管理员；30011 条线潜才管理员；30012 机构潜才管理员
export const HEADQUARTER_ADMIN = '30010'
export const TANLENTS_LINE_ADMIN = '30011'
export const TANLENTS_ORG_ADMIN = '30012'
export const HEADQUARTER_ADMIN_NAME = '总行潜才管理员'
export const TANLENTS_LINE_ADMIN_NAME = '条线潜才管理员'
export const TANLENTS_ORG_ADMIN_NAME = '机构潜才管理员'

// 学员录入状态
export const ENTER_STATUS_OPTIONS = [
  {
    label: '已录入',
    value: 'Y'
  },
  {
    label: '待录入',
    value: 'N'
  }
]

// 方案提交状态
export const PLAN_STATUS_OPTIONS = [
  {
    label: '待提交',
    value: '0'
  },
  {
    label: '已提交',
    value: '1'
  }
]