<template>
  <div style="height: 100%">
    <div v-show="active === 0" class="course-recommendation__super-tube-center">
      <div class="column-tree">
        <el-tree
          ref="layoutTree"
          node-key="layoutId"
          :data="columnTreeData"
          @node-click="handleNodeClick"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          :default-expanded-keys="defaultExpandedKeys"
          :props="{ children: 'childs', label: 'layoutName' }"
        >
          <span class="df" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <div class="ml20 vanish" v-if="data.layoutId !== 3">
              <span
                @click.stop="addColumn(data)"
                v-if="data.rootType === 2 && data.lowerType === 'layout'"
              >
                添加</span
              >
              <span
                v-if="
                  data.layoutId !== 1 &&
                  data.layoutId !== 2 &&
                  data.parent.childs.indexOf(data) !== 0
                "
                @click.stop="moveNode(data, -1)"
              >
                上移</span
              >
              <span
                v-if="
                  data.layoutId !== 1 &&
                  data.layoutId !== 2 &&
                  data.parent.childs.indexOf(data) !==
                    data.parent.childs.length - 1
                "
                @click.stop="moveNode(data, 1)"
              >
                下移</span
              >
              <span
                class="ml10"
                v-if="data.isDel !== 'N'"
                @click.stop="delNode(data)"
              >
                删除</span
              >
            </div>
          </span>
        </el-tree>
      </div>
      <div class="column-box">
        <router-view ref="commonName"></router-view>
      </div>
    </div>
    <div v-show="active === 1">
      <ChoiceCourse
        :hideTime="true"
        type="layout"
        ref="choiceCourse"
        confirmClass="button-w80-h30"
        confirmText="确认添加"
        :selected="selected"
        @cancel="active = 0"
        @acknowledgement="acknowledgement"
      />
    </div>
    <div v-show="active === 2">
      <ChoiceCourseBag
        :hideTime="true"
        type="layout"
        ref="choiceCourseBag"
        confirmClass="button-w80-h30"
        confirmText="确认添加"
        :selected="selected"
        @cancel="active = 0"
        @acknowledgement="acknowledgement"
      />
    </div>
    <!-- 选择直播 -->
    <div v-show="active === 3">
      <ChoiceLive
        :hideTime="true"
        type="layout"
        ref="choiceLive"
        confirmClass="button-w80-h30"
        confirmText="确认添加"
        :selected="selected"
        @cancel="active = 0"
        @acknowledgement="acknowledgement"
      />
    </div>
  </div>
</template>

