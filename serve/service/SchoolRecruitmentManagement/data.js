const express = require('express')
const app = express()
const Mock = require('mockjs')
app.post('/fn/admission/admissionConfig/listFosterPlanConfig', function (req, res) {
  const data = Mock.mock({
    code: 0,
    'data|10': [
      {
        transferPositionType: '@ctitle',
        planStartDate: '@date',
        updatedByStr: '@cname',
        updatedDate: '@date'
      }
    ]
  })
  res.send(data)
})
app.post('/fn/admission/admissionConfig/listConfigVersionByTransferPositionType', function (req, res) {
  const data = Mock.mock({
    code: 0,
    'data|10': [
      {
        transferPositionType: '@ctitle',
        planStartDate: '@date',
        planId: '@id'
      }
    ]
  })
  res.send(data)
})
app.post('/fn/admission/admissionConfig/fosterPlanConfigDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    'data|1': [
      {
        transferPositionType: '@ctitle',
        planStartDate: '@date',
        planId: '@id',
        teamPrincipal: '',
        adminDepartment: '',
        courseModuleList: [],
        practiceModuleList: [],
        qualificationModuleList: []
      }
    ]
  })
  res.send(data)
})
app.post('/fn/admission/admissionConfig/findFosterProject', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      'list|10': [
        {
          fosterProjectId: '@id',
          fosterProjectName: '@ctitle'
        }
      ],
      total: 20,
      page: 1,
      size: 10
    }
  })
  res.send(data)
})
app.post('/fn/admission/admissionConfig/saveFosterPlanConfig', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})
app.post('/fn/admission/admissionConfig/deleteFosterPlanConfig', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/listStudentAdmissionInfo', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      'list|10': [
        {
          id: '@id',
          grade: '@ctitle',
          userName: '@cname',
          userCode: 'userCode',
          onboardDate: '@date',
          onboardOrg: 'onboardOrg',
          onboardDeptName: '入职部门',
          onboardPosition: '入职岗位',
          onboardLine: '入职条线大类',
          onboardSubLine: '入职条线小类',
          onboardLevel: '入职职级',
          transferStage: '最新轮岗阶段',
          transferStatusName: '最新轮岗状态',
          teacherEvaStatusName: '最新导师评价状态',
          teacherEvaDate: '2023-12-23 23:23:33',
          fosterResStatusName: '最新培养结果录入状态',
          fosterResDate: '@datetime'
        }
      ],
      total: 20,
      page: 1,
      size: 10
    }
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/studentAdmissionRecord', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      grade: '@ctitle',
      userCode: 'userCode',
      userName: '@cname',
      onboardDate: '@date',
      onboardOrg: '入职单位名称'
    }
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/admissionQryParam', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      identity: 4,
      'orgs|10': [
        {
          xrCode: '@id',
          xrMsg: '@ctitle'
        }
      ],
      'grades|10': ['@ctitle']
    }
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/listStudentTransferStage', function (req, res) {
  const data = Mock.mock({
    code: 0,
    'data|10': [
      {
        id: '@id',
        grade: '@ctitle',
        userCode: '@cname',
        transferStage: '@ctitle'
      }
    ]
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/findFosterPlanDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      grade: '@pick(2019,2020,2021)届',
      userCode: '@pick("liwenyong316","linda059")',
      transferStage: '第' + '@pick(1,2,3,4,5)' + '阶段',
      transferPosition: '轮岗岗位',
      transferPositionType: '轮岗岗位类型名称',
      transferExpectedDate: '@date',
      transferExpectedTime: '预计轮岗时长',
      transferActualDate: '@date',
      transferActualTime: '实际轮岗时长',
      transferStatusName: '轮岗状态',
      nextPhaseArrange: '下阶段安排',
      mentor: '导师',
      planId: '培养方案ID',
      isSave: '@pick(null,"Y","N")',
      'courseModuleList|3': [
        {
          fosterProjectId: '@id',
          fosterProjectName: '@ctitle(8,10)',
          fosterModality: '@pick(5,4)',
          completeStatusName: '@pick("","已完成","未完成")',
          'fileInformationList|2': [
            {
              udmpId: '@id',
              createdByName: '@ctitle',
              fileName: '@ctitle',
              fileSize: '@integer(0, 20000)',
              fosterRequire: '',
              createdDate: '@datetime'
            }
          ]
        }
      ],
      'practiceModuleList|3': [
        {
          fosterProjectId: '@id',
          fosterProjectName: '@ctitle(8,12)',
          fosterModality: '@pick(5,4)',
          completeNum: '@cparagraph(10, 30)',
          fosterRequire: '@ctitle(150, 200)',
          completeStatusName: '@pick("","已完成","未完成")',
          auditStatus: '@pick(null,0,1,2)',
          'fileInformationList|2': [
            {
              udmpId: '@id',
              createdByName: '@ctitle',
              fileName: '@ctitle',
              fileSize: '@integer(0, 20000)',
              fosterRequire: '',
              createdDate: '@datetime'
            }
          ]
        }
      ],
      'qualificationModuleList|3': [
        {
          fosterProjectId: '@id' + '@id',
          fosterProjectName: '@ctitle(8,12)',
          fosterModality: '@pick(5,4,6)',
          completeNum: '@cparagraph(10, 30)',
          fosterRequire: '@ctitle(150, 200)',
          score: '@integer(0, 100)',
          completeStatusName: '@pick("","已完成","未完成")',
          auditStatus: '@pick(null,0,1,2)',
          'fileInformationList|2': [
            {
              udmpId: '@id',
              createdByName: '@ctitle',
              fileName: '@ctitle',
              fileSize: '@integer(0, 20000)',
              fosterRequire: '',
              createdDate: '@datetime'
            }
          ]
        }
      ]
    }
  })
  res.send(data)
})
app.post('/fn/commons/udmp/udmpReserve', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      uptokens: [
        'Vm99oMQ9DtGUu5mdwRHDpLqYi2JTGuna8r7KGL2o:urGlhrosVEeNNmal0uz27HqQHa8=:eyJzY29wZSI6InVkbXAtc3RvcmFnZTpVRE1QLTc0OTcxMjk1MDUwOWZjNTRiMWQ1ODI5MWJhNTBhZjE5YTdiZWVhODBlZS1lNjZjMDFlZC0yMDIzMTIwNjA5MDkxOS0wMDAwMDAwMS8xIiwiZGVhZGxpbmUiOjE3MDE5NDAxNTksImluc2VydE9ubHkiOjEsImRldGVjdE1pbWUiOjEsInNhdmVLZXkiOiJVRE1QLTc0OTcxMjk1MDUwOWZjNTRiMWQ1ODI5MWJhNTBhZjE5YTdiZWVhODBlZS1lNjZjMDFlZC0yMDIzMTIwNjA5MDkxOS0wMDAwMDAwMS8xIiwiY2FsbGJhY2tVcmwiOiJodHRwOi8vYXBpLXVkbXAuZmF0LnFhLnBhYi5jb20uY24vZG9jdW1lbnRzL2NhbGxiYWNrL2NyZWF0ZS9VRE1QLTc0OTcxMjk1MDUwOWZjNTRiMWQ1ODI5MWJhNTBhZjE5YTdiZWVhODBlZS1lNjZjMDFlZC0yMDIzMTIwNjA5MDkxOS0wMDAwMDAwMSIsImNhbGxiYWNrQm9keSI6ImtleT0kKGtleSlcdTAwMjZoYXNoPSQoZXRhZylcdTAwMjZmc2l6ZT0kKGZzaXplKVx1MDAyNnR5cGU9JChtaW1lVHlwZSkiLCJjYWxsYmFja0JvZHlUeXBlIjoiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkIn0='
      ],
      document: {
        doc_id: 'UDMP-749712950509fc54b1d58291ba50af19a7beea80ee-e66c01ed-20231206090919-00000001',
        title: '',
        bizdata: {},
        operator: {
          created_by: 'MEIZX',
          created_at: '2023-12-06T17:09:19.476651187+08:00',
          created_by_app: 'e66c01ed',
          updated_by: 'MEIZX',
          updated_at: '2023-12-06T17:09:19.476651187+08:00',
          updated_by_app: 'e66c01ed'
        },
        pages: [
          {
            page_no: 1,
            bizdata: {
              file_name: '截屏2023-11-30 下午7.28.10.png'
            }
          }
        ]
      }
    }
  })
  res.send(data)
})
app.post('/fn/commons/udmp/pabosuat', function (req, res) {
  const data = Mock.mock({
    hash: 'Fg2ZWoQnCq0oLCmYo6bEl3FmJ9hI',
    key: 'UDMP-749712950509fc54b1d58291ba50af19a7beea80ee-e66c01ed-20231206090919-00000001/1'
  })
  res.send(data)
})
app.post('/fn/commons/udmp/getDocuments', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      pages: [
        {
          page_no: 1,
          bizdata: {
            _fsize: '159878',
            _mimeType: 'image/png',
            file_name: '截屏2023-11-30 下午7.28.10.png'
          },
          download_url:
            'http://e66c01ed-bucket.pabosuat.sdb.com.cn/UDMP-fa756b0ae62fb3eb5abe0289a113f51f2962cf32e2-e66c01ed-20231213014723-00000001/1?attname=%E6%88%AA%E5%B1%8F2023-11-30+%E4%B8%8B%E5%8D%887.28.10.png&e=1702439253&token=Vm99oMQ9DtGUu5mdwRHDpLqYi2JTGuna8r7KGL2o:LI3KAOMb_JtRYcn9au61oV4EaR8='
        }
      ],
      bizdata: {},
      title: '',
      doc_id: 'UDMP-fa756b0ae62fb3eb5abe0289a113f51f2962cf32e2-e66c01ed-20231213014723-00000001',
      operator: {
        created_by: 'LIWENYONG316',
        created_at: '2023-12-13T01:47:23.402Z',
        created_by_app: 'e66c01ed',
        updated_by: 'LIWENYONG316',
        updated_at: '2023-12-13T01:47:23.402Z',
        updated_by_app: 'e66c01ed'
      }
    }
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/findTeacherEvaluateDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      isSave: '@pick(null,"Y","N")',
      'evaTargetList|5': [
        {
          targetAnswer: '@pick(null,"1","2","3")',
          targetContent: '@pick("智商（IQ）","情商（EQ）","做事（Executing）")',
          targetType: '@pick("IQ","EQ","AQ","AAQ","Thinking","Executing")',
          'targetOptionList|4': [
            {
              optionContent: '@ctitle(5,80)',
              orderNo: '@pick("1","2","3","4",@id)'
            }
          ]
        }
      ]
    }
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/saveTeacherEvaluate', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: null
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/findFosterResultDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      grade: '@ctitle',
      userCode: 'userCode',
      transferStage: '第' + '@pick(1,2,3,4,5)' + '阶段',
      myselfChoice: '@pick(null,1,2)',
      compliance: '@pick(null,1,0)',
      serviceComplaint: '@pick(null,1,0)',
      attendance: '@ctitle(150, 200)',
      evaluateResult: '@pick(null,3,2,1,0)',
      teamPrincipalEvaluate: '@ctitle(150, 200)',
      teamPrincipalName: '@cname',
      teamPrincipalUm: null,
      adminDepartmentEvaluate: null,
      adminDepartmentUm: null,
      adminDepartmentName: '@ctitle',
      teamPrincipal: null,
      adminDepartment: '@ctitle'
    }
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/saveFosterResult', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: null
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/uploadFileModality', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: null
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/auditFileModality', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: null
  })
  res.send(data)
})
app.post('/common/admission/studentAdmission/importBatchFosterResult', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      failBatchId: '@id',
      succBatchId: '@id',
      'sucessList|12': [
        {
          grade: '@ctitle',
          userCode: 'userCode',
          transferStage: '第' + '@pick(1,2,3,4,5)' + '阶段'
        }
      ],
      failList: [
        {
          grade: '@ctitle',
          userCode: 'userCode',
          transferStage: '第' + '@pick(1,2,3,4,5)' + '阶段',
          msg: '失败原因@ctitle'
        }
      ]
    }
  })
  res.send(data)
})
app.post('/fn/admission/studentAdmission/saveBatchFosterResult', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: null
  })
  res.send(data)
})

const fs = require('fs')
app.post('/fn/admission/studentAdmission/exportFailFosterResult', function (req, res) {
  let fileName = './SchoolRecruitmentManagement/data.js' // 文件地址随意這里先写死
  let name = encodeURIComponent(fileName.split('.')[1])
  //设置文件流的响应头的俩种方法
  //res.writeHead()
  res.writeHead(200, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment;filename=${name}.js`,
    'Access-Control-Expose-Headers': 'Content-Disposition'
  })
  //创建可读流
  let readStream = fs.createReadStream(fileName)
  readStream.on('data', (chunk) => {}) //开始读取数据
  readStream.on('close', () => {}) //处理完成
  readStream.pipe(res) //  返回文件流
})
module.exports = app