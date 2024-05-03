// 课程来源下拉选项
export const SOURCE_TMS = 'tms'
export const SOURCE_ZN = 'zn'
export const SOURCE_XC = 'xc'
export const SOURCE_KD = 'kd'
export const sourceOptions = [
  {
    label: '培训系统',
    value: SOURCE_TMS
  },
  {
    label: '知鸟',
    value: SOURCE_ZN
  },
  {
    label: '小橙',
    value: SOURCE_XC
  },
  {
    label: '口袋银行',
    value: SOURCE_KD
  }
]

// 课程类型
export const coursewareTypeOptions = [
  {
    label: '音频',
    value: 'yp'
  },
  {
    label: '视频',
    value: 'sp'
  },
  {
    label: '图文',
    value: 'tw'
  }
]

// 课程完成标准
export const completePercentOptions = [
  {
    label: '40%',
    value: 40
  },
  {
    label: '60%',
    value: 60
  },
  {
    label: '80%',
    value: 80
  },
  {
    label: '100%',
    value: 100
  }
]

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

// 类别选项
export const courseCategoryOptions = [
  {
    label: '课程',
    value: 1
  },
  {
    label: '案例',
    value: 2
  }
]

// 难易程度选项
export const difficultEasyOptions = [
  {
    label: '高阶',
    value: '3'
  },
  {
    label: '中阶',
    value: '2'
  },
  {
    label: '低阶',
    value: '1'
  }
]

// 课程类型 选项
export const courseTypeOptions = [
  {
    label: '音频',
    value: 'yp'
  },
  {
    label: '视频',
    value: 'sp'
  },
  {
    label: '图文',
    value: 'tw'
  }
]

// 课程状态 选项
export const HAVENT_SHELVES = '0200'
export const PUTAWAY = '02001'
export const SOLDOUT = '02002'
export const curriculumStatusOptions = [
  {
    label: '未上架',
    value: HAVENT_SHELVES
  },
  {
    label: '已上架',
    value: PUTAWAY
  },
  {
    label: '已下架',
    value: SOLDOUT
  }
]

// 审批状态 选项
export const EOA_DRAFTS = '02000'
export const EOA_WAITTING = '02001'
export const EOA_DONE = '02002'
export const EOA_BACK = '02003'
export const EOA_WITHDRAW = '02004'
export const approvalStatusOptions = [
  {
    label: '草稿中',
    value: EOA_DRAFTS
  },
  {
    label: '审批中',
    value: EOA_WAITTING
  },
  {
    label: '已通过',
    value: EOA_DONE
  },
  {
    label: '已退回',
    value: EOA_BACK
  },
  {
    label: '已撤回',
    value: EOA_WITHDRAW
  }
]

// 考试类型
export const MONTHLY_EXAM = 1
export const COMPREHENSIVE_EXAM = 2
export const WEEKLY_EXAM = 3
export const QUIZZES = 4
export const examTypeOptions = [
  {
    label: '月考',
    value: MONTHLY_EXAM
  },
  {
    label: '综合考',
    value: COMPREHENSIVE_EXAM
  },
  {
    label: '周考',
    value: WEEKLY_EXAM
  },
  {
    label: '随堂考',
    value: QUIZZES
  }
]

// 考查能力选项
export const examineContentOptions = [
  {
    label: '底层资产',
    value: 'bottom'
  },
  {
    label: '市场',
    value: 'market'
  },
  {
    label: '产品',
    value: 'product'
  },
  {
    label: '其他',
    value: 'others'
  }
]

// 推送人员设置
export const PUSH_WHITELIST = 1
export const PUSH_ORGAN_POST = 2
export const PUSH_SEQUENCE = 3
export const PUSH_MODE = {
  [PUSH_WHITELIST]: '白名单导入',
  [PUSH_ORGAN_POST]: '指定机构+岗位',
  [PUSH_SEQUENCE]: '指定序列'
}
// 推送业务类型
export const PUSH_TYPE = {
  course: 'course',
  project: 'project',
  live: 'live',
  exam: 'exam',
  training: 'training',
}

