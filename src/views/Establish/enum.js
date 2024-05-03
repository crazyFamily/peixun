import { IF_CONFORMANCE_OPTIONS as ifConforManceOptions } from '../StatementCentre/enum'

// 培训班类型
export const TRAINING_COURSE_TYPE = '01001'
// 非培训班类型
export const NOT_TRAINING_COURSE_TYPE = '01002'

// 阶梯课程类型
export const LADDER_COURSE_TYPE = '02001'

// 培训类型选项
export const TRAINING_OPTIONS = [
  {
    label: '培训班',
    value: TRAINING_COURSE_TYPE
  },
  {
    label: '非培训班',
    value: NOT_TRAINING_COURSE_TYPE
  }
]


// 02000: 未提交；02001创建中；02002进行中；02003已结训；02004已完成

// 未提交
export const TRAINING_STATUS_TODO = '02000'
// 进行中
export const TRAINING_STATUS_DOING = '02002'
// 已结训
export const TRAINING_STATUS_DONE = '02003'

// 状态选项
export const TRAINING_STATUS_OPTIONS = [
  {
    label: '已结训',
    value: TRAINING_STATUS_DONE
  },
  {
    label: '未结训',
    value: TRAINING_STATUS_DOING
  }
]

export const IF_CONFORMANCE_OPTIONS = ifConforManceOptions

// 战神/战狼/战英/耀你闪亮/耀你不一样条线/耀你不一样机构
export const TRAINING_TYPE_OPTIONS_ZS = '01'
export const TRAINING_TYPE_OPTIONS_ZL = '02'
export const TRAINING_TYPE_OPTIONS_ZY = '03'
export const TRAINING_TYPE_OPTIONS_YNSL = '04'
export const TRAINING_TYPE_OPTIONS_YNTX = '05'
export const TRAINING_TYPE_OPTIONS_YNJG = '06'

export const TRAINING_TYPE_OPTIONS_VALUES = [
  TRAINING_TYPE_OPTIONS_ZS,
  TRAINING_TYPE_OPTIONS_ZL,
  TRAINING_TYPE_OPTIONS_ZY,
  TRAINING_TYPE_OPTIONS_YNSL,
  TRAINING_TYPE_OPTIONS_YNTX,
  TRAINING_TYPE_OPTIONS_YNJG
]

export const TRAINING_TYPE_OPTIONS = [
  { label: '战神', value: TRAINING_TYPE_OPTIONS_ZS, type: 'xxy' },
  { label: '战狼', value: TRAINING_TYPE_OPTIONS_ZL, type: 'xxy' },
  { label: '战英', value: TRAINING_TYPE_OPTIONS_ZY, type: 'xxy' },
  { label: '耀你闪亮', value: TRAINING_TYPE_OPTIONS_YNSL },
  { label: '耀你不一样条线', value: TRAINING_TYPE_OPTIONS_YNTX },
  { label: '耀你不一样机构', value: TRAINING_TYPE_OPTIONS_YNJG },
]

// 很好/较好/一般/较差/差/未体现
export const EVALUATION_TYPE_OPTIONS_HH = '01'
export const EVALUATION_TYPE_OPTIONS_JH = '02'
export const EVALUATION_TYPE_OPTIONS_YB = '03'
export const EVALUATION_TYPE_OPTIONS_JC = '04'
export const EVALUATION_TYPE_OPTIONS_C = '05'
export const EVALUATION_TYPE_OPTIONS_WTX = '06'
export const EVALUATION_TYPE_OPTIONS = [
  { label: '很好', value: EVALUATION_TYPE_OPTIONS_HH },
  { label: '较好', value: EVALUATION_TYPE_OPTIONS_JH },
  { label: '一般', value: EVALUATION_TYPE_OPTIONS_YB },
  { label: '较差', value: EVALUATION_TYPE_OPTIONS_JC },
  { label: '差', value: EVALUATION_TYPE_OPTIONS_C },
  { label: '未体现', value: EVALUATION_TYPE_OPTIONS_WTX },
]
export const CLASS_TYPE_KXYF = '05006'

// 餐杂费
export const MEALS_AND_MISCELLANEOUS = '000101'
// 出差补助
export const TRAVEL_ALLOWANCE = '000405'
// 交通费（平安大学）
export const TRAVEL_EXPENSES = '000404'

// 是结训条件
export const IS_FINISH_CONDITION = '1'
// 不是结训条件
export const IS_NOT_FINISH_CONDITION = '0'
// 查询列表
export const FINISH_CONDITION_OPTIONS = [
  {
    label: '是',
    value: IS_FINISH_CONDITION
  },
  {
    label: '否',
    value: IS_NOT_FINISH_CONDITION
  }
]


// 是必修条件
export const IS_REQUIRED = '1'
// 不是必修条件
export const IS_NOT_REQUIRED = '0'
// 必修/选修
export const REQUIRED_OPTIONS = [
  {
    label: '必修',
    value: IS_REQUIRED
  },
  {
    label: '选修',
    value: IS_NOT_REQUIRED
  }
]

