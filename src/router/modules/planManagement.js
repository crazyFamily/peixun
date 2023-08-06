export default [
    {
      path: '/AnnualPlan',
      name: '年度计划',
      meta: '培训计划管理',
      component: () =>
        import(
          /* webpackChunkName: "PlanManagement" */
          '@/views/PlanManagement/AnnualPlan'
        )
    },
    {
      path: '/MonthlyPlan',
      name: '月度计划',
      meta: '培训计划管理',
      component: () =>
        import(
          /* webpackChunkName: "PlanManagement" */
          '@/views/PlanManagement/MonthlyPlan/index'
        )
    },
    {
      path: '/MonthlyPlanDashboard',
      name: '月度计划看板',
      meta: '培训计划管理',
      component: () =>
        import(
          /* webpackChunkName: "PlanManagement" */
          '@/views/PlanManagement/MonthlyPlanDashboard/MonthlyPlanDashboard'
        )
    },
    {
      path: '/PlanManagement',
      name: '计划管理',
      meta: '培训计划管理',
      component: () =>
        import(
          /* webpackChunkName: "PlanManagement" */
          '@/views/PlanManagement/PlanManagement'
        )
    }
  ]
  