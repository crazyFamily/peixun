export default [
    {
      path: '/DataDashboard',
      name: '培训指标',
      meta: '培训指标',
      component: () =>
        import(
          /* webpackChunkName: "DataDashboard" */
          '@/views/DataDashboard'
        )
    }
  ]
  