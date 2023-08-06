export default [
    {
      path: '/UserCenter',
      name: '用户中心',
      meta: '用户中心',
      component: () =>
        import(
          /* webpackChunkName: "UserCenter" */
          '@/views/UserCenter/Index'
        )
    }
  ]
  