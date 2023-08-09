<template>
  <div class="CaseCenter__report report-box">
    <el-tabs v-model="activeName">
      <template v-for="(item, index) in reportTypes">
        <el-tab-pane
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </template>
      <div class="report-container" v-if="currentReportId">
        <!-- <keep-alive :include="Object.values(componentsMap)">
                </keep-alive> -->
        <component
          :is="currentReport"
          :case-id="currentReportId"
          :key="`${currentReport}-${currentReportId}`"
        ></component>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import CompCaseTypeReport from './CompCaseTypeReport.vue'
import CompOrganizationTypeReport from './CompOrganizationTypeReport.vue'
import CompScoreTypeReport from './CompScoreTypeReport.vue'
import { addAllowKeepAlive } from '@/util/utils'
export default {
  name: 'CaseReport',

  props: {},

  data() {
    return {
      activeName: 'case',
      // 报表类型
      reportTypes: [
        {
          label: '按案例统计',
          value: 'case'
        },
        {
          label: '按机构统计',
          value: 'organization'
        },
        {
          label: '评分明细',
          value: 'score'
        }
      ],
      // comp-map
      componentsMap: {
        case: 'CompCaseTypeReport',
        organization: 'CompOrganizationTypeReport',
        score: 'CompScoreTypeReport'
      },
      // 表单
      queryForm: {},
      currentReportId: ''
    }
  },

  components: {
    CompCaseTypeReport,
    CompOrganizationTypeReport,
    CompScoreTypeReport
  },

  computed: {
    // 当前活动报表
    currentReport() {
      return this.componentsMap[this.activeName]
    }
  },

  methods: {},

  mounted() {
    if (this.$route.params.id === undefined) {
      addAllowKeepAlive('/CaseManagement')
      this.$router.push({ name: '案例管理' })
    } else {
      this.currentReportId = this.$route.params.id
    }
  },
  activated() {
    this.$route.params.id && (this.currentReportId = this.$route.params.id)
    this.activeName = 'case'
  }
}
</script>
<style lang="scss">
.CaseCenter__report .el-tabs__header {
  background-color: #fff;
  margin-bottom: -1px;
}
</style>
