<template>
  <div class="gc-curriculumClassification" ref="curriculumClassification">
    <div
      class="gc-curriculumClassification__input"
      :class="{ disabled }"
      @click="openDropDown"
    >
      <span v-show="labelName">{{ labelName }}</span>
      <span v-show="!labelName" class="placeholder">
        {{ placeholder }}
      </span>

      <i
        slot="suffix"
        class="gc-curriculumClassification__input__icon el-icon-arrow-down"
        :class="{
          'is-reverse': newAddIsShowCurriculumClassification
        }"
      ></i>
    </div>
    <div
      class="curriculumClassification"
      v-show="newAddIsShowCurriculumClassification"
    >
      <!-- <div class="curriculumClassification__search">
                <el-input placeholder="输入选择" v-model.trim="searchValue">
                    <i
                        slot="suffix"
                        class="page-input__search"
                        @click="search"
                    ></i>
                </el-input>
            </div> -->
      <div class="curriculumClassification__tree mt20">
        <el-tree
          v-if="!isReset"
          node-key="tagId"
          highlight-current
          check-on-click-node
          ref="curriculumClassificationTree"
          :props="{ label: 'tagName' }"
          :data="curriculumClassificationTreeData"
          :default-expanded-keys="expandedKeys"
          @node-click="handleClick"
          :filter-node-method="filterNodeMethod"
        ></el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { jsonHeaders, getCurriculumTree } from '../../../util/utils'
export default {
  props: {
    value: {
      type: null,
      default: undefined
    },
    courseClassify: {
      type: null,
      default: undefined
    },
    disabled: {
      type: null,
      default: undefined
    },
    blgStripLine: {
      type: null,
      default: undefined
    },
    tree: {
      type: null,
      default: undefined
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 课程分类搜索树是否显示
      newAddIsShowCurriculumClassification: false,
      // 树的数据
      curriculumClassificationTreeData: [],
      // v-model 绑定的值
      thisValue: '',
      // 显示的标签名
      labelName: '',
      // 搜索框的值
      searchValue: '',
      // 展开行
      expandedKeys: [],
      isReset: false
    }
  },
  methods: {
    handleClick(item, node) {
      if (item.children) return
      const results = []
      this.findParent(
        this.curriculumClassificationTreeData,
        item.tagId,
        results
      )
      this.labelName = results.map((v) => v.tagName).join('/')
      this.$emit('input', item.tagId)
      this.$emit('change')
    },
    filterNodeMethod() {},
    // 搜索符合条件的
    search() {
      if (!this.searchValue) return
      const id = this.findId(
        this.curriculumClassificationTreeData,
        this.searchValue
      )
      this.expandedKeys.splice(0, this.expandedKeys.length)

      if (id) {
        this.expandedKeys.push(id)
        this.currentKey = id
        this.$nextTick(() => {
          $(`.el-tree-node__label:contains(${this.searchValue})`).trigger(
            'click'
          )
          this.$refs.curriculumClassificationTree.setCurrentKey(id)
        })
      } else {
        this.$refs.curriculumClassificationTree.setCurrentKey(null)
      }
    },
    // 查找符合条件的id
    findId(arr, val) {
      if (!arr) return
      for (let i = 0, len = arr.length; i < len; i++) {
        const item = arr[i]
        if (item.tagName === val) {
          return item.tagId
        }
        const id = this.findId(item.children, val)
        if (id) {
          return id
        }
      }
    },
    // 查找 点击节点的祖先 对象
    findParent(tree, id, results) {
      for (let i = 0, len = tree.length; i < len; i++) {
        const item = tree[i]
        if (item.tagId === id) {
          results.push(item)
          return id
        }
        if (!item.children) continue
        const _id = this.findParent(item.children, id, results)
        if (_id) {
          results.unshift(item)
          return _id
        }
      }
    },
    // 打开关闭下拉框
    openDropDown() {
      if (this.disabled) return
      this.newAddIsShowCurriculumClassification =
        !this.newAddIsShowCurriculumClassification
    },
    $reset() {
      this.thisValue = ''
      this.labelName = ''
      this.searchValue = ''
      this.expandedKeys = []
      this.isReset = true
      this.$nextTick(() => {
        this.isReset = false
      })
    },
    updateValue() {
      const results = []
      this.findParent(
        this.curriculumClassificationTreeData,
        this.thisValue,
        results
      )
      this.labelName = results.map((v) => v.tagName).join('/')
    }
  },
  mounted() {
    if (Array.isArray(this.tree)) {
      this.curriculumClassificationTreeData = this.tree
    }
    const that = this
    $(document).bind('click', function (e) {
      const ele = $(e.target).closest('.gc-curriculumClassification')
      if (ele.length === 0) {
        that.newAddIsShowCurriculumClassification = false
      }
    })
    if (this.thisValue) {
      const results = []
      this.findParent(
        this.curriculumClassificationTreeData,
        this.thisValue,
        results
      )
      this.labelName = results.map((v) => v.tagName).join('/')
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.thisValue = newValue
      if (newValue === '' && oldValue !== '') {
        this.$reset()
      } else if (newValue !== '') {
        this.updateValue()
      }
    },
    blgStripLine: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          getCurriculumTree(1, newValue, 1, this.url).then((data) => {
            this.curriculumClassificationTreeData = data
            this.updateValue()
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gc-curriculumClassification {
  position: relative;
  flex: 1;
  &__input {
    height: 30px;
    padding-left: 10px;
    border: 1px solid #dcdfe6;
    cursor: pointer;
    line-height: 30px;

    &__icon {
      float: right;
      margin: 8px 10px 0 0;
    }
  }

  .curriculumClassification {
    position: absolute;
    width: 100%;
    height: 400px;
    background-color: #fff;
    box-shadow: 0 2px 10px 0 rgba(66, 70, 86, 0.08);
    border-radius: 2px;
    z-index: 11;
    overflow-y: auto;

    &__search {
      :deep(.el-input) {
        width: 100%;
      }
      :deep(input.el-input__inner) {
        border-color: #dcdfe6 !important;
      }
    }
  }
}
</style>