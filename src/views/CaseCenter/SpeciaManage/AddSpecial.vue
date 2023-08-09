<template>
  <div class="CaseCenter__addSpecial">
    <!-- form 内容 -->
    <div class="content-box">
      <el-form
        ref="formRef"
        class="content-form"
        :model="queryForm"
        :rules="queryFormRule"
        label-width="48px"
      >
        <el-form-item label="专题名称" prop="zoneName">
          <el-input
            maxlength="50"
            show-word-limit
            placeholder="请输入"
            v-model="queryForm.zoneName"
          ></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-input
            class="h-90"
            resize="none"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入"
            v-model="queryForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传海报" :prop=" isScoreSpecial ? '' : 'zoneImgUrlId'">
          <div class="df">
            <gc-upload
              single
              :size="200"
              width="345"
              height="110"
              :udmpId.sync="queryForm.zoneImgUrlId"
            ></gc-upload>
            <div class="tintColor ml10">
              <p>1.建议图片尺寸为（345*110px），可按比例调整尺寸</p>
              <p>2.格式为jpg或png</p>
              <p>3.图片不能大于200KB</p>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="关联案例" required>
          <div class="aic">
            <el-button class="fontColor fw4" @click="selectCaseVisible = true">添加案例</el-button>
            <i class="icons-wraning ml30 mr10"></i>
            <span class="title1Color">只有处于上架状态的案例才可选择</span>
          </div>
          <table-pagination
            drop
            row-key="caseName"
            :list="list"
            :tableList="caseIdList"
            :queryForm="caseIdForm"
            :getList="noop"
            ref="tablePagination"
            tableClass="general__table table-left"
            hidePagination
            class="special-table-container"
          >
            <el-table-column label="操作" min-width="78">
              <template slot-scope="scope">
                <span class="active" @click="delCase(scope.row)">移除</span>
              </template>
            </el-table-column>
          </table-pagination>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeCurrPage()">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="submit">确定</el-button>
    </div>

    <!-- 选择案例dialog -->
    <gc-model
      title="选择案例"
      width="1000px"
      :visible.sync="selectCaseVisible"
      @comfirm="handleCaseComfirm"
      @close="handleCaseClose"
    >
      <div class="between mb20">
        <gc-select
          label="案例分类"
          label-width="58px"
          class="p0"
          el-class="w-250"
          :options="businessLineOptions"
          v-model="caseQueryForm.businessLine"
        ></gc-select>
        <el-input
          class="w-250"
          placeholder="案例名称/创建人"
          v-model="caseQueryForm.caseCreateBy"
          @keyup.enter.native="queryCase"
        >
          <i class="page-input__search" style="margin-top: 6px;" slot="suffix" @click="queryCase"></i>
        </el-input>
      </div>
      <table-pagination
        :list="caseList"
        :tableList="caseTableList"
        :queryForm="caseQueryForm"
        :getList="getCaseList"
        ref="tablePagination">
      </table-pagination>
    </gc-model>
  </div>
</template>

