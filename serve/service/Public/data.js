const express = require('express')
const app = express()
const Mock = require('mockjs')
app.post('/fn/user/selectLoginUserInfo', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      empName: '@cname',
      menuInfoList: []
    }
  })
  res.send(data)
})
app.post('/fn/user/selectAllTree', function (req, res) {
  const busiTypeMap = {
    LS: ['总行大零售', "平安银行基础零售事业部","平安银行综合金融拓展部","平安银行零售信贷事业部","平安银行运营管理部"],
    FL: ['平安银行分行', "平安银行物业","平安银行友银金融","平安银行综金服务支持中心","平安银行总行"],
    JF: ['金服银行科技中心','金服银行科技中心1','金服银行科技中心2','金服银行科技中心3','金服银行科技中心4'],
    CX: ['橙信科技','橙信科技1','橙信科技2','橙信科技3','橙信科技4']
  }
  const dataOne = Mock.mock({
    code: 0,
    data: [
      {
        busiType: req.body.busiType,
        orgList: [
          {
            createdBy: null,
            updatedBy: null,
            createdDate: null,
            updatedDate: null,
            orgId: '@id',
            'orgName|1': busiTypeMap[req.body.busiType],
            blgStripLine: req.body.busiType,
            lateFixNode: null,
            allPrnNode: null,
            prnOrgId: null,
            orgLvl: null,
            pageSort: null,
            prnPageSort: null,
            ifFixNode: 'Y',
            isChoose: null,
            isSpread: 'Y'
          }
        ]
      }
    ]
  })
  const dataOrg = Mock.mock({
    code: 0,
    data: [
      {
        busiType: req.body.busiType,
        'orgList|8': [
          {
            createdBy: null,
            updatedBy: null,
            createdDate: null,
            updatedDate: null,
            orgId: '@id',
            'orgName|1': busiTypeMap[req.body.busiType],
            blgStripLine: req.body.busiType,
            lateFixNode: null,
            allPrnNode: null,
            prnOrgId: null,
            orgLvl: null,
            pageSort: null,
            prnPageSort: null,
            ifFixNode: 'Y',
            isChoose: null,
            isSpread: 'Y'
          }
        ]
      }
    ]
  })
  res.send(req.body.orgId ? dataOrg : dataOne)
})
module.exports = app