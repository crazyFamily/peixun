<template>
  <div>
    <el-card class="search-form-card">
      <el-form :model="queryForm" :rules="queryRules" inline ref="queryForm">
        <el-form-item label="部门" class="">
          <div class="df">
            <gc-institution
              v-model="blgOrgIds"
              @change="busiTypeChange"
              ref="institutionRef"
            >
            </gc-institution>
            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10">
              含下属机构
            </el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="评聘年度" prop="evaluateYear">
          <gc-select
            k="evaluateYearName"
            v="evaluateYearId"
            class="w-200"
            :options="yearsOptions"
            v-model="queryForm.evaluateYear"
          ></gc-select>
        </el-form-item>
        <el-form-item label="培训师UM号/姓名">
          <el-input v-model="queryForm.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="培训师类型">
          <gc-select
            class="w-250"
            multiple
            collapse-tags
            :options="trainersTypes"
            v-model="queryForm.trainersType"
          ></gc-select>
        </el-form-item>
        <!-- <el-form-item label="在职状态">
          <gc-select
            v-model="queryForm.isLeaved"
            :options="leavedTypes"
          >
          </gc-select>
        </el-form-item> -->
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        class="table-left"
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import { trainersTypes, leavedTypes, busiTypes } from '@/util/constants'
import { CopyObj } from '@/util/utils'
import {
  fetchSelectTrainersTotalPoints,
  fetchExportSelectTrainersTotalPoints,
  fetchListEvaluationYear
} from '@/fetch/pointManagement'
export default {
  name: 'PointSummaryReport',

  props: {},

  data() {
    let orderList = [
      { label: '默认', value: '0' },
      { label: '升序', value: '1' },
      { label: '降序', value: '2' }
    ]
    let tableFilterSetting = (key, list, multiple = false) => {
      return {
        type: 'tablecolumnfilters',
        labelKey: key,
        radio: !multiple,
        list
      }
    }
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      list: [
        { label: 'UM帐号', prop: 'umId', width: '150' },
        { label: '姓名', prop: 'teacherName' },
        // { label: '公司', prop: '' },
        {
          label: '部门',
          prop: 'orgName',
          width: '150',
          ...tableFilterSetting('teacherOrgNameOrder', orderList)
        },
        {
          label: '业务条线',
          prop: 'blgStripLineName',
          width: '100'
          // ...tableFilterSetting('tableFilterBusiType', busiTypes)
        },
        { label: '岗位', prop: 'postDesc', width: '150' },
        // { label: '职级', prop: '' },
        {
          label: '培训师类型',
          prop: 'trainersTypeName',
          width: '120'
          // ...tableFilterSetting('trainersType', trainersTypes, true)
        },
        { label: '授课领域一', prop: 'lecturesAreaFirstName', width: '100' },
        { label: '授课领域二', prop: 'lecturesAreaSecName', width: '100' },
        {
          label: '总积分',
          prop: 'totalPoints',
          ...tableFilterSetting('pointTotalOrder', orderList)
        },
        {
          label: '面授积分',
          prop: 'facePoints',
          ...tableFilterSetting('facePointOrder', orderList)
        },
        {
          label: '直播积分',
          prop: 'livePoints',
          ...tableFilterSetting('livePointOrder', orderList)
        },
        {
          label: '微课积分',
          prop: 'microcoursesPoints',
          ...tableFilterSetting('microcoursesPointOrder', orderList)
        },
        {
          label: '其它积分',
          prop: 'otherPoints',
          ...tableFilterSetting('otherPointOrder', orderList)
        },
        { label: '评聘年度', prop: 'evaluateYearName' },
        { label: '评聘单位', prop: 'evaluateCompany' },
        {
          label: '在职状态',
          prop: 'isLeaved',
          ...tableFilterSetting('isLeaved', leavedTypes)
        }
      ],
      tableList: [],
      blgOrgIds: [],
      queryForm: {
        isGotSubBranch: '',
        evaluateYear: '',
        trainersType: [],
        teacherName: '',
        isLeaved: '',
        evaluateCompany: '',
        currPage: 1,
        pageSize: 10,
        total: 0,
        tableFilterBusiType: '',
        teacherOrgNameOrder: '',
        pointTotalOrder: '',
        facePointOrder: '',
        livePointOrder: '',
        microcoursesPointOrder: '',
        otherPointOrder: ''
      },
      queryRules: {
        evaluateYear: [requiredHandle('请选择评聘年度')]
      },
      yearsOptions: [],
      originOrgIds: [],
      // 在职状态下拉选项
      leavedTypes,
      trainersTypes
    }
  },

  components: {},

  computed: {},

  mounted() {
    this._getEvaluationYear()
  },

  methods: {
    async _getEvaluationYear() {
      this.yearsOptions = await fetchListEvaluationYear()
    },
    _formatParams(params) {
      let data = CopyObj(params)
      const [busiType, orgId] = this.blgOrgIds
      data.busiType = busiType
      data.orgId = orgId
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      data.trainersType = data.trainersType.join(',')
      data.busiType = data.tableFilterBusiType
        ? data.tableFilterBusiType
        : busiType
      return data
    },
    getList() {
      this.$refs.queryForm.validate(async (v) => {
        if (!v) return false
        let data = this._formatParams(this.queryForm)
        let { list, total } = await fetchSelectTrainersTotalPoints({ data })
        this.queryForm.total = total
        this.tableList = list
      })
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    reset() {
      for (let i in this.$data) {
        if (i === 'yearsOptions') continue
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.$refs.tablePagination.resetFilters()
      this.$refs.institutionRef.createTreeData()
    },
    async exportHandle() {
      this.$refs.queryForm.validate(async (v) => {
        if (!v) return false
        let data = this._formatParams(this.queryForm)
        await fetchExportSelectTrainersTotalPoints({ data })
      })
    },
    orgIdsFinish() {
      this.query()
      !this.originOrgIds.length && (this.originOrgIds = this.queryForm.orgIds)
    },
    busiTypeChange(orgName) {
      orgName && (this.queryForm.isGotSubBranch = true)
    }
  }
}
</script>
<style lang='scss' scoped>
</style>