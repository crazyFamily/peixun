<template>
  <el-dropdown class="gc-institution" :style="{ width: width }" trigger="click" placement="bottom-start" :disabled="disabled">
    <div class="input" :style="{ width: '100%' }">
      <span v-if="content">
        {{ content }}
      </span>
      <span v-else class="hint">
        {{ placeholder }}
      </span>

      <i class="el-icon-arrow-down"></i>
    </div>
    <el-dropdown-menu slot="dropdown" class="gc-institution__dropdown-box">
      <el-tree
        ref="qcorgTreeRef"
        :current-node-key="thisValue"
        accordion
        node-key="qCCode"
        :data="treeData"
        :props="defaultProps"
        :highlight-current="true"
        @node-click="handleNodeClick"
        class="qcorg-tree"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">{{ data.qCMsg }}</span>
      </el-tree>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script setup>
import { CopyObj } from '@/util/utils'
import { ref, nextTick, watch, computed } from 'vue'
const props = defineProps({
  value: {
    default: ''
  },
  orgList: {
    default: []
  },
  placeholder: {
    type: String,
    default: '选择机构'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '200px'
  }
})
const emits = defineEmits(['input', 'change', 'update:qCCode'])
const content = ref('')
const thisValue = ref('')
const defaultProps = {
  children: 'subLine',
  label: 'qCMsg'
}
const handleNodeClick = (item) => {
  let { qCCode, qCMsg } = item
  content.value = qCMsg
  emits('input', qCCode)
  emits('change', qCMsg, CopyObj(item) || {})
  emits('update:qCCode', qCCode)
}
const findContent = (list) => {
  nextTick(() => {
    list.forEach((v) => {
      if (Array.isArray(v.subLine) && v.subLine.length) {
        findContent(v.subLine)
      } else {
        if (props.value === v.qCCode) {
          content.value = v.qCMsg
        }
      }
    })
  })
}
const treeData = computed(() => {
  content.value = ''
  findContent(props.orgList)
  return props.orgList
})
watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      thisValue.value = newValue
      findContent(treeData.value)
    } else {
      thisValue.value = ''
    }
  },
  { immediate: true }
)
</script>
<script>
export default {
  name: 'qc-orgTree'
}
</script>
<style lang="scss" scoped>
.qcorg-tree {
  width: 100%;
  max-width: 400px;
  max-height: 320px;
  overflow: auto;
}
.custom-tree-node {
  padding: 3px;
}
.qcorg-tree {
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
</style>