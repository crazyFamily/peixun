import { mergeHostHandle, handleUdmpHref } from '@/util/utils'

const BASE_HOST = {
  local: '/'
  // dev: 'http://tms-new.dev.pab.com.cn/tms-new/api',
  // fat: 'http://tms-new.fat.qa.pab.com.cn/tms-new/api',
  // prd: 'http://tms-new.pab.com.cn/tms-new/api',
  // uat: 'http://tms-new.uat.pab.com.cn/tms-new/api'
}

export const SERVER_BASEHOST = mergeHostHandle(BASE_HOST)

export const LIVE = {
  LIVE_TYPE: {
    EXIST: '已有系列直播',
    ONCE: '非系列直播'
  }
}

// 培训师类型
export const trainersTypes = [
  { label: '菁英培训师(一级)', value: '03001001' },
  { label: '菁英培训师(二级)', value: '03001002' },
  { label: '菁英培训师(三级)', value: '03001003' },
  { label: '菁英培训师(四级)', value: '03001004' },
  { label: '菁英培训师(五级)', value: '03001005' }
]

// 培训类型
export const trainingTypes = [
  { label: '面授记录', value: '1' },
  { label: '直播记录', value: '2' },
  { label: '微课记录', value: '3' },
  { label: '其他', value: '4' }
]

// 培训师在职状态
export const leavedTypes = [
  { label: '在职', value: 'N' },
  { label: '离司', value: 'Y' }
]


export const busiTypes = [
  { label: '非零', value: 'FL' },
  { label: '零售', value: 'LS' },
  { label: '金服', value: 'JF' },
  { label: '橙信', value: 'CX' },
]


export const ROUTER_ICON = [
  {
    label: '报表中心',
    icon: 'shouye-baobiaozhongxin.svg'
  },
  {
    label: '报销中心',
    icon: 'shouye-baoxiaozhongxin.svg'
  },
  {
    label: '讲师管理',
    icon: 'shouye-jiangshiguanli.svg'
  },
  {
    label: '课程管理',
    icon: 'shouye-kechengguanli.svg'
  },
  {
    label: '培训计划管理',
    icon: 'shouye-peixunjihuaguanli.svg'
  },
  {
    label: '培训项目管理',
    icon: 'shouye-peixunxiangmuguanli.svg'
  },
  {
    label: '系统管理',
    icon: 'shouye-xitongguanli.svg'
  },
  {
    label: '星火计划',
    icon: 'shouye-xinghuojihua.svg'
  },
  {
    label: '培训师管理',
    icon: 'peixunshi-yuan.svg'
  },
  {
    label: '私行财富学习管理',
    icon: 'sicai-yuan.svg'
  },
  {
    label: '案例中心',
    icon: 'anlizhongxin3.svg'
  },
  {
    label: '首页运营',
    icon: 'anlizhongxin3.svg'
  },
  {
    label: 'AI陪练',
    icon: 'ai-background.svg'
  },
  {
    label: '阶梯培训管理',
    icon: 'jietipeixunguanli1.svg'
  },
  {
    label: '数据大屏',
    icon: 'shouye-datadashboard.svg'
  },
  {
    label: '潜才培养管理',
    icon: 'shouye-qiancai.svg'
  },
  {
    label: '新人培养管理',
    icon: 'shouye-xinrenpeiyang.svg'
  },
  {
    label: '校招轮岗管理',
    icon: 'shouye-xiaozhao.svg'
  },
  {
    label: '学习档案',
    icon: 'shouye-xuexidangan.svg'
  }
]

// 训练营eoa审批状态
export const TRAIN_EOA_STATUS = [
  {
    label: '草稿中',
    value: '02000'
  },
  {
    label: '审批中',
    value: '02001'
  },
  {
    label: '已通过',
    value: '02002'
  },
  {
    label: '已退回',
    value: '02003'
  },
  {
    label: '已撤回',
    value: '02004'
  }
]

// 训练营状态
export const TRAIN_STATUS = [
  {
    label: '未上架',
    value: '02000'
  },
  {
    label: '已上架',
    value: '02001'
  },
  {
    label: '已下架',
    value: '02002'
  }
]

// 条线
export const LINE_LS = 'LS'
export const LINE_FL = 'FL'
export const LINE_JF = 'JF'
export const LINE_CX = 'CX'
export const LINE_MAP = {
  [LINE_LS]: '零售',
  [LINE_FL]: '非零',
  [LINE_JF]: '金服',
  [LINE_CX]: '橙信'
}

// 课程表讲师和课程类型
export const ESTABLISH_COURSE_MAP = {
  // 银行面授
  bank: '05002',
  // 外部面授
  interior: '05003',
  // 移动
  move: '05001',
  // 内部（银行）
  interiorBank: '01001',
  // 内部（非银行）
  interiorNotBank: '01000',
  // 外部讲师
  sansLecturer: '01002',
  // 无讲师
  notLecturer: '01003',
  // 通用课程
  commonCourse: 'commonCourse'
}

