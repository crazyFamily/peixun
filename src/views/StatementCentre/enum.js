// 培训班类型
export const PLAN_TRAINING_COURSE_TYPE = '1'
// 非培训班类型
export const PLAN_NOT_TRAINING_COURSE_TYPE = '0'

// 培训类型选项
export const PLAN_TRAINING_OPTIONS = [
  {
    label: '培训班',
    value: PLAN_TRAINING_COURSE_TYPE
  },
  {
    label: '非培训班',
    value: PLAN_NOT_TRAINING_COURSE_TYPE
  }
]
// 参训状态
export const ISATTENDCLASS = [
  {
    label: '未参训',
    value: 'N'
  },
  {
    label: '已参训',
    value: 'Y'
  }
]


// 培训形式
// 1.线上，2线下，3线上+线下
// 线上
export const TRAIN_SHAPE_ONLINE = '1'
// 线下
export const TRAIN_SHAPE_OFFLINE = '2'
// 线上+线下
export const TRAIN_SHAPE_ALL = '3'

export const TRAIN_SHAPE_OPTIONS = [
  {
    label: '线上',
    value: TRAIN_SHAPE_ONLINE
  },
  {
    label: '线下',
    value: TRAIN_SHAPE_OFFLINE
  },
  {
    label: '线上+线下',
    value: TRAIN_SHAPE_ALL
  }
]


// 是否消保 Y是，N否
// 是
export const IF_CONFORMANCE_Y = 'Y'
// 否
export const IF_CONFORMANCE_N = 'N'

export const IF_CONFORMANCE_OPTIONS = [
  {
    label: '是',
    value: IF_CONFORMANCE_Y
  },
  {
    label: '否',
    value: IF_CONFORMANCE_N
  },
]

// 归属区域；ZH：总行部门；FQ：分区部门；FH：分行部门；EJFH：二级分行
export const ZONE_OPTIONS = [
  { value: 'ZH', label: '总行' },
  { value: 'FQ', label: '片区' },
  { value: 'FH', label: '分行' },
  { value: 'EJFH', label: '二级分行' },
]

export const SUPER_ADAMIN_ROLE_CODE='10000'


export const LADDER_COVERAGE_TABS_SG = 'sg'
export const LADDER_COVERAGE_TABS_JYZ = 'xr'
export const LADDER_COVERAGE_TABS_TS = 'ts'
export const LADDER_COVERAGE_TABS_YX = 'yx'
// 阶梯培训覆盖率报表TAB状态
export const LADDER_COVERAGE_TABS_NEW = [
  { label: '上岗培训', value: LADDER_COVERAGE_TABS_SG },
  { label: '加油站培训', value: LADDER_COVERAGE_TABS_JYZ },
  { label: '提升培训', value: LADDER_COVERAGE_TABS_TS },
  { label: '研修培训', value: LADDER_COVERAGE_TABS_YX }
]

export const LADDER_COVERAGE_TABS_RATE_JG = 'JG'
export const LADDER_COVERAGE_TABS_RATE_GW = 'GW'
// 阶梯培训覆盖率报表TAB状态
export const LADDER_COVERAGE_TABS_RATE = [
  { label: '机构纬度', value: LADDER_COVERAGE_TABS_RATE_JG },
  { label: '岗位纬度', value: LADDER_COVERAGE_TABS_RATE_GW },
]

// 是否离职；Y-离职，N-在职
export const USER_LEAVED_Y = 'Y'
export const USER_LEAVED_N = 'N'
// 阶梯培训覆盖率报表TAB状态
export const USER_LEAVED_OPTIONS = [
  { label: '离职', value: USER_LEAVED_Y },
  { label: '在职', value: USER_LEAVED_N },
]

// 参训状态：Y-已参训，N-未参训
export const USER_REQUIRE_Y = 'Y'
export const USER_REQUIRE_N = 'N'
export const USER_REQUIRE_OPTIONS = [
  { label: '已参训', value: USER_REQUIRE_Y },
  { label: '未参训', value: USER_REQUIRE_N },
]

export const PERMISSION_STATUS_ON = 'Y'
export const PERMISSION_STATUS_OFF = 'N'
export const PERMISSION_STATUS_ON_LABEL = '开'
export const PERMISSION_STATUS_OFF_LABEL = '关'
export const PERMISSION_STATUS_OPTIONS = [
  { value: PERMISSION_STATUS_ON , label: PERMISSION_STATUS_ON_LABEL, },
  { value: PERMISSION_STATUS_OFF , label: PERMISSION_STATUS_OFF_LABEL, }
]

export const CLASS_STATUS_YJX = '02003'

// 培训类型2级-考试文件信息
export const CLASS_TYPE_TWO_KSWJXX = '05010'
// 网点孵化导师津贴明细表的讲师管理入参
export const TEACHER_MODULE = 'teacherModule'
// 培训项目管理
export const CLASS_MODULE = 'classModule'
// 星火计划
export const SPARK_MODULE = 'sparkModule'
// 案例中心
export const CASE_MODULE = 'caseModule'