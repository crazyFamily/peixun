<template>
  <div class="trainer-management__lecturer-management">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="讲师姓名">
          <el-input
            placeholder="请输入讲师姓名"
            class="w200"
            v-model="queryForm.teacherName"
          ></el-input>
        </el-form-item>
        <el-form-item label="讲师UM">
          <el-input
            placeholder="请输入讲师UM"
            class="w200"
            v-model="queryForm.teacherUm"
          ></el-input>
        </el-form-item>
        <el-form-item label="擅长领域">
          <DropdownTree
            class="sw-300"
            node-key="tagId"
            ref="dropdownTree"
            :list="goodAtAreasOptions"
            :props="{ label: 'tagName' }"
            v-model="queryForm.goodAtAreas"
          />
        </el-form-item>
        <el-form-item label="是否外部讲师">
          <gc-select
            :options="isExternalOptions"
            v-model="queryForm.isExternal"
          ></gc-select>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 数据表格 card -->
    <el-card class="mt10">
      <div class="menu-right icons no-line">
        <span class="icons__add" @click="openAddLecturer">
          <i class="icons__add__icon"></i>
          新增讲师</span
        >
        <!-- <span class="icons__del" @click="delOneItem">
                    <i class="icons__del__icon"></i>
                    删除</span
                > -->
      </div>
      <gc-table
        class="general__table"
        ref="tableRef"
        :list="list"
        :tableList="tableList"
      >
        <el-table-column label="教授课程" width="90">
          <template slot-scope="scope">
            <span class="underline active">
              {{ scope.row.courseNum }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="直播数" min-width="60">
                    <template slot-scope="scope">
                        <span class="underline active">
                            {{ scope.row.liveNum }}
                        </span>
                    </template>
                </el-table-column> -->
        <el-table-column
          label="是否置顶"
          min-width="90"
          prop="isTop"
          :formatter="
            (row) => {
              if (row.teacherUm.includes('W_')) return '--'
              return row.isTop
            }
          "
        ></el-table-column>
        <el-table-column
          label="是否隐藏(移动端)"
          min-width="120"
          prop="isCancel"
        ></el-table-column>
        <el-table-column label="置顶时间" min-width="140" prop="topTime">
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-tooltip
              placement="left"
              :visible-arrow="false"
              popper-class="bgf shadow-1"
            >
              <div slot="content" class="tooltip__operation">
                <span class="active" @click="openChangePage(scope.row)"
                  >修改</span
                >
                <span class="active" @click="delOneItem(scope.row)">删除</span>
                <template v-if="!scope.row.teacherUm.includes('W_')">
                  <span
                    class="active"
                    v-if="scope.row.isTop === '未置顶'"
                    @click="operation(scope.row, 'isTop', 'Y')"
                    >置顶</span
                  >
                  <span
                    class="active"
                    v-if="scope.row.isTop === '置顶'"
                    @click="operation(scope.row, 'isTop', 'N')"
                    >取消置顶</span
                  >
                </template>
                <span
                  class="active"
                  @click="operation(scope.row, 'isCancel', 'N')"
                  v-if="scope.row.isCancel === '显示'"
                  >隐藏</span
                >
                <span
                  class="active"
                  @click="operation(scope.row, 'isCancel', 'Y')"
                  v-if="scope.row.isCancel === '隐藏'"
                  >显示</span
                >
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
      />
    </el-card>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  hintFrame,
  sizeChange,
  jsonHeaders,
  currentChange,
  getCurriculumTree,
  addAllowKeepAlive
} from '@/util/utils'
import { allowKeepAlive } from '@/router'
import DropdownTree from '@/components/dropdown/DropdownTree'
export default {
  name: 'CRLecturerManagement',
  components: {
    DropdownTree
  },
  data() {
    return {
      // 查询用的表单
      queryForm: {
        //  UM号
        teacherUm: '',
        // 姓名
        teacherName: '',
        // 擅长领域
        goodAtAreas: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        // 是否外部讲师
        isExternal: ''
      },
      total: 0,
      // 擅长领域下拉选项
      goodAtAreasOptions: [],
      // 表格字段数组
      list: [
        {
          label: '讲师排序',
          width: '80',
          prop: 'pageSort'
        },
        {
          label: '讲师姓名',
          prop: '',
          width: '110',
          type: 'component',
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline',
                    on: {
                      click: () => {
                        that.openTrainerInfo(row)
                      }
                    }
                  },
                  row.teacherName
                )
              }
            }
          }
        },
        {
          label: '讲师UM',
          prop: 'teacherUm',
          width: '140'
        },
        {
          label: '擅长领域',
          prop: 'goodAtAreasName',
          width: '190'
        },
        {
          label: '讲师头衔',
          prop: 'titleName',
          width: '190'
        },
        {
          label: '是否为外部讲师',
          prop: 'isExternal',
          width: '190',
          ctx: (row) => (row.isExternal === 'N' ? '否' : '是')
        }
      ],
      // 表格数据数组
      tableList: [],
      // 外部讲师选项
      isExternalOptions: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      // 分页函数
      sizeChange,
      currentChange
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
      this.$refs.dropdownTree.clear()
      this.getList()
    },
    getList() {
      const data = CopyObj(this.queryForm)
      data.isExternal = data.isExternal
      this.$axios
        .post('/fn/privatewealth/teacher/teacherList', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.total = total
            this.tableList = list
          }
        })
    },
    // 获取标签
    getTag() {
      getCurriculumTree(
        '2',
        'LS',
        1,
        '/fn/course/tag/selectCourseTagsForTk'
      ).then((res) => {
        this.goodAtAreasOptions = res
      })
    },
    // 打开新增讲师
    openAddLecturer() {
      const params = { state: 'add' }
      addAllowKeepAlive('/CRAddTrainer')
      this.$router.push({
        name: '新增讲师',
        params
      })
      allowKeepAlive['/CRAddTrainer'].routerName = '新增讲师'
    },
    // 打开讲师详情
    openTrainerInfo(row) {
      this.getLecturerInfo(row).then((params) => {
        if (!params) return
        const name = addAllowKeepAlive('/CRTrainerInfo')
        this.$router.push({ name, params })
      })
    },
    // 打开修改培训师界面
    openChangePage(row) {
      this.getLecturerInfo(row).then((params) => {
        if (!params) return
        params.state = 'edit'
        addAllowKeepAlive('/CRAddTrainer')
        this.$router.push({ name: '新增讲师', params })
        // 更改 页面 标签名
        allowKeepAlive['/CRAddTrainer'].routerName = '修改讲师'
        // this.$wenEvent.$emit("getTiele");
      })
    },
    getLecturerInfo(row) {
      const { id, teacherUm, busiType } = row
      return this.$axios
        .post(
          '/fn/privatewealth/teacher/queryTecherInfo',
          { id, teacherUm, busiType },
          jsonHeaders
        )
        .then((res) => {
          const { code, data: params } = res.data
          if (code === 0) {
            return params
          }
        })
    },
    // 删除一项培训师
    delOneItem(row) {
      hintFrame('确认删除?').then((res) => {
        const data = [{ id: row.id, teacherUm: row.teacherUm }]
        this.$axios
          .post('/fn/privatewealth/teacher/delTeacher', { data }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
      })
    },
    // 置顶/取消置顶，显示/隐藏 操作
    operation(row, key, value) {
      const { id, teacherUm, busiType } = row
      const data = { id, teacherUm, [key]: value }
      this.$axios
        .post('/fn/privatewealth/teacher/updateStatus', { data }, jsonHeaders)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message.success('操作成功')
            this.getList()
          }
        })
    }
  },
  mounted() {
    this.getList()
    this.getTag()
  },
  activated() {
    this.query()
  }
}
</script>

<style lang="scss">
.course-recommendation__new-course,
.course-recommendation__new-project {
  .fractional-line {
    .el-input-group--prepend {
      width: 150px;
      .el-input-group__prepend {
        width: 74px;
        padding: 0 12px;
      }
    }
  }
  .push-info {
    width: 670px;
    margin: auto;
  }
}
</style>
