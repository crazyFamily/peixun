export default [
  {
    path: '/CRCurriculumManagement',
    name: '课程管理',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/CurriculmManagement/CurriculumManagement'
      )
  },
  {
    path: '/CRPushRecord',
    name: '推送记录',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/PushRecord'
      )
  },
  {
    path: '/CRNewCourse',
    name: '新增课程',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/CurriculmManagement/NewCourse'
      )
  },
  {
    path: '/CRPreviewCourse',
    name: '课程详情',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/CurriculmManagement/Preview'
      )
  },
  {
    path: '/CRLecturerManagement',
    name: '讲师管理',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/LecturerManagement/TrainLecturerManagement'
      )
  },
  {
    path: '/CRAddTrainer',
    name: '新增讲师',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/LecturerManagement/AddTrainer'
      )
  },
  {
    path: '/CRTrainerInfo',
    name: '讲师详情',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/LecturerManagement/TrainerInfo'
      )
  },
  {
    path: '/CRProjectManagement',
    name: '课程包管理',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/ProjectManagement/ProjectManagement'
      )
  },
  {
    path: '/CRExercisesBookMg',
    name: '习题库管理',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/ExercisesBookMg/ExercisesBookMg'
      )
  },
  {
    path: '/CRExercisePackageMg',
    name: '习题包管理',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/ExercisePackageMg/ExercisePackageMg'
      )
  },
  {
    path: "/CRExaminationMg",
    name: "考试管理",
    meta: "智能推课",
    component: () =>
        import(
            /* webpackChunkName: "CourseRecommendation" */
            "@/views/CourseRecommendation/ExercisePackageMg/ExaminationMg"
        ),
  },
  {
    path: "/CRExaminationAdd",
    name: "新增考试",
    meta: "智能推课",
    component: () =>
        import(
            /* webpackChunkName: "CourseRecommendation" */
            "@/views/CourseRecommendation/ExercisePackageMg/ExaminationAdd"
        ),
  },
  {
    path: "/CRExaminationStatistics",
    name: "考试统计",
    meta: "智能推课",
    component: () =>
        import(
            /* webpackChunkName: "CourseRecommendation" */
            "@/views/CourseRecommendation/ExercisePackageMg/ExaminationStatistics"
        ),
  },
  {
    path: "/CRRelatedCourse",
    name: "关联课程",
    meta: "智能推课",
    component: () =>
        import(
            /* webpackChunkName: "CourseRecommendation" */
            "@/views/CourseRecommendation/ExercisePackageMg/RelatedCourse"
        ),
  },
  {
    path: '/CRNewExercisePackage',
    name: '新增习题包',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/ExercisePackageMg/NewExercisePackage'
      )
  },
  {
    path: '/CRExercisePackageDetail',
    name: '习题包习题列表',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/ExercisePackageMg/ExercisePackageDetail'
      )
  },
  {
    path: '/CRExercisePackageAdd',
    name: '添加习题',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/ExercisePackageMg/ExercisePackageAdd'
      )
  },
  {
    path: '/CRNewProject',
    name: '新增课程包',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/ProjectManagement/NewProject'
      )
  },
  {
    path: '/CRPreviewProject',
    name: '课程包详情',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/ProjectManagement/Preview'
      )
  },
  {
    path: '/CRLiveBroadcast',
    name: '直播管理',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/LiveBroadcast/LiveBroadcastManagement'
      )
  },
  {
    path: '/CRNewLiveBroadcast',
    name: '新增直播',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/LiveBroadcast/NewLiveBroadcast'
      )
  },
  {
    path: '/CRPreviewLive',
    name: '直播详情',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/LiveBroadcast/Preview'
      )
  },
  {
    path: '/CRSeriesInfo',
    name: '系列详情',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/LiveBroadcast/SeriesInfo'
      )
  },
  {
    path: '/CRSuperTubeCenter',
    name: '超管中心',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/SuperTubeCenter/SuperTubeCenter'
      ),
    children: [
      {
        path: '/CRExclusiveRecommendation',
        name: '专属推荐',
        meta: '智能推课',
        component: () =>
          import(
            /* webpackChunkName: "CourseRecommendation" */
            '@/views/CourseRecommendation/SuperTubeCenter/ExclusiveRecommendation/ExclusiveRecommendation'
          )
      },
      {
        path: '/CRNewExclusiveRecommendation',
        name: '新增专属推荐',
        meta: '智能推课',
        component: () =>
          import(
            /* webpackChunkName: "CourseRecommendation" */
            '@/views/CourseRecommendation/SuperTubeCenter/ExclusiveRecommendation/NewExclusiveRecommendation'
          )
      },
      {
        path: '/CRNewFindGoodLesson',
        name: '新增发现好课',
        meta: '智能推课',
        component: () =>
          import(
            /* webpackChunkName: "CourseRecommendation" */
            '@/views/CourseRecommendation/SuperTubeCenter/FindGoodLesson/NewFindGoodLesson'
          )
      },
    ]
  },
  {
    path: "/CRTrainingCampMg",
    name: "训练营管理",
    meta: "智能推课",
    component: () =>
        import(
            /* webpackChunkName: "CourseRecommendation" */
            "@/views/CourseRecommendation/TrainingCampMg/TrainingCampList"
        ),
  },
  {
    path: "/CRTrainingCampStatistics",
    name: "训练营数据统计",
    meta: "智能推课",
    component: () =>
        import(
            /* webpackChunkName: "CourseRecommendation" */
            "@/views/CourseRecommendation/TrainingCampMg/TrainingStatistics"
        ),
  },
  {
    path: "/CRTrainingCampEditor",
    name: "编辑训练营",
    meta: "智能推课",
    component: () =>
        import(
            /* webpackChunkName: "CourseRecommendation" */
            "@/views/CourseRecommendation/TrainingCampMg/TrainingCampEditor"
        ),
  },
  {
    path: "/CRAttendanceManagement",
    name: "智推考勤管理",
    meta: "智能推课",
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        "@/views/CourseRecommendation/AttendanceManagement/AttendanceManagement"
      ),
  },
  {
    path: '/CRStartAttendance',
    name: '智推开始考勤',
    meta: '智能推课',
    component: () =>
      import(
        /* webpackChunkName: "CourseRecommendation" */
        '@/views/CourseRecommendation/AttendanceManagement/StartAttendance'
      )
  },
  {
    path: "/CRNoteManagement",
    name: "评论管理",
    meta: "智能推课",
    component: () =>
        import(
            "@/views/CourseRecommendation/NoteManagement/NoteList"
        ),
  },
  {
    path: "/CRNoteDetail",
    name: "笔记详情",
    meta: "智能推课",
    component: () =>
        import(
            "@/views/CourseRecommendation/NoteManagement/NoteDetail"
        ),
  },
]