const express = require('express')
const app = express()
let http = require('http')
let url = require('url')
let fs = require('fs')
let path = require('path')

// 保存登录信息
function createFile(filePath, data, writeOptions = {}) {
  // let flag = fs.existsSync(path.join(__dirname, '/db'))
  // if (!flag) {
  //   fs.mkdirSync(path.join(__dirname, '/db'))
  // }
  try {
    if (fs.existsSync(filePath)) {
      // 判断文件是否存在
      // 是否强制data
      if (writeOptions.coerce) {
        fs.writeFileSync(filePath, data, writeOptions)
      } else {
        let str = fs.readFileSync(filePath, 'utf8')
        if (!str.includes(data)) {
          fs.appendFileSync(filePath, data + ',')
        } else {
          // 将当前登录的帐号放在第一的位置
          let reg = new RegExp(data + ',', 'g')
          str = str.replace(reg, '')
          fs.writeFileSync(filePath, data + ',' + str, writeOptions)
          reg = null
        }
      }
    } else {
      if (writeOptions.coerce) {
        fs.writeFileSync(filePath, data, writeOptions)
      } else {
        fs.appendFileSync(filePath, data + ',')
      }
    }
  } catch (e) {
    console.log(e)
  }
}

// 存储信息-写入文件
function saveInfo({ticket}) {
  const content = `module.exports = ${JSON.stringify({ ticket })}`
  createFile(`${path.join(__dirname)}/ticket.js`, content, {
    flag: 'w',
    coerce: true
  })
}

app.get('/saveInfo', function (req, res) {
  console.log(req.query);
  if(req.query.ticket) {
    saveInfo({ ticket: req.query.ticket })
  }
  res.send('随便测试下结果')
})

app.listen('18000', function () {
  console.log('node服务: http://localhost: 18000')
})
