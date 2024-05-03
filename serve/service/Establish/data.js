const express = require('express')
const app = express()
const Mock = require('mockjs')

app.post('/common/lixiang/queryLadderCourse', function (req, res) {
  let data = Mock.mock({
    code: 0,
    'data|1-10': [
      {
        id: '@id',
        courseOid: '@id',
        courseId: '@id',
        courseName: '@ctitle',
        courseDate: '@date',
        startDate: '@date',
        endDate: '@date',
        'startHour|0-24': '0',
        'startMin0-60': '0',
        'endHour|0-24': '0',
        'endtMin|0-60': '60',
        teacherNo: '@id',
        'teacherType|1': ['01001', '01000', '01002', '01003'],
        teacherName: '@cname',
        'courseType|1': ['05002', '05003', '05001'],
        courseMold: '@id',
        'courseScore|1-10': '1',
        teacherId: '@id',
        teacherSex: '1',
        supplyName: '@cname',
        'isCommonCourse|1': ['Y', 'N']
      }
    ]
  })
  res.send(data)
})

//  1、混合培训知鸟课程、知鸟直播、知鸟考试、案例列表查询：
app.post('/fn/classes/mixed/selectMixedTrainingPage', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      page: 1,
      size: 10,
      total: 100,
      'list|10': [
        {
          // 混合培训类型：course知鸟课程，live知鸟直播，test知鸟考试，case案例
          'trainingType|1': ['course', 'live', 'test', 'case'],
          // 知鸟课程id、知鸟直播id、知鸟考试id、案例id
          trainingId: '@id',
          // 培训名称
          trainingName: '@cword',
          //是否结训条件：0否，1是
          'isFinishCondition|1': ['0', '1'],
          // 排序号
          'sortNo|100-1000': 1,
          // 学员人数
          'studentNum|100-1000': 1,
          // 完成人数
          'completeNum|100-1000': 1,
          // 添加人
          createdBy: '@cname',
          // 直播状态：0未开始，1直播中，2已结束，3回放中
          'liveStatus|1': ['0', '1', '2', '3'],
          'liveStatusDesc|1': ['未开始', '直播中', '已结束', '回放中'],
          // 直播开始时间
          startTime: '@date',
          // 混合培训id
          id: '@id'
        }
      ]
    }
  })
  res.send(data)
})

// 2、混合培训添加知鸟课程、知鸟直播、知鸟考试、案例：
app.post('/fn/classes/mixed/saveMixedTraining', function(req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

// 3、查询知鸟课程列表：
app.post('/fn/classes/mixed/selectZnCourseList', function(req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      page: 1,
      size: 10,
      total: 100,
      'list|10': [
        {
          // 课程id
          courseId: '@id',
          // 课程名称
          courseName: '@cword',
          // 制作人
          developPerson: '@cname',
          // 课件类型； 0:图文，1：混合，2：小游戏，3：纯视频，5：纯音频，6：电子书
          'coursewareType|1': ['0', '1', '2','3','5','6'],
          // 课程时长
          'duration|100-1000': 1
        }
      ]
    }
  })
  res.send(data)
})

// 4、查询知鸟直播列表：
app.post('/fn/classes/mixed/selectZnLiveList', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      page: 1,
      size: 10,
      total: 100,
      'list|1-10': [
        {
          // 直播id
          liveId: '@id',
          // 直播名称
          liveName: '@cword',
          // 直播状态：0未开始，1直播中，2已结束，3回放中
          'liveStatus|1': ['0', '1', '2', '3'],
          // 直播创建人
          developPerson: '@cname',
          // 直播开始时间
          startTime: '@date'
        }
      ]
    }
  })
  res.send(data)
})

// 5、查询知鸟考试列表：
app.post('/fn/classes/mixed/selectZnTestList', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      page: 1,
      size: 10,
      total: 100,
      'list|1-10': [
        {
          // 考试id
          testId: '@id',
          // 考试名称
          testName: '@cword',
          // 考试创建人
          developPerson: '@cname',
          // 创建时间
          startTime: '@date'
        }
      ]
    }
  })
  res.send(data)
})

