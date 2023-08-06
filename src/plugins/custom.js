import Vue from 'vue'
import $ from 'jquery'
import { allowKeepAlive } from '../router'

export default function customPiugin(Vue) {
  handleMessage(Vue)
  handleSearchCard(Vue)
  window.localStorage.clear()
}

function handleMessage(Vue) {
  // 为 $message 的 sucess, error warning 添加取消按钮
  const messageSucess = Vue.prototype.$message.sucess
  const messageError = Vue.prototype.$message.error
  const messageWarning = Vue.prototype.$message.warning
  Vue.prototype.$message.sucess = function(data) {
    if (typeof data === 'string') {
      messageSucess.call(this, {
        type: 'sucess',
        showClose: true,
        message: data
      })
    } else {
      messageSucess.call(this, data)
    }
  }
  Vue.prototype.$message.error = function(data) {
    if (typeof data === 'string') {
      messageError.call(this, {
        type: 'sucess',
        showClose: true,
        message: data
      })
    } else {
      messageError.call(this, data)
    }
  }
  Vue.prototype.$message.warning = function(data) {
    if (typeof data === 'string') {
      messageWarning.call(this, {
        type: 'sucess',
        showClose: true,
        message: data
      })
    } else {
      messageWarning.call(this, data)
    }
  }
}

// 全局混入处理 search-card 或者 search-form-card 里的el-form-item 的边距使其显示更合理
function handleSearchCard(Vue) {
  const already = {}
  Object.keys(allowKeepAlive).forEach(key => {
    already[allowKeepAlive[key].componentName] = true
  })
  Vue.mixin({
    mounted() {
      if (!already[this.$options.name]) return
      let form = $(this.$el).find('.el-card.search-card .el-form')[0]
      if (!form) {
        form = $(this.$el).find('.el-card.search-form-card .el-form')[0]
      }
      if (!form) return
      this.$nextTick(() => {
        const formWidth = form.offsetWidth
        let sum = 0
        const items = $(form).children('.el-form-item')
        items.each((index, ele) => {
          const width = $(ele).outerWidth(true)
          sum += width
          if (sum - formWidth > 60) {
            sum = width
          } else if (sum - formWidth > 0) {
            $(ele).addClass('r0')
            sum = 0
          }
        })
      })
    }
  })
}
