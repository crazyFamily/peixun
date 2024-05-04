// ====================== 我的档案 ======================
// 月份中文
export const YEARMAPING = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
//
export const TRAINING_CLASS = 'calss'
// 学习类型
export const STUDYTYPES = [
  {
    label: '培训班',
    value: 'calss',
    studyType: '1',
    sumUnitTitle: '个',
    sumUnitDesc: '参加培训班',
    hourUnitTitle: '小时',
    hourUnitDesc: '培训班时长'
  },
  { label: '课程', value: 'course', studyType: '2', sumUnitTitle: '门', sumUnitDesc: '学习课程', hourUnitTitle: '小时', hourUnitDesc: '学习时长' },
  { label: '直播', value: 'live', studyType: '3', sumUnitTitle: '场', sumUnitDesc: '观看直播', hourUnitTitle: '小时', hourUnitDesc: '观看时长' },
  { label: '考试', value: 'exam', studyType: '4', sumUnitTitle: '场', sumUnitDesc: '参加考试', hourUnitTitle: '小时', hourUnitDesc: '考试时长' },
  { label: '案例', value: 'case', studyType: '10', sumUnitTitle: '个', sumUnitDesc: '学习案例', hourUnitTitle: '小时', hourUnitDesc: '学习时长' },
  { label: 'AI练', value: 'aiTrain', studyType: '6', sumUnitTitle: '个', sumUnitDesc: '学习资源', hourUnitTitle: '小时', hourUnitDesc: '学习时长' },
  { label: '其他', value: 'other', studyType: '7', sumUnitTitle: '个', sumUnitDesc: '学习资源', hourUnitTitle: '小时', hourUnitDesc: '学习时长' }
]
// 排名区间x轴
export const RANK_XLABEL = [
  { label: '后30%', value: '1' },
  { label: '前70%', value: '0.7' },
  { label: '前40%', value: '0.4' },
  { label: '前20%', value: '0.2' },
  { label: '前10%', value: '0.1' }
]
// 本人所在区间
export const ISMYSELF = '1'