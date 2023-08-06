<template>
  <el-dropdown
    class="gc-institution"
    :class="{ disabled: disabled }"
    :style="{'width': width}"
    trigger="click"
    placement="bottom-start"
    :disabled="disabled"
  >
    <div class="input" :style="{'width': '100%'}">
      <span v-if="content.length">
        {{ content.join('/') }}
      </span>
      <span v-else class="hint">
        {{ placeholder }}
      </span>

      <i class="el-icon-arrow-down"></i>
    </div>
    <el-dropdown-menu slot="dropdown" class="gc-institution__dropdown-box" :class="popperClass">
      <div
        class="blgStripLine"
        :class="{ w100: !activeBlgStripLine }"
        v-if="leftShow"
      >
        <div
          class="item"
          v-for="i in blgStripLine"
          :key="i.busiType"
          :class="{ active: activeBlgStripLine === i.busiType }"
          @click="handleClick(i)"
        >
          <span>{{ i.label }}</span>
          <i class="el-tree-node__expand-icon el-icon-caret-right"></i>
        </div>
      </div>
      <div
        class="tree-wrap"
        :class="{ vanish: leftShow && !activeBlgStripLine }"
      >
        <el-tree
          lazy
          accordion
        :data="treeData"
          :load="loadNode"
          :props="defaultProps"
          :highlight-current="true"
          @node-click="handleNodeClick"
          class="institution-tree"
        >
          <span class="custom-tree-node" :class="{'disabled': isNodeDisabled(node, data)}" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { CopyObj, jsonHeaders } from '@/util/utils'
