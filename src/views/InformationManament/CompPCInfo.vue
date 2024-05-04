<template>
  <div class="pc-inifo-container">
    <div class="pc-info-nav">
      <template v-for="item in pcInfoNav">
        <p
          class="nav-item"
          :class="{ active: currentNav === item.value }"
          :key="item.value"
          @click="switchNavHandle(item.value)"
        >
          {{ item.label }}({{ item.number || 0 }})
        </p>
      </template>
    </div>
    <div class="pc-info-content">
      <template v-if="currentNav === 'publish'">
        <div class="top-bar">
          <el-button class="button-w80-h30" @click="addPCInfoHandle"
            >新增</el-button
          >
          <el-button class="button-w80-h30" @click="offlineHandle"
            >下线</el-button
          >
          <el-button class="button-w80-h30" @click="removeHandle"
            >删除</el-button
          >
        </div>
      </template>
      <template v-else>
        <div class="top-bar">
          <el-button class="button-w80-h30" @click="onlineHandle"
            >发布</el-button
          >
          <el-button class="button-w80-h30" @click="removeHandle"
            >删除</el-button
          >
        </div>
      </template>
      <el-scrollbar style="height: calc(100% - 70px)">
        <el-card>
          <table-pagination
            class="table-left"
            :list="columns"
            :tableList="tableList"
            :queryForm="queryForm"
            :getList="getList"
            table-height="400px"
            @selection-change="selectionHandle"
            ref="tablePagination"
          >
            <el-table-column label="操作" min-width="90" fixed="right">
              <template slot-scope="scope">
                <el-tooltip
                  placement="left"
                  :visible-arrow="false"
                  popper-class="bgf shadow-1"
                >
                  <div slot="content" class="tooltip__operation">
                    <span class="active" @click="editHandle(scope.row)"
                      >编辑</span
                    >
                    <span
                      v-if="scope.row.headTop === 'Y'"
                      class="active"
                      @click="toTopHandle(scope.row, 'cancel')"
                      >取消置顶</span
                    >
                    <span
                      v-else
                      class="active"
                      @click="toTopHandle(scope.row, 'setting')"
                      >置顶</span
                    >
                  </div>
                  <el-button class="button-48-24">操作</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </table-pagination>
        </el-card>
      </el-scrollbar>
    </div>
  </div>
  <!-- <el-scrollbar style="height: calc(100% - 50px);">
    </el-scrollbar> -->
</template>

