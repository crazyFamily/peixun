export default [
    {
      path: '/TanlentsRepository',
      name: '潜才库查询',
      meta: '潜才培养管理',
      component: () =>
        import(
          /* webpackChunkName: "TalentsCultivation" */
          '@/views/TalentsCultivation/TanlentsRepository/TanlentsRepository'
        )
    },
    {
      path: '/TanlentsPermission',
      name: '潜才权限管理',
      meta: '潜才培养管理',
      component: () =>
        import(
          /* webpackChunkName: "TalentsCultivation" */
          '@/views/TalentsCultivation/TanlentsPermission/TanlentsPermission'
        )
    },
    {
      path: '/AddTanlentsPermission',
      name: '新增/编辑潜才权限',
      meta: '潜才培养管理',
      component: () =>
        import(
          /* webpackChunkName: "TalentsCultivation" */
          '@/views/TalentsCultivation/TanlentsPermission/AddTanlentsPermission'
        )
    },
    {
      path: '/TalentsCultivationPlan',
      name: '潜才方案管理',
      meta: '潜才培养管理',
      component: () =>
        import(
          /* webpackChunkName: "TalentsCultivation" */
          '@/views/TalentsCultivation/TalentsCultivationPlan/TalentsCultivationPlan'
        )
    },
    {
      path: '/AddTalentsCultivationPlan',
      name: '潜才培养方案详情',
      meta: '潜才培养管理',
      component: () =>
        import(
          /* webpackChunkName: "TalentsCultivation" */
          '@/views/TalentsCultivation/TalentsCultivationPlan/AddTalentsCultivationPlan'
        )
    },
    {
      path: '/AddTalentsStudent',
      name: '潜才学员详情',
      meta: '潜才培养管理',
      component: () =>
        import(
          /* webpackChunkName: "TalentsCultivation" */
          '@/views/TalentsCultivation/TalentsCultivationPlan/AddTalentsStudent'
        )
    },
    {
      path: '/TanlentsTopicManagement',
      name: '潜才议题创建',
      meta: '潜才培养管理',
      component: () =>
        import(
          /* webpackChunkName: "TalentsCultivation" */
          '@/views/TalentsCultivation/TopicManagement/TanlentsTopicManagement'
        )
    },
    {
        path: '/AddTalentsTopic',
        name: '潜才议题详情',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TopicManagement/AddTalentsTopic'
          )
      },
      {
        path: '/TalentsTopicCheck',
        name: '潜才议题终审',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TopicCheck/TalentsTopicCheck'
          )
      },
      {
        path: '/AddTalentsTopicCheck',
        name: '议题终审详情',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TopicCheck/AddTalentsTopicCheck'
          )
      },
      {
        path: '/AddSupervise',
        name: '议题督办详情',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TopicCheck/AddSupervise'
          )
      },
      {
        path: '/TalentsProgress',
        name: '培养进展管理',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TalentsProgress/TalentsProgress'
          )
      },
      {
        path: '/AddTalentsProgress',
        name: '项目进展收集',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TalentsProgress/AddTalentsProgress'
          )
      },
      {
        path: '/EditTalentsProgress',
        name: '培养进展详情',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TalentsProgress/EditTalentsProgress'
          )
      },
      {
        path: '/TanlentsEvaluation',
        name: '潜才学员评价',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TanlentsEvaluation/TanlentsEvaluation'
          )
      },
      {
        path: '/TanlentsEvaluationDetail',
        name: '潜才学员评价详情',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TanlentsEvaluation/TanlentsEvaluationDetail'
          )
      },
      {
        path: '/AddTanlentsEvaluation',
        name: '学员评价详情',
        meta: '潜才培养管理',
        component: () =>
          import(
            /* webpackChunkName: "TalentsCultivation" */
            '@/views/TalentsCultivation/TanlentsEvaluation/AddTanlentsEvaluation'
          )
      }
    ]
      