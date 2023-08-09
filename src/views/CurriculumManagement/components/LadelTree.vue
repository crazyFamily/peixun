<template>
  <div class="curriculumManagement__labelTree">
    <div class="curriculumManagement__labelTree__title">
      <div class="title mr20">
        <span class="title__menu"></span>
        {{ title }}
      </div>
      <el-button class="button-60 ml10" @click="batchImport"
        >批量导入</el-button
      >
    </div>
    <div class="curriculumManagement__labelTree__tree mt20">
      <el-tree
        ref="treeRef"
        node-key="tagId"
        :data="treeData"
        :expand-on-click-node="false"
        :props="{ label: 'tagName' }"
        :default-expanded-keys="expandedKeys"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div v-show="!data.edit" class="df h18">
            <span class="custom-tree-node__label" @click="expansion">{{
              node.label
            }}</span>
            <div class="custom-tree-node__operation icons">
              <span
                @click="
                  () => {
                    edit(data)
                  }
                "
                class="icons__edit"
                ><i class="icons__edit__icon"></i> 编辑</span
              >
              <span @click="add(data, node)" class="icons__add">
                <i class="icons__add__icon"></i>
                添加</span
              >
              <span @click="moveNode(node, data, 'up')" v-if="node.previousSibling" class="pl0 icons__add">
                <i class="el-icon-top"></i>上移
              </span>
              <span @click="moveNode(node, data, 'down')" v-if="node.nextSibling" class="pl0 icons__add">
                <i class="el-icon-bottom"></i>下移
              </span>
              <span
                @click="del(node, data)"
                class="icons__del"
                v-if="!data.children && data.tagLevel !== '0'"
              >
                <i class="icons__del__icon"></i>
                删除</span
              >
            </div>
          </div>
          <div v-show="data.edit">
            <input type="text" v-model.trim="data.beek" />
            <span class="custom-tree-node__operation__save" @click="save(data)"
              >保存</span
            >
            <span
              class="custom-tree-node__operation__cancel"
              @click="cancel(node, data)"
              >取消</span
            >
          </div>
        </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { CopyObj, jsonHeaders } from '../../../util/utils'
