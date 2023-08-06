const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const tanlents = require('./Tanlents/data')
const establish = require('./Establish/data')
const caseCenter = require('./CaseCenter/data')
const courseRecommendation = require('./CourseRecommendation/data')
const planManagement = require('./Planmanagement/data')
const Public = require('./Public/data')
const DataDashboard = require('./DataDashboard/data')
const StatementCentre = require('./StatementCentre/data')

app.use(cors())
app.use(tanlents)
app.use(establish)
app.use(caseCenter)
app.use(courseRecommendation)
app.use(planManagement)
app.use(Public)
app.use(DataDashboard)
app.use(StatementCentre)

app.all('*', function (req, res, next) {
//设置允许跨域的域名，*代表允许任意域名跨域
  // res.header("Access-Control-Allow-Origin","http://localhost:3000");
  res.header('Access-Control-Allow-Credentials', 'true')
  //允许的header类型
  // res.header("Access-Control-Allow-Headers","content-type");
  //跨域允许的请求方式
  // res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");

  // res.header("Transfer-Encoding","Identity");

  if (req.method.toLowerCase() == 'options') res.send(200)
  //让options尝试请求快速结束
  else next()
})

app.get('/test', function (req, res) {
  res.send('随便测试下结果')
})

app.listen('9000', function () {
  console.log('node服务: http://localhost: 9000')
})
