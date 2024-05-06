export default [
  {
    path: '/ExampDelayApplication',
    name: '豁免/延期申请',
    meta: '星火计划',
    component: () =>
      import(
        /* webpackChunkName: "SparkProject" */

        '@/views/SparkProject/ExampDelayApplication'
      )
  },
  {
    path: '/StudentManagement',
    name: '申请管理',
    meta: '星火计划',
    component: () =>
      import(
        /* webpackChunkName: "SparkProject" */
        '@/views/SparkProject/StudentManagement'
      )
  }
]