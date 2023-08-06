import './assets/stylesheets/reset-element-ui.css'
import './assets/stylesheets/overwrite-el.css'
import './assets/stylesheets/common-reset.css'
import './assets/stylesheets/component-frame.css'

import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入 Webtrends 插件。
import Webtrends from '@pa/webtrends'
// 这里的appKey对应CMS的前端资源ID
Vue.use(Webtrends, { appKey: 'A102688', autoUpdate: true })

import ElementUI from 'element-ui'
// 修复 el-form里只有一个input时回车触发submit的bug
ElementUI.Form.mounted = function () {
  this.$el.addEventListener('submit', function (e) {
    e.preventDefault()
  })
}
Vue.use(ElementUI)

import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

// 全局过滤器文件
import { filterInit } from './filter/filter'

import model from './components/model'
import select from './components/select'
import SelectAutoComplete from './components/select/SelectAutoComplete'
import table from './components/table'
import tablePagination from './components/table/table-pagination'
import input from './components/input'
import fileInput from './components/input/FileInput.vue'
import InputNumber from './components/input/InputNumber.vue'
import ProcessInput from './components/input/ProcessInput.vue'
import pagination from './components/pagination'
import dropdown from './components/dropdown'
import tablecolumnfilters from './components/tablecolumnfilters'
import tooltip from './components/tooltip'
import institution from './components/institution'
import InstructorBatchImport from './components/dialogs/InstructorBatchImport.vue'
import ApprovalChain from './components/ApprovalChain.vue'
import lineProgress from './components/progress/lineProgress.vue'
import ReadonlyInput from './components/ReadonlyInput.vue'
import upload from './components/upload'
import timeChunk from './components/time/index.vue'

import _ from 'lodash'
import customPiugin from './plugins/custom'

//import componentMixin from './mixins/component'

Vue.component(model.name, model)
Vue.component(select.name, select)
Vue.component(SelectAutoComplete.name, SelectAutoComplete)
Vue.component(table.name, table)
Vue.component(input.name, input)
Vue.component(fileInput.name, fileInput)
Vue.component(InputNumber.name, InputNumber)
Vue.component(ProcessInput.name, ProcessInput)
Vue.component(pagination.name, pagination)
Vue.component(dropdown.name, dropdown)
Vue.component(tablecolumnfilters.name, tablecolumnfilters)
Vue.component(tooltip.name, tooltip)
Vue.component(institution.name, institution)
Vue.component(InstructorBatchImport.name, InstructorBatchImport)
Vue.component(ApprovalChain.name, ApprovalChain)
Vue.component(lineProgress.name, lineProgress)
Vue.component(ReadonlyInput.name, ReadonlyInput)
Vue.component(tablePagination.name, tablePagination)
Vue.component(upload.name, upload)
Vue.component(timeChunk.name, timeChunk)
//Vue.mixin(componentMixin)

Vue.config.productionTip = false

Vue.prototype._ = _
Vue.prototype.$wenEvent = new Vue()
Vue.prototype.$wenData = {
  hillsManagementTable: []
}

filterInit(Vue)
// 自定义插件 处理一些事情
Vue.use(customPiugin)

const vueInt = new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

export { vueInt }
