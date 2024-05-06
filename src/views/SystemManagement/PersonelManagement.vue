<template>
  <div class="system-management__personnel-management">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item>
          <gc-select
            label="选择条线"
            v-model="queryForm.busiType"
            :options="busiTypeOptions"
          ></gc-select>
        </el-form-item>
        <el-form-item label="UM号/姓名">
          <el-input
            class="w200"
            placeholder="请输入UM号/姓名"
            v-model="queryForm.umId"
          ></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="visible = true" type="primary" class="w-90"
            >批量新增</el-button
          >

          <el-button type="primary" class="w-90" @click="changeVisible = true"
            >批量修改</el-button
          >
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="system-management__personnel-management__content mt10">
      <div class="menu-right">
        <span class="icons__del last active" @click="delItem">
          <i class="icons__del__icon"></i>
          删除
        </span>
      </div>
      <gc-table
        :list="dataList"
        :tableList="dataTableList"
        ref="dataTableRef"
        class="
          system-management__personnel-management__content__table
          general__table
        "
      >
        <el-table-column label="主条线操作" width="170">
          <template slot-scope="scope">
            <div class="df" v-if="scope.row.busiType !== 'JF'">
              <el-button
                class="button-60-h30"
                v-if="scope.row.busiType !== 'LS'"
                @click="busiTypeAdjustment(scope.row, 'LS')"
                >调为零售</el-button
              >
              <el-button
                class="button-60-h30"
                type="primary"
                v-if="scope.row.busiType !== 'FL'"
                @click="busiTypeAdjustment(scope.row, 'FL')"
                >调为非零</el-button
              >
            </div>
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="[10]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
      />
    </el-card>

    <!-- 批量新增 dialog -->
    <InstructorBatchImport
      title="批量新增"
      :visible="visible"
      @close="visible = false"
      @cancel="visible = false"
      @comfirm="confirm"
      @change="batchUpload"
      @templateDownload="
        templateDownload('/common/file/downloadModule', {
          fileCode: 'addPerson'
        })
      "
    />

    <!-- 批量修改 dialog -->
    <gc-model
      title="批量修改"
      width="1000px"
      :visible="changeVisible"
      @close="changeVisible = false"
      @cancel="changeVisible = false"
      @comfirm="changeConfirm"
    >
      <div class="menu-right">
        <div class="icons no-line df">
          <span class="icons__upload">
            <gc-fileInput width="auto" @change="batchChange">
              <i class="icons__upload__icon"></i>
              批量上传
            </gc-fileInput>
          </span>
          <span
            class="icons__download"
            @click="
              templateDownload('/common/file/downloadModule', {
                fileCode: 'updateLine'
              })
            "
          >
            <i class="icons__download__icon"></i>
            模版下载
          </span>
        </div>
      </div>
      <gc-table
        class="general__table mt20"
        ref="changeTableRef"
        :list="changeTableList"
        :tableList="changeTableDataList"
      >
        <el-table-column label="操作" min-width="86">
          <template slot-scope="scope">
            <span
              class="active mr10"
              @click="changeDelOneStudent(scope.$index)"
            >
              <el-tooltip content="删除" popper-class="icon-popper">
                <i class="operation__del"></i>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </gc-table>
    </gc-model>
  </div>
</template>

