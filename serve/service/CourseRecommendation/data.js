const express = require('express')
const app = express()
const Mock = require('mockjs')
app.post('/fn/privatewealth/training/queryTrainingStatistical', function (req, res) {
  let data = {
    code: 0,
    data: {
      trainingId: 54,
      completedNum: 0,
      total: 1,
      trainingStageList: [
        {
          id: 106,
          stageName: 'first',
          completedNum: 0,
          notCompletedNum: 1,
          stageSeriesList: [
            {
              id: 149,
              type: 'series',
              completedNum: 0,
              notCompletedNum: 1,
              title: '系列',
              content: 'ser1',
              stageSeriesList: [
                {
                    id: 150,
                    type: 'course',
                    completedNum: 0,
                    notCompletedNum: 1,
                    title: '课程',
                    content: '【务删】小橙-头像测试尚书',
                    stageSeriesList: null
                  },
                  {
                    id: 151,
                    type: 'exam',
                    completedNum: 0,
                    notCompletedNum: 1,
                    title: '考试',
                    content: '2022安全考试第一期',
                    stageSeriesList: null
                  },
                  {
                    id: 152,
                    type: 'course',
                    completedNum: 0,
                    notCompletedNum: 1,
                    title: '课程',
                    content: 'ICC天天讲堂27：用平安智投做省心投资',
                    stageSeriesList: null
                  }
                ]
              },
              {
                id: 153,
                type: 'series',
                completedNum: 0,
                notCompletedNum: 1,
                title: '系列',
                content: 'ser2',
                stageSeriesList: [
                    {
                      id: 154,
                      type: 'task',
                      completedNum: 0,
                      notCompletedNum: 1,
                      title: 'work',
                      content: 'work',
                      stageSeriesList: null
                    },
                    {
                      id: 155,
                      type: 'course',
                      completedNum: 0,
                      notCompletedNum: 1,
                      title: '课程',
                      content: 'ICC天天讲堂27：用平安智投做省心投资',
                      stageSeriesList: null
                    }
                  ]
                },
                {
                  id: 156,
                  type: 'course',
                  completedNum: 0,
                  notCompletedNum: 1,
                  title: '课程',
                  content: 'ICC天天讲堂27：用平安智投做省心投资',
                  stageSeriesList: null
                },
                {
                  id: 157,
                  type: 'exam',
                  completedNum: 0,
                  notCompletedNum: 1,
                  title: '考试',
                  content: '2022安全考试第一期',
                  stageSeriesList: null
                },
                {
                  id: 158,
                  type: 'course',
                  completedNum: 1,
                  notCompletedNum: 0,
                  title: '课程',
                  content: '【务删】小橙-头像测试尚书',
                  stageSeriesList: null
                }
              ]
            },
            {
              id: 107,
              stageName: 'first',
              completedNum: 0,
              notCompletedNum: 1,
              stageSeriesList: [
                {
                  id: 149,
                  type: 'series',
                  completedNum: 0,
                  notCompletedNum: 1,
                  title: '系列',
                  content: 'ser2-1',
                  stageSeriesList: [
                    {
                      id: 150,
                      type: 'course',
                      completedNum: 0,
                      notCompletedNum: 1,
                      title: '课程',
                      content: '【务删】小橙-头像测试尚书',
                      stageSeriesList: null
                    },
                    {
                      id: 151,
                      type: 'exam',
                      completedNum: 0,
                      notCompletedNum: 1,
                      title: '考试',
                      content: '2022安全考试第一期',
                      stageSeriesList: null
                    },
                    {
                        id: 152,
                        type: 'course',
                        completedNum: 0,
                        notCompletedNum: 1,
                        title: '课程',
                        content: 'ICC天天讲堂27：用平安智投做省心投资',
                        stageSeriesList: null
                      }
                    ]
                  },
                  {
                    id: 153,
                    type: 'series',
                    completedNum: 0,
                    notCompletedNum: 1,
                    title: '系列',
                    content: 'ser2-2',
                    stageSeriesList: [
                      {
                        id: 154,
                        type: 'task',
                        completedNum: 0,
                        notCompletedNum: 1,
                        title: 'work',
                        content: 'work',
                        stageSeriesList: null
                      },
                      {
                        id: 155,
                        type: 'course',
                        completedNum: 0,
                        notCompletedNum: 1,
                        title: '课程',
                        content: 'ICC天天讲堂27：用平安智投做省心投资',
                        stageSeriesList: null
                      }
                    ]
                  },
                  {
                    id: 156,
                    type: 'course',
                    completedNum: 0,
                    notCompletedNum: 1,
                    title: '课程',
                    content: 'ICC天天讲堂27：用平安智投做省心投资',
                    stageSeriesList: null
                  },
                  {
                    id: 157,
                    type: 'exam',
                    completedNum: 0,
                    notCompletedNum: 1,
                    title: '考试',
                    content: '2022安全考试第一期',
                    stageSeriesList: null
                  },
                  {
                    id: 158,
                    type: 'course',
                    completedNum: 1,
                    notCompletedNum: 0,
                    title: '课程',
                    content: '【务删】小橙-头像测试尚书',
                    stageSeriesList: null
                  }
                ]
              }
            ]
          }
        }
        res.send(data)
      })
      
      app.post('/fn/privatewealth/training/queryTrainingUmStatistical', function (req, res) {
        let data = {
          code: 0,
          data: {
            list: [
                {
                    trainingId: 54,
                    umId: 'SUNJIEHONG',
                    empName: '臧吉骅',
                    blgOrgId: 'S000014794',
                    blgOrgName: '平安银行零售业务中区零售销售推动部',
                    stageSeriesList: [{ stageId: 106, stageName: 'first', completeFlag: 1 }]
                  }
                ],
                total: 1,
                page: 1,
                size: 10
              }
            }
            res.send(data)
          })
          
          app.post('/fn/privatewealth/training/queryTrainingUmDetail', function (req, res) {
            let data = {
              code: 0,
              data: {
                trainingStageList: [
                  {
                    id: 106,
                    stageName: 'first',
                    title: null,
                    status: 1,
                    finishDate: null,
                    stageSeriesList: [
                      {
                        id: 149,
                        type: 'series',
                        title: '系列',
                        content: 'ser1',
                        totalDuration: 0,
                        finishDate: null,
                        status: 0,
                        stageSeriesList: [
                          {
                            id: 150,
                            type: 'course',
                            title: '课程',
                            content: '【务删】小橙-头像测试尚书',
                            totalDuration: 0,
                            finishDate: null,
                            status: 0,
                            stageSeriesList: null
                          },
                          {
                            id: 151,
                            type: 'exam',
                            title: '考试',
                            content: '2022安全考试第一期',
                            totalDuration: 0,
                            finishDate: null,
                            status: 0,
                            stageSeriesList: null
                          },
                          {
                            id: 152,
                            type: 'course',
                            title: '课程',
                            content: 'ICC天天讲堂27：用平安智投做省心投资',
                            totalDuration: 0,
                            finishDate: null,
                            status: 0,
                            stageSeriesList: null
                          }
                        ]
                      },
                      {
                        id: 153,
                        type: 'series',
                        title: '系列',
                        content: 'ser2',
                        totalDuration: 0,
                        finishDate: null,
                        status: 1,
                        stageSeriesList: [
                          {
                            id: 154,
                            type: 'task',
                            title: 'work',
                            content: 'work',
                            totalDuration: 0,
                            finishDate: null,
                            status: 1,
                            stageSeriesList: null
                          },
                          {
                            id: 155,
                            type: 'course',
                            title: '课程',
                            content: 'ICC天天讲堂27：用平安智投做省心投资',
                            totalDuration: 0,
                            finishDate: null,
                            status: 0,
                            stageSeriesList: null
                          }
                        ]
                      },
                      {
                        id: 156,
                        type: 'course',
                        title: '课程',
                        content: 'ICC天天讲堂27：用平安智投做省心投资',
                        totalDuration: 0,
                        finishDate: null,
                        status: 0,
                        stageSeriesList: null
                      },
          