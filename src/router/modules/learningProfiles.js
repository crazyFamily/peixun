export default [
    {
      path: '/EmployeeFiles',
      name: '我的档案',
      meta: '学习档案',
      component: () =>
        import(
          /* webpackChunkName: "EmployeeFiles" */
          '@/views/LearningProfiles/EmployeeFiles/EmployeeFiles'
        )
    },
    {
      path: '/TotalDocuments',
      name: '学员档案',
      meta: '学习档案',
      component: () =>
        import(
          /* webpackChunkName: "TotalDocuments" */
          '@/views/LearningProfiles/TotalDocuments/TotalDocuments'
        )
    },
    // {
    //   path: '/TrainingPlanConfiguration',
    //   name: '学员档案',
    //   meta: '学习档案',
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "TrainingPlanConfiguration" */
    //       '@/views/SchoolRecruitmentManagement/TrainingPlanConfiguration/TrainingPlanConfiguration'
    //     )
    // }
  ]