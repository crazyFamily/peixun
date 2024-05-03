<template>
  <div class="StatementCentre__SynthesisIndex__PerCapitaHour">
    <el-card>
      <div>直播立项名称: {{ seriesInfo.liveProposalName }}</div>
      <div class="between mt20 w1000">
        <span> 审批状态：{{ seriesInfo.eoaStatusName }} </span>
        <span> 系列立项人：{{ seriesInfo.createdBy }} </span>
        <span> 拟定开始时间：{{ seriesInfo.planStartDate }} </span>
        <span> 拟定结束时间：{{ seriesInfo.planEndDate }} </span>
      </div>
    </el-card>
    <el-card class="mt10">
      <gc-table
        class="general__table table-left"
        :list="list"
        :tableList="tableList"
      >
      </gc-table>
      <gc-pagination
        class="between"
        :total="total"
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
      />
    </el-card>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  handleBlob,
  sizeChange,
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
export default {
  name: 'CRSeriesInfo',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      // 系列数据
      seriesInfo: {},
      queryForm: {
        // busiType: [],
        // isGotSubBranch: "",
        // dateStart: "",
        // dateEnd: "",
        currPage: 1,
        pageSize: 10
      },
      total: 0,
      list: [
        {
          label: '直播名称',
          width: '200',
          prop: 'liveName',
          'show-overflow-tooltip': false
        },
        {
          label: '直播源',
          width: '90',
          prop: 'liveSource',
          ctx: (row) => {
            let sourceMap = { xc: '小橙', zn: '知鸟' }
            return sourceMap[row.liveSource] || row.liveSource
          }
        },
        {
          label: '直播类型',
          width: '90',
          prop: 'liveType',
          ctx: (row) => {
            let typeMap = { new: '新建直播', relation: '关联已有直播' }
            return typeMap[row.liveType] || row.liveType
          }
        },
        {
          label: '所属机构',
          width: '90',
          prop: 'orgName'
        },
        {
          label: '主播',
          width: '100',
          prop: 'liveUmName'
        },
        {
          label: '授课讲师',
          width: '110',
          prop: 'teacherUmName'
        },
        {
          label: '直播标签',
          width: '90',
          prop: 'liveTag'
        },
        {
          label: '系列名称',
          width: '166',
          prop: 'liveProposalName'
        },
        {
          label: '开始时间',
          width: '90',
          prop: 'liveStartDate'
        },
        {
          label: '结束时间',
          width: '90',
          prop: 'liveEndDate'
        },
        {
          label: '理财合规课程',
          width: '120',
          prop: 'isFinanceCompliance',
          ctx: (row) => {
            let renderList = { Y: '是', N: '否' }
            return renderList[row.isFinanceCompliance]
          }
        }
      ],
      tableList: [],
      // 审批状态 选项
      approvalStatusOptions: [
        {
          label: '草稿中',
          value: '02000'
        },
        {
          label: '审批中',
          value: '02001'
        },
        {
          label: '已通过',
          value: '02002'
        },
        {
          label: '已退回',
          value: '02003'
        },
        {
          label: '已撤回',
          value: '02004'
        }
      ],
      sizeChange,
      currentChange
    }
  },
  methods: {
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      const [busiType, orgId] = data.busiType
      ;[data.busiType, data.orgId] = [busiType, orgId]
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      return data
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    download() {
      const data = this.getQueryForm()
      data.tip = 'N'
      return this.$axios
        .post(
          '/fn/report/process/listOrgStudyRecord',
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
    getList() {
      // const data = this.getQueryForm();
      // data.tip = "Y";
      let data = {
        ...this.queryForm,
        liveProposalName: this.seriesInfo.liveProposalName
      }
      return this.$axios
        .post(
          '/fn/privatewealth/liveinfo/selectLiveInfoListByPage',
          // "/fn/report/process/listOrgStudyRecord",
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableList = list
          }
        })
    },
    // 后端转前端
    backgroundDataToCurrentPageData(params) {
      this.seriesInfo = params
    }
  },
  activated() {
    this.isChange = false
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.resetFormData()
      setPageTitle(this.stateMap[this.state])
      this.$wenEvent.$emit('getTiele')
    }
    if (params.id) {
      this.id = params.id
      this.$nextTick(() => {
        console.log(params, '---- params')
        this.backgroundDataToCurrentPageData(params)
        this.query()
      })
    }
  }
}
</script>

<style></style>