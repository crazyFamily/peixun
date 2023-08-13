<template>
  <div class="establish__establishProject">
    <!-- 搜索框 -->
    <el-card class="search-card more-line">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="机构">
          <div class="df">
            <gc-institution v-model="queryForm.busiType" @change="orgNameChange" ref="institutionRef" style="width: 300px;"> </gc-institution>

            <el-checkbox class="ml10" v-model="queryForm.isGotSubBranch">含下属机构</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item>
          <el-form-item label="立项日期" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.createdDateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startCreatedPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date">
            <el-date-picker
              v-model="queryForm.createdDateEnd"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endCreatedPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-form-item label="项目周期" class="search-card__date mr10">
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
          <el-form-item label="至" class="search-card__date">
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

        <el-form-item label="项目信息">
          <el-input class="w-200" v-model.trim="queryForm.classId" placeholder="请输入项目编号 / 项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目分类">
          <!-- <gc-select label="项目分类" :options="classTypeOptions" v-model="queryForm.classTypeOne"> </gc-select> -->
          <ClassTypesCascader v-model="queryForm.classTypeList" ref="classTypesCascaderRef"></ClassTypesCascader>
        </el-form-item>

        <el-form-item label="立项人" class="mr20">
          <el-input class="w-200" v-model.trim="queryForm.realManager" placeholder="请输入立项人姓名/UM号" :disabled="isHaveClassModule"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 表格内容框 -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="add">
          <i class="instructor-icons__add__icon"></i>
          新增</span
        >
        <span class="instructor-icons__download" @click="handleExport('/fn/classes/lixiang/exportClassProjectList', getdata())">
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <table-pagination
        v-loading="getLoadingStatus('LOADING_ESTABLISH_PROJECT_LIST')"
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePaginationRef"
      >
        <el-table-column label="操作" width="100" fixed="right">
          <div class="" slot-scope="scope">
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation">
                <span class="active mr20" @click="openEdit(scope.row)"> 修改 </span>
                <span class="active mr20" @click="openChange(scope.row)"> 更改立项 </span>
                <span class="active mr20" @click="openSupplement(scope.row)"> 补充立项 </span>
                <span class="active mr20" v-if="scope.row.taskId" @click="openApprovalRecord(scope.row)"> 查看审批 </span>
                <span class="active mr20" @click="revocation(scope.row)"> 撤回 </span>
                <span class="active mr20" @click="copy(scope.row)"> 复制 </span>
                <span class="active mr20"> 调研 </span>
                <span class="active" @click="del(scope.row)"> 删除 </span>
                <span class="active" v-if="scope.row.isCanAssociationPlan === 'Y'" @click="addPlanHandle(scope.row)"> 补关联计划 </span>
              </div>

              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </div>
        </el-table-column>
      </table-pagination>
    </el-card>

    <!-- 查看 审批记录 -->
    <gc-model
      title="EOA审批记录"
      width="1200px"
      class="add-student"
      :visible="approvalRecordVisible"
      @close="approvalRecordVisible = false"
      @cancel="approvalRecordVisible = false"
      @comfirm="approvalRecordVisible = false"
    >
      <div class="approval-record-box">
        <div class="title">审批链：{{ auditUsersum }}</div>
        <gc-table class="general__table mt20" ref="approvalRecordTableRef" :list="approvalRecordList" :tableList="approvalRecordTableList">
        </gc-table>
      </div>
    </gc-model>

    <Plan :show.sync="isPlanShow" :auto-close="false" :data-info="selectedRow" @save="planSaveHandle" ref="planRef"></Plan>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  CopyObj,
  resetObj,
  hintFrame,
  getLoadingStatus,
  jsonHeaders,
  handleExport,
  addAllowKeepAlive,
  renderName,
  formatDate,
  customHint
} from '../../../util/utils'
import { handlePickerOptions } from '../../../mixins/component'
import ClassTypesCascader from '@/components/ClassTypesCascader.vue'
import { LINE_MAP, yesOrNoMap, TRAININGMODE } from '@/util/constants'
import Plan from './components/Plan'
import { fetchAssociationPlan, fetchListClassProjectList } from '@/fetch/establish'
export default {
  name: 'EstablishProject',
  mixins: [handlePickerOptions],
  components: { ClassTypesCascader, Plan },
  data() {
    return {
      queryForm: {
        // 培训班编号 或 项目名称
        classId: '',
        // 负责人
        realManager: '',
        busiType: [],
        orgId: '',
        isGotSubBranch: false,
        dateStart: '',
        dateEnd: '',
        applyStatus: '',
        applyStatusList: [],
        classTypeList: [],
        createdDateStart: '',
        createdDateEnd: '',
        currPage: 1,
        pageSize: 10
      },
      // 选中机构的名字
      blgDeptName: '',
      // 选择时间 限制对象
      startPickerOptions: {},
      endPickerOptions: {},
      // el-date-picker 开始时间限制
      startCreatedPickerOptions: {
        disabledDate: (time) => {
          if (this.queryForm.createdDateEnd) {
            return !(formatDate(time) <= this.queryForm.createdDateEnd)
          }
          return false
        }
      },
      // el-date-picker 结束时间限制
      endCreatedPickerOptions: {
        disabledDate: (time) => !(formatDate(time) >= this.queryForm.createdDateStart)
      },
      // 项目分类下拉选项
      classTypeOptions: [
        {
          label: '培训班项目',
          value: '01001'
        },
        {
          label: '非培训班项目',
          value: '01002'
        }
      ],
      // 表格字段数组
      list: [
        {
          type: 'index',
          width: '54',
          label: '序号'
        },
        {
          width: '76',
          label: '项目编号',
          prop: 'classId'
        },
        {
          type: 'component',
          width: '172',
          label: '项目名称',
          prop: 'className',
          ctx: (row) => {
            const that = this
            return {
              render(createElement) {
                return createElement(
                  'span',
                  {
                    class: 'active',
                    on: {
                      click() {
                        that.openPreview(row)
                      }
                    }
                  },
                  `${row.className}`
                )
              }
            }
          }
        },
        {
          width: '230',
          label: '项目分类',
          prop: 'classTypeDesc'
        },
        {
          width: '120',
          label: '是否消保培训',
          prop: 'ifConformance',
          type: 'tablecolumnfilters',
          radio: true,
          labelKey: 'ifConformance',
          list: yesOrNoMap,
          formatter: (row) => yesOrNoMap.find(v=>v.value === row.ifConformance)?.label
        },
        {
          width: '120',
          label: '培训形式',
          prop: 'trainingMode',
          type: 'tablecolumnfilters',
          labelKey: 'trainingModes',
          list: TRAININGMODE,
          formatter: (row) => TRAININGMODE.find(v=>v.value === row.trainingMode)?.label
        },
        {
          width: '120',
          label: '开始日期',
          prop: 'dateStart'
        },
        {
          width: '120',
          label: '结束日期',
          prop: 'dateEnd'
        },
        {
          width: '74',
          label: '培训系列',
          prop: 'trainSeriesDesc'
        },
        {
          width: '130',
          label: '申请部门',
          prop: 'orgName'
        },
        {
          width: '200',
          label: '立项人',
          prop: 'realManager',
          formatter: row => renderName(row.realManager, row.realManagerUmId)
        },
        {
          width: '120',
          label: '立项日期',
          prop: 'createdDate'
        },
        {
          width: '66',
          label: '状态',
          prop: 'applyStatusDesc',
          type: 'tablecolumnfilters',
          labelKey: 'applyStatusList',
          list: [],
        },
      ],
      // 表格内容数组
      tableList: [],
      // 状态下拉选项列表
      ApplyStatusOptions: [],
      // 查看审批记录 dialog 状态
      approvalRecordVisible: false,
      // 查看审批记录 字段数组
      approvalRecordList: [
        {
          type: 'i',
          label: '序号',
          prop: 'orderNo'
        },
        {
          label: '审批人',
          width: '100',
          prop: 'empName'
        },
        {
          label: '审批意见',
          width: '300',
          prop: 'advice'
        },
        {
          label: '审批时间',
          width: '160',
          prop: 'approveDate'
        }
      ],
      // 查看审批记录 数据数组
      approvalRecordTableList: [],
      // 审批链
      auditUsersum: '',
      handleExport,
      selectedRow: {},
      isPlanShow: false,
      getLoadingStatus
    }
  },
  computed: {
    isHaveClassModule() {
      return this.$store.state.userInfo.isHaveClassModule === 'N'
    }
  },
  methods: {
    // 查询
    query() {
      this.queryForm.pageSize = 10
      this.queryForm.currPage = 1
      this.getList()
    },
    // 重置
    reset() {
      resetObj(this.queryForm)
      
      // 需求变更：重置还原用户条线
      const {blgStripLine, deptno} = this.$store.state.userInfo
      this.queryForm.busiType = [blgStripLine, deptno]
      this.$refs.institutionRef.setContentValue([LINE_MAP[blgStripLine], this.$store.state.userInfo.deptName])
      this.queryForm.isGotSubBranch = true
      this.queryForm.pageSize = 10
      this.queryForm.currPage = 1
      this.$refs.classTypesCascaderRef.reset()
      this.$refs.tablePaginationRef.resetFilters()
      this.getList()
    },
    getdata() {
      const data = CopyObj(this.queryForm)
      ;[data.busiType, data.orgId] = data.busiType
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      if(this.isHaveClassModule) {
        this.queryForm.realManager = this.$store.state.userInfo.umId
      }
      return { data }
    },
    // 获取内容
    getList() {
      const data = this.getdata()
      fetchListClassProjectList(data).then(res => {
        const { list, total } = res
        list.forEach(v => {
          if (v.dateStart && v.dateEnd) {
            v.cycle = `${v.dateStart} - ${v.dateEnd}`
          } else {
            v.cycle = ''
          }
          v.createdDate = v.createdDate.split('T')[0]
          v.createdDate = v.createdDate.split(' ')[0]
        })
        this.tableList = list
        this.queryForm.total = total
      })
    },
    getApplyStatusOptions() {
      this.$axios.post('/fn/classes/lixiang/listApplyStatus').then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          data.forEach((v) => {
            v.label = v.applyStatusDesc
            v.value = v.applyStatus
          })
          this.list.find(v => v.labelKey === 'applyStatusList').list.push(...data)
        }
      })
    },
    // 状态筛选函数
    applyStatusFilter(list) {
      this.queryForm.applyStatusList = list.list
      this.queryForm.currPage = 1
      this.getList()
    },
    // 状态重置函数
    applyStatusReset(list) {
      this.queryForm.applyStatusList = []
      this.queryForm.currPage = 1
      this.getList()
    },
    // 跳转到新增页面
    async add() {
      let data
      try {
        data = await this.getEstablishProject()
      } catch {}
      if (!data) {
        return
      }
      data.blgStripLine = this.$store.state.userInfo.blgStripLine
      data.deptno = this.$store.state.userInfo.deptno
      addAllowKeepAlive('/AddEstablishProject')
      this.$router.push({
        name: '新增立项',
        params: { ...data, pageState: 'add' }
      })
    },
    // 跳转到修改页面
    async openEdit(row) {
      if (['02001', '02002'].includes(row.applyStatus)) {
        return this.$message.warning('审批中和已通过的不能修改')
      }
      const classId = row.classId
      let data
      try {
        data = await this.getEstablishProject(classId)
      } catch {}
      if (!data) return
      data.blgStripLine = row.blgStripLine
      data.classId = classId
      addAllowKeepAlive('/AddEstablishProject')
      this.$router.push({
        name: '新增立项',
        params: { ...data, pageState: 'edit' }
      })
    },
    // 跳转到补充页面
    async openSupplement(row) {
      if (row.reimTip !== 'Y') {
        return this.$message.warning('未发起报销的培训班不能补充立项')
      }
      const classId = row.classId
      let data
      try {
        data = await this.getEstablishProject(classId, '/fn/classes/lixiang/replenishClass')
      } catch {}
      if (!data) {
        return
      }
      data.blgStripLine = row.blgStripLine
      data.classId = classId
      addAllowKeepAlive('/AddEstablishProject')
      this.$router.push({
        name: '新增立项',
        params: { ...data, pageState: 'supplement' }
      })
    },
    // 跳转到更改页面
    async openChange(row) {
      if (!['02002'].includes(row.applyStatus)) {
        return this.$message.warning('只有已通过的培训班才能更改立项')
      }
      if (['02003'].includes(row.classStatus)) {
        return this.$message.warning('已结训的培训班不能更改立项')
      }
      const classId = row.classId
      let data
      try {
        data = await this.getEstablishProject(classId, '/fn/classes/lixiang/changeClass')
      } catch {}
      if (!data) {
        return
      }
      data.blgStripLine = row.blgStripLine
      data.classId = classId
      addAllowKeepAlive('/AddEstablishProject')
      this.$router.push({
        name: '新增立项',
        params: { ...data, pageState: 'change' }
      })
    },
    // 跳转到预览页面
    async openPreview(row) {
      const classId = row.classId
      let data
      try {
        data = await this.getEstablishProject(classId, '/fn/classes/lixiang/showClass')
      } catch {}
      if (!data) return
      data.blgStripLine = row.blgStripLine
      data.classId = classId
      addAllowKeepAlive('/PreviewEstablishProject')
      this.$router.push({
        name: '查看立项',
        params: { ...data }
      })
    },
    // 获取立项数据
    getEstablishProject(classId, url) {
      url = url || '/fn/classes/lixiang/initClass'
      return this.$axios.post(url, { classId }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          return data
        }
      })
    },
    // 选择部门变化事件
    orgNameChange(v) {
      this.blgDeptName = v
    },
    // 撤回立项
    revocation(row) {
      this.$alert('确定撤回该笔立项？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const { classId } = row
            this.$axios.post('/fn/classes/lixiang/recallClass', { classId }, jsonHeaders).then((res) => {
              const { code } = res.data
              if (code === 0) {
                this.$message.success('撤回成功')
                this.getList()
              }
            })
          }
        })
        .catch((err) => err)
    },
    // 复制立项
    copy(row) {
      const { classId } = row
      this.$axios.post('/fn/classes/lixiang/copyClass', { classId }, jsonHeaders).then((res) => {
        const { code } = res.data
        if (code === 0) {
          this.$message.success('拷贝成功')
          this.getList()
        }
      })
    },
    // 打开审批记录dialog
    openApprovalRecord(row) {
      const { taskId } = row
      this.$axios.post('/fn/user/listEoaAdvice', { data: { taskId } }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { auditUsersum, eoaAdviceDTOList } = data
          this.approvalRecordTableList = eoaAdviceDTOList
          this.auditUsersum = auditUsersum
          this.approvalRecordVisible = true
        }
      })
    },
    // 删除立项
    del(row) {
      hintFrame('确认删除该立项？').then(() => {
        const { classId } = row
        this.$axios.post('/fn/classes/lixiang/deleteClass', { classId }, jsonHeaders).then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
    },
    // 补关联计划
    addPlanHandle(row) {
      this.selectedRow = CopyObj(row)
      this.isPlanShow = true
    },
    // 补关联计划选择的计划
    async planSaveHandle(row) {
      await customHint('确定把当前计划关联到项目', '提示', '取消')
      const data = { classId: this.selectedRow.classId, annualPlanId: row.annualPlanId }
      await fetchAssociationPlan(data)
      this.$refs.planRef.close()
      this.$message.success('提交成功')
      this.query()
    }
  },
  mounted() {
    const {blgStripLine, deptno} = this.$store.state.userInfo
    console.log(LINE_MAP, blgStripLine, '===>>>');
    this.queryForm.busiType = [blgStripLine, deptno]
    this.queryForm.isGotSubBranch = true
    this.$refs.institutionRef.setContentValue([LINE_MAP[blgStripLine], this.$store.state.userInfo.deptName])
    this.getApplyStatusOptions()
    this.query()
  },
  activated() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.search-card {
  :deep(.el-form .el-form-item) {
    margin-right: 20px;
  }

  :deep(.el-card__body .el-form .el-date-editor.el-input) {
    min-width: 120px;
    width: 120px !important;
  }
}
</style>
