<template>
  <div class="course-recommendation__project-management">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="习题包ID">
          <el-input
            v-model="queryForm.sortNum"
            class="w200"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="习题包名称">
          <el-input
            v-model="queryForm.exerciseProjectName"
            class="w200"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="创建时间" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.createStartDate"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date">
            <el-date-picker
              v-model="queryForm.createEndDate"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="负责人UM">
          <el-input
            v-model="queryForm.responsibleUmId"
            class="w200"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="操作人UM">
          <el-input
            v-model="queryForm.updatedBy"
            class="w200"
            clearable
          ></el-input>
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
        <span class="icons__add" @click="add">
          <i class="icons__add__icon"></i>
          新增习题包</span
        >
      </div>
      <gc-table
        class="general__table table-left"
        :list="list"
        :tableList="tableList"
      >
        <el-table-column label="题目难度" header-align="center">
          <el-table-column
            prop="ryPercent"
            label="容易"
            width="60">
          </el-table-column>
          <el-table-column
            prop="zdPercent"
            label="中等"
            width="60">
          </el-table-column>
          <el-table-column
            prop="knPercent"
            label="困难"
            width="60">
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="78"
          prop=""
          class-name="td-pr0"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tooltip
              placement="left"
              :visible-arrow="false"
              popper-class="bgf shadow-1"
            >
              <div slot="content" class="tooltip__operation">
                <span class="active" @click="openEditPage(scope.row)"
                  >编辑</span
                >
                <span class="active" @click="del(scope.row)">删除</span>
                <span class="active" @click="exportHandle(scope.row)">导出</span>
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
  commonFilter,
  currentChange,
  addAllowKeepAlive,
  gtNow
} from '@/util/utils'
import {
  fetchExportExerciseInfoList
} from '@/fetch/courseRecommendation'
import { handlePickerOptions } from '@/mixins/component'
import { getOrg } from '../utils'
import gcTag from '@/components/chunk/tag'
export default {
  name: 'CRExercisePackageMg',
  mixins: [handlePickerOptions],
  components: { gcTag },
  data() {
    return {
      // 查询用的表单
      queryForm: {
        createStartDate: null,
        createEndDate: null,
        exerciseProjectName: '',
        sortNum: '',
        responsibleUmId: '',
        updatedBy: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      total: 0,
      // 分页函数
      sizeChange,
      currentChange,
      // 表格筛选公共函数
      commonFilter,
      list: [
        {
          label: '习题包ID',
          width: '80',
          prop: 'sortNum'
        },
        {
          type: 'component',
          label: '习题包名称',
          width: '270',
          prop: '',
          'show-overflow-tooltip': true,
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline ellipsis',
                    on: {
                      click() {
                        that.preview(row)
                      }
                    }
                  },
                  row.exerciseProjectName
                )
              }
            }
          }
        },
        {
          label: '描述',
          width: '130',
          prop: 'description'
        },
        {
          type: 'component',
          label: '题目数量',
          width: '70',
          prop: '',
          'show-overflow-tooltip': true,
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline ellipsis',
                    on: {
                      click() {
                        that.ExercisePackageDetail(row)
                      }
                    }
                  },
                  row.exerciseNum
                )
              }
            }
          }
        },
        {
          label: '负责人部门',
          width: '140',
          prop: 'orgName'
        },
        {
          label: '负责人UM',
          width: '120',
          prop: 'responsibleUmId'
        },
        {
          label: '操作人UM',
          width: '120',
          prop: 'updatedBy'
        },

        {
          label: '创建时间',
          width: '120',
          prop: 'createdDate'
        }
      ],
      tableList: [],
      gtNow
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
    },
    getList() {
      let data = this.queryForm
      data.createStartDate = data.createStartDate ? data.createStartDate : null
      data.createEndDate = data.createEndDate ? data.createEndDate : null
      this.$axios
        .post(
          '/fn/privatewealth/exerciseproject/selectExerciseProjectListByPage',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableList = list
            console.log(687, code, data)
          }
        })
    },
    add() {
      const params = { state: 'add' }
      addAllowKeepAlive('/CRNewExercisePackage')
      this.$router.push({
        name: '新增习题包',
        params
      })
    },
    // 跳转到预览界面
    preview(row) {
      console.log(357, row)
      let { id } = row
      const params = {
        state: 'preview',
        id
      }
      addAllowKeepAlive('/CRNewExercisePackage')
      this.$router.push({
        name: '新增习题包',
        params
      })
    },
    // 打开修改项目界面
    openEditPage(row) {
      console.log(357, row)
      let { id } = row
      const params = {
        state: 'edit',
        id
      }
      addAllowKeepAlive('/CRNewExercisePackage')
      this.$router.push({
        name: '新增习题包',
        params
      })
    },
    del(row) {
      console.log(425, row)
      hintFrame(`确定删除：${row.exerciseProjectName}？`).then((res) => {
        const { id } = row
        this.deleteExerciseProjectByIdF(id)
      })
    },
    // 查看习题下面的所有习题
    ExercisePackageDetail(row) {
      addAllowKeepAlive('/CRExercisePackageDetail')
      this.$router.push({
        name: '习题包习题列表',
        params: {
          exerciseProjectId: row.id + '',
          exerciseProjectName: row.exerciseProjectName
        }
      })
      console.log('习题')
    },
    // 删除习题包
    deleteExerciseProjectByIdF(id) {
      const data = { id }
      this.$axios
        .post(
          '/fn/privatewealth/exerciseproject/deleteExerciseProjectById',
          data,
          jsonHeaders
        )
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
    },
    // 删除习题
    deleteExerciseInfoByIdF(id) {
      const data = { id }
      this.$axios
        .post(
          '/fn/privatewealth/exerciseinfo/deleteExerciseInfoById',
          data,
          jsonHeaders
        )
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
    },
    exportHandle(row) {
      const data = { exerciseProjectId: row.id }
      fetchExportExerciseInfoList(data).catch(e => console.log(e))
    }
  },
  mounted() {},
  activated() {
    this.query()
  }
}
</script>