<script>
import { addAllowKeepAlive } from '@/util/utils'
import {
  fetchListRealInfo,
  fetchOrderRealInfoTop,
  fetchDeleteRealInfo,
  fetchFinRealInfoCount,
  fetchUpdateRealInfoStatus
} from '@/fetch/informationManament'
import toTop from '../../assets/svg/toTop.svg'
export default {
  name: 'CompPCInfo',

  props: {
    activate: Boolean
  },

  data() {
    return {
      currentNav: 'publish',
      pcInfoNav: [
        {
          label: '已发布',
          value: 'publish',
          number: 0
        },
        {
          label: '草稿箱',
          value: 'draft',
          number: 0
        },
        {
          label: '已下线',
          value: 'down',
          number: 0
        }
      ],
      typesLength: {
        publishNum: 0,
        downNum: 0,
        draftNum: 0
      },
      columns: [
        {
          type: 'selection'
        },
        {
          label: '内容标题',
          prop: 'title',
          width: '300px'
        },
        {
          type: 'component',
          label: '状态',
          prop: 'headTop',
          ctx: (row) => {
            return {
              render(h) {
                let res = ''
                row.headTop === 'Y' &&
                  (res = h('img', { attrs: { src: toTop } }))
                return res
              }
            }
          }
        },
        {
          label: '操作人',
          prop: 'updateByName'
        },
        {
          label: '操作时间',
          prop: 'updatedDate'
        }
      ],
      tableList: [],
      queryForm: {
        condition: {
          type: 'home',
          status: 'publish'
        },
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      tableSelectionRows: []
    }
  },

  watch: {
    activate: {
      handler(n) {
        if (n) {
          this.getList()
          this.$emit('update:activate', false)
        }
      }
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.getList()
  },

  methods: {
    // 获取每个类型的数量
    async getTypesLength() {
      let res = await fetchFinRealInfoCount({ type: 'home' })
      this.pcInfoNav[0].number = res.publishNum
      this.pcInfoNav[1].number = res.draftNum
      this.pcInfoNav[2].number = res.downNum
    },
    // 获取数据
    async getList() {
      this.getTypesLength()
      let data = this.queryForm
      let { list, total } = await fetchListRealInfo(data)
      this.queryForm.total = total
      this.tableList = list
    },
    // 菜单切换，重新查询
    switchNavHandle(value) {
      this.queryForm.condition.status = this.currentNav = value
      this.queryForm.currPage = 1
      this.getList()
    },
    // 表格选择回调
    selectionHandle(list) {
      this.tableSelectionRows = list
    },
    // 置顶操作
    async toTopHandle(row, status) {
      await fetchOrderRealInfoTop({ id: row.id })
      let tips = status === 'cancel' ? '已取消置顶' : '已置顶'
      this.showMessage(tips, 'success')
      this.getList()
    },
    // 下线操作
    offlineHandle() {
      this._editOnlineOfflineHandle('down')
    },
    // 上线操作
    onlineHandle() {
      this._editOnlineOfflineHandle('publish')
    },
    // 上下线逻辑
    async _editOnlineOfflineHandle(status) {
      if (!this._checkSelected()) return
      let ids = this.tableSelectionRows.map((item) => item.id)
      await fetchUpdateRealInfoStatus({ ids, status: status })
      this.showMessage(status === 'publish' ? '发布成功' : '已下线', 'success')
      this.getList()
    },
    // 检测是否有选择了表
    _checkSelected() {
      !this.tableSelectionRows.length && this.showMessage('最少选择一行')
      return Boolean(this.tableSelectionRows.length)
    },
    // 删除操作
    async removeHandle() {
      if (!this._checkSelected()) return
      try {
        await this.removeTips()
        let ids = this.tableSelectionRows.map((item) => item.id)
        await fetchDeleteRealInfo({ ids })
        this.showMessage('删除成功', 'success')
        this.getList()
      } catch (error) {}
    },
    // 删除操作的二次提示
    removeTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定删除选中项', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout'
        })
          .then(() => {
            return resolve()
          })
          .catch(() => {
            return reject()
          })
      })
    },
    showMessage(tip = '', type = 'warning') {
      this.$message[type](tip)
    },
    // 新增PC资讯
    addPCInfoHandle() {
      addAllowKeepAlive('/NewPCInfo')
      this.$router.push({ name: '新增/编辑PC首页资讯' })
    },
    // 编辑PC首页资讯
    editHandle(row) {
      addAllowKeepAlive('/NewPCInfo')
      this.$router.push({ name: '新增/编辑PC首页资讯', params: { id: row.id } })
    }
  }
}
</script>
<style lang="scss" scoped>
$baseMargin: 10px;
$baseBgColor: #fff;
@mixin flexCenter() {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pc-inifo-container {
  height: calc(100% - 50px);
  box-sizing: border-box;
  display: flex;
}
.pc-info-nav {
  width: 120px;
  padding-top: $baseMargin;
  background-color: $baseBgColor;
  flex: none;
  .nav-item {
    color: $title1Color;
    min-height: 30px;
    @include flexCenter();
    cursor: pointer;
    &:hover {
      background-color: rgba($color: $line-color, $alpha: 0.3);
    }
    &.active {
      color: $themeColor;
    }
  }
}
.pc-info-content {
  width: calc(100% - 120px - #{$baseMargin});
  margin-left: $baseMargin;
  background-color: $baseBgColor;
}
.top-bar {
  transform: translateY(1px);
  padding: $baseMargin * 2;
  border-bottom: 1px solid $line-color;
  position: relative;
  z-index: 9;
}
</style>