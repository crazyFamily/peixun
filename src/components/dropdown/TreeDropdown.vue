<template>
  <el-dropdown
    class="gc-tree-dropdown"
    trigger="click"
    placement="bottom-start"
    @visible-change="visibleChange"
  >
    <div class="input" style="outline: 0">
      <span v-if="content.length" class="ellipsis">
        {{ content.join('/') }}
      </span>
      <span v-else class="placeholder">
        {{ placeholder }}
      </span>

      <i
        class="
          el-input__icon
          el-icon-circle-close
          el-input__clear
          shallow
          r0
          fs0
        "
        @click.stop="clear"
      ></i>
    </div>
    <el-dropdown-menu
      slot="dropdown"
      :class="`gc-tree-dropdown__dropdown-box ${customDropdownTreeClass || ''}`"
      :style="{ width, height }"
    >
      <div
        class="left"
        :style="{ width: leftWidth }"
        :class="{ w100: rightHide }"
      >
        <div
       class="item"
          v-for="(item, index) in list"
          :key="item.label"
          :class="{
            active: activeIndex === index
          }"
          @click="handleClick(index)"
        >
          <span>{{ item[label] }}</span>
          <i class="el-tree-node__expand-icon el-icon-caret-right"></i>
        </div>
      </div>
      <div class="tree-wrap" :class="{ vanish: rightHide }">
        <el-tree
          ref="treeRef"
          v-bind="$attrs"
          v-on="$listeners"
          :data="activeObj"
          :node-key="nodeKey"
          :default-checked-keys="keys"
          :default-expanded-keys="keys"
          @check-change="checkChange"
          @node-click="nodeClick"
        ></el-tree>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    },
    leftWidth: {
      type: String,
      default: '150px'
    },
    height: {
      type: String,
      default: '256px'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    label: {
      type: String,
      default: 'label'
    },
    nodeKey: {
      type: String
    },
    value: {
      type: Array
    },
    contentArr: {
      type: Array
    },
    maxValue: {
      type: Number,
      default: Infinity
    },
    multiple: {
      type: Boolean,
      default: false
    },
    customDropdownTreeClass: {
      type: String
    }
  },
  data() {
    return {
      content: [],
      activeIndex: -1,
      activeObj: [],
      width: '',
      isSetValue: true,
      keys: []
    }
  },
 methods: {
    handleClick(i) {
      this.activeIndex = i
      this.activeObj = this.list[i][this.$attrs.props?.children || 'children']
    },
    visibleChange(flag) {
      if (!flag) {
        this.activeIndex = -1
      }
    },
    checkChange(node, checked) {
      const { [this.label]: tagName, [this.nodeKey]: tagId } = node
      if (checked) {
        if (this.keys.length >= this.maxValue) {
          this.content.shift()
          const key = this.keys.shift()
          this.$refs.treeRef.setChecked(key, false)
        }
        this.content.push(tagName)
        this.keys.push(tagId)
      } else {
        const index = this.keys.findIndex((v) => v === tagId)
        if (index > -1) {
          this.content.splice(index, 1)
          this.keys.splice(index, 1)
        }
      }
      this.isSetValue = false
      this.$emit('input', this.keys)
      this.$nextTick(() => {
        this.isSetValue = true
      })
    },
    nodeClick(item) {
      this.content = [item[this.label]]
      this.$emit('input', item[this.nodeKey])
    },
    clear() {
      this.keys = []
      this.content = []
      this.$emit('input', this.keys)
      this.$refs.treeRef.setCheckedNodes([])
    }
  },
  watch: {
    value(n) {
      if (this.isSetValue && Array.isArray(n)) {
        this.keys = n
      }
    },
    contentArr(n) {
      if (this.isSetValue && Array.isArray(n)) {
        this.content = n
      }
    }
  },
  computed: {
    rightHide() {
      return this.activeIndex < 0
    }
  },
  mounted() {
    this.width = this.$el.querySelector('.input').offsetWidth + 'px'
  },
  created() {
    if (this.multiple) {
      this.nodeClick = () => {}
    } else {
      this.checkChange = () => {}
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/commonScss/common-variate.scss';
.gc-tree-dropdown {
  width: 100%;
  .input {
    display: flex;
    width: 100%;
    height: 30px;
    padding-left: 10px;
    font-size: 12px;
    line-height: 30px;
    border: 1px solid #e0e1e3;
    color: #000000;
    justify-content: space-between;
    i {
      float: right;
      height: 30px;
      margin-right: 10px;
      line-height: 30px;
    }
  }
  &__dropdown-box {
    position: absolute;
    display: flex;
    padding: 0 !important;
    margin: 2px 0 0 0 !important;

    .left {
      padding: 10px 0;
      flex-shrink: 0;
      line-height: 30px;
      border-right: 1px solid #e0e1e3;
      overflow: auto;
      .item {
        display: flex;
        height: 30px;
        padding: 0 4px 0 20px;
        align-items: center;
        justify-content: space-between;
        cursor: default;
        color: $title1Color;
        i {
          padding: 6px;
        }
        &.active {
          color: #fd6720;
          background: rgba(234, 236, 241, 0.3);
          cursor: default !important;
          i {
            color: #fd6720 !important;
          }
        }
      }

      &.w100 {
        width: 100% !important;
      }
    }

    .tree-wrap {
      width: 100%;
      padding-top: 10px;
      overflow: auto;

      .el-tree {
        min-width: 100%;
        display: inline-block;
      }
      .el-tree-node__content {
        height: 30px;
        padding-right: 15px;
      }
    }

    .popper__arrow {
      display: none !important;
    }
  }
}
</style>
