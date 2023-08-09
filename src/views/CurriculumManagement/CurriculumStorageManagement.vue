<template>
  <div class="CurriculumManagement__curriculumStorageManagement">
    <!-- 搜索 框 -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item>
          <gc-input
            label="项目信息"
            v-model="queryForm.className"
            placeholder="请输入项目名称/项目编号"
          ></gc-input>
        </el-form-item>
        <el-form-item>
          <gc-input
            label="立项人"
            v-model.trim="queryForm.applyName"
            placeholder="请输入立项人姓名/UM号"
            :disabled="isHaveClassModule"
          ></gc-input>
        </el-form-item>
        <el-form-item class="mr20">
          <el-form-item label="立项日期" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.dateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date r0">
            <el-date-picker
              v-model="queryForm.dateEnd"
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
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 表格 内容 和分页 -->
    <el-card class="mt10">
      <div class="menu-right">
        <span
          class="instructor-icons__download"
          @click="
            handleExport(
              '/fn/course/materials/reportClassStoreList',
              handleQueryForm()
            )
          "
        >
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <gc-table
        class="general__table"
        ref="dataTableRef"
        :list="dataList"
        v-loading="loadingTable"
        :tableList="dataTableList"
      >
        <el-table-column label="" width="100" prop="classStatusDesc">
          <template slot="header">
            <gc-tablecolumnfilters
              label="入库状态"
              ref="tablecolumnfilters"
              className="table__screen__icon"
              :list="expenseStatus"
              confirmText="确定"
              popperClass="circular"
              @filter="storageStatusFilter"
              @reset="storageStatusReset"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <div v-if="getEmployState(scope.row)">
              <span class="active mr20" @click="entranceStorage(scope.row)">
                <el-tooltip content="课程入库" popper-class="icon-popper">
                  <i class="operation__curriculumStorage"></i>
                </el-tooltip>
              </span>
              <span class="active ml10">
                <el-tooltip content="完成" popper-class="icon-popper">
                  <i
                    class="operation__curriculumStorageAccomplish-disabled"
                  ></i>
                </el-tooltip>
              </span>
            </div>
            <div v-else>
              <span class="active mr20" @click="entranceStorage(scope.row)">
                <el-tooltip content="课程入库" popper-class="icon-popper">
                  <i class="operation__curriculumStorage"></i>
                </el-tooltip>
              </span>
              <span class="active ml10" @click="storageHint(scope.row)">
                <el-tooltip content="完成" popper-class="icon-popper">
                  <i class="operation__curriculumStorageAccomplish"></i>
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10, 15]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getCurriculumList)"
        @currentChange="currentChange($event, queryForm, getCurriculumList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  sizeChange,
  jsonHeaders,
  handleExport,
  currentChange,
  addAllowKeepAlive,
  renderName
} from '../../util/utils'
import { handlePickerOptions } from '../../mixins/component'
import { NO_STATUS } from '@/util/constants'
export default {
  name: 'CurriculumStorageManagement',
  mixins: [handlePickerOptions],
  data() {
    return {
      // 总条数
      total: 0,
      // 查询表单
      queryForm: {
        blgStripLine: '',
        applyName: '',
        className: '',
        classStatus: '',
        dateStart: null,
        dateEnd: null,
        currPage: 1,
        pageSize: 10
      },
      // 课程字段数组
      dataList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '项目编号',
          width: '100',
          prop: 'classId'
        },
        {
          label: '项目名称',
          width: '280',
          prop: 'className'
        },
        {
          label: '申请部门',
          width: '280',
          prop: 'blgOrgName'
        },
        {
          label: '立项人',
          width: '214',
          prop: 'applyName',
          formatter: row => renderName(row.applyName, row.applyUmId)
        },
        {
          label: '立项日期',
          width: '112',
          prop: 'createdDateDes'
        }
      ],
      // 课程 数据列表
      dataTableList: [],
      // 入库管理字段
      expenseStatus: [
        { label: '未完成', value: '02002' },
        { label: '已完成', value: '02003' }
      ],
      // 分页函数
      sizeChange,
      currentChange,
      // 时间组件 设置对象
      startPickerOptions: {},
      endPickerOptions: {},
      handleExport,
      loadingTable: false
    }
  },
  computed: {
    isHaveClassModule() {
      return this.$store.state.userInfo.isHaveClassModule === NO_STATUS
    }
  },
  methods: {
    // 查询 函数
    query() {
      this.queryForm.currPage = 1
      this.getCurriculumList()
    },
    // 重置函数
    reset() {
      resetObj(this.queryForm)
      this.queryForm.dateStart = null
      this.queryForm.dateEnd = null
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getCurriculumList()
    },
    // 处理queryForm
    handleQueryForm() {
      if(this.isHaveClassModule) {
        this.queryForm.applyName = this.$store.state.userInfo.umId
      }
      if (!this.queryForm.blgStripLine) {
        this.queryForm.blgStripLine = this.$store.state.userInfo.blgStripLine
      }
      const data = CopyObj(this.queryForm)
      return { classInfo: data }
    },
    // 获取课程数据
    getCurriculumList() {
      const data = this.handleQueryForm()
      this.loadingTable = true
      this.$axios
        .post('/fn/course/materials/listClassStore', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            list.forEach((v) => {
              v.dateStart = v.dateStart.split('T')[0]
            })
            this.dataTableList = list
            this.total = total
          }
        }).finally(()=>{
          this.loadingTable = false
        })
    },
    // 查询管理状态
    storageStatusFilter(list) {
      this.queryForm.classStatus = list.list[0]
      this.queryForm.currPage = 1
      this.getCurriculumList()
    },
    // 重置管理状态
    storageStatusReset(list) {
      this.queryForm.classStatus = ''
      this.queryForm.currPage = 1
      this.getCurriculumList()
    },
    // 是否确定入库
    storageHint(row) {
      if (row.courseCompleteNum < row.courseNum || row.courseCompleteNum <= 0) {
        return this.$message.warning('该项目还有课程未完成')
      }
      this.$alert('确定完成入库吗？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      }).then((valied) => {
        if (valied === 'confirm') {
          const { classId } = row
          const data = { classId }
          this.$axios
            .post(
              '/fn/course/materials/completeNonClass',
              { data },
              jsonHeaders
            )
            .then((res) => {
              const { code, data } = res.data
              if (code === 0) {
                this.$message.success('操作成功')
                this.getCurriculumList()
              }
            })
        }
      })
    },
    // 跳转 课程入库页面
    entranceStorage(row) {
      addAllowKeepAlive('/CurriculumStorage')
      this.$router.push({ name: '课程入库', params: row })
    },
    getEmployState(row) {
      return ['02003'].includes(row.classStatus)
    }
  },
  mounted() {
    const className = this.$route.query.className
    if (className) {
      this.queryForm.className = className
      this.query()
    } else {
      this.getCurriculumList()
    }
  }
}
</script>

<style lang="scss"></style>
