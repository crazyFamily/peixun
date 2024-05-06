
import { trainingTypes } from '@/util/constants'

// 积分收入/支出
export const POINTS_INCOMES = [
  { label: '收入', value: '1' },
  { label: '支出', value: '2' }
]

// 排序类型
export const ORDER_TYPES = [
  { label: '默认', value: '0' },
  { label: '升序', value: '1' },
  { label: '降序', value: '2' }
]

// 培训类型
export const TRAINING_TYPES = trainingTypes


// 培训师类型
export const TRAINER_TYPES = [
  {
    label: '菁英培训师(一级)',
    value: '03001001'
  },
  {
    label: '菁英培训师(二级)',
    value: '03001002'
  },
  {
    label: '菁英培训师(三级)',
    value: '03001003'
  },
  {
    label: '菁英培训师(四级)',
    value: '03001004'
  },
  {
    label: '菁英培训师(五级)',
    value: '03001005'
  }
]

// 在职状态
export const LEAVE_STATUS = [
  {
    label: '在职',
    value: 'N'
  },
  {
    label: '离司',
    value: 'Y'
  }
]

// 是否双倍积分
const NO_HOLIDAY = '1'
const IS_HOLIDAY = '2'
export const HOLIDAY_STATUS = {
  IS_HOLIDAY: '是',
  NO_HOLIDAY: '否'
}

// 是否双倍积分
export const HOLIDAY_OPTIONS = [
  { label: HOLIDAY_STATUS.IS_HOLIDAY, value: IS_HOLIDAY },
  { label: HOLIDAY_STATUS.NO_HOLIDAY, value: NO_HOLIDAY }
]

// 课程来源
export const COURSE_SOURCE = [
  {
    label: '组织',
    value: '0'
  },
  {
    label: '个人',
    value: '1'
  },
  {
    label: '供应商',
    value: '2'
  }
]