export default {
  name: 'gc-institution',
  props: {
    value: {
      default: ''
    },
    orgUrl: {
      default: '/fn/user/selectTree'
    },
    level: {
      default: Infinity
    },
    defaultShow: { // 是否显示默认值
      type: Boolean,
      default: false
    },
    leftShow: { // 是否显示左边
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '选择机构'
    },
    busiType: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isbranch: {
      type: Boolean,
      default: false
    },
    otherParams: {  // 阶梯覆盖率报表机构树需要增加入参展示二级分行数据
      type: Object,
      default: () => {}
    },
    fetchParams: {
      type: Object,
      default: () => {}
    },
  width: {
      type: String,
      default: '200px'
    },
    // 是否立即发起请求
    immediate: {
      type: Boolean,
      default: true
    },
    // 是否允许选择虚拟节点
    allowInvented: {
      type: Boolean,
      default: true
    },
    // 下拉窗类名
    popperClass: {
      type: String,
    }
  },
  data() {
    return {
      thisValue: [],
      isShow: true,
      module: undefined,
      content: [],
      blgStripLine: [],
      activeBlgStripLine: '',
      maping: {
        报销中心: 'systemModule',
        讲师管理: 'teacherModule',
        培训师管理: 'teacherModule',
        课程管理: 'courseModule',
        系统管理: 'systemModule',
        培训计划管理: 'planModule',
        星火计划: 'sparkModule',
        培训项目管理: 'classModule',
        报表中心: 'reportModule',
        案例中心: 'caseModule',
        潜才培养管理: 'qcStoreModule',
        阶梯培训管理: 'ladderCourseModule'
      },
      defaultProps: {
        children: 'children',
        label: 'orgName',
        isLeaf: 'leaf'
      },
      blgStripLineMaping: {},
      FLTree: [],
      LSTree: [],
      JFTree: [],
      noLineTreeData: []
    }
  },
  methods: {
    clear(options = {}) {
      this.isShow = false
      this.content = []
      this.activeBlgStripLine = []
      this.$nextTick(() => {
        this.isShow = true
      })

      if (options.clearBlgStripLine) {this.blgStripLine = []}
    },
    // 获取条线
    getBlgStripLine(fetchParams) {
      return this.$axios
        .post(
          this.orgUrl,
          { module: this.module, ...this.fetchParams, ...fetchParams },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.blgStripLine = this.handleBusiType(data)
          }
        })
    },
    handleBusiType(data) {
      data.forEach((item) => {
        if (item.busiType === 'LS') {
          item.label = '零售'
        } else if (item.busiType === 'FL') {
          item.label = '非零'
        } else {
          item.label = '金服'
        }
      })
      return data
    },
    // 条线点击事件
    handleClick(item) {
      const { busiType, label } = item
      this.$emit('input', [busiType])
      // this.$emit("change", [busiType]);
      this.$emit('update:busiType', busiType)
      this.content = [label]
      this.activeBlgStripLine = busiType
      const tree = this.blgStripLineMaping[busiType]
      if (!tree.length) {
        const data = { module: this.module, busiType, ...this.fetchParams }
        return this.$axios.post(this.orgUrl, data, jsonHeaders).then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const items = data[0].orgList
            items.forEach((v) => {
              v.leaf = this.level === 1
            })
            this.blgStripLineMaping[busiType] = items
          }
        })
      }
    },
   loadNode(node, resolve) {
      const module = this.module
      const { data, level } = node
      let item
      if (level === 0) {
        return resolve([])
      } else if (!data.blgStripLine) {
        return resolve([])
      } else {
        const { blgStripLine: busiType, orgId } = data
        if (this.leftShow) {
          item = { busiType, orgId, module , ...this.otherParams }
        } else {
          item = {
            orgId,
            ...this.otherParams,
            busiType:
              this.busiType || (module === 'caseModule' ? busiType : undefined),
            module,
          }
        }
        item = {...item, ...this.fetchParams}
      }
      this.$axios.post(this.orgUrl, item, jsonHeaders).then((res) => {
        let { code, data } = res.data
        let results = []
        if (code === 0) {
          if (this.isbranch) {
            data = [{ busiType: 'LS', orgList: data }]
          }
          const items = data[0].orgList
          items.forEach((v) => {
            v.leaf = v.isSpread ? v.isSpread === 'N' : level > this.level - 1
            results.push(v)
          })
        }
        resolve(results)
      })
    },
    handleNodeClick(item) {
      let { blgStripLine, orgId, orgName, isChoose } = item

      // 虚拟节点不允许选择，根据属性开启
      if(!this.allowInvented && item.isInvented === 'Y') {
        this.content = []
        this.$emit('input', [])
        this.$emit('change', '', {})
        return
      }

      if (isChoose === 'N') {
        orgId = orgName = ''
      }
      const data = [blgStripLine, orgId]
      if (this.leftShow) {
        if (this.content.length < 1) {
          this.content.unshift(
            this.blgStripLine.find(
              (v) => v.busiType === this.activeBlgStripLine
            ).label
         )
        }
        this.content.splice(1, 1, orgName)
      } else {
        this.content = [orgName]
      }

      this.$emit('input', data)
      this.$emit('change', orgName, CopyObj(item) || {})
      this.$emit('update:orgId', orgId)
    },
    // 构建树data
    createTreeData(fetchParams) {
      if (this.leftShow) {
        this.getBlgStripLine(fetchParams).then((res) => {
          if (this.defaultShow) {
            if (this.blgStripLine.length < 2) {
              this.handleClick(this.blgStripLine[0]).then((res) => {
                const tree =
                  this.blgStripLineMaping[this.blgStripLine[0].busiType]
                if (tree.length < 2) {
                  this.handleNodeClick(tree[0])
                }
              })
            }
          }
        })
      } else {
        let data = {}
        if (this.busiType) {
          data = { busiType: this.busiType, module: this.module, ...this.otherParams }
        }
        this.$axios.post(this.orgUrl, data, jsonHeaders).then((res) => {
          let { code, data } = res.data
          if (code === 0) {
            if (this.isbranch) {
              data = [{ busiType: 'LS', orgList: data }]
            }
            const items = data[0].orgList
            items.forEach((v) => {
              v.leaf = v.isSpread ? v.isSpread === 'N' : this.level === 1
            })
            this.noLineTreeData = items

            // 添加默认显示
            if (this.defaultShow) {
              this.handleNodeClick(items[0])
              this.$emit('setDataFinish', items[0])
            }
          }
        })
      }
    },
    setContentValue(content) {
      this.content = content
    },
  isNodeDisabled(node, data) {
      if(!this.allowInvented && data.isInvented === 'Y') return true
      return false
    }
  },
  watch: {
    value(newValue) {
      this.thisValue = newValue
      if (newValue.length === 1) {
        const blgStripLine = this.blgStripLine.find(
          (v) => v.busiType === newValue[0]
        )
        blgStripLine && (this.content = [blgStripLine.label])
      } else if (newValue.length < 1) {
        if(!this.allowInvented) return
        this.content = []
        // 添加重置后的默认选中
        if (this.defaultShow && !this.leftShow) {
          this.noLineTreeData.length &&
            this.handleNodeClick(this.noLineTreeData[0])
        }
      }
    }
  },
  created() {
    this.module = this.maping[this.$route.meta]
    this.blgStripLineMaping = {
      LS: this.LSTree,
      FL: this.FLTree,
      JF: this.JFTree
    }
  },
  mounted() {
    this.immediate && this.createTreeData()
  },
  computed: {
    treeData() {
      if (this.leftShow) {
        return this.blgStripLineMaping[this.activeBlgStripLine]
      } else {
        return this.noLineTreeData
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .gc-institution.disabled {
    background-color: #f7f8fa;
    border-color: #e4e7ed;
    cursor: not-allowed;
    :deep(.input) {
      color: #b4b6bc;
    }
  }

  .institution-tree {
    :deep() {
    .el-tree-node {
        .custom-tree-node {
          padding: 3px;
        }
      }
      .el-tree-node.is-current.is-current {
        > .el-tree-node__content {
          .custom-tree-node {
            background-color: #fd6720;
            color: #f5f7fa;
          }

          .custom-tree-node.disabled {
            background-color: #f7f8fa;
            color: #b4b6bc;
          }
        }
      }
    }
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {}
  .custom-tree-node {
    // background-color: #f5f7fa;
    // color: #fd6720;
  }
</style>

<style lang="scss">
.gc-institution {

  .input {
    width: 200px;
    height: 30px;
    padding-left: 10px;
    font-size: 12px;
    line-height: 30px;
    border: 1px solid #e0e1e3;
    color: #000000;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: nowrap;

    .hint {
      color: rgba(#000000, 0.4);
    }

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
    min-width: 200px;
    min-height: 210px;

    padding: 0 !important;
    margin: 2px 0 0 0 !important;

  .blgStripLine {
      width: 100px;
      flex-shrink: 0;
      line-height: 30px;
      border-right: 1px solid #e0e1e3;
      .item {
        display: flex;
        height: 30px;
        padding: 0 4px 0 15px;
        align-items: center;
        justify-content: space-between;
        cursor: default;
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
        width: 100%;
      }
    }

    .tree-wrap {
      min-width: 120px;
      min-height: 210px;
      max-width: 400px;
      max-height: 320px;
      overflow: auto;

      .el-tree {
        min-width: 100%;
        display: inline-block;
      }
      .is-current {
        > .el-tree-node__content {
          background-color: #fff !important;
          color: #fff;
          .el-tree-node__label {
            background-color: #fd6720;
          }
          .el-tree-node__expand-icon.is-leaf {
            color: transparent !important;
          }
        }
      }
      .el-tree-node__content {
        height: 30px;
        padding-right: 15px;
        .el-tree-node__label {
          height: 20px;
          padding: 0 10px;
          line-height: 21px;
          border-radius: 1px;
        }
      }
      .el-tree-node__expand-icon {
        padding-right: 0;
      }
    }

    .popper__arrow {
      display: none !important;
    }
  }
}
</style>