// 正常/屏蔽
export const COMMENT_STATUS_OPTIONS = [
  {
    label: '屏蔽',
    value: IS_REQUIRED
  },
  {
    label: '正常',
    value: IS_NOT_REQUIRED
  }
]

// 已提交 未提交 逾期提交
export const ASSIGMENT_SUBMIT_STATUS_OPTIONS = [
  {
    label: '未提交',
    value: '0'
  },
  {
    label: '已提交',
    value: '1'
  },
  {
    label: '逾期提交',
    value: '2'
  }
]


// 课程类型
export const MIXINS_TRAINING_TYPE_COURSE = 'course'

// 直播类型
export const MIXINS_TRAINING_TYPE_LIVE = 'live'

// 考试类型
export const MIXINS_TRAINING_TYPE_EXAM = 'test'

// 案例类型
export const MIXINS_TRAINING_TYPE_CASE = 'case'

// 0:图文，1：混合，2：小游戏，3：纯视频，5：纯音频，6：电子书
export const MIXINS_ZN_COURSE_WARE_TYPE_IMAGE = '0'
export const MIXINS_ZN_COURSE_WARE_TYPE_MIXIN = '1'
export const MIXINS_ZN_COURSE_WARE_TYPE_GAME = '2'
export const MIXINS_ZN_COURSE_WARE_TYPE_VIDEO = '3'
export const MIXINS_ZN_COURSE_WARE_TYPE_AUDIO = '5'
export const MIXINS_ZN_COURSE_WARE_TYPE_BOOK = '6'
export const MIXINS_ZN_COURSE_WARE_OPTIONS = [
  {
    label: '图文',
    value: MIXINS_ZN_COURSE_WARE_TYPE_IMAGE
  },
  {
    label: '混合',
    value: MIXINS_ZN_COURSE_WARE_TYPE_MIXIN
  },
  {
    label: '小游戏',
    value: MIXINS_ZN_COURSE_WARE_TYPE_GAME
  },
  {
    label: '纯视频',
    value: MIXINS_ZN_COURSE_WARE_TYPE_VIDEO
  },
  {
    label: '纯音频',
    value: MIXINS_ZN_COURSE_WARE_TYPE_AUDIO
  },
  {
    label: '电子书',
    value: MIXINS_ZN_COURSE_WARE_TYPE_BOOK
  }
]

// 混合培训知鸟课程完成情况
export const MIXINS_ZN_COURSE_COMPLETE_OPTIONS = [
  {
    label: '未完成',
    value: '0'
  },
  {
    label: '已完成',
    value: '1'
  }
]

// 混合培训案例完成情况
export const MIXINS_ZN_CASE_COMPLETE_OPTIONS = [
  {
    label: '未完成',
    value: '0'
  },
  {
    label: '已完成',
    value: '1'
  }
]

// 混合培训知鸟考试完成情况
export const MIXINS_ZN_EXAM_COMPLETE_OPTIONS = [
  {
    label: '未考试',
    value: '0'
  },
  {
    label: '未通过',
    value: '1'
  },
  {
    label: '已通过',
    value: '2'
  }
]

// 直播状态 0未开始，1直播中 2已结束 3回放中 4无效直播
export const MIXINS_ZN_LIVE_STATUS_WAIT = '0'
export const MIXINS_ZN_LIVE_STATUS_DOING = '1'
export const MIXINS_ZN_LIVE_STATUS_DONE = '2'
export const MIXINS_ZN_LIVE_STATUS_REPEAT = '3'
export const MIXINS_ZN_LIVE_STATUS_FAIL = '4'
export const MIXINS_ZN_LIVE_STATUS_OPTIONS = [
  {
    label: '未开始',
    value: MIXINS_ZN_LIVE_STATUS_WAIT
  },
  {
    label: '直播中',
    value: MIXINS_ZN_LIVE_STATUS_DOING
  },
  {
    label: '已结束',
    value: MIXINS_ZN_LIVE_STATUS_DONE
  },
  {
    label: '回放中',
    value: MIXINS_ZN_LIVE_STATUS_REPEAT
  },
  {
    label: '无效直播',
    value: MIXINS_ZN_LIVE_STATUS_FAIL
  }
]

// 交流圈发布状态:0下架,1发布
export const MIXINS_COMMUNICATE_ON = 1
export const MIXINS_COMMUNICATE_OFF = 0

export const MIXINS_SUBJECT_TYPE_CLASS = 'class'

export const OUTER_TEACHER_COST = '000202'
// 上传附件的文件类型
export const ACCEPTSTR = '.xls,.doc,.htm,.ppt,.mht,.msg,.rar,.zip,.txt,.html,.docx,.xlsx,.pptx,.png,.gif,.jpg,.jpeg,.pdf,.ofd,.tif,.mpp,.rtf,.7z.001,.7z.002,.log,.bmp,.7z,.7z.003,.7z.004,.7z.005,.eml,.gzip,.text,.xmind'