// ====================== 培养方案配置 ======================
// 课程学习形式options
export const COURSE_ZN = 0
export const LEARNING_FORMAT_OPTIONS = [
  { label: '知鸟课程', value: 0 },
  { label: '智能推课课程', value: 2 },
  { label: '知鸟直播', value: 7 },
  { label: '文件上传', value: 5 },
]
// 知鸟课程及知鸟考试对应都叫知鸟，课程用在课程模块，考试用在资质模块
export const FOSTER_MODULE_LIST = [
  { label: '知鸟课程', value: 0 },
  { label: '知鸟考试', value: 1 },
  { label: '智能推课课程', value: 2 },
  { label: '孵化工厂', value: 4 },
  { label: '文件上传', value: 5 },
  { label: '智能推课考试', value: 6 },
  { label: '知鸟直播', value: 7 }
]
export const PRACTICE_FILEUPLOAD = 5
// 活动实践形式options
export const PRACTICE_FORMAT_OPTIONS = [
  // { label: 'B+', value: 3 },
  { label: '文件上传', value: 5 }
]
// 考试来源options
export const QUALIFICATION_OPTIONS = [
  { label: '知鸟考试', value: 1 },
  // { label: 'B+', value: 3 },
  { label: '智能推课考试', value: 6 },
  { label: '文件上传', value: 5 }
]
// ====================== 轮岗培养 ======================
// 非零超管或总行新人培养管理员
export const FL_SUPER_ADMIN_OR_NEW_USER = 4
// 机构新人培养管理员
export const ORG_NEW_USER_ADMIN_VALUE = 3
// 导师
export const TEACHER = 2
// 校招生
export const STUDENT = 1
export const TRANSFER_STATUS_LIST_OPTIONS = [
  { label: '进行中', value: '1' },
  { label: '终止', value: '2' },
  { label: '完成', value: '3' }
]
export const TEACHER_EVA_STATUS_OPTIONS = [
  { label: '已评价', value: '1' },
  { label: '未评价', value: '0' }
]
export const FOSTER_RES_STATUS_OPTIONS = [
  { label: '已录入', value: '1' },
  { label: '未录入', value: '0' }
]
// 审核状态
export const REVIEW_STATUS_OPTIONS = [
  { label: '未审核', value: 0 },
  { label: '审核通过', value: 1 },
  { label: '审核不通过', value: 2 }
]
// 个人意愿选项Personal willingness
export const PERSONAL_WILLINGNESS_OPTIONS = [
  { label: '继续在该岗位轮岗', value: 0 },
  { label: '申请流转至其它岗位轮岗', value: 1 },
  { label: '定岗', value: 2 }
]
