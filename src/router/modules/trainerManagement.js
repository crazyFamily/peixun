export default [
  {
    path: '/TrainerEvaluation',
    name: '培训师评聘',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/TrainerEvaluation'
      )
  },
  {
    path: '/EvaluationYearManagement',
    name: '评聘年度配置',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/EvaluationYear/Management'
      )
  },
  {
    path: '/NewTrainer',
    name: '新增培训师',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/NewTrainer'
      )
  },
  {
    path: '/TrainerManagement',
    name: '培训师管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/TrainerManagement'
      )
  },
  {
    path: '/FaceTeachingRecord',
    name: '全量面授记录',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/TeachManagement/FaceTeachingRecord'
      )
  },
  {
    path: '/MicroClassRecord',
    name: '全量微课记录',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/TeachManagement/MicroClassRecord'
      )
  },
  {
    path: '/LiveRecord',
    name: '全量直播记录',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/TeachManagement/LiveRecord'
      )
  },
  {
    path: '/FaceTeachingRecordS',
    name: '培训师面授记录 ',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainnerSearch" */
        '@/views/TrainerManagement/TeachManagement/TrainnerSearch/FaceTeachingRecord'
      )
  },
  {
    path: '/MicroClassRecordS',
    name: '培训师微课记录 ',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainnerSearch" */
        '@/views/TrainerManagement/TeachManagement/TrainnerSearch/MicroClassRecord'
      )
  },
  {
    path: '/LiveRecordS',
    name: '培训师直播记录 ',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainnerSearch" */
        '@/views/TrainerManagement/TeachManagement/TrainnerSearch/LiveRecord'
      )
  },
  {
    path: '/IntegrationConfiguration',
    name: '积分规则',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/IntegrationConfiguration'
      )
  },
  {
    path: '/LegalHoliday',
    name: '法定节假日',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/LegalHoliday/LegalHoliday'
      )
  },
  {
    path: '/PointManagement',
    name: '积分管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/PointManagement/PointManagement'
      )
  },
  {
    path: '/PointCalculate',
    name: '积分计算',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/PointManagement/PointCalculate'
      )
  },
  {
    path: '/PointRecord',
    name: '积分补录',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/PointManagement/PointRecord'
      )
  },
  {
    path: '/PointSummaryReport',
    name: '积分汇总表',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/PointManagement/PointSummaryReport'
      )
  },
  {
    path: '/PointDetailReport',
    name: '积分明细表',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/PointManagement/PointDetailReport'
      )
  },
  {
    path: '/AddPointRecord',
    name: '新增积分补录',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/PointManagement/AddPointRecord'
      )
  },
  {
    path: '/YBLecturerManagement',
    name: '银保培训管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBLecturerManagement'
      )
  },
  {
    path: '/YBLecturerInfo',
    name: '银保讲师信息管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBLecturerInfo'
      )
  },
  {
    path: '/EditYBLecturerInfo',
    name: '编辑银保讲师',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditYBLecturerInfo'
      )
  },
  {
    path: '/YBLecturerLecturesShare',
    name: '银保讲师授课/分享管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBLecturerLecturesShare'
      )
  },
  {
    path: '/EditYBLecturerLecturesShare',
    name: '编辑银保讲师授课/分享',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditYBLecturerLecturesShare'
      )
  },
  {
    path: '/EditYBLLS',
    name: '编辑讲师授课/分享',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditYBLLS'
      )
  },
  {
    path: '/YBLecturerCurricularRD',
    name: '银保讲师课程研发管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBLecturerCurricularRD'
      )
  },
  {
    path: '/EditYBLecturerCurricularRD',
    name: '编辑银保讲师课程研发管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditYBLecturerCurricularRD'
      )
  },
  {
    path: '/ImportFromPXB',
    name: '从培训班导入',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/ImportFromPXB'
      )
  },
  {
    path: '/BranchOfCourse',
    name: '分行培训班管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/BranchOfCourse'
      )
  },
  {
    path: '/EditBranchOfCourse',
    name: '编辑分行培训班管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditBranchOfCourse'
      )
  },
  {
    path: '/YBLecturerEmpowerManagement',
    name: '讲师授权管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBLecturerEmpowerManagement'
      )
  },
  {
    path: '/ImportFromNPXB',
    name: '从培训班导入New',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/ImportFromNPXB'
      )
  },
  {
    path: '/AssociatedWithLLS',
    name: '关联银保讲师授课/分享管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/AssociatedWithLLS'
      )
  },
  {
    path: '/YBStudentManagement',
    name: '管理学员',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBStudentManagement'
      )
  },
  {
    path: '/EditYBStudentManagement',
    name: '编辑管理学员',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditYBStudentManagement'
      )
  },
  {
    path: '/YBTrainHonor',
    name: '银保培训荣誉管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBTrainHonor'
      )
  },
  {
    path: '/EditYBTrainHonor',
    name: '编辑银保培训荣誉管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditYBTrainHonor'
      )
  },
  {
    path: '/YBTrainHonorCategory',
    name: '银保培训荣誉类别管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBTrainHonorCategory'
      )
  },
  {
    path: '/EditYBTrainHonorCategory',
    name: '编辑银保培训荣誉类别管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditYBTrainHonorCategory'
      )
  },
  {
    path: '/ZNCourseCatalogue',
    name: '知鸟课程目录',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/ZNCourseCatalogue'
      )
  },
  {
    path: '/EditZNCourseCatalogue',
    name: '编辑知鸟课程目录',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditZNCourseCatalogue'
      )
  },
  {
    path: '/ZNBusinessZone',
    name: '知鸟业务专区',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/ZNBusinessZone'
      )
  },
  {
    path: '/EditZNBusinessZone',
    name: '编辑知鸟业务专区',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditZNBusinessZone'
      )
  },
  {
    path: '/OfficeStaffHR',
    name: '内勤人力清单',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/OfficeStaffHR'
      )
  },
  {
    path: '/EditOfficeStaffHR',
    name: '编辑内勤人力清单',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditOfficeStaffHR'
      )
  },
  {
    path: '/GoodCourseSuggest',
    name: '好课推荐管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/GoodCourseSuggest'
      )
  },
  {
    path: '/YBImportCourse',
    name: '导入课程',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/YBImportCourse'
      )
  },
  {
    path: '/ImportLiveBroadcast',
    name: '导入直播',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/ImportLiveBroadcast'
      )
  },
  {
    path: '/TrainExpressManagement',
    name: '培训速递内容管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/TrainExpressManagement'
      )
  },
  {
    path: '/EditTrainExpressManagement',
    name: '编辑培训速递内容管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditTrainExpressManagement'
      )
  },
  {
    path: '/PublishSummarize',
    name: '发布总结管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/PublishSummarize'
      )
  },
  {
    path: '/EditPublishSummarize',
    name: '编辑发布总结管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditPublishSummarize'
      )
  },
  {
    path: '/LearningSpecialTopic',
    name: '学习专题管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/LearningSpecialTopic'
      )
  },
  {
    path: '/EditLearningSpecialTopic',
    name: '编辑学习专题管理',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditLearningSpecialTopic'
      )
  },
  {
    path: '/EditLearningSpecialTopicCourse',
    name: '配置课程',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/EditLearningSpecialTopicCourse'
      )
  },
  {
    path: '/ContinuingEducationLearningDetail',
    name: '继续教育学习明细',
    meta: '培训师管理',
    component: () =>
      import(
        /* webpackChunkName: "TrainerManagement" */
        '@/views/TrainerManagement/YBLecturerManagement/ContinuingEducationLearningDetail'
      )
  }
]