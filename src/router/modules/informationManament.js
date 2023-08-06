export default [
    {
      path: '/InformationManament',
      name: '资讯管理',
      meta: '首页运营',
      component: () =>
        import(
          /* webpackChunkName: "InformationManament" */
          '@/views/InformationManament/Index'
        )
    },
    {
      path: '/NewAppInfo',
      name: '新增/编辑APP资讯',
      meta: '首页运营',
      component: () =>
        import(
          /* webpackChunkName: "InformationManament" */
          '@/views/InformationManament/NewAppInfo'
        )
    },
    {
      path: '/NewPCInfo',
      name: '新增/编辑PC首页资讯',
      meta: '首页运营',
      component: () =>
        import(
          /* webpackChunkName: "InformationManament" */
          '@/views/InformationManament/NewPCInfo'
        )
    },
    {
      path: '/NewSystemLog',
      name: '新增/编辑系统更新日志',
      meta: '首页运营',
      component: () =>
        import(
          /* webpackChunkName: "InformationManament" */
          '@/views/InformationManament/NewSystemLog'
        )
    }
  ]
  