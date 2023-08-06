export default [
    {
      path: '/InternalCurriculumManagement',
      name: '内部课程管理',
      meta: '课程管理',
      component: () =>
        import(
          /* webpackChunkName: "CurriculumManagement" */
          '@/views/CurriculumManagement/InternalCurriculum'
        )
    },
    {
      path: '/ExternalCurriculumManagement',
      name: '外部课程管理',
      meta: '课程管理',
      component: () =>
        import(
          /* webpackChunkName: "CurriculumManagement" */
          '@/views/CurriculumManagement/ExternalCurriculum'
        )
    },
    {
      path: '/CurriculuLabelManagement',
      name: '课程标签管理',
      meta: '课程管理',
      component: () =>
        import(
          /* webpackChunkName: "CurriculumManagement" */
          '@/views/CurriculumManagement/LabelManagement'
        )
    },
    {
      path: '/CurriculumStorageManagement',
      name: '课程入库管理',
      meta: '课程管理',
      component: () =>
        import(
          /* webpackChunkName: "CurriculumManagement" */
          '@/views/CurriculumManagement/CurriculumStorageManagement'
        )
    },
    {
      path: '/ZnCourseStorageManagement',
      name: '知鸟课程存档',
      meta: '课程管理',
      component: () =>
        import(
          /* webpackChunkName: "CurriculumManagement" */
          '@/views/CurriculumManagement/ZnCourseStorageManagement'
        )
    },
    {
      path: '/CurriculumStorage',
      name: '课程入库',
      meta: '课程管理',
      component: () =>
        import(
          /* webpackChunkName: "CurriculumManagement" */
          '@/views/CurriculumManagement/CurriculumStorage'
        )
    },
    {
      path: '/addCurriculum',
      name: '新增/修改课程',
      meta: '课程管理',
      component: () =>
        import(
          /* webpackChunkName: "CurriculumManagement" */
          '@/views/CurriculumManagement/addCurriculum'
        )
    },
    {
      path: '/LadderManagenebt',
      name: '阶梯培训管理',
      meta: '课程管理',
      component: () =>
        import(
          /* webpackChunkName: "CurriculumManagement" */
          '@/views/CurriculumManagement/LadderManagenebt'
        )
    }
  ]
  