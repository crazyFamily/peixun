export default [
    {
      path: '/SystemManagementApplication',
      name: '角色申请',
      meta: '系统管理',
      component: () =>
        import(
          /* webpackChunkName: "SystemManagement" */
          '@/views/SystemManagement/RoleApplication'
        )
    },
    {
      path: '/MenuManagement',
      name: '菜单管理',
      meta: '系统管理',
      component: () =>
        import(
          /* webpackChunkName: "SystemManagement" */
          '@/views/SystemManagement/BackstageManagement/MenuManagement'
        )
    },
    {
      path: '/SystemManagementDict',
      name: '字典表管理',
      meta: '系统管理',
      component: () =>
        import(
          /* webpackChunkName: "SystemManagement" */
          '@/views/SystemManagement/DataDict'
        )
    },
    {
      path: '/LsOrgManagement',
      name: '零售机构树管理',
      meta: '系统管理',
      component: () =>
        import(
          /* webpackChunkName: "LsOrgManagement" */
          '@/views/SystemManagement/LsOrgManagement'
        )
    },
    {
      path: '/TemplateManagement',
      name: '模板管理',
      meta: '系统管理',
      component: () =>
        import(
          /* webpackChunkName: "SystemManagement" */
          '@/views/SystemManagement/TemplateManagement'
        )
    },
    {
      path: '/ApprovalRoleManagement',
      name: '审批连角色管理',
      meta: '系统管理',
      component: () =>
        import(
          /* webpackChunkName: "SystemManagement" */
  
          '@/views/SystemManagement/ApprovalRoleManagement'
        )
    },
    {
      path: '/AuthorityAssignment',
      name: '权限查询与分配',
      meta: '系统管理',
      component: () =>
        import(
          /* webpackChunkName: "SystemManagement" */
  
          '@/views/SystemManagement/AuthorityAssignment'
        )
    },
    {
        path: '/ApprovalStudentManagement',
        name: '审批链人员管理',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
    
            '@/views/SystemManagement/ApprovalStudentManagement'
          )
      },
      {
        path: '/PersonnelManagement',
        name: '人员管理',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
    
            '@/views/SystemManagement/PersonnelManagement'
          )
      },
      {
        path: '/RoleMenuManagement',
        name: '角色菜单管理',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
    
            '@/views/SystemManagement/RoleMenuManagement'
          )
      },
      {
        path: '/RoleFunctionManagement',
        name: '角色功能管理',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
    
            '@/views/SystemManagement/RoleFunctionManagement'
          )
      },
      {
        path: '/RoleJurisdiction',
        name: '角色权限管理',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
    
            '@/views/SystemManagement/RoleJurisdiction'
          )
      },
      {
        path: '/EmailManagement',
        name: '邮件发送记录',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
    
            '@/views/SystemManagement/EmailManagement'
          )
      },
      {
        path: '/MoreManagementSetings',
        name: '更多系统配置',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
    
            '@/views/SystemManagement/MoreManagementSetings'
          )
      },
      {
        path: '/UserFeedback',
        name: '用户反馈',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
            '@/views/SystemManagement/UserFeedback/UserFeedback'
          )
      },
      {
        path: '/FeedbackInfo',
        name: '用户反馈/查看详情',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
            '@/views/SystemManagement/UserFeedback/FeedbackInfo'
          )
      }, // LaunchSetupManagement
      {
        path: '/LaunchSetupManagement',
        name: '功能开关',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
            '@/views/SystemManagement/LaunchSetupManagement/LaunchSetupList'
          )
      },
      {
        path: '/LaunchSetupForm',
        name: '功能开关编辑',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
            '@/views/SystemManagement/LaunchSetupManagement/LaunchSetupForm'
          )
      },
      {
        path: '/ManageCompany',
        name: '管理单位管理',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
            '@/views/SystemManagement/ManageCompany/ManageCompanyList'
          )
      },
      {
        path: '/ManageCompanyForm',
        name: '新增管理单位',
        meta: '系统管理',
        component: () =>
          import(
            /* webpackChunkName: "SystemManagement" */
            '@/views/SystemManagement/ManageCompany/ManageCompanyForm'
          )
      },
    ]
          