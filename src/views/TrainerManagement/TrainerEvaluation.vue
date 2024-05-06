<template>
  <div class="trainer-management__trainer-evaluation">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="机构部门" required>
          <div class="df">
            <gc-institution v-model="queryForm.busiType"> </gc-institution>

            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10"
              >含下属机构</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item label="评聘年度">
          <gc-select
            class="p0 w-150"
            k="evaluateYearName"
            v="evaluateYearId"
            :options="evaluateYearOptions"
            v-model="queryForm.evaluateYear"
          >
          </gc-select>
        </el-form-item>
        <el-form-item>
          <gc-select
            label="培训师类型"
            :options="trainerOptions"
            v-model="queryForm.trainerType"
          ></gc-select>
        </el-form-item>
        <el-form-item label="UM号/姓名">
          <el-input v-model.trim="queryForm.umId" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="授课领域">
          <gc-select
            class="p0 w-150"
            k="dataValue"
            v="dataEncode"
            v-model="queryForm.lecturesArea"
            placeholder="请选择授课领域"
            :options="lecturesAreaOptions"
          >
          </gc-select>
        </el-form-item>
        <el-form-item label="在职状态" class="mr20">
          <gc-select
            v-model="queryForm.isLeaved"
            :options="sittingOptions"
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
        <span class="icons__add" @click="addOne">
          <i class="icons__add__icon"></i>
          新增</span
        >
        <span class="icons__add ml10" @click="add">
          <i class="icons__add__icon"></i>
          批量新增</span
        >
        <span class="icons__upload ml10" @click="educe">
          <i class="icons__upload__icon"></i>
          导出</span
        >
        <span class="icons__del ml10" @click="del">
          <i class="icons__del__icon"></i>
          删除</span
        >
      </div>
      <gc-table
        class="general__table"
        ref="tableRef"
        :list="list"
        :tableList="tableList"
      >
        <el-table-column label="操作" width="100px" fixed="right">
          <template slot-scope="scope">
            <span class="active" @click="openChangePage(scope.row)">修改</span>
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

    <InstructorBatchImport
      title="批量新增"
      :visible.sync="batchAddVisible"
      @close="batchAddClose"
      @comfirm="batchAddComfirm"
      @change="batchAddChange($event)"
      @templateDownload="
        templateDownload('/common/file/downloadModule', {
          fileCode: 'trainerTemplate'
        })
      "
    />
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  hintFrame,
  handleBlob,
  sizeChange,
  dataHeaders,
  jsonHeaders,
  commonFilter,
  currentChange,
  fileImportHint,
  templateDownload,
  addAllowKeepAlive
} from '@/util/utils'
export default {
  name: 'TrainerEvaluation',
  data() {
    return {
      // 查询用的表单
      queryForm: {
        // 条线
        busiType: '',
        orgId: '',
        // 开始日期  格式: yyyy-MM-dd
        dateStart: '',
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: '',
        evaluateYear: null,
        // 授课领域
        lecturesArea: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        tip: 'Y',
        // 选择子机构标识
        isGotSubBranch: false
      },
      total: 0,
      // 培训师类型下拉选项
      trainerOptions: [
        {
          label: '菁英培训师(一级)',
          value: '03001001'
        },
        {
          label: '菁英培训师(二级)',
          value: '03001002'
        },
        {
          label: '菁英培训师(三级)',
          value: '03001003'
        },
        {
          label: '菁英培训师(四级)',
          value: '03001004'
        },
        {
          label: '菁英培训师(五级)',
          value: '03001005'
        }
      ],
      // 在职状态下拉选项
      sittingOptions: [
        {
          label: '在职',
          value: 'N'
        },
        {
          label: '离司',
          value: 'Y'
        }
      ],
      // 评聘年度下拉选项
      evaluateYearOptions: [],
      // 授课领域下拉选项
      lecturesAreaOptions: [],
      // 分页函数
      sizeChange,
      currentChange,
      // 模版下载工具函数
      templateDownload,
      list: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '54'
        },
        {
          label: 'UM号',
          width: '140',
          prop: 'umId'
        },
        {
          label: '姓名',
          width: '120',
          prop: 'empName'
        },
        {
          label: '零售/非零',
          width: '100',
          prop: 'busiTypeDesc'
        },
        {
          label: '所在部门',
          width: '200',
          prop: 'orgName'
        },
        // {
        //     label: "所在部门",
        //     width: "200",
        //     prop: "department"
        // },
        {
          label: '所在岗位',
          width: '180',
          prop: 'postDesc'
        },
        {
          label: '在职状态',
          width: '110',
          prop: 'isLeavedDesc'
        },
        {
          label: '培训师类型',
          width: '120',
          prop: 'trainerTypeDesc'
        },
        // {
        //     label: "培训师星级",
        //     width: "120",
        //     prop: "trainerStartLevelDesc"
        // },
        {
          label: '授课领域一',
          width: '120',
          prop: 'lecturesAreaFirstName'
        },
        {
          label: '授课领域二',
          width: '120',
          prop: 'lecturesAreaSecName'
        },
        {
          label: '评聘年度',
          width: '100',
          prop: 'evaluateYear'
        },
        {
          label: '评聘单位',
          width: '180',
          prop: 'evaluateName'
        },
        {
          label: '备注',
          width: '180',
          prop: 'remarks'
        }
      ],
      tableList: [],
      // 批量新增 dialog状态
      batchAddVisible: false,
      // 批量新增 dialog 选中文件对象
      file: {}
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, {
        currPage: 1,
        pageSize: 10,
        evaluateYear: null
      })
      this.queryForm.tip = 'Y'
      this.total = 0
      this.tableList = []
    },
    getList() {
      const data = CopyObj(this.queryForm)
      const [busiType, orgId] = data.busiType
      ;[data.busiType, data.orgId] = [busiType, orgId]
      if (!data.busiType || !data.orgId) {
        return this.$message.warning('请先选择条线和机构')
      }
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      this.$axios
        .post('/fn/trainer/eval/evaluationList', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            if (this.queryForm.currPage > 1 && list.length < 1) {
              this.queryForm.currPage--
              return this.getList()
            }
            this.tableList = list
            this.total = total
          }
        })
    },
    getEvaluateYearOptions() {
      this.$axios
        .post('/fn/trainer/setting/listEvaluationYear', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.evaluateYearOptions = data
            this.queryForm.evaluateYear = data.slice(-1)[0]?.evaluateYearId
          }
        })
    },
    add() {
      this.batchAddVisible = true
    },
    // 导出
    educe() {
      this.queryForm.tip = 'N'
      const data = CopyObj(this.queryForm)
      const [busiType, orgId] = data.busiType
      ;[data.busiType, data.orgId] = [busiType, orgId]
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      this.$axios
        .post(
          '/fn/trainer/eval/evaluationList',
          { data },
          { ...jsonHeaders, responseType: 'blob' }
        )
        .then((res) => {
          if (res.data.type === 'application/json') {
            const reader = new FileReader()
            const that = this
            reader.onload = function (event) {
              var content = reader.result //内容就在这里
              that.$message.error(JSON.parse(content).msg)
            }
            reader.readAsText(res.data)
          } else {
            handleBlob(res)
          }
        })
    },
    // 删除
    del() {
      const selection = this.$refs.tableRef.$children[0].selection
      if (!selection.length) {
        return this.$message.warning('请先选择培训师')
      }
      hintFrame('确认删除？').then((res) => {
        const list = selection.map((v) => ({ id: v.id, umId: v.umId }))
        this.$axios
          .post('/fn/trainer/eval/deleteTrainer', { list }, jsonHeaders)
          .then((res) => {
            const { code } = res.data
            if (code === 0) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
      })
    },
    // 批量新增 dialog 关闭事件
    batchAddClose() {
      this.file = {}
      this.batchAddVisible = false
    },
    // 批量新增 dialog 确认事件
    batchAddComfirm() {
      const data = new FormData()
      data.append('file', this.file)
      this.$axios
        .post('/common/trainer/batchResult', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (parseInt(code) === 0) {
            this.getList()
            this.batchAddVisible = false
            this.$nextTick(() => {
              fileImportHint(data)
            })
          }
        })
    },
    // 批量新增 dialog 文件选中事件
    batchAddChange($event) {
      this.file = $event.target.files[0]
    },
    // 跳到新增页面
    addOne() {
      const params = { state: 'add' }
      addAllowKeepAlive('/NewTrainer')
      this.$router.push({
        name: '新增培训师',
        params
      })
    },
    // 打开修改页面
    openChangePage(row) {
      const { id, umId, evaluateYear } = row
      const data = { id, umId, evaluateYear }
      this.$axios
        .post('/fn/trainer/eval/trainerInfo', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.state = 'edit'
            addAllowKeepAlive('/NewTrainer')
            this.$router.push({
              name: '新增培训师',
              params: data
            })
          }
        })
    },
    getLecturesAreaOptions() {
      this.$axios
        .post(
          '/fn/commons/dict/listDictsForSelector',
          {
            data: {
              dataCtgy: 'trainer_course_area'
            }
          },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.lecturesAreaOptions = data
          }
        })
    }
  },
  mounted() {
    this.getEvaluateYearOptions()
    this.getLecturesAreaOptions()
  }
}
</script>

<style lang="scss"></style>