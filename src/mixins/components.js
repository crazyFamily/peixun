import { pickerOptions, appendloading } from '../util/utils'
import $ from 'jquery'

export const handlePickerOptions = {
  created() {
    const { startPickerOptions, endPickerOptions } = pickerOptions(this)
    this.startPickerOptions = startPickerOptions
    this.endPickerOptions = endPickerOptions
  }
}

export const loadingMixin = {
  data() {
    return {
      loading: null
    }
  },
  created() {
    this.download = appendloading(this.download).bind(this)
    this.getList = appendloading(this.getList).bind(this)
    this.handleExport = appendloading(this.handleExport).bind(this)
  }
}

export default {
  props: {
    title: {
      type: String,
      default: '这是标题'
    },

    width: {
      type: String,
      default: '50%'
    },
    type: {
      type: String,
      default: 'text'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    comfirmText: {
      type: String,
      default: '确定'
    },
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'key'
    },
    placeholder: {
      type: String,
      default: '请输入'
    },

    maxlength: {
      type: Number,
      default: 10000
    },

    label: {
      type: String,
      default: ''
    },
    btnText: {
      type: String,
      default: '设置'
    },

    options: {
      type: Array,
      default: () => [
        {
          value: '选项1',
          label: '黄金糕'
        }
      ]
    },
    content: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    mustFill: {
      type: Boolean,
      default: false
    },
    soltShow: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  }
}