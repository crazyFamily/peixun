export default [
  {
    path: '/StudentDataDashboard',
    name: '学员数据看板',
    meta: '新人培养管理',
    component: () =>
      import(
        /* webpackChunkName: "NewPeopleTrainingManagement" */
        '@/views/NewPeopleTrainingManagement/StudentDataDashboard/StudentDataDashboard'
      )
  },
  {
    path: '/StudentRecruitment',
    name: '学员招募',
    meta: '新人培养管理',
    component: () =>
      import(
        /* webpackChunkName: "NewPeopleTrainingManagement" */
        '@/views/NewPeopleTrainingManagement/StudentRecruitment/StudentRecruitment'
      )
  },
  {
    path: '/StudentRegistration',
    name: '学员报名',
    meta: '新人培养管理',
    component: () =>
      import(
        /* webpackChunkName: "NewPeopleTrainingManagement" */
        '@/views/NewPeopleTrainingManagement/StudentRegistration/StudentRegistration'
      )
  },
  {
    path: '/OfflineOperation',
    name: '培养管理',
    meta: '新人培养管理',
    component: () =>
      import(
        /* webpackChunkName: "NewPeopleTrainingManagement" */
        '@/views/NewPeopleTrainingManagement/OfflineOperation/OfflineOperation'
      )
  },
  {
    path: '/OfflineOperationDetail',
    name: '查看学员培养评价',
    meta: '新人培养管理',
    component: () =>
      import(
        /* webpackChunkName: "NewPeopleTrainingManagement" */
        '@/views/NewPeopleTrainingManagement/OfflineOperation/OfflineOperationDetail'
      )
  },
  {
    path: '/AddStudentRegistration',
    name: '添加/编辑学员',
    meta: '新人培养管理',
    component: () =>
      import(
        /* webpackChunkName: "NewPeopleTrainingManagement" */
        '@/views/NewPeopleTrainingManagement/StudentRegistration/AddStudentRegistration'
      )
  },
  {
    path: '/AddBatchStudentRegistration',
    name: '批量添加学员',
    meta: '新人培养管理',
    component: () =>
      import(
        /* webpackChunkName: "NewPeopleTrainingManagement" */
        '@/views/NewPeopleTrainingManagement/StudentRegistration/AddBatchStudentRegistration'
      )
  }
]