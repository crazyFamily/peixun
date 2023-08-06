const express = require('express')
const app = express()
const Mock = require('mockjs')
app.post('/fn/caseCenter/case/voiceToText', function (req, res) {
  let data = Mock.mock({
    code: 0,
    data: '@id'
  })
  res.send(data)
})

app.post('/fn/caseCenter/case/findVoiceToTextList', function (req, res) {
  let data = Mock.mock({
    code: 0,
    'data|1-10': [
      {
        startTime: '@time',
        endTime: '@time',
        speechText: '@ctitle'
      }
    ]
  })
  res.send(data)
})

app.post('/common/file/uploadCaseCourseTxt', function (req, res) {
  let data = Mock.mock({
    code: 0,
    data: '123<br/>456'
  })
  res.send(data)
})

module.exports = app
