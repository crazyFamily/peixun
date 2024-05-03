const express = require('express')
const app = express()
const Mock = require('mockjs')
app.post('/fn/studyRecord/record/generalSituation', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      umId: '@pick("LIWENYONG316","WUJUN003")',
      empName: '@cname',
      hireAge: '@pick("0","2.5","9")',
      orgName: '机构名称',
      postDesc: '岗位',
      totalDay: '@pick(10,2.5,4.5,8.0)',
      totalRank: '@pick(10,2.5,4.5,8)',
      totalHour: '@pick(10,2.5,4.5,8.0)',
      onLineHour: '@pick(10,2.5,4.5,8.0)',
      faceHour: '@pick(10,2.5,4.5,8.0)',
      avatar: ''
    }
  })
  res.send(data)
})
app.post('/fn/studyRecord/record/listRecordYear', function (req, res) {
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
  // res.header('Access-Control-Allow-Credentials', 'true')
  console.log(res, '--->> res`')
  const data = Mock.mock({
    code: 0,
    'data|10': ['@integer(0, 20000)']
  })
  res.send(data)
})
app.post('/fn/studyRecord/record/studyHourPieChart', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      umId: '@pick("LIWENYONG316","WUJUN003")',
      classStudyHour: '@pick(33.896,3641.12,332.5,44.5)',
      courseStudyHour: '@pick(0,2,4,80)',
      liveStudyHour: '@pick(10,2.5,4.5,8.0)',
      examStudyHour: '@pick(0,1)',
      caseStudyHour: '@pick(12,33)',
      aiTrainStudyHour: '@pick(1.2,30.3)',
      otherStudyHour: '@pick(13.2,230.3)'
    }
  })
  res.send(data)
})
app.post('/fn/studyRecord/record/studyHourRankBarChart', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      umId: '@pick("LIWENYONG316","WUJUN003")',
      totalHour: '@pick(0,20,5,119)',
      avgTotalHour: '@pick(99,3,9)',
      'rankRangeList|3': [
        {
          peopleNum: '@pick("12","32","55","999")', //人数
          avgHour: '@pick("1","3",)', //平均学时
          haveMySelf: '@pick("1","0")', //是否本人所在区间：1是、0否
          rankRange: "@pick(1, '0.7', '0.4', '0.2', '0.1')"
        }
      ]
    }
  })
  res.send(data)
})
app.post('/fn/studyRecord/record/studyHourRank', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      myHourRank: {
        umId: '@pick("LIWENYONG316","WUJUN003")',
        empName: '姓名',
        orgName: '机构名称',
        totalRank: '@integer(0, 20000)',
        totalHour: '@pick(0,10,53,119)'
      },
      'hourRankList|14': [
        {
          umId: '@pick("LIWENYONG316","WUJUN003")',
          empName: '姓名',
          orgName: '机构名称',
          totalRank: '@integer(0, 20000)',
          totalHour: '@integer(0, 20000)'
        }
      ]
    }
  })
  res.send(data)
})
app.post('/fn/studyRecord/record/trainingInfo', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      'trainingInfoList|3': [
        {
          totalCount: '@pick(0,10,53,119)',
          totalHour: '@integer(0, 20000)',
          calMonth: '@pick("2024-01","2024-11","2024-12","2024-06")'
        }
      ],
      umId: '@pick("LIWENYONG316","WUJUN003")',
      totalCount: '@pick(0,10,53,119)',
      totalHour: '@integer(0, 20000)'
    }
  })
  res.send(data)
})
app.post('/fn/studyRecord/record/listStudyRecord', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      'list|30': [
        {
          umId: '@pick("LIWENYONG316","WUJUN003")',
          empName: '姓名',
          orgName: '机构名称',
          studyType: '@pick("培训班","课程")',
          studyContent: '学习内容',
          studyHour: 0.04,
          studyDate: '@pick("2021-07-02 00:00:00","2021-06-27 00:10:00")'
        }
      ],
      total: '@integer(0, 20000)'
    }
  })
  res.send(data)
})

app.post('/fn/studyRecord/record/checkUmListForStudyRecord', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      'successList|10': [
        {
          umId: '@id',
          umName: '@cname',
          failMsg: null,
          batchId: '@id',
          type: null,
          orgName: null
        }
      ],
      failList: []
    }
  })
  res.send(data)
})

app.post('/fn/studyRecord/record/listStudyRecordCollect', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      list: [
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '河南安阳1121特别重大火灾 安全警示教育',
          studyHour: 0.09,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-25 14:19:27'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '珠海分行宣导新亮牌问责处罚办法',
          studyHour: 0.67,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-21 17:24:13'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '合规护航，职涯长青',
          studyHour: 0.03,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-21 16:57:59'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '理财销售合规',
          studyHour: 0.03,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-21 16:54:47'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '零售贷款风险管理基础知识',
          studyHour: 0.01,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-21 16:34:48'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '珠海分行人力资源合规培训',
          studyHour: 0.02,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-21 16:27:52'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '中国平安合规风控基本法',
          studyHour: 0.03,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-21 16:25:54'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '平安办公规范化课程',
          studyHour: 0.01,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-21 16:21:55'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '2023年珠海分行零售员工合规文化 消保“9号令”解读培训',
          studyHour: 0.02,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-21 16:18:56'
        },
        {
          umId: 'TENGYUN623',
          empName: '滕云',
          orgId: 'S000016067',
          orgName: '平安银行珠海分行私行财富管理部私财客户经营室',
          deptName: null,
          studyType: '课程',
          studyContent: '珠海分行宣导新亮牌问责处罚办法',
          studyHour: 0.53,
          'classStudyCount|1-100': 1,
          'courseStudyCount|1-100': 1,
          'liveStudyCount|1-100': 1,
          'examStudyCount|1-100': 1,
          'caseStudyCount|1-100': 1,
          'aiTrainStudyCount|1-100': 1,
          'otherStudyCount|1-100': 1,
          studyDate: '2023-12-20 21:44:06'
        }
      ],
      total: 111,
      page: 1,
      size: 10
    }
  })
  res.send(data)
})

module.exports = app