<script>
import {
  noop,
  merge,
  CopyObj,
  resetObj,
  filterObj,
  localPaging,
  jsonHeaders,
  setPageTitle,
  closeCurrPage,
  closeCurrPageAndGoPath
} from '@/util/utils'
import { fetchListTags } from '@/fetch/caseCenter'
export default {
  name: 'AddSpecial',
  data(vm) {
    return {
      queryForm: {
        zoneId: '',
        zoneName: '',
        zoneImgUrlId: '',
        desc: ''
      },
      queryFormRule: {
        zoneName: [{ required: true, message: '请填写专题名称' }],
        zoneImgUrlId: [{ required: true, message: '请上传海报' }],
        desc: [{ required: true, message: '请填写简介' }]
      },
      list: [
        {
          width: '50',
          formatter: () => {
            return <i class="el-icon-rank drop"></i>
          }
        },
        { label: '序号', type: 'index' },
        {
          label: '案例名称',
          prop: 'caseName',
          width: '200'
        },
        {
          label: '创建人/UM号',
          width: '180',
          ctx: (row) =>
            `${row.createByName || row.createdByName}/${row.createdBy}`
        },
        {
          label: '组织机构',
          prop: 'belongOrgStr',
          width: '186'
        },
        {
          label: '状态',
          prop: 'statusStr',
          width: '100',
          ctx: (row) =>
            row.status === 'up' ? '上架' : row.status === 'down' ? '下架' : ''
        }
      ],
      caseIdList: [],
      caseIdForm: {
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      selectCaseVisible: false,
      caseList: [
        {
          type: 'selection',
          selectable: vm.caseTableSelectable
        },
        {
          label: '案例名称',
          prop: 'caseName',
          width: '200'
        },
        {
          label: '创建人/UM号',
          width: '180',
          ctx: (row) => `${row.createdByName}/${row.createdBy}`
        },
        {
          label: '组织机构',
          prop: 'belongOrgStr',
          width: '186'
        },
        {
          label: '状态',
          prop: 'statusStr',
          width: '140'
        }
      ],
      caseTableList: [],
      caseQueryForm: {
        businessLine: '',
        caseCreateBy: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      businessLineOptions: [],
      closeCurrPage,
      noop,
      // 页面状态
      state: '',
      stateMap: {
        add: '新增专题',
        edit: '编辑专题'
      },
      zoneType: ''
    }
  },
  methods: {
    queryCase() {
      this.caseQueryForm.currPage = 1
      this.getCaseList()
    },
    // 获取案例列表
    getCaseList() {
      const data = filterObj(this.caseQueryForm)
      data.status = 'up'
      this.$axios
        .post('/fn/caseCenter/case/listToCase', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.caseQueryForm.total = total
            list.forEach(m => {
              m.canCheck = true
            })
            this.caseTableList = list
            this.checkCaseData()
          }
        })
    },
    // 获取业务条线
    async getLineOptions() {
      const data = await fetchListTags({ data: { blgStripLine: this.$store.state.userInfo.blgStripLine, tagType: 5 } })
      const tagsList =
        data?.map(v => ({
          value: v.tagId,
          tagId: v.tagId,
          label: v.tagName,
          tagName: v.tagName,
          tagLevel: v.tagLevel,
          parentTagId: v.parentTagId
        })) || []
      this.businessLineOptions = tagsList.filter(v => v.tagLevel === '1')
    },
    // 选择案例确认事件
    handleCaseComfirm() {
      const selection = this.$refs.tablePagination.$refs.tableRef.$children[0].selection
      if (!selection.length) return (this.selectCaseVisible = false)
      const ids = this.caseIdList.map((v) => v.id)
      selection.forEach((v) => {
        if (!ids.includes(v.id)) {
          this.caseIdList.push(v)
        }
      })
      this.selectCaseVisible = false
    },
    // 弹框关闭清除数据
    handleCaseClose() {
      resetObj(this.caseQueryForm, {
        currPage: 1,
        pageSize: 10,
        total: 0,
        businessLine: ''
      })
      this.caseTableList = []
      this.selectCaseVisible = false
    },
    // 提交
    submit() {
      this.$refs.formRef.validate((valied) => {
        if (!valied) return
        if (!this.caseIdList.length) {
          return this.$message.warning('请关联案例')
        }
        const condition = filterObj(this.queryForm)
        const caseIdList = this.caseIdList.map((v) => v.id)
        condition.zoneType = this.zoneType
        condition.caseIdList = caseIdList
        this.$axios
          .post(
            '/fn/caseCenter/zoneManager/saveOrUpdateZone',
            { condition },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.$message.success('专题创建成功')
              const routerParams = { path: '/SpecialManage', params: { 
                fromPage: 'AddSpecial',
                operation: 'loadList'
               } }
              closeCurrPageAndGoPath(routerParams)
            }
          })
      })
    },
    // 重置页面数据
    resetData() {
      resetObj(this.queryForm)
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate()
      })
      this.caseIdList = []
    },
    // 培训讲师评估 是否可以评估
    caseTableSelectable(row, index) {
      return row.canCheck
    },
    // 回显案例数据
    checkCaseData () {
      this.$nextTick(() => {
        const selectRows = []
        this.caseIdList.forEach(m => {
          const row = this.caseTableList.find(c => m.id === c.id)
          if (row) {
            row.canCheck = false
            selectRows.push(row)
          } 
        })
        this.toggleSelection(selectRows)
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.caseTableRef?.toggleRowSelection(row);
        });
      } else {
        this.caseTableRef?.clearSelection();
      }
    },
    // 移除已选择的案例
    delCase(row) {
      const index = this.caseIdList.findIndex((v) => v === row)
      if (index >= 0) {
        this.caseIdList.splice(index, 1)
      }
    }
  },
  computed: {
    caseTableRef () {
      return this.$refs?.tablePagination?.getOriginTableRef()
    },
    comCaseIdList() {
      const list = localPaging(this.caseIdList, this.caseIdForm)
      return list
    },
    isScoreSpecial () {
      return this.zoneType === 'caseEva'
    }
  },
  mounted() {
    this.getLineOptions()
  },
  activated() {
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.zoneType = params.zoneType
      this.resetData()
      setPageTitle(this.stateMap[this.state])
      this.$wenEvent.$emit('getTiele')
    }
    if (params.state === 'edit') {
      merge(this.queryForm, params)
      this.caseIdList = params.caseList
    }
  }
}
</script>
<style lang="scss" scoped>
.CaseCenter__addSpecial {
  padding-top: 40px;
  background-color: #fff;
  .content-form {
    width: 648px;
    margin: 0 auto 60px;
    .table-pagination {
      position: relative;
      width: 800px;
      left: -58px;
      margin-top: 20px;
    }
  }

  .el-input__suffix {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

<style lang="scss" scoped>
.special-table-container {
  :deep(.el-table__body-wrapper) {
    max-height: 520px;
    overflow-y: auto;
  }
}
</style>