import { APICheckTagUsedStatus, fetchUpdateTagSort } from '@/fetch/caseCenter'
import { APICheckCourseTagIsRef } from '@/fetch/courseRecommendation'
export default {
  // caseTags: 添加节点时需要allPrnNode入参，删除校验接口不一样，不需要查询findOrgCategoryInfo
  props: ['title', 'dataList', 'modificationPart', 'tagType', 'blgStripLine', 'caseTags'],
  data() {
    return {
      treeData: [],
      expandedKeys: ['0','tag001'],
      orgCategoryInfo: ''
    }
  },
  methods: {
    // 移动节点
    moveNode(node, data, desc) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.tagId === data.tagId)
      if (desc === 'up') {
        this.$refs.treeRef.remove(data)
        this.$refs.treeRef.insertBefore(data, children[index - 1])
      } else {
        this.$refs.treeRef.remove(data)
        this.$refs.treeRef.insertAfter(data, children[index])
      }
      // 移动节点时，重新对当前层级数据进行排序并存储，用户点保存时传给后台
      this.sortData(children)
    },
    cureData(arr) {
      arr.forEach((v) => {
        v.edit = false
        v.beek = ''
        if (v.children) {
          this.cureData(v.children)
        }
      })
    },
    // 编辑节点
    edit(data) {
      data.beek = data.tagName
      data.edit = true
    },
    // 添加节点
    add(data, node) {
      if (parseInt(data.tagLevel) + 1 > 5) {
        return this.$message.warning('标签最多五层')
      }
      if (!data.children) {
        Reflect.deleteProperty(data, 'children')
        this.$set(data, 'children', [])
      }
      const addTagId = +new Date()
      const newNode = {
        parentTagId: data.tagId,
        tagId: addTagId,
        tagName: '',
        tagLevel: parseInt(data.tagLevel) + 1,
        edit: true,
        beek: '',
        allPrnNode: data.allPrnNode ? (data.allPrnNode + '|' + addTagId) : addTagId,
        allPrnNodeDesc: data.allPrnNodeDesc || '',
        orgCategory:
          this.blgStripLine === 'LS'
            ? data.orgCategory || this.orgCategoryInfo || ''
            : ''
      }
      if (data.syncId) {
        newNode.parentSyncId = data.syncId
      }
      data.children.push(newNode)
      // 新增节点时，重新对当前层级数据进行排序并存储，用户点保存时传给后台
      this.sortData(data.children)
      this.expandedKeys = [data.tagId]
      this.setProperty(newNode)
      this.modificationPart.addList.push(newNode)
      if (data.tagLevel === '0') {
        this.treeData = [data]
      }
    },
    // 删除节点
    del(node, data) {
      if (this.tagType == 3 || this.tagType == 4) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout'
        }).then(() => {
          this.delSelect(node, data)
        })
      } else {
        this.delSelect(node, data)
      }
    },
    delSelect(node, data) {
      const children = node.parent.data.children || node.parent.children
      const index = children.findIndex((v) => v.tagId === data.tagId)
      let url = APICheckCourseTagIsRef
      if (this.caseTags) {
        url = APICheckTagUsedStatus
      }
      if (data.id) {
        this.$axios
          .post(
            url,
            {
              data: {
                tagId: data.tagId,
                tagType: this.tagType,
                blgStripLine: this.blgStripLine
              }
            },
            jsonHeaders
          )
          .then((res) => {
            const { code, data: status } = res.data
            if (code === 0) {
              if (status === 0) {
                if (index >= 0) {
                  // 删除时需要把排序对应的tagId删除，并且过滤掉新增对应的标签
                  this.modificationPart.sortList = this.modificationPart.sortList.filter(v => v.tagId !== data.tagId)
                  this.modificationPart.addList = this.modificationPart.addList.filter(v => v.tagId !== data.tagId)
                  children.splice(index, 1)
                  this.setProperty(data)
                  this.modificationPart.deleteList.push(data)
                }
              } else {
                this.$message.warning('标签使用中 不能删除')
              }
            }
          })
      } else {
        this.modificationPart.sortList = this.modificationPart.sortList.filter(v => v.tagId !== data.tagId)
        this.modificationPart.addList = this.modificationPart.addList.filter(v => v.tagId !== data.tagId)
        children.splice(index, 1)
      }
    },
    // 批量导入 事件
    batchImport() {
      this.$emit('batchImport')
    },
    // 点击标签名展开标签
    expansion($event) {
      $($event.target).parent().parent().prev().click()
    },
    // 保存
    save(data) {
      if (!data.beek) return
      if (data.tagName.trim() === data.beek.trim()) {
        data.edit = false
        return
      }
      data.tagName = data.beek
      const allPrnNodeDescList = data.allPrnNodeDesc.split('|')
      allPrnNodeDescList[allPrnNodeDescList.length - 1] = data.tagName
      console.log(allPrnNodeDescList);
      data.allPrnNodeDesc = allPrnNodeDescList.join('|')
      // data.allPrnNodeDesc = data.allPrnNodeDesc ? data.allPrnNodeDesc + '|' + data.tagName : data.tagName
      data.edit = false
      if (data.id) {
        const index = this.modificationPart.updateList.findIndex(
          (v) => v.tagId === data.tagId
        )
        if (index < 0) {
          this.setProperty(data)
          this.modificationPart.updateList.push(data)
        }
      }
    },
    // 取消
    cancel(node, data) {
      if (!data.beek) {
        const children = node.parent.data.children || node.parent.children
        const index = children.findIndex((v) => v.tagId === data.tagId)
        if (index > -1) {
          children.splice(index, 1)
          const i = this.modificationPart.addList.findIndex(
            (n) => n.tagId === data.tagId
          )
          if (i > -1) {
            this.modificationPart.addList.splice(i, 1)
          }
        }
        data.edit = false
      }
      data.edit = false
    },
    setProperty(obj) {
      obj.tagType = this.tagType
      obj.blgStripLine = this.blgStripLine
    },
    findOrgCategoryInfo() {
      this.$axios
        .post('/fn/course/tag/findOrgCategoryInfo', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.orgCategoryInfo = data
          }
        })
    },
    sortData (list){
      list.forEach((v, i) => {
        v.tagSort = i + 1
        const changeNode = this.modificationPart.sortList.find(s => s.tagId === v.tagId)
        if (changeNode) {
          changeNode.tagSort = i + 1
        } else {
          this.modificationPart.sortList.push({
            tagId: v.tagId,
            tagSort: v.tagSort
          })
        }
      })
    }
  },
  mounted() {
    this.cureData(this.dataList)
    this.treeData = CopyObj(this.treeData)
    if (!this.caseTags) {
      this.findOrgCategoryInfo()
    }
  },
  watch: {
    dataList(newValue) {
      this.cureData(newValue)
      this.treeData = CopyObj(newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.curriculumManagement__labelTree {
  &__title {
    display: flex;
    align-items: center;
  }
  .el-tree-node__content:hover .custom-tree-node__operation {
    display: flex;
  }
  &__tree {
    margin-left: 7px;

    .custom-tree-node {
      display: flex;
      align-items: center;

      &__label {
        margin-right: 35px;
      }

      .pl0 {
        padding-left: 0 !important;
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

      .h18 {
        height: 18px;
      }
    }

    :deep(.el-tree-node) {
      .el-tree-node__content {
        height: 32px;
        &:hover {
          background-color: #fff;
        }
      }
    }
    :deep(.el-tree > .el-tree-node) {
      display: inline-block;
    }
    :deep(.el-tree-node),
    :deep(.is-current),
    :deep(.is-focusable) {
      .el-tree-node__content {
        background-color: #fff !important;
      }
    }
  }
}
</style>
