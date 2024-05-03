const express = require('express')
const app = express()
const Mock = require('mockjs')

app.post('/fn/plan/annual/dispensePlanDetail', function (req, res) {
  let data = Mock.mock({
    code: 0,
    data: {
      // 计划id
      annualPlanId: '@id',
      // 计划名称
      annualPlanName: '@cname',
      // 机构名称
      blgDeptName: '@cword',
      // 业务模块
      channelTypeDesc: '@cword',
      // 关键岗位
      keyJobsDesc: '@cword',
      // 培训系列
      trainSeriesDesc: '@cword',
      // 子系列
      childSeriesDesc: '@cword',
      // 总期数
      termNum: '@integer(0, 20)',
      // 每期天数
      dayNum: '@integer(0, 20)',
      // 每期人数
      studentNum: '@integer(0, 20)',
      // 总费用
      totalFee: '@integer(0, 20)',
      // 已分配期数
      dispenseNum: '@integer(0, 20)',
      // 剩余期数
      remainNum: '@integer(0, 20)'
    }
  })
  res.send(data)
})

app.post('/fn/plan/annual/queryDispensePlanPage', function (req, res) {
  let data = Mock.mock({
    code: 0,
    data: {
      'total': 10,
      size: 10,
      page: 1,
      'list|1-10': [
        {
          // id
          id: '@id',
          // 分配单位
          blgDept: '@cword',
          // 分配单位名称
          blgDeptName: '@cname',
          // 分配期数
          dispenseNum: '@integer(0, 20)',
          // 分配时间
          updatedDate: '@date',
          // 分配人um
          updatedBy: '@id',
          // 分配人姓名
          updatedByName: '@cname',
          // 已举办期数
          holdNum: '@integer(0, 20)'
        }
      ]
    }
  })
  res.send(data)
})
app.post('/fn/plan/annual/addDispensePlan', function (req, res) {
  let data = Mock.mock({
    code: 0
  })
  res.send(data)
})

app.post('/fn/plan/month/selectPlanMonthAndAuthority', function (req, res) {
  let data = Mock.mock({
    code: 0,
    data: {
      monthList: [
        { planMonth: '2023-06-01', planMonthName: '2023年6月' },
        { planMonth: '2023-05-01', planMonthName: '2023年5月' },
        { planMonth: '2023-04-01', planMonthName: '2023年4月' },
        { planMonth: '2023-03-01', planMonthName: '2023年3月' },
        { planMonth: '2023-02-01', planMonthName: '2023年2月' },
        { planMonth: '2023-01-01', planMonthName: '2023年1月' },
        { planMonth: '2022-12-01', planMonthName: '2022年12月' }
      ]
    }
  })
  res.send(data)
})


app.post('/fn/plan/month/saveMonthPlanPoster', function (req, res) {
  let data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

app.post('/fn/plan/month/selectMonthPlanPoster', function (req, res) {
  let data = Mock.mock({
    code: 0,
    data: {
      title: '@ctitle',
      content: '@ctitle',
      overview: '@ctitle',
      remark: '@ctitle',
      status: '0|1',
      'branchPlans|1-10': [
        {
          orgId: '机构编码',
          orgName: '机构名称',
          classType: '培训班类型',
          classTypeName: '培训班类型编码',
          planClassName: '培训班名称',
          attendObject: '培训对象',
          trainingMode: '举办形式编码',
          trainingModeDesc: '举办形式',
          startDate: '开始日期',
          endDate: '结束日期',
          executedStatus: '执行状态'
        }
      ],
      'nonBranchPlans|1-10': [
        {
          orgId: '机构编码',
          orgName: '机构名称',
          classType: '培训班类型',
          classTypeName: '培训班类型编码',
          planClassName: '培训班名称',
          attendObject: '培训对象',
          trainingMode: '举办形式编码',
          trainingModeDesc: '举办形式',
          startDate: '开始日期',
          endDate: '结束日期',
          executedStatus: '执行状态'
        }
      ]
    }
  })
  res.send(data)
})



module.exports = app