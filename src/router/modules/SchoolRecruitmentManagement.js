export default [
    {
      path: '/RotationTraining',
      name: '轮岗培养',
      meta: '校招轮岗管理',
      component: () =>
        import(
          /* webpackChunkName: "RotationTraining" */
          '@/views/SchoolRecruitmentManagement/RotationTraining/RotationTraining'
        )
    },
    {
      path: '/TrainingPlanConfiguration',
      name: '培养方案配置',
      meta: '校招轮岗管理',
      component: () =>
        import(
          /* webpackChunkName: "TrainingPlanConfiguration" */
          '@/views/SchoolRecruitmentManagement/TrainingPlanConfiguration/TrainingPlanConfiguration'
        )
    }
  ]