// 案例文稿类型
export const CASE_DRAFT_TYPE = {
  ai: '0',
  txt: '1'
}
// 阶梯培训覆盖率报表TAB状态
export const LADDER_COVERAGE_TABS = [
  { label: '上岗培训', name: 'SG' },
  { label: '加油站培训', name: 'XR' },
  { label: '提升培训', name: 'TS' },
  { label: '研修培训', name: 'YX' }
]
// 星火计划申请管理申请类型
export const SPARK_APPLY_TYPE = [
  { label: '豁免', value: '0' },
  { label: '延期', value: '1' }
]
// 星火计划申请管理审批状态
export const SPARK_APPLY_STATUS = [
  { label: '未提交', value: '02000' },
  { label: '审批中', value: '02001' },
  { label: '已通过', value: '02002' },
  { label: '已退回', value: '02003' },
  { label: '已撤回', value: '02004' }
]
// 报销中心发起报销TAB状态
export const REIMBURSE_DETAILS_TABS = [
  { label: '报账明细', name: 'BZMX' },
  { label: '挂账信息', name: 'GZXX' },
  { label: '核销信息', name: 'HXXX' },
  { label: '差旅信息', name: 'CLXX' },
  { label: '审批记录', name: 'SPJL' },
  { label: '咨询记录', name: 'ZXJL' },
  { label: '影像信息', name: 'YXXX' }
]

// 智推训练营系列状态map
const TRAINING_STATUS_UNSTART = 0
const TRAINING_STATUS_DOING = 1
const TRAINING_STATUS_DONE = 2
export const TRAINING_STAGE_SERIES_STATUS = {
  [TRAINING_STATUS_UNSTART]: '未开始',
  [TRAINING_STATUS_DOING]: '进行中',
  [TRAINING_STATUS_DONE]: '已完成'
}

// 是否映射关系
export const YES_STATUS = 'Y'
export const NO_STATUS = 'N'
export const yesOrNoMap = [
  {
    label: '是',
    value: YES_STATUS
  },
  {
    label: '否',
    value: NO_STATUS
  }
]
// 培训立项培训形式形式
export const TRAININGMODE = [
  {
    label: '线上',
    value: '1'
  },
  {
    label: '线下',
    value: '2'
  },
  {
    label: '线上+线下',
    value: '3'
  }
]
//培训班状态
export const TRAININGSTATE = [
  {
    value: '02003',
    label: '已结训'
  },
  {
    value: '02002',
    label: '进行中'
  }
]

export const YES_INT = '1'
export const NO_INT = '0'
//培训班状态
export const SUBMIT_STATUS_OPTIONS = [
  { value: YES_STATUS, label: '已提交', code: YES_INT },
  { value: NO_STATUS, label: '未提交', code: NO_INT  }
]
//执行状态
export const EXECUTE_STATUS_OPTIONS = [
  { value: YES_INT, label: '已执行', code: YES_INT },
  { value: NO_INT, label: '未执行', code: NO_INT  },
  { value: '2', label: '延期执行', code: '2'  },
  { value: '3', label: '取消', code: '3'  },
]

// 自定义问卷类型
export const QUESTION_TYPES_START = '1' // 评分题
export const QUESTION_TYPES_INPUT = '2' // 填空题
export const QUESTION_TYPES_RADIO = '3' // 单选题
export const QUESTION_TYPES_CHECKBOX = '4' // 多选题
export const QUESTION_TYPES = {
  // '2': { label: '主观题', value: 'input', iconClass: 'el-icon-notebook-2' },
  [QUESTION_TYPES_START]: { label: '评分题', code: 'start'},
  [QUESTION_TYPES_INPUT]: { label: '填空题', code: 'input' },
  [QUESTION_TYPES_RADIO]: { label: '单选题', code: 'radio' },
  [QUESTION_TYPES_CHECKBOX]: { label: '多选题', code: 'checkbox' },
}
export const DEFAULT_ZONE_IMG_URL_ID = 'UDMP-e039f939c2d9005cea5af4ca2ca3c13e57338f36a4-e66c01ed-20221017120106-00000001'
export const DEFAULT_ZONE_IMG_URL = handleUdmpHref(DEFAULT_ZONE_IMG_URL_ID) // require('@/assets/images/default-special.png')

// 模板类型   3:自定义模版，4:学员旅程固定模板
export const TEMPLATE_TYPE_CUSTOM = '3' // 自定义模版
export const TEMPLATE_TYPE_FIXED = '4' // 学员旅程固定模板


// 培训班计划
export const PLAN_TRAINING_COURSE_TYPE = '1'
// 非培训班计划
export const PLAN_NOT_TRAINING_COURSE_TYPE = '0'

// 培训班项目
export const TRAINING_COURSE_TYPE = '01001'
// 非培训班项目
export const NOT_TRAINING_COURSE_TYPE = '01002'

// 角色编码
export const ROLE_CODE = {
  SUPER_ADAMIN: '10000', // 超级管理员
  SUPER_ADAMIN_BM: '20008', // 部门超管
  SUPER_ADAMIN_FH: '20009', // 分行超管
}