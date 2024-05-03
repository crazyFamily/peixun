const express = require('express')
const app = express()
const Mock = require('mockjs')

app.post('/fn/plan/annual/listDeptDispensePlan', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      'list|10': [
        {
          blgDept: '@id',
          blgDeptName: '@ctitle',
          'dispensePlanNum|1-1000': 1000,
          'dispenseNum|1-1000': 1000,
          'holdNum|1-1000': 100,
          'holdRate|1-100': 100
        }
      ],
      total: 20,
      page: 1,
      size: 10
    }
  })
  res.send(data)
})
app.post('/fn/plan/annual/deptDispensePlanDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      'list|10': [
        {
          annualPlanId: '@id',
          annualPlanName: '@ctitle',
          className: '@ctitle',
          channelTypeDesc: '@ctitle',
          keyJobsDesc: '@ctitle',
          trainSeriesDesc: '@ctitle',
          childSeriesDesc: '@ctitle',
          'dispenseNum|1-1000': 1000,
          'holdNum|1-1000': 100,
          updatedByName: '@ctitle',
          blgDeptName: '@ctitle'
        }
      ],
      total: 7619,
      page: 1,
      size: 10
    }
  })
  res.send(data)
})


module.exports = app