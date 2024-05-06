export default [
  {
    path: '/InstructorApplication',
    name: '星级讲师申请',
    meta: '讲师管理',
    component: () =>
      import(
        /* webpackChunkName: "LecturerManagement" */
        '@/views/LecturerManagement/Apply'
      )
  },
  {
    path: '/InstructorSearch',
    name: '讲师查询',
    meta: '讲师管理',
    component: () =>
      import(
        /* webpackChunkName: "LecturerManagement" */
        '@/views/LecturerManagement/Search'
      )
  },
  {
    path: '/InstructorAuthorization',
    name: '讲师授权',
    meta: '讲师管理',
    component: () =>
      import(
        /* webpackChunkName: "LecturerManagement" */
        '@/views/LecturerManagement/Authorization'
      )
  },
  {
    path: '/AuthorizationChildren',
    name: '授权课程讲师',
    meta: '讲师管理|讲师授权',
    component: () =>
      import(
        /* webpackChunkName: "LecturerManagement" */
        '@/views/LecturerManagement/AuthorizationChildren'
      )
  },
  {
    path: '/InstructorEvaluation',
    name: '讲师评聘',
    meta: '讲师管理',
    component: () =>
      import(
        /* webpackChunkName: "LecturerManagement" */
        '@/views/LecturerManagement/Evaluation'
      )
  }
]