// H5页面风格
export const H5_TEMPLATE_STYLE = [
  // {
  //   label: '湖蓝色(#3835B6)',
  //   value: 'blue',
  //   titleBg: require('@/assets/images/h5style-1-top.svg'),
  //   defaultTopicBg: require('@/assets/images/courseRecommendation-h5-style1.png'),
  //   backgroundUrl: require('@/assets/images/courseRecommendation-h5-style1.png')
  // },
  {
    label: '天蓝色(#7498E0)',
    value: 'skyBlue',
    templateBackground: '#7498E0',
    titleBg: require('@/assets/images/h5style-4-top.svg'),
    defaultTopicBg: require('@/assets/images/h5style-4-img.jpg'),
    backgroundUrl: require('@/assets/images/courseRecommendation-h5-style5.png')
  },
  {
    label: '红色(#A34C4A)',
    value: 'red',
    templateBackground: 'linear-gradient(180deg, #bc4446 0%, #a34c4a 100%)',
    titleBg: require('@/assets/images/h5style-2-top.svg'),
    defaultTopicBg: require('@/assets/images/h5style-2-img.jpg'),
    backgroundUrl: require('@/assets/images/courseRecommendation-h5-style3.png')
  },
  {
    label: '浅紫色(#8881DD)',
    value: 'lightPurple',
    templateBackground: '#8881DD',
    titleBg: require('@/assets/images/h5style-6-top.svg'),
    defaultTopicBg: require('@/assets/images/h5style-6-img.jpg'),
    backgroundUrl: require('@/assets/images/courseRecommendation-h5-style7.png')
  },
  {
    label: '暗紫色(#444B8A)',
    value: 'purple',
    templateBackground: 'linear-gradient(180deg, #3b4376 0%, #434c8e 100%)',
    titleBg: require('@/assets/images/h5style-1-top.svg'),
    defaultTopicBg: require('@/assets/images/h5style-1-img.jpg'),
    backgroundUrl: require('@/assets/images/courseRecommendation-h5-style2.png')
  },
  {
    label: '棕色(#AF8A67)',
    value: 'brown',
    templateBackground: '#b1845c',
    titleBg: require('@/assets/images/h5style-3-top.svg'),
    defaultTopicBg: require('@/assets/images/h5style-3-img.jpg'),
    backgroundUrl: require('@/assets/images/courseRecommendation-h5-style4.png')
  },
  {
    label: '橙色(#C78855)',
    value: 'orange',
    templateBackground: '#C78855',
    titleBg: require('@/assets/images/h5style-5-top.svg'),
    defaultTopicBg: require('@/assets/images/h5style-5-img.jpg'),
    backgroundUrl: require('@/assets/images/courseRecommendation-h5-style6.png')
  },
  {
    label: '灰色(#D9E3ED)',
    value: 'gray',
    templateBackground: '#D9E3ED',
    titleBg: require('@/assets/images/h5style-7-top.svg'),
    defaultTopicBg: require('@/assets/images/h5style-7-img.jpg'),
    backgroundUrl: require('@/assets/images/courseRecommendation-h5-style8.png'),
    headerTextColor: '#3046B2'
  },
  {
    label: '中式鹤景(#F9DFC7)',
    value: 'chineseCrane',
    templateBackground: 'linear-gradient(180deg, #FBE7D2 34%, #F7CFB0 88%, #F7CFB0 95%)',
    titleBg: require('@/assets/images/h5style-8-top.svg'),
    defaultTopicBg: require('@/assets/images/h5style-8-img.jpg'),
    backgroundUrl: require('@/assets/images/courseRecommendation-h5-style9.jpg'),
    headerTextColor: '#B54C3A'
  }
]

// 训练营系列类型集
export const TRAINING_SERIES = 'series'
export const TRAINING_COURSE = 'course'
export const TRAINING_EXAM = 'exam'
export const TRAINING_CLASS = 'class'
export const TRAINING_TASK = 'task'
export const SERIES_TYPE_AI_EXERCISE = 'ai_exercise'
export const TRAINING_SERIES_TYPE = {
  [TRAINING_SERIES]: '系列',
  [TRAINING_COURSE]: '课程',
  [TRAINING_EXAM]: '考试',
  [TRAINING_CLASS]: '线下培训班',
  [TRAINING_TASK]: '作业',
  [SERIES_TYPE_AI_EXERCISE]: 'AI练'
}

// 课程状态
export const COURSE_STATUS = {
  UNIMPLEMENT: '02000', // 未上架
  VALID: '02001', // 已上架
  INVALID: '02002' // 已下架
}

// 推荐课程
export const RECOMMEND_COLUMNS = [ 
  {
    type: 'selection'
  },
  {
    label: '课程名称',
    width: '70',
    prop: 'courseName'
  },
  {
    label: '课程属主部门',
    width: '70',
    prop: 'blgOrgName'
  },
  {
    label: '课程系列',
    width: '70',
    prop: 'courseClassifyName'
  },
  {
    label: '课程难易程度',
    width: '70',
    prop: 'difficultyLevel'
  },
  {
    label: '授课讲师',
    width: '70',
    prop: 'teacherName'
  },
  {
    label: '上架时间',
    width: '70',
    prop: 'realUpTime'
 }]

 // 课程笔记
export const NOTE_COLUMNS = [ 
  {
    type: 'selection'
  },
  {
    label: '评论内容',
    width: '120',
    prop: 'content'
  },
  {
    label: '所属课程',
    width: '70',
    prop: 'courseName'
  },
  {
    label: '课程ID',
    width: '50',
    prop: 'sbjId'
  },
  {
    label: '发布者',
    width: '50',
    prop: 'createdBy'
  },
  {
    label: '状态',
    width: '40',
    prop: 'status',
    formatter: (row) => row.status === 1 ? '屏蔽' : row.status === 0 ? '正常' : '',
  },
  {
    label: '发布时间',
    width: '70',
    prop: 'createdDate'
  },
  {
    label: '更新时间',
    width: '70',
    prop: 'updatedDate'
  }]

  // 笔记状态
  export const STATUS_OPTIONS = [
    {
      label: '正常',
      value: '0'
    },
    {
      label: '屏蔽',
      value: '1'
    },
  ]

  // 笔记评论
  export const NOTE_COMMENT_COLUMNS = [
    {
      label: '回复内容',
      width: '100',
      prop: 'content'
    },
    {
      label: '评论人',
      width: '30',
      prop: 'createdBy'
    },
    {
      label: '可见状态',
      width: '30',
      prop: 'status',
      formatter: (row) => row.status === 1 ? '不可见' : row.status === 0 ? '可见' : '',
    },
    {
      label: '评论时间',
      width: '40',
      prop: 'createdDate'
    },
  ]