<template>
  <div class="gc-addApportionUnit">
    <span class="icons__add active" :class="className" @click="visible = true">
      <i class="icons__add__icon"></i>
      新增
    </span>

    <gc-model
      title="添加分摊单位"
      :visible="visible"
      width="800px"
      custom-class="gc-addApportionUnit__apportion-unit__tree-box"
      @close="visible = false"
      @cancel="visible = false"
      @comfirm="comfirm"
    >
      <div class="tree-wrap" v-if="visible">
        <el-tree
          lazy
          accordion
          show-checkbox
          check-strictly
          :load="loadNode"
          :props="{
            children: 'children',
            label: 'orgName'
          }"
          :highlight-current="true"
          ref="tree"
        ></el-tree>
      </div>
    </gc-model>
  </div>
</template>

<script>
import $ from 'jquery'
import { jsonHeaders } from '../../util/utils'
export default {
  props: {
    blgStripLine: {
      type: String,
      default: ''
    },
    module: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: '/fn/user/selectAllTree'
    },
    otherParams: {  // 新增立项需要增加入参展示二级分行数据
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // dialog显示状态
      visible: false
    }
  },
  methods: {
    treeData() {
      const blgStripLine =
        this.blgStripLine || this.$store.state.userInfo.blgStripLine
      if (blgStripLine !== 'JF') {
        if (blgStripLine === 'CX') {
          return [
            {
              orgName: '橙信',
              blgStripLine: 'CX'
            }
          ]
        }
        return [
          {
            orgName: '零售',
            blgStripLine: 'LS'
          },
          {
            orgName: '非零',
            blgStripLine: 'FL'
          }
        ]
      } else {
        return [
          {
            orgName: '金服',
            blgStripLine: 'JF'
          }
        ]
      }
    },
    // 树组件 加载数据函数
    loadNode(node, resolve) {
      const module = this.module
      const { data, level } = node
      let item
      if (level === 0) {
        resolve(this.treeData())
        this.$nextTick(() => {
          $('label.el-checkbox').css({ display: 'none' })
        })
        return
      } else if (!data.blgStripLine) {
        return resolve([])
      } else {
        const { blgStripLine: busiType, orgId } = data
        item = { busiType, orgId, module, ...this.otherParams }
      }
      this.$axios.post(this.url, item, jsonHeaders).then((res) => {
        const { code, data } = res.data
        let results = []
        if (code === 0) {
          const items = data[0].orgList
          this.$emit('handleNodeList', items, node)
          results = items
        }
        resolve(results)
      })
    },
    comfirm() {
      const nodeList = this.$refs.tree.getCheckedNodes()
      if (!nodeList.length) {
        return (this.visible = false)
      }
      const data = nodeList.map((node) => {
        return {
          blgOrgName: node.orgName,
          blgStripLine: node.blgStripLine,
          blgOrg: node.orgId
        }
      })
      this.$emit('addApportionUnit', data)
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.gc-addApportionUnit {
  &__apportion-unit {
    &__tree-box {
      box-shadow: 0 4px 10px 0 rgba($color: #424656, $alpha: 0.08);
      .tree-wrap {
        .el-tree {
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
        }
      }
    }
  }
}
</style>