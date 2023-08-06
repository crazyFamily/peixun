<template>
  <el-tree ref="treeRef" class="edit-tree" v-bind="$attrs" v-on="$listeners">
    <div class="custom-tree-node" slot-scope="{ node, data }">
      <div v-show="!data.edit" class="aic">
        <span class="custom-tree-node__label">{{ node.label }}</span>
        <div class="custom-tree-node__operation icons">
          <span @click.stop="edit(data, node)" class="icons__edit"
            ><i class="icons__edit__icon"></i> 编辑</span
          >
          <span
            v-if="!data.addHide"
            @click.stop="add(data, node)"
            class="icons__add"
          >
            <i class="icons__add__icon"></i>
            添加</span
          >
          <span
            @click.stop="del(data, node)"
            class="icons__del"
            v-if="!data.children && data.tagLevel !== '0'"
          >
            <i class="icons__del__icon"></i>
            删除</span
          >
        </div>
      </div>
      <div v-show="data.edit">
        <input type="text" v-model.trim="data.beek" :maxlength="maxlength" />
        <span
          class="custom-tree-node__operation__save"
          @click="save(data, node)"
          >保存</span
        >
        <span
          class="custom-tree-node__operation__cancel"
          @click="cancel(data, node)"
          >取消</span
        >
      </div>
    </div>
  </el-tree>
</template>

<script>
export default {
  name: 'editTree',
  inheritAttrs: false,
  props: {
    maxlength: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {}
  },
  methods: {
    edit(data, node) {
      this.$emit('edit', data, node)
    },
    add(data, node) {
      this.$emit('add', data, node)
    },
    del(data, node) {
      this.$emit('del', data, node)
    },
    save(data, node) {
      this.$emit('save', data, node)
    },
    cancel(data, node) {
      this.$emit('cancel', data, node)
    }
  }
}
</script>

<style lang="scss">
.edit-tree {
  .el-tree-node,
  .is-current,
  .is-focusable {
    .el-tree-node__content {
      background-color: #fff !important;
    }
  }
  .el-tree-node__content {
    height: 30px;
    &:hover {
      background-color: #fff;
    }
  }
  .custom-tree-node {
    display: flex;
    align-items: center;

    &__label {
      margin-right: 35px;
    }

    &:hover .custom-tree-node__operation {
      display: flex;
    }

    &__operation {
      display: none;
      margin-top: 3px;
      span {
        color: #fd6720;
      }

      &__save,
      &__cancel {
        padding: 0 10px;
        border-right: 1px solid #e0e1e3;
        color: #fd6720;
        cursor: pointer;
      }
      &__cancel {
        border-right: none;
      }
    }

    input {
      width: 250px;
      height: 30px;
      padding-left: 10px;
      border: 1px solid #e0e1e3;
      font-size: 12px;
    }

    &:hover {
      color: #fd6720;
    }
  }
}
</style>
