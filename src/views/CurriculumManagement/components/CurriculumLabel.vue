<template>
  <div class="f1">
    <div class="gc-newAdd__tag-box">
      <el-col :span="22">
        <div class="newAdd__tag-box">
          <div class="newAdd__tag-box__wrapper">
            <span
              class="newAdd__tag-box__item ml10"
              v-for="item in selectTagListReal"
              :key="item.tagId"
              >{{ item.tagName }}</span
            >
          </div>
        </div>
      </el-col>
      <el-col :span="2" class="newAdd__right" v-if="isShowAdd">
        <span class="icons__add r0" @click="openSelectTagDialog">
          <i class="icons__add__icon"></i>
          添加
        </span>
      </el-col>
    </div>
    <!-- 新增面授课程-选择标签dialog -->
    <gc-model
      title="选择标签"
      width="1100px"
      :visible="selectTagVisible"
      @close="
        selectTagVisible = false
        addInternalCurriculumIsCheckAll = false
        addInternalCurriculumSelectedTag = []
      "
      @cancel="selectTagVisible = false"
      @comfirm="selectTagComfirm"
      class="selectTag common-dialog-no-flex"
    >
      <div class="common-dialog-no-flex__box selectTag__box">
        <div class="selectTag__box__selected">
          <div>
            <span class="mr10"> 已选标签 </span>

            <span
              class="selectTag__box__selected__tag tag ml10"
              v-for="(item, index) in selectTagList"
              :key="item.tagId"
            >
              {{ item.tagName }}
              <i class="el-icon-close" @click="delTag(index)"></i>
            </span>
          </div>
          <div class="active selectTag__box__selected__clear" @click="allClear">
            <i class="icon__clear"></i>
            全部清除
          </div>
        </div>
        <div class="selectTag__box__content">
          <div class="selectTag__box__content__left">
            <el-tree
              v-if="!isReset"
              node-key="tagId"
              ref="selectTagTree"
              highlight-current
              check-on-click-node
              :props="{ label: 'tagName' }"
              :data="selectTagTreeData"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
          <div class="selectTag__box__content__right">
            <el-checkbox
              :indeterminate="addInternalCurriculumIsIndeterminate"
              v-model="addInternalCurriculumIsCheckAll"
              @change="addInternalCurriculumHandleCheckAllChange"
              class="selectTag__box__content__right__checkall"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="addInternalCurriculumSelectedTag"
              @change="addInternalCurriculumHandleCheckedTagChange"
            >
              <el-checkbox
                v-for="tag in addInternalCurriculumTagList"
                :label="tag"
                :key="tag.tagId"
                @change="boxChange($event, tag)"
                class="selectTag__box__content__right__tag"
              >
                <span class="ellipsis w-full">{{ tag.tagName }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </gc-model>
  </div>
</template>

<script>
import { jsonHeaders, getCurriculumTree, CopyObj } from '../../../util/utils'
export default {
  props: {
    blgStripLine: null,
    courseTag: null,
    disabled: null,
    tree: null,
    value: null,
    url: null,
    maxValue: {
      type: Number,
      default: 10
    },
    tagType: {
      type: Number,
      default: 2
    },
    isShowAdd: {
      type: Boolean,
      default: true
    },
    // 前置规则
    precedRules: {
      type: Function,
    }
  },
  data() {
    return {
      // 选择标签dialog 状态
      selectTagVisible: false,
      // 选择标签dialog 里标签树 data
      selectTagTreeData: [],
      // 选择标签dialog 里 已选中的标签数组 真正添加的
      selectTagListReal: [],
      // 选择标签dialog 里 已选中的标签数组 展示用的
      selectTagList: [],
      // 新增内部课程 dialog 分类标签列表
      addInternalCurriculumTagList: [],
      // 新增内部课程 dialog 分类标签列表  选中的标签数组
      addInternalCurriculumSelectedTag: [],
      // 所有的选择标签
      allSelect: [],
      // 新增内部课程 dialog 分类标签 用于实现全选的效果
      addInternalCurriculumIsIndeterminate: false,
      // 新增内部课程 dialog 分类标签 是否全选
      addInternalCurriculumIsCheckAll: false,
      isReset: false,
      newCourseTag: ''
    }
  },
  methods: {
    // 新增内部课程 dialog 分类标签列表  选择变化处理事件
    addInternalCurriculumHandleCheckedTagChange() {
      const len = this.addInternalCurriculumSelectedTag.length
      this.addInternalCurriculumIsIndeterminate =
        len > 0 && len < this.addInternalCurriculumTagList.length
      this.addInternalCurriculumIsCheckAll =
        this.addInternalCurriculumTagList.length === 0
          ? false
          : len === this.addInternalCurriculumTagList.length
    },
    // 新增内部课程 dialog 分类标签列表 处理全选按钮 change事件
    addInternalCurriculumHandleCheckAllChange(val) {
      this.addInternalCurriculumSelectedTag = val
        ? [...this.addInternalCurriculumTagList]
        : []
      this.addInternalCurriculumIsIndeterminate = false
      if (val) {
        this.addInternalCurriculumTagList.forEach((v) => {
          if (!this.allSelect.includes(v)) {
            this.allSelect.push(v)
          }
        })
      } else {
        this.addInternalCurriculumTagList.forEach((v) => {
          const index = this.allSelect.findIndex((item) => item === v)
          if (index >= 0) {
            this.allSelect.splice(index, 1)
          }
        })
      }
    },
    // 清除全部已选中标签
    allClear() {
      this.selectTagList = this.allSelect = []
      this.addInternalCurriculumSelectedTag = []
      this.addInternalCurriculumIsIndeterminate = false
      this.addInternalCurriculumIsCheckAll = false
    },
    // 过滤树
    filterNode(val, data, node) {
      // if (!data.children) {
      //   return false
      // }
      return true
    },
    // 打开dialog
    openSelectTagDialog() {
      if (this.disabled) return
      if(this.precedRules) {
        if(!this.precedRules()) return
      }
      this.allSelect = [...this.selectTagListReal]
      this.selectTagList = this.allSelect
      if (this.addInternalCurriculumTagList.length) {
        this.selectedTag()
      }

      this.selectTagVisible = true
      if (!this.$refs.selectTagTree) {
        this.$nextTick(() => {
          this.$refs.selectTagTree.filter()
        })
      }
    },
    // node 点击回掉事件
    handleNodeClick(data, node) {
      this.addInternalCurriculumSelectedTag = []
      this.addInternalCurriculumTagList = data.children
        ? data.children.filter((v) => !v.children?.length)
        : [data]
      this.selectedTag()
    },
    // 勾选已选择的标签
    selectedTag() {
      this.allSelect.forEach((v) => {
        if (this.addInternalCurriculumTagList.includes(v)) {
          this.addInternalCurriculumSelectedTag.push(v)
        }
      })
      this.addInternalCurriculumHandleCheckedTagChange()
    },
    // 选择标签确定事件
    selectTagComfirm() {
      if (this.allSelect.length > this.maxValue) {
        return this.$message.warning(`最多选择${this.maxValue}个标签`)
      }
      this.selectTagListReal = this.allSelect

      this.selectTagVisible = false
      const ids = this.selectTagListReal.map((v) => v.tagId).join(',')
      this.$emit('change', ids)
      this.$emit('input', ids)
    },
    // 删除一个标签
    delTag(index) {
      const items = this.selectTagList.splice(index, 1)
      let index_ = this.addInternalCurriculumSelectedTag.findIndex(
        (v) => v === items[0]
      )
      this.addInternalCurriculumSelectedTag.splice(index_, 1)
      const i = this.addInternalCurriculumTagList.findIndex(
        (v) => v === items[0]
      )
      this.addInternalCurriculumIsIndeterminate = i > -1 ? true : false
      index_ = this.allSelect.findIndex((v) => v === items[0])
      if (index_ > -1) {
        this.allSelect.splice(index_, 1)
      }
      if (this.addInternalCurriculumSelectedTag.length <= 0) {
        this.addInternalCurriculumIsIndeterminate = false
        this.addInternalCurriculumIsCheckAll = false
      }
    },
    // 多选框change事件
    boxChange(flag, tag) {
      if (flag) {
        this.allSelect.push(tag)
      } else {
        const index = this.allSelect.findIndex((v) => v === tag)
        this.allSelect.splice(index, 1)
      }
    },
    getObj(id, tree) {
      for (let i = 0, len = tree.length; i < len; i++) {
        const item = tree[i]
        if (id == item.tagId) return item
        if (item.children && item.children.length > 0) {
          const obj = this.getObj(id, item.children)
          if (obj) return obj
        }
      }
    },
    reset() {
      this.selectTagListReal = []
      this.selectTagList = []
      this.addInternalCurriculumTagList = []
      this.addInternalCurriculumSelectedTag = []
      this.addInternalCurriculumIsIndeterminate = false
      this.addInternalCurriculumIsCheckAll = false
      this.isReset = true
      this.$nextTick(() => {
        this.isReset = false
      })
    },
    updateValue() {
      const courseTag = this.newCourseTag || this.courseTag
      if (!courseTag) return
      const ids = courseTag.split(',')
      this.selectTagListReal = ids
        .map((id) => this.getObj(id, this.selectTagTreeData))
        .filter((v) => v)
    },
    getDeepParent(item) {
      item.parent = this.getObj(item.parentTagId, this.selectTagTreeData)

      if (item.parent) {
        item.parent = CopyObj(item.parent)
        this.getDeepParent(item.parent)
      }
      return item
    },
    getArrayObject() {
      const result = CopyObj(this.selectTagListReal)
      result.forEach((v) => this.getDeepParent(v))
      return result
    },
    _initData(){
      if (Array.isArray(this.tree)) {
        this.selectTagTreeData = this.tree
      }
      if (this.courseTag) {
        const ids = this.courseTag.split(',')
        this.selectTagListReal = ids
          .map((id) => this.getObj(id, this.selectTagTreeData))
          .filter((v) => v)
      }
    }
  },
  mounted() {
    this._initData()
  },
  watch: {
    tree() {
      this._initData()
    },
    blgStripLine: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          getCurriculumTree(this.tagType, newValue, 1, this.url).then(
            (data) => {
              this.selectTagTreeData = data
              this.updateValue()
              this.$nextTick(() => {
                this.$refs.selectTagTree && this.$refs.selectTagTree.filter()
              })
            }
          )
        }
      }
    },
    courseTag(newValue, oldValue) {
      this.newCourseTag = newValue
      if (newValue === '' && oldValue !== '') {
        this.reset()
      } else if (newValue !== '') {
        this.updateValue()
      }
    },
    value(newValue, oldValue) {
      this.newCourseTag = newValue
      if (newValue === '' && oldValue !== '') {
        this.reset()
      } else if (newValue !== '') {
        this.updateValue()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.newAdd {
  &__tag-box {
    min-height: 30px;
    padding-top: 4px;
    margin-bottom: -10px;
    border-top: 1px solid #e0e1e3;
    overflow: hidden;
    &__wrapper {
      position: relative;
      display: flex;
      min-height: 35px;
      top: -10px;
      padding-bottom: 4px;
      flex-wrap: wrap;
      border: 1px solid #e0e1e3;
      border-top: none;
    }
    &__item {
      margin-top: 10px;
      padding: 2px 10px;
      height: 20px;
      background-color: #f7f8fa;
      color: #424656;
      border-radius: 2px;
      line-height: 17px;
    }
  }
  &__right {
    height: 30px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.selectTag {
  &__box {
    &__selected {
      display: flex;
      min-height: 60px;
      padding: 14px 20px;
      border-bottom: 1px solid #eaecf1;
      align-items: center;
      justify-content: space-between;

      :deep(.icon__clear) {
        margin-right: 6px;
      }

      &__clear {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        align-self: start;
      }
    }
    &__content {
      height: 380px;
      display: flex;
      &__left {
        width: 200px;
        padding: 20px;
        border-right: 1px solid #eaecf1;
        overflow: auto;

        :deep() {
          .el-tree {
            min-width: 100%;
            display: inline-block !important;
          }
        }
      }
      &__right {
        flex: 1;
        padding: 20px 0 20px 20px;
        &__checkall {
          margin-bottom: 7px;
          line-height: 1 !important;
        }
        &__tag {
          width: calc((100% - 140px) / 4);
          margin-top: 20px;
          line-height: 1 !important;
          :deep(.el-checkbox__label) {
            width: calc(100% - 16px);
            vertical-align: bottom;
          }
        }

        :deep(.el-checkbox-group) {
          line-height: 1 !important;
        }
      }
    }
  }
}
</style>
