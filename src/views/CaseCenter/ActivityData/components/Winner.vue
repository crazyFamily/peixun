<template>
  <div class="CaseCenter__ActivityData__Activity">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <div>
        <div class="mt15 df">
          <div>奖品情况</div>
          <div>
            <el-tooltip content="刷新">
              <span class="instructor-icons__refresh" @click="getPrizeInfo">
                <i class="instructor-icons__refresh__icon"></i>
              </span>
            </el-tooltip>
          </div>
        </div>

        <div class="prize">
          <template v-for="prize in prizeInfo">
            <div :key="prize.awardId" v-if="prize.winningFlag === '1'">
              {{ prize.awardName }}: 共{{ prize.totalStock }}个, 剩余{{
                prize.nowStock
              }}个
            </div>
          </template>
        </div>
      </div>
      <el-form :model="queryForm" inline>
        <el-form-item label="姓名">
          <el-input
            v-model="queryForm.umOrName"
            placeholder="输入分享人姓名/UM号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="中奖日期" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.startDate"
              type="date"
              placeholder="开始日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0">
            <el-date-picker
              class="w-120"
              v-model="queryForm.endDate"
              type="date"
              placeholder="结束日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
          <el-button @click="downCase" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column slot="award" prop="awardName">
          <template slot="header">
            <gc-tablecolumnfilters
              label="奖项"
              ref="awardNameFilter"
              className="table__screen__icon"
              :list="fiterList"
              confirmText="确定"
              popperClass="circular"
              @filter="
                commonFilter($event, queryForm, 'awardName', getList, 'filter')
              "
              @reset="
                commonFilter($event, queryForm, 'difficultyLevel', getList)
              "
              radio
            >
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import { commonFilter, filterObj, resetObj } from '@/util/utils'
import { fetchHeroWinningRecord, fetchListAwardStock } from '@/fetch/caseCenter'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
export default {
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        umOrName: '',
        awardName: '',
        startDate: '',
        endDate: '',
        trailId: '',
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      list: [
        { label: '序号', type: 'index' },
        {
          label: '姓名',
          prop: 'umName',
          ctx: (row) =>
            `${row.umName ? `${row.umName}(${row.umId})` : row.umId}`
        },
        { slot: 'award' },
        { label: '机构', prop: 'orgName' },
        { label: '所属分组', prop: 'groupName' },
        { label: '中奖时间', prop: 'createdDate' }
      ],
      fiterList: [
        {
          label: '一等奖',
          value: '一等奖'
        },
        {
          label: '二等奖',
          value: '二等奖'
        },
        {
          label: '三等奖',
          value: '三等奖'
        }
      ],
      tableList: [],
      commonFilter,
      // 中奖数据数组
      prizeInfo: [],
      prizeDict: {}
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
      this.$refs.awardNameFilter.$reset()
      this.getList()
    },
    getList() {
      const data = filterObj(this.queryForm)
      data.tip = 'Y'
      fetchHeroWinningRecord({ data }).then((res) => {
        const { list, total } = res
        this.tableList = list
        this.queryForm.total = total
      })
    },
    downCase() {
      const data = filterObj(this.queryForm)
      data.tip = 'N'
      Reflect.deleteProperty(data, 'total')
      Reflect.deleteProperty(data, 'currPage')
      Reflect.deleteProperty(data, 'pageSize')
      fetchHeroWinningRecord({ data }, { headers: { responseType: 'blob' } })
    },
    // 获取奖品库存
    getPrizeInfo() {
      fetchListAwardStock().then((res) => {
        res.sort((a, b) => (a.awardId > b.awardId ? 1 : -1))
        this.prizeInfo = res
      })
    }
  },
  mounted() {
    this.getPrizeInfo()
  }
}
</script>

<style lang="scss" scoped>
.CaseCenter__ActivityData__Activity {
  .prize {
    display: flex;
    margin-top: 15px;
    & > div {
      width: 236px;
    }
  }
}
</style>
