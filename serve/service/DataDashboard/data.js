const express = require('express')
const app = express()
const Mock = require('mockjs')

app.post('/fn/data/board/classCalendar', function (req, res) {
  const data = Mock.mock({
    code: 0,
    'data': [
      {
        date: '2023-04-01',
        'classNum|1-1000': 1000
      },
      {
        date: '2023-04-10',
        'classNum|1-1000': 1000
      },
      {
        date: '2023-04-15',
        'classNum|1-1000': 1000
      },
      {
        date: '2023-04-17',
        'classNum|1-1000': 1000
      },
      {
        date: '2023-04-23',
        'classNum|1-1000': 1000
      },
      {
        date: '2023-04-25',
        'classNum|1-1000': 1000
      },
      {
        date: '2023-04-26',
        'classNum|1-1000': 1000
      },
      {
        date: '2023-04-27',
        'classNum|1-1000': 1000
      },
      {
        date: '2023-04-28',
        'classNum|1-1000': 1000
      },
    ]
  })
  res.send(data)
})

// 培训计划执行数据统计
app.post('/fn/data/board/statisticPlanInfo', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      classPlan: {
        'totalTerm|1-1000': 1000,
        'executedTerm|1-1000': 1000,
        'executedTermRate|1-100': 100
      },
      nonClassPlan: {
        'totalTerm|1-1000': 1000,
        'executedTerm|1-1000': 1000,
        'executedTermRate|1-100': 100
      }
    }
  })
  res.send(data)
})

// 培训项目数量统计
app.post('/fn/data/board/statisticClassNum', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: [
      {
        year: '2023',
        month: '1月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '2月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '3月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '4月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '5月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '6月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '7月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '8月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '9月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '10月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '11月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '12月',
        'classNum|1-1000': 1000,
        'nonClassNum|1-1000': 1000
      },
    ]
  })
  res.send(data)
})

// 人均学时统计
app.post('/fn/data/board/statisticAvgStudy', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: [
      {
        year: '2023',
        month: '1月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '2月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '3月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '4月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '5月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '6月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '7月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '8月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '9月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '10月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '11月',
        'studyHour|1-1000': 1000
      },
      {
        year: '2023',
        month: '12月',
        'studyHour|1-1000': 1000
      }
    ]
  })
  res.send(data)
})

// 案例产出统计
app.post('/fn/data/board/statisticCaseNum', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: [
      {
        year: '2023',
        month: '1月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '2月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '3月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '4月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '5月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '6月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '7月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '8月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '9月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '10月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '11月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      },
      {
        year: '2023',
        month: '12月',
        'caseNum|1-1000': 1000,
        'perfectCaseNum|1-1000': 1000
      }
    ]
  })
  res.send(data)
})

// 案例学习
app.post('/fn/data/board/statisticCaseStudy', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: [
      {
        year: '2023',
        month: '1月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '2月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '3月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '4月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '5月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '6月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '7月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '8月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '9月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '10月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '11月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      },
      {
        year: '2023',
        month: '12月',
        'studyNum|1-1000': 1000,
        'studyHour|1-24': 24
      }
    ]
  })
  res.send(data)
})

// 培训项目分布统计
app.post('/fn/data/board/statisticClassDistribution', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: [
      {
        classTypeOne: '01001',
        classTypeOneDesc: '培训班',
        classTypeTwo: 'a',
        classTypeTwoDesc: '项目性培训',
        'classNum|10-100': 100
      },
      {
        classTypeOne: '01001',
        classTypeOneDesc: '培训班',
        classTypeTwo: 'b',
        classTypeTwoDesc: '阶梯培训',
        'classNum|10-100': 100
      },
      {
        classTypeOne: '01001',
        classTypeOneDesc: '培训班',
        classTypeTwo: 'c',
        classTypeTwoDesc: '大学专班',
        'classNum|10-100': 100
      },
      {
        classTypeOne: '01002',
        classTypeOneDesc: '非培训班',
        classTypeTwo: 'd',
        classTypeTwoDesc: '读书会',
        'classNum|10-100': 100
      },
      {
        classTypeOne: '01002',
        classTypeOneDesc: '非培训班',
        classTypeTwo: 'e',
        classTypeTwoDesc: '教师节活动',
        'classNum|10-100': 100
      },
      {
        classTypeOne: '01002',
        classTypeOneDesc: '非培训班',
        classTypeTwo: 'f',
        classTypeTwoDesc: '内部讲师课时费',
        'classNum|10-100': 100
      },
      {
        classTypeOne: '01002',
        classTypeOneDesc: '非培训班',
        classTypeTwo: 'g',
        classTypeTwoDesc: '外派培训',
        'classNum|10-100': 100
      },
    ]
  })
  res.send(data)
})

// 年度总学时
app.post('/fn/data/board/statisticTotalStudy', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: [
      {
        studyType: 'a',
        studyTypeDesc: 'A',
        'studyHour|1-20': 1
      },
      {
        studyType: 'b',
        studyTypeDesc: 'B',
        'studyHour|1-20': 1
      },
      {
        studyType: 'c',
        studyTypeDesc: 'C',
        'studyHour|1-20': 1
      },
      {
        studyType: 'd',
        studyTypeDesc: 'D',
        'studyHour|1-20': 1
      },
      {
        studyType: 'e',
        studyTypeDesc: 'E',
        'studyHour|1-20': 1
      },
      {
        studyType: 'f',
        studyTypeDesc: 'F',
        'studyHour|1-20': 1
      },
    ]
  })
  res.send(data)
})



module.exports = app