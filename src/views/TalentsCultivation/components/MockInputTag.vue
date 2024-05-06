<template>
  <div class="mock-input" :class="{ disabled: disabled }" :style="`width: ${inputWidth}`">
    <el-scrollbar style="width: 100%; height: 100%" ref="scrollbar">
      <div class="content-container">
        <el-tooltip class="item" effect="dark" placement="top-start" v-for="(item, index) in list" :key="index">
          <div slot="content">
            UM: {{ item.umId }}<br />
            岗位: {{ item.pnbrDesc || '-' }}
          </div>
          <el-tag class="mock-tags" :closable="!disabled" @close="tagRemoveHandle(index, item)">
            {{ label ? item[label] : item.label }}
          </el-tag>
        </el-tooltip>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { CopyObj } from '@/plugins/until'
export default {
  name: 'MockInputTag',

  props: {
    // 宽，支持数字或带单位，默认单位为px
    width: {
      type: [String, Number],
      default: '200'
    },
    // 数据列表
    list: {
      type: Array,
      required: true
    },
    // 显示的label，可指定字段，默认为字段label
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    list: {
      handler() {
        this._updateScoll()
      }
    },
    width: {
      handler() {
        this._updateScoll()
      }
    }
  },

  data() {
    return {}
  },

  components: {},

  computed: {
    inputWidth() {
      let validator = /^[0-9]+$/
      if (validator.test(this.width)) {
        return `${this.width}px`
      }
      return this.width
    }
  },

  mounted() {},

  methods: {
    tagRemoveHandle(index, item) {
      if (this.disabled) return
      this.$emit('remove', index, CopyObj(item))
    },
    _updateScoll() {
      this.$nextTick(() => {
        this.$refs.scrollbar && this.$refs.scrollbar.update()
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.mock-input {
  height: 30px;
  padding: 0;
  margin-right: 10px;
  display: inline-block;
  border: 1px solid #dcdfe6;
  line-height: 22px;
  position: relative;
  font-size: 12px;
  color: #000000;
  display: inline-flex;
  align-items: center;
  border-radius: 2px;
  font-size: inherit;
  vertical-align: middle;
}

.mock-tags {
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
  box-sizing: border-box;
  margin: 2px;
  height: 24px;
  padding: 0 8px;
  line-height: 22px;

  :deep(.el-tag__close) {
    color: #909399;
    background-color: #b4b6bc;
    cursor: pointer;
  }
}

.content-container {
  height: 22px;
  white-space: nowrap;
}

.disabled {
  background-color: #f7f8fa;
}
</style>