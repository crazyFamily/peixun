export default [
  {
    path: '/StatementCentre',
    name: '报表中心',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre'
      )
  },
  {
    path: '/SubBranchManager',
    name: '支行长培养报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/SubBranchManager/index'
      )
  },
  {
    path: '/TutorAllowance',
    name: '网点孵化导师津贴明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/lecturer/TutorAllowance'
      )
  },
  {
    path: '/TutorAllowanceStatistics',
    name: '网点孵化导师津贴统计表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/lecturer/TutorAllowanceStatistics'
      )
  },
  {
    path: '/LadderCourseRecord',
    name: '讲师授课记录',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/lecturer/LadderCourseRecord/Index'
      )
  },
  {
    path: '/EstablishProjectInventory',
    name: '培训立项清单',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/TrainingCourse/EstablishProjectInventory'
      )
  },
  {
    path: '/ProjectStatistics',
    name: '机构培训项目统计报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/TrainingCourse/ProjectStatistics'
      )
  },
  {
    path: '/StaffPresentTeach',
    name: '员工面授培训明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/TrainingCourse/StaffPresentTeach'
      )
  },
  {
    path: '/KpiTable',
    name: '机构培训KPI报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/TrainingCourse/KpiTable'
      )
  },
  {
    path: '/LiveBroadcastBaseInfo',
    name: '机构直播基本资料报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Indicator/LiveBroadcastBaseInfo'
      )
  },
  {
    path: '/newEmployeeStudy',
    name: '学习任务完成明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Indicator/newEmployeeStudy'
      )
  },
  {
    path: '/CompletionRate',
    name: '各阶段任务完成率统计表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Indicator/CompletionRate'
      )
  },
  {
    path: '/StudyRecord',
    name: '个人学习纪录清单明细报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Indicator/StudyRecord'
      )
  },
  {
    path: '/NewStaffTrain',
    name: '新员工面授培训报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/course/NewStaffTrain'
      )
  },
  {
    path: '/PerCapitaHour',
    name: '机构人均课时报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/SynthesisIndex/PerCapitaHour'
      )
  },
  {
    path: '/OnlineRate',
    name: '线上化率报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/SynthesisIndex/OnlineRate'
      )
  },
  {
    path: '/TrainingCourseLineUsage',
    name: '机构培训班线上使用情况明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/SynthesisIndex/TrainingCourseLineUsage'
      )
  },
  {
    path: '/OrganizationCost',
    name: '机构纬度费用明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/CostKind/OrganizationCost'
      )
  },
  {
    path: '/PersonCost',
    name: '人员纬度费用明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/CostKind/PersonCost'
      )
  },
  {
    path: '/ProjectCost',
    name: '项目纬度费用明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/CostKind/ProjectCost'
      )
  },
  {
    path: '/OnlineStatistic',
    name: '案例学习统计报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/CaseCenter/OnlineStatistic'
      )
  },
  {
    path: '/OrganizationStaff',
    name: '机构员工学时清单明细',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/CostKind/OrganizationStaff'
      )
  },
  {
    path: '/EndAndReimbusementReport',
    name: '项目结训与报销及时性统计表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/CostKind/EndAndReimbusementReport'
      )
  },
  {
    path: '/ConsumerProtectionTrain',
    name: '平安银行消费者权益保护培训台账',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/ConsumerProtection/ConsumerProtectionTrain'
      )
  },
  {
    path: '/JudgesList',
    name: '评委名单管理',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/CaseCenter/JudgesList'
      )
  },
  {
    path: '/CaseScoreDetail',
    name: '案例评价明细报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/CaseCenter/CaseScoreDetail'
      )
  },
  {
    path: '/TrainingPlanReport',
    name: '培训计划明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Training/TrainingPlanReport'
      )
  },
  {
    path: '/ExternalPlanReport',
    name: '计划外培训项目明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Training/ExternalPlanReport'
      )
  },
  {
    path: '/TrainingPlanExecuteReport',
    name: '培训计划执行明细表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Training/TrainingPlanExecuteReport'
      )
  },
  {
    path: '/DeptDispensePlan',
    name: '阶梯培训计划分配报表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Training/DeptDispensePlan'
      )
  },
  {
    path: '/TalentsProgressReport',
    name: '潜才培养进度统计表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/Talents/TalentsProgressReport'
      )
  },
  {
    path: '/TrainingManageReport',
    name: '新人培养管理统计表',
    meta: '报表中心',
    component: () =>
      import(
        /* webpackChunkName: "StatementCentre" */
        '@/views/StatementCentre/NewPeopleTraining/TrainingManageReport'
      )
  }
]