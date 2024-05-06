export default [
  {
    path: '/LadderInstructorAuthorization',
    name: '阶梯讲师授权',
    meta: '阶梯培训管理',
    component: () =>
      import(
        /* webpackChunkName: "LadderManagement" */
        // '@/views/LadderManagement/LadderInstructorAuthorization/'
        '@/views/LadderManagement/LadderInstructorAuthorization/Index'
      )
  },
  {
    path: '/ScheduleManagmnet',
    name: '课表管理',
    meta: '阶梯培训管理',
    component: () =>
      import(
        /* webpackChunkName: "LadderManagement" */
        '@/views/LadderManagement/ScheduleManagmnet'
      )
  },
  {
    path: '/LadderCourses',
    name: '阶梯课程',
    meta: '阶梯培训管理',
    component: () =>
      import(
        /* webpackChunkName: "LadderManagement" */
        '@/views/LadderManagement/LadderCourses'
      )
  },
  {
    path: '/AddLadderCourses',
    name: '新增/编辑阶梯课程',
    meta: '阶梯培训管理',
    component: () =>
      import(
        /* webpackChunkName: "LabelManagement" */
        '@/views/LadderManagement/AddLadderCouresNew'
      )
  },
  {
    path: "/LadderCoverage",
    name: "岗位阶梯覆盖率报表",
    meta: "报表中心",
    component: () =>
      import(
        /* webpackChunkName: "LadderManagement" */
        // "@/views/LadderManagement/LadderCoverage"
        '@/views/StatementCentre/LadderCoverage/index'
      )
  }
]