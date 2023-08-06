export default [
    {
      path: '/EstablishProject',
      name: '培训项目立项',
      meta: '培训项目管理',
      component: () =>
        import(
          /* webpackChunkName: "EstablishProject" */
          '@/views/Establish/EstablishManagement/EstablishProject'
        )
    },
    {
      path: '/AddEstablishProject',
      name: '新增立项',
      meta: '培训项目管理',
      component: () =>
        import(
          /* webpackChunkName: "EstablishProject" */
          '@/views/Establish/EstablishManagement/AddEstablishProject'
        )
    },
    {
      path: '/PreviewEstablishProject',
      name: '查看立项',
      meta: '培训项目管理',
      component: () =>
        import(
          /* webpackChunkName: "EstablishProject" */
          '@/views/Establish/EstablishManagement/PreviewEstablishProject'
        )
    },
    {
      path: '/TrainingCourseManagement',
      name: '培训班管理',
      meta: '培训项目管理',
      component: () =>
        import(
          /* webpackChunkName: "EstablishProject" */
          '@/views/Establish/TrainingCourseManagement/TrainingCourseManagement'
        )
    },
    {
      path: '/TrainingCourseSeeEdit',
      name: '培训班编辑',
      meta: '培训项目管理',
      component: () =>
        import(
          /* webpackChunkName: "EstablishProject" */
          '@/views/Establish/TrainingCourseManagement/TrainingCourseSeeEdit'
        )
    },
    {
      path: '/CustomQuestinnaire',
      name: '自定义问卷',
      meta: '培训项目管理',
      component: () =>
        import(
          /* webpackChunkName: "EstablishProject" */
          '@/views/Establish/TrainingCourseManagement/CustomQuestionnaire'
        )
    },
    {
        path: '/TrainingCourseDetail',
        name: '培训班查看',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/TrainingCourseManagement/TrainingCourseDetail'
          )
      },
      {
        path: '/NotTrainingCourseManagement',
        name: '非培训班管理',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/NotTrainingCourseManagement'
          )
      },
      {
        path: '/StartAttendance',
        name: '开始考勤',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/TrainingCourseManagement/StartAttendance'
          )
      },
      {
        path: '/AttendanceManagement',
        name: '考勤管理',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/TrainingCourseManagement/AttendanceManagement'
          )
      },
      {
        path: '/TrainingCourseAssessment',
        name: '培训班管理/培训班评估',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/TrainingCourseManagement/TrainingCourseAssessment'
          )
      },
      {
        path: '/InputAfterTraning',
        name: '训后录入',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/TrainingCourseManagement/InputAfterTraning'
          )
      },
      {
        path: '/NewThankLetter',
        name: '创建感谢函',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/TrainingCourseManagement/NewThankLetter'
          )
      },
      {
        path: '/TrainingCoursePigeonhole',
        name: '培训班归档',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/TrainingCourseManagement/TrainingCoursePigeonhole'
          )
      },
      {
        path: '/StudentNotification',
        name: '通知编辑',
        meta: '培训项目管理',
        component: () =>
          import(
            /* webpackChunkName: "EstablishProject" */
            '@/views/Establish/TrainingCourseManagement/StudentNotification'
          )
      },
      
    ]
          