// 6、完成明细列表查询/导出：
app.post('/fn/classes/mixed/trainingCompleteDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      page: 1,
      size: 10,
      total: 100,
      'list|1-10': [
        {
          // 学员姓名
          empName: '@cname',
          // um号
          umId: '@id',
          // 完成状态
          completeStatus: '',
          // 完成时间
          completeTime: '@date',
          // 考试成绩
          'score|100-1000': 1
        }
      ]
    }
  })
  res.send(data)
})

// 7、知鸟直播详情数据：
app.post('/fn/classes/mixed/selectZnLiveDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      // 直播时长
      'duration|100-1000': 1,
      // 直播观看人次
      'browseSum|100-1000': 1,
      // 同时在线峰值
      'onlineMax|100-1000': 1,
      // 总观众人数
      'totalUserNum|100-1000': 1,
      // 直播观众人数
      'liveUserNum|100-1000': 1,
      // 回看观众人数
      'replayUserNum|100-1000': 1,
      // 点赞数
      'upSum|100-1000': 1,
      // 用户评分
      'avgRating|100-1000': 1
    }
  })
  res.send(data)
})

// 8、批量设置结训条件
app.post('/fn/classes/mixed/updateFinishCondition', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

// 9、调整混合培训顺序：
app.post('/fn/classes/mixed/updateTrainingSortNo', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

// 10、导出完成明细：
app.post('/fn/classes/mixed/exportCompleteDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

// 混合培训-混合培训数量查询 
app.post('/fn/classes/mixed/selectMixedTrainingNum', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      'courseNum|1-1000': 0,
      'liveNum|1-1000': 0,
      'testNum|1-1000': 0,
      'caseNum|1-1000': 0
    }
  })
  res.send(data)
})

// 混合培训-交流圈-主题列表 
app.post('/fn/classes/communicate/listCommunicateSubject', function (req, res) {
  const data = Mock.mock({
    code: '0',
    'data|10': [
      {
        classId: '@id',
        subjectId: '@id',
        subjectTitle: '@title',
        subjectContent: '@paragraph()',
        // 发布状态:0下架,1发布
        'publishStatus|1': ['0', '1'],
        'publishStatusDesc|1': ['下架', '发布'],
        sortNo: '@id',
        updatedBy: '@id',
        updatedByName: '@name',
        updatedDate: '@date',
        'commentCount|1-1000': 1,
        'likeCount|1-1000': 1
      }
    ]
  })
  data.data = data.data.map((row) => ({ ...row, publishStatusDesc: row.publishStatus === '0' ? '下架' : '发布'}))
  res.send(data)
})

// 混合培训-交流圈-删除 
app.post('/fn/classes/communicate/deleteCommunicateSubject', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

// 混合培训-交流圈-上下架 
app.post('/fn/classes/communicate/upOrDownCommunicateSubject', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

// 混合培训-交流圈-排序 
app.post('/fn/classes/communicate/updateCommunicateSubjectSortNo', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

// 混合培训-交流圈-保存主题
app.post('/fn/classes/communicate/saveCommunicateSubject', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {}
  })
  res.send(data)
})

// 混合培训-交流圈-查看主题
app.post('/fn/classes/communicate/communicateSubjectDetail', function (req, res) {
  const data = Mock.mock({
    code: 0,
    data: {
      subjectId: '@id',
      subjectTitle: '@title',
      subjectContent: '@paragraph()',
      picList: [
        {
          fileName: '1 (1).png',
          type: 'image/png',
          udmpId: 'UDMP-1d973f137eef3b59c643447421dcd808e635d691c9-e66c01ed-20230816073028-00000001'
        },
        {
          fileName: '1 (2).png',
          type: 'image/png',
          udmpId: 'UDMP-6a9b06a7546360a31814751e6bf50b2b3f72975f65-e66c01ed-20230816073035-00000001'
        }
      ]
    }
  })
  res.send(data)
})


module.exports = app