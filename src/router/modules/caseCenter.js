export default [
    {
      path: '/HomePageSetting',
      name: '首页设置',
      meta: '案例中心',
      component: () =>
        import(
          /* webpackChunkName: "CaseCenter" */
          // '@/views/CaseCenter/HomePageSetting/HomePageSetting'
          // '@/views/CaseCenter/HomePageSetting/case/HomePageSetting'
          '@/views/CaseCenter/HomePageSetting/Index'
        )
    },
    // {
    //   path: '/HomePageSetting2',
    //   name: '首页设置2',
    //   meta: '案例中心',
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "CaseCenter" */
    //       // '@/views/CaseCenter/HomePageSetting2/HomePageSetting'
    //       '@/views/CaseCenter/HomePageSetting2/Index'
    //     )
    // },
    // {
    //   path: '/HomePageSetting3',
    //   name: '首页设置3',
    //   meta: '案例中心',
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "CaseCenter" */
    //       // '@/views/CaseCenter/HomePageSetting2/HomePageSetting'
    //       '@/views/CaseCenter/HomePageSetting3/HomePageSetting'
    //     )
    // },
    {
      path: '/CaseManagement',
      name: '案例管理',
      meta: '案例中心',
      component: () =>
        import(
          /* webpackChunkName: "CaseCenter" */
          '@/views/CaseCenter/CaseManagement/CaseManagement'
        )
    },
    {
      path: '/NewCase',
      name: '新增案例',
      meta: '案例中心',
      component: () =>
        import(
          /* webpackChunkName: "CaseCenter" */
          '@/views/CaseCenter/CaseManagement/NewCase'
        )
    },
    {
        path: '/CaseLabelManage',
        name: '案例标签管理',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/CaseLabelManage/CaseLabelManage'
          )
      },
      {
        path: '/SpecialManage',
        name: '案例专题',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/SpecialManage/index'
          )
      },
      {
        path: '/ZnSpecialManage',
        name: '知鸟课程专题',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/ZnSpecialManage/index'
          )
      },
      {
        path: '/AddSpecial',
        name: '新增专题',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/SpecialManage/AddSpecial'
          )
      },
      {
        path: '/EditBanner',
        name: '编辑banner',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/HomePageSettingCase/EditBanner'
          )
      },
      {
        path: '/casePreview',
        name: '查看案例',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/CaseManagement/casePreview'
          )
      },
      {
        path: '/caseReport',
        name: '案例报表',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/CaseReport/CaseReportIndex'
          )
      },
      {
        path: '/CasePush',
        name: '案例推送',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/CasePush/CasePush'
          ),
        redirect: '/CasePushList',
        children: [
          {
            path: '/CasePushList',
            name: '案例推送列表',
            meta: '案例中心',
            component: () =>
              import(
                /* webpackChunkName: "CaseCenter" */
                '@/views/CaseCenter/CasePush/CasePushList'
              )
          },
          {
            path: '/AddCasePush',
            name: '新增案例推送',
            meta: '案例中心',
            component: () =>
              import(
                /* webpackChunkName: "CaseCenter" */
                '@/views/CaseCenter/CasePush/AddCasePush'
              )
          },
          {
            path: '/CasePushEmailTemp',
            name: '案例推送邮件模板',
            meta: '案例中心',
            component: () =>
              import(
                /* webpackChunkName: "CaseCenter" */
                '@/views/CaseCenter/CasePush/CasePushEmailTemp'
              )
          },
          {
            path: '/CasePushRule',
            name: '案例推送规则',
            meta: '案例中心',
            component: () =>
              import(
                /* webpackChunkName: "CaseCenter" */
                '@/views/CaseCenter/CasePush/CasePushRule'
              )
          },
          {
            path: '/CasePushImport',
            name: '案例推送导入',
            meta: '案例中心',
            component: () =>
              import(
                /* webpackChunkName: "CaseCenter" */
                '@/views/CaseCenter/CasePush/CasePushImport'
              )
          },
          {
            path: '/CasePushReport',
            name: '案例推送报表',
            meta: '案例中心',
            component: () =>
              import(
                /* webpackChunkName: "CaseCenter" */
                '@/views/CaseCenter/CasePushReport/CasePushReport'
              )
          }
        ]
      },
      {
        path: '/CaseEvent',
        name: '案例活动',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/CaseEvent/CaseEvent'
          )
      },
      {
        path: '/ActivityData',
        name: '活动数据',
        meta: '案例中心',
        component: () =>
          import(
            /* webpackChunkName: "CaseCenter" */
            '@/views/CaseCenter/ActivityData/ActivityData'
          )
      }
    ]
              