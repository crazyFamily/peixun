export default [
  {
    path: '/TrainingCourse',
    name: '培训班费用报销',
    meta: '报销中心',
    component: () =>
      import(
        /* webpackChunkName: "Reimbursement" */
        '@/views/Reimbursement/TrainingCourse'
      )
  },
  {
    path: '/NonTrainingCourse',
    name: '非培训班费用报销',
    meta: '报销中心',
    component: () =>
      import(
        /* webpackChunkName: "Reimbursement" */
        '@/views/Reimbursement/NonTrainingCourse'
      )
  },
  {
    path: '/MyReimbursement',
    name: '我的报销',
    meta: '报销中心',
    component: () =>
      import(
        /* webpackChunkName: "Reimbursement" */
        '@/views/Reimbursement/My'
      )
  },
  {
    path: '/LaunchReimbursement',
    name: '发起报销',
    meta: '报销中心',
    component: () =>
      import(
        /* webpackChunkName: "Reimbursement" */
        '@/views/Reimbursement/LaunchReimbursement'
      )
  },
  {
    path: '/ViewReimbursement',
    name: '查看报销',
    meta: '报销中心',
    component: () =>
      import(
        /* webpackChunkName: "Reimbursement" */
        '@/views/Reimbursement/ViewReimbursement'
      )
  },
  {
    path: '/ReimburseExpenses',
    name: '机构报销费用查询',
    meta: '报销中心',
    component: () =>
      import(
        /* webpackChunkName: "Reimbursement" */
        '@/views/Reimbursement/ReimburseExpenses'
      )
  }
]