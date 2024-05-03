const express = require('express')
const app = express()
const Mock = require('mockjs')
app.post('/fn/system/func/listTemplateName', function (req, res) {
  const data = Mock.mock({
    code: 0,
    'data|18': [
      {
        templateCode: '@id',
        templateName: '@ctitle(6,20)'
      }
    ]
  })
  res.send(data)
})
app.post('/fn/system/roleApply/listSelectRole', function (req, res) {
  const roleName = Mock.mock({
    'roleName|1': '@pick("总行潜才管理员","条线潜才管理员","机构潜才管理员")'
  })
  const data = Mock.mock({
    code: 0,
    data: [
      {
        roleId: '@id',
        roleName: '总行超管',
        orgRequired: 'Y',
      },
      {
        roleId: '@id',
        roleName: '总行潜才管理员',
        orgRequired: 'N',
      },
      {
        roleId: '@id',
        roleName: '条线潜才管理员',
        orgRequired: 'N',
      },
      {
        roleId: '@id',
        roleName: '机构潜才管理员',
        orgRequired: 'N',
      },
    ]
  })
  res.send(data)
})
app.post('/fn/system/flOrgManagement', function(req, res) {
  res.send(Mock.mock({
    code: 0,
    data: {
      "total": 100,
      "list|10": [
        {
          orgId: '@id',
          orgName: '@ctitle(6,20)',
          chidren: '@ctitle(6,20)',
          "statusName|1": ['启用', '不启用'],
          createBy: '@cname',
          createByDate: '@date',
          updateBy: '@cname',
          updateByDate: '@date',
        }
      ]
    }
  }))
})

module.exports = app