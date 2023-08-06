const jwt = require('jsonwebtoken')

const solt = 'ex-zhuowenbiao001'

export default {
  sign(data) {
    return jwt.sign(data, solt)
  },
  verify(str) {
    return jwt.verify(str)
  }
}