<script>
import {
  hintFrame,
  jsonHeaders,
  addAllowKeepAlive,
  getAllowKeepAliveIndex
} from '@/util/utils'
import ChoiceCourse from '../components/ChoiceCourse'
import ChoiceCourseBag from '../components/ChoiceCourseBag'
import ChoiceLive from '../components/ChoiceLive'
import { resetObj } from '../../../util/utils'
export default {
  name: 'CRSuperTubeCenter',
  components: {
    ChoiceCourse,
    ChoiceCourseBag,
    ChoiceLive
  },
  provide() {
    return {
      changeActive: (num, selected, layoutId) => {
        this.active = num
        selected = selected || []
        this.selected.splice(0)
        this.selected.push(...selected)
        if (num === 1) {
          this.$refs.choiceCourse.query()
        } else if (num === 2) {
          this.$refs.choiceCourseBag.query(layoutId)
        } else if (num === 3) {
          this.$refs.choiceLive.query(layoutId)
        }
      },
      refreshTree: () => {
        this.getColumnData()
      },
      parentParams: this.parentParams
    }
  },
  data() {
    return {
      // 显示哪个页面
      active: 0,
      // 左边栏目树数据
      columnTreeData: [],
      nameMap: {
        1: {
          name: '专属推荐',
          path: '/CRExclusiveRecommendation',
          addName: '新增专属推荐',
          addPath: 'CRNewExclusiveRecommendation'
        },
        2: {
          name: '新增发现好课',
          path: '/CRFindGoodLesson',
          addName: '新增发现好课',
          addPath: 'CRFindGoodLesson'
        }
      },
      path: '',
      parentParams: {
        layoutId: '',
        rootType: ''
      },
      // 默认展开项
      defaultExpandedKeys: [],
      selected: []
    }
  },
  methods: {
    // 左侧栏目树数据获取
    getColumnData() {
      this.$axios
        .post('/fn/privatewealth/layout/findLayoutTree', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.addFatherQuote(data)
            this.columnTreeData = data
          }
        })
    },
    // 为每个节点添加父节点引用
    addFatherQuote(arr, parent) {
      arr.forEach((v) => {
        if (!v) return
        v.parent = parent
        if (v.childs) {
          this.addFatherQuote(v.childs, v)
        }
      })
    },
    // 节点点击事件
    handleNodeClick(item) {
      if (item.layoutId !== 1 && item.layoutId !== 2) {
        const data = { id: item.layoutId }
        this.$axios
          .post(
            '/fn/privatewealth/layout/findLayoutNodeInfo',
            data,
            jsonHeaders
          )
          .then((res) => {
            const { code, data: params } = res.data
            if (code === 0) {
              params.state = 'edit'
              resetObj(this.parentParams)
              this._.merge(this.parentParams, params)
              params.rootType = item.rootType
              const { name, path } = this.nameMap[item.rootType]
              console.log(193, name, params, this.nameMap[item.rootType])
              this.$router.push({ name, params })
            }
          })
      }
    },
    acknowledgement(selectedList, num) {
      console.log(199, selectedList, num)
      this.active = 0
      this.$refs.commonName.acknowledgement(selectedList, num)
    },
    addColumn(item) {
      const { addName, addPath } = this.nameMap[item.rootType]
      const prnLayoutId = []
      this.getPrnLayoutId(item.layoutId, this.columnTreeData, prnLayoutId)
      const params = {
        layoutId: '',
        rootType: item.rootType,
        state: '',
        prnLayoutId
      }
      if (addName !== '新增专属推荐') {
        resetObj(this.parentParams)
        this._.merge(this.parentParams, params)
      }
      this.$router.push({ name: addName, params })
    },
    delNode(node) {
      hintFrame('确认要删除该栏目吗').then(() => {
        const data = { layoutId: node.layoutId }
        this.$axios
          .post(
            '/fn/privatewealth/layout/deleteLayoutNodeInfo',
            data,
            jsonHeaders
          )
          .then((res) => {
            const { code } = res.data
            if (code === 0) {
              this.$message.success('删除成功')
              this.getColumnData()
            }
          })
      })
    },
    // 节点展开事件
    nodeExpand(node) {
      this.defaultExpandedKeys.push(node.layoutId)
    },
    // 节点关闭事件
    nodeCollapse(node) {
      const index = this.defaultExpandedKeys.findIndex(
        (v) => v === node.layoutId
      )
      this.defaultExpandedKeys.splice(index, 1)
    },
    getPrnLayoutId(id, arr, results) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item.layoutId === id) return results.unshift(id)
        if (!item.childs) continue
        const flag = this.getPrnLayoutId(id, item.childs, results)
        if (flag) return results.unshift(item.layoutId)
      }
    },
    // 移动节点
    moveNode(item, n) {
      const parent = item.parent.childs
      const len = parent.length
      const index = parent.indexOf(item)
      if (index < 1 && n === -1) return
      if (index === len - 1 && n === 1) return
      parent.splice(index, 1)
      parent.splice(index + n, 0, item)
      this.columnTreeData = [...this.columnTreeData]
      const data = parent.map((v) => ({ layoutId: v.layoutId }))
      this.$axios.post(
        '/fn/privatewealth/layout/modifyLayoutTree',
        { data },
        jsonHeaders
      )
    }
  },
  mounted() {
    this.getColumnData()
  },
  activated() {
    const path = this.$route.path
    if (path === '/CRSuperTubeCenter') return
    let index = getAllowKeepAliveIndex(path)
    if (index > -1) {
      this.$store.commit('delKeepAlive', index)
    }
    index = getAllowKeepAliveIndex('/CRSuperTubeCenter')
    this.$store.commit('changeKeepAlive', { index, key: 'customPath' })
  },
  beforeRouteLeave(to, form, next) {
    this.path = form.path === '/CRSuperTubeCenter' ? '' : form.path
    next()
  },
  deactivated() {
    if (!this.path) return
    const path = this.path
    const index = getAllowKeepAliveIndex('/CRSuperTubeCenter')
    if (index < 0) return
    addAllowKeepAlive({ path, notShow: true })
    this.$store.commit('changeKeepAlive', {
      index,
      key: 'customPath',
      value: path
    })
  }
}
</script>

<style lang="scss">
@import '@/assets/commonScss/common-variate.scss';
.course-recommendation__super-tube-center {
  display: flex;
  min-height: 100%;
  background-color: #fff;
  .column-tree {
    width: 300px;
    padding: 20px 0 20px 20px;
    flex-shrink: 0;
    .el-tree-node__content:hover {
      background-color: $themeColor;
      span {
        color: #fff;
      }
      .vanish {
        display: block;
      }
    }
    .el-tree-node:focus > .el-tree-node__content {
      background-color: $themeColor;
      span {
        color: #fff;
      }
    }
  }
  .column-box {
    padding-top: 30px;
    flex: 1;
    background-color: #fff;
  }
}
</style>