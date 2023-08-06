<template>
  <div>
    <el-dropdown
      class="gc-dropdown-tree"
      trigger="click"
      placement="bottom-start"
      @visible-change="visibleChange"
    >
      <div class="input" style="outline: 0" v-if="!search">
        <span v-if="activeObj[props.label]" class="ellipsis">
          {{ activeObj[props.label] }}
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
      <div v-else>
        <el-input :placeholder="placeholder" readonly :value="checkLabel">
        </el-input>
      </div>

      <el-dropdown-menu
        slot="dropdown"
        :class="{ df: !search }"
        class="gc-dropdown-tree__dropdown-box"
        :style="{ width, height }"
      >
        <div @click="stopClose" v-if="search" class="search-input">
          <el-input placeholder="请输入" v-model="searchValue" :max="200">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search r0 fs0"
              @click.stop="filter"
            ></i>
          </el-input>
        </div>
        <div class="tree-wrap">
          <el-tree
            ref="treeRef"
            v-bind="$attrs"
            v-on="$listeners"
            :data="list"
            :props="props"
            :node-key="nodeKey"
            @node-click="handleClick"
            @check-change="checkChange"
          ></el-tree>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    },
    height: {
      type: String,
      default: '256px'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    props: {
      type: Object,
      default: () => ({})
    },
    nodeKey: {
      type: [String, Number]
    },
    search: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: '',
      activeObj: {},
      dropdownVisible: false,
      searchValue: '',
      checkLabel: ''
    }
  },
  methods: {
    handleClick(item) {
      this.activeObj = item
      this.$emit('input', this.activeObj[this.nodeKey])
    },
   clear($event) {
      $event?.stopPropagation()
      this.$emit('input', '')
      this.activeObj = {}
    },
    visibleChange(visible) {
      this.dropdownVisible = visible
    },
    stopClose($event) {
      if (this.dropdownVisible) {
        $event.stopPropagation()
        $event.preventDefault()
      }
    },
    filter() {
      if (!this.dropdownVisible) return
      this.$refs.treeRef.filter(this.searchValue)
    },
    checkChange() {
      const nodes = this.$refs.treeRef.getCheckedNodes()
      const checkKeys = nodes.map((v) => v[this.nodeKey])
      const label = nodes
        .slice(0, 80)
        .map((v) => v[this.props.label])
        .join('/')
      this.checkLabel = label.length > 200 ? label.slice(0, 200) + '...' : label
      this.$emit('change', checkKeys)
    },
    getTreeRef() {
      return this.$refs.treeRef
    }
  },
  mounted() {
    if (!this.search) {
      this.width = this.$el.querySelector('.input').offsetWidth + 'px'
    } else {
      this.width = this.$el.querySelector('.el-input').offsetWidth + 'px'
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/commonScss/common-variate.scss';
.gc-dropdown-tree {
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
    padding: 0 !important;
    margin: 2px 0 0 0 !important;
    overflow: auto;

    .search-input {
      padding: 20px 24px 0;
    }

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