<script>
import {
  CopyObj,
  hintFrame,
  sizeChange,
  dataHeaders,
  jsonHeaders,
  currentChange,
  axiosDownload,
  fileImportHint,
  templateDownload
} from '../../util/utils'
export default {
  name: 'PersonnelManagement',
  data() {
    return {
      queryForm: {
        busiType: '',
        umId: '',
        currPage: 1,
        pageSize: 10
      },
      busiTypeOptions: [
        {
          label: '零售',
          value: 'LS'
        },
        {
          label: '非零',
          value: 'FL'
        },
        {
          label: '金服',
          value: 'JF'
        },
        {
          label: '橙信',
          value: 'CX'
        },
        {
          label: '其他',
          value: 'other'
        }
      ],
      // 表格字段数组
      dataList: [
        { type: 'selection' },
        {
          type: 'index',
          label: '序号',
          width: '54'
        },
        {
          label: 'um号',
          prop: 'umId',
          width: '120'
        },
        {
          label: '员工姓名',
          prop: 'empName',
          width: '110'
        },
        {
          label: '离职时间',
          prop: 'dateLeave',
          width: '90'
        },
        {
          label: '部门名称',
          prop: 'orgName',
          width: '200'
        },
        {
          label: '所属条线',
          prop: 'busiTypeDesc',
          width: '80'
        },
        {
          label: '岗位号码',
          prop: 'positionId',
          width: '120'
        },
        {
          label: '岗位编码描述',
          prop: 'postDesc',
          width: '200'
        },
        { label: '入职时间', prop: 'dateHire' },
        { label: '用工性质', prop: 'empClassDesc' },
        { label: '能力层级', prop: 'capLevelIdDesc' },
      ],
      // 表格数据数组
      dataTableList: [],
      total: 0,
      // 分页工具函数
      jsonHeaders,
      currentChange,
      // 下载工具函数
      axiosDownload,
      templateDownload,
      // 批量新增 dialog 状态
      visible: false,
      // 批量新增 文件存储对象
      file: {},
      // 批量修改 dialog 状态
      changeVisible: false,
      // 修改表格 字段数组
      changeTableList: [
        {
          type: 'index',
          label: '序号',
          width: '54'
        },
        {
          label: 'um号',
          prop: 'umId',
          width: '120'
        },
        {
          label: '条线',
          prop: 'busiType',
          width: '120'
        }
      ],
      // 修改表格 数据数组
      changeTableDataList: []
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      this.queryForm.umId = ''
      this.queryForm.busiType = ''
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    getList() {
      const data = CopyObj(this.queryForm)
      this.$axios
        .post('/fn/system/person/listManager', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.dataTableList = list
            this.total = total
          }
        })
    },
    // 删除
    delItem() {
      const selection = this.$refs.dataTableRef.$children[0].selection
      if (!selection.length) {
        return this.$message.warning('请先选择员工')
      }
      hintFrame('确定删除这些人员吗？').then(() => {
        const list = selection.map((v) => {
          const { umId, busiType } = v
          return { umId, busiType }
        })
        this.$axios
          .post('/fn/system/person/deletePerson', { data: list }, jsonHeaders)
          .then((res) => {
            const { code } = res.data
            if (code === 0) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
      })
    },
    // 条线调整
    busiTypeAdjustment(row, adjustType) {
      const { umId, busiType } = row
      const data = { umId, adjustType, busiType }
      this.$axios
        .post('/fn/system/person/updatePersonLine', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('调整成功')
            this.getList()
          }
        })
    },
    // 批量上传
    batchUpload($event) {
      this.file = $event.target.files[0]
    },
    // 删除一个新增的
    delOneStudent(index) {
      this.uploadTableDataList.splice(index, 1)
    },
    // 批量新增 确认事件
    confirm() {
      const file = this.file
      if (!file) return
      const data = new FormData()
      data.append('file', file)
      this.$axios
        .post('/common/person/batchPersonList', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (parseInt(code) === 0) {
            this.visible = false
            this.getList()
            this.$nextTick(() => {
              fileImportHint(data)
            })
          }
        })
    },
    // 批量修改
    batchChange($event) {
      const file = $event.target.files[0]
      if (!file) return
      const data = new FormData()
      data.append('file', file)
      this.$axios
        .post('/common/person/uploadPersonList', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (parseInt(code) === 0) {
            this.changeTableDataList = data.success
            fileImportHint(data)
          }
        })
    },
    // 修改 dialog 删除一项
    changeDelOneStudent(index) {
      this.changeTableDataList.splice(index, 1)
    },
    // 批量修改 确认事件
    changeConfirm() {
      const list = this.changeTableDataList.map((v) => {
        const { umId, empName, busiType } = v
        return { umId, empName, busiType }
      })
      this.$axios
        .post('/fn/system/person/batchPersonLine', { list }, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.changeVisible = false
            this.changeTableDataList = []
            this.getList()
          }
        })
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style lang="scss"></style>