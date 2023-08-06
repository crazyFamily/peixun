<template>
  <HeadquarterTree
    :tree-options="treeOptions"
    :normalizer="normalizer"
    :disable-branch-nodes="false"
    class="tree-container"
    v-model="treeData"
    :load-options="loadOptions"
  >
    <label
      slot="option-label"
      slot-scope="{
        node,
        shouldShowCount,
        count,
        labelClassName,
        countClassName
      }"
    >
      {{ node.label }}
      <!-- {{ node.isBranch ? 'Branch' : 'Leaf' }}: {{ node.label }}
    <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span> -->
    </label>
  </HeadquarterTree>
  <!-- <treeselect
    class="headquarter-tree"
    :options="treeOptions"
    :auto-load-root-options="false"
    :disabled="disabled"
    no-results-text="暂无数据"
    no-options-text="暂无数据"
    no-children-text="暂无数据"
    v-bind="$attrs"
    v-on="$listeners"
    :normalizer="normalizer"
    :disable-branch-nodes="true"
    v-model="treeData"
    :load-options="loadOptions"
    ref="treeselectRef"
  /> -->
  <!-- always-open -->
</template>

<script>
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import HeadquarterTree from '@/components/tree/HeadquarterTree.vue'
import { fetchUserOrgTree } from '@/fetch/public'
import { LINE_MAP } from '@/util/constants'
export default {
  name: 'TMSOrgTree',

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择...'
    }
  },

  data() {
    return {
      treeData: null,
      treeOptions: null,
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName
        }
      },
      busiType: ''
    }
  },

  watch: {},

  components: {
    HeadquarterTree,
    treeselect
  },

  computed: {},

  mounted() {},

  methods: {
    async loadOptions({ action, parentNode, callback }) {
      if (action === 'LOAD_ROOT_OPTIONS') {
        this._treeRootData()
        callback()
      }
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        let params = {
          orgId: parentNode.orgId,
          busiType: this.busiType,
          module: 'classModule'
        }
        if (Object.keys(LINE_MAP).includes(parentNode.orgId)) {
          params.orgId = ''
        }
        parentNode.children = await this._getTreeData(params, parentNode)
        callback()
      }
    },
    async _treeRootData() {
      // let data = await this._getTreeData({
      //   // busiType: 'LS',
      //   module: 'classModule'
      // })

      let data = await fetchUserOrgTree({
        module: 'classModule'
      })
      let { busiType } = data[0]
      this.treeOptions = [
        {
          busiType,
          orgId: busiType,
          orgName: LINE_MAP[busiType],
          leaf: false,
          children: null,
          isSpread: 'N'
        }
      ]
      this.busiType = busiType
    },
    async _getTreeData(param, parentNode) {
      let res = await fetchUserOrgTree(param)
      let { orgList } = res[0]
      let data = this._formatTreeData(orgList || []).map((item) => ({
        ...item,
        renderName: parentNode ? parentNode.orgName : item.orgName
      }))
      return data
    },
    _formatTreeData(data) {
      return data.map((item) => {
        let res = { ...item, leaf: item.isSpread === 'N' }
        if (item.isSpread === 'Y') {
          res.children = null
        }
        return res
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.headquarter-tree {
  $base-height: 30px;
  min-width: 200px;
  height: $base-height;

  :deep(.vue-treeselect__control) {
    height: $base-height;
    line-height: $base-height;
    border-radius: 3px;
    display: flex;
    align-items: center;
  }

  :deep(.vue-treeselect__value-container) {
    height: 100%;
    line-height: $base-height;
  }

  :deep(.vue-treeselect__placeholder) {
    line-height: $base-height;
  }

  :deep(.vue-treeselect__input-container) {
    position: absolute;
    width: 100%;
    height: $base-height;
    line-height: $base-height;
    box-sizing: border-box;
    top: 0;
  }

  :deep(.vue-treeselect__single-value) {
    height: 100%;
    line-height: $base-height;
  }

  :deep(.vue-treeselect__input) {
    outline: none;
  }

  :deep(.vue-treeselect__option--selected) {
    background-color: rgb($themeColor, 0.3);
  }

  :deep(.vue-treeselect__option) {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  :deep(.vue-treeselect__value-remove) {
    display: flex;
    align-items: center;
    height: 100%;
  }

  :deep(.vue-treeselect__value-remove) {
    color: $themeColor;
  }

  :deep(.vue-treeselect__multi-value-item) {
    height: 28px;
    background-color: rgba(253, 103, 32, 0.3);
    color: #000;
    line-height: 0;
    padding: 0;
  }

  :deep(.vue-treeselect__multi-value-item-container) {
    padding-top: 0;
  }

  :deep(.vue-treeselect__input-container) {
    padding-top: 0 !important;
  }

  :deep(.vue-treeselect__checkbox--checked) {
    border-color: $themeColor;
    background: $themeColor;
  }
}

:deep(.headquarter-tree.vue-treeselect--disabled) {
  .vue-treeselect__control {
    background-color: #f7f8fa;
    border-color: #e4e7ed;
    color: #b4b6bc;
  }
  .vue-treeselect__single-value {
    color: #b4b6bc;
  }
}

:deep(.headquarter-tree.vue-treeselect--focused:not(.vue-treeselect--open)) {
  .vue-treeselect__control {
    border-color: $themeColor;
    box-shadow: 0 0 0 3px rgb($themeColor, 0.1);
  }
}
</style>
