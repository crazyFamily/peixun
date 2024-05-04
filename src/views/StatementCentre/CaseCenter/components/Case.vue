<template>
  <div class="StatementCentre__OnlineStatistic__Case">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="案例归属">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              busiType="LS"
              :left-show="false"
              :default-show="true"
              :fetchParams="{ module: CASE_MODULE }"
              :otherParams="{ module: CASE_MODULE }"
              @setDataFinish="orgIdsFinish"
              ref="institutionRef"
            >
            </gc-institution>
          </div>
        </el-form-item>
        <el-form-item>
          <el-form-item label="案例上架时间" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.upStartDate"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0">
            <el-date-picker
              class="w-120"
              v-model="queryForm.upEndDate"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="学习时间">
          <time-chunk v-model="queryForm.date"></time-chunk>
        </el-form-item>
        <el-form-item label="案例名称">
          <el-input v-model="queryForm.caseInfo" placeholder="案例编号/案例名称"></el-input>
        </el-form-item>
        <el-form-item label="案例制作人">
          <el-input v-model="queryForm.caseAuthor" placeholder="姓名/UM号"></el-input>
        </el-form-item>
        <el-form-item label="案例分类">
          <gc-select class="w-200" :options="caseClassifyOptions" @change="changeCaseClassify" v-model="queryForm.businessLine"></gc-select>
        </el-form-item>
        <el-form-item label="案例标签">
          <el-cascader
            clearable
            :options="caseTagOptions"
            :props="cascaderProps"
            collapse-tags
            @visible-change="setEmptyContent"
            v-model="queryForm.tagChildIds"
            ref="multipleCascaderRef"
          >
          </el-cascader>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="exportHandle">
          <i class="instructor-icons__add__icon"></i>
          导出
        </span>
      </div>
      <div class="scroll__table" v-loading="getLoadingStatus('LOADING_CASE_STATISTICS')">
        <gc-table class="table-left" :show-header="false"  :list="totallist" :tableList="totalList"></gc-table>
        <gc-table
          class="table-left"
          :list="list"
          :tableList="tableList"
          ref="tablePagination"
          :queryForm="queryForm"
          :getList="getList"
          v-loading="getLoadingStatus('LOADING_CASE_STATISTICS')"
        >
          <el-table-column slot="tagName" width="226px;" label="案例标签">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content" v-html="toBreak(scope.row.tagName)"></div>
                <div class="onLine" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{scope.row.tagName}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
        </gc-table>
      </div>
      <gc-pagination
        :total="queryForm.total"
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
// 按机构统计
import { jsonHeaders, resetObj, handleBlob, CopyObj, arrToTree,  filterObj, sizeChange, currentChange, getLoadingStatus } from '@/util/utils'
import { fetchCaseStatisticsList } from '@/fetch/statementCentre'
import { fetchListTags } from '@/fetch/caseCenter'
import { LINE_LS } from '@/util/constants'
import { yesOrNoMap } from '@/util/constants'
import { CASE_MODULE } from '../../enum'
export default {
  props: {},

  data() {
    return {
      list: [
        {
          label: '案例编号',
          prop: 'caseId',
          width: '150'
        },
        {
          label: '案例名称',
          prop: 'caseName',
          width: '160'
        },
        {
          type: 'tablecolumnfilters',
          label: '是否优秀案例',
          width: '120',
          prop: 'isPerfect',
          radio: true,
          labelKey: 'isPerfect',
          formatter: row => `${row.isPerfect === 'Y' ? '是' : '否'}`,
          list: yesOrNoMap
        },
        {
          label: '学习人次',
          prop: 'browseNum',
          width: '80'
        },
        {
          label: '学习人数',
          prop: 'studyNum',
          width: '80'
        },
        {
          label: '完成人数',
          prop: 'doneNum',
          width: '80'
        },
        {
          label: '累计学习时长（分钟）',
          prop: 'covertCumulativeTime',
          width: '140'
        },
        {
          label: '有效学习时长（分钟）',
          prop: 'covertEffetiveTime',
          width: '140'
        },
        {
          label: '案例评分',
          width: '80',
          prop: 'avScore'
        },
        {
          label: '推荐指数',
          width: '80',
          prop: 'npsScore'
        },
        {
          label: '评分人数',
          width: '80',
          prop: 'scoreNum'
        },
        {
          label: '喜欢人数',
          prop: 'likeNum',
          width: '80'
        },
        {
          label: '不喜欢人数',
          prop: 'dislikeNum',
          width: '90'
        },
        {
          label: '收藏数',
          prop: 'collectionNum',
          width: '80'
        },
        {
          label: '制作人',
          prop: 'makeUserName',
          width: '100'
        },
        {
          label: '分享人',
          prop: 'shareUserName',
          width: '100'
        },
        {
          label: '案例归属',
          prop: 'orgName',
          width: '120'
        },
        {
          label: '创建时间',
          prop: 'createDateStr',
          width: '100'
        },
        {
          label: '案例分类',
          prop: 'businessLineStr',
          width: '120'
        },
        {
          label: '案例标签',
          slot: 'tagName',
          width: '226'
        },
        {
          label: '案例简介',
          prop: 'briefIntroduction',
          width: '160'
        },
        {
          label: '案例关键词',
          prop: 'keyWords',
          width: '140'
        },
        {
          label: '课件数量',
          prop: 'coursewareNum',
          width: '100'
        }
      ],
      totallist: [
        {
          label: '案例编号',
          width: '150',
          formatter: row => '合计'
        },
        {
          label: '案例名称',
          width: '160'
        },
        {
          label: '是否优秀案例',
          width: '120'
        },
        {
          label: '学习人次',
          prop: 'totalBrowseNum',
          width: '80'
        },
        {
          label: '学习人数',
          prop: 'totalStudyNum',
          width: '80'
        },
        {
          label: '完成人数',
          prop: 'totalDoneNum',
          width: '80'
        },
        {
          label: '累计学习时长（分钟）',
          prop: 'totalCovertCumulativeTime',
          width: '140'
        },
        {
          label: '有效学习时长（分钟）',
          prop: 'totalCovertEffetiveTime',
          width: '140'
        },
        {
          label: '案例评分',
          width: '80',
          prop: 'totalAvScore'
        },
        {
          label: '推荐指数',
          width: '80',
          prop: 'totalAvgNpsScore'
        },
        {
          label: '评分人数',
          width: '80',
          prop: 'totalScoreNum'
        },
        {
          label: '喜欢人数',
          prop: 'totalLikeNum',
          width: '80'
        },
        {
          label: '不喜欢人数',
          prop: 'totalDislikeNum',
          width: '90'
        },
        {
          label: '收藏数',
          prop: 'totalCollectionNum',
          width: '80'
        },
        {
          label: '制作人',
          width: '100'
        },
        {
          label: '分享人',
          width: '100'
        },
        {
          label: '案例归属',
          width: '120'
        },
        {
          label: '创建时间',
          width: '100'
        },
        {
          label: '案例分类',
          width: '120'
        },
        {
          label: '案例标签',
          width: '226'
        },
        {
          label: '案例简介',
          width: '160'
        },
        {
          label: '案例关键词',
          width: '140'
        },
        {
          label: '课件数量',
          width: '100'
        }
      ],
      tableList: [],
      queryForm: {
        currPage: 1,
        pageSize: 10,
        businessLine: '',
        tagChildIds: []
      },
      startPickerOptions: {},
      endPickerOptions: {},
      sizeChange,
      currentChange,
      getLoadingStatus,
      caseClassifyOptions: [],
      caseTagOptions: [],
      tagsList: [],
      cascaderProps: { value: 'value', label: 'label', multiple: true },
      CASE_MODULE
    }
  },

  mounted() {
    this.getAllFilter()
    this.$refs.multipleCascaderRef.$el.querySelector('.el-input').style.width = '350px'
  },

  methods: {
    orgIdsFinish() {
      this.queryForm.id = this.caseId
      this.cacheOrgIds = CopyObj(this.queryForm.orgIds)
      this.query()
    },
    // 执行查询
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    // 表单重置
    reset() {
      resetObj(this.queryForm, {
        currPage: 1,
        pageSize: 10,
        total: 0,
        id: this.caseId,
        orgIds: this.cacheOrgIds
      })
      this.$refs.tablePagination.resetFilters()
      this.$refs.institutionRef.createTreeData()
      this.$nextTick(() => {
        this.caseTagOptions = []
      })
    },
    // 格式化发送数据
    _formatSendParams(params) {
      let data = filterObj(params)
      data.orgId = data.orgIds?.[1]
      const { start, end } = data.date || {}
      data.startDate = start
      data.endDate = end
      data.tagChildIds = this.$refs.multipleCascaderRef.getCheckedNodes().map(v=>v.value)
      Reflect.deleteProperty(data, 'orgIds')
      Reflect.deleteProperty(data, 'date')
      return data
    },
    // 拉取数据
    async getList() {
      let data = this._formatSendParams(this.queryForm)
      data.tip = 'Y'
      const { total, list } = await fetchCaseStatisticsList({ data })
      this.queryForm.total = total
      this.tableList = list
    },
    // 导出
    exportHandle() {
      let data = this._formatSendParams(this.queryForm)
      data.tip = 'N'
      this.$axios
        .post(
          '/fn/report/case/caseStatisticsList',
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
    // 获取 业务条线 业务类型 销售客群 下拉选项
    async getAllFilter() {
      const blgStripLine = this.$store.state.userInfo.blgStripLine || LINE_LS
      const data = await fetchListTags({ data: { blgStripLine, tagType: 5 } })
      this.tagsList =
        data?.map(v => ({
          value: v.tagId,
          tagId: v.tagId,
          label: v.tagName,
          tagLevel: v.tagLevel,
          parentTagId: v.parentTagId
        })) || []
      this.caseClassifyOptions = this.tagsList.filter(v => v.tagLevel === '1')
    },
    changeCaseClassify(val) {
      let selectItem = this.caseClassifyOptions.find(item => item.value === val)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      // 重新渲染案例标签
      this.queryForm.tagChildIds = []
      this.$nextTick(() => {
        this.caseTagOptions = newArr
      })
    },
    toBreak(val) {
      return val?.replace(/\n/g,'<br />')
    },
    // 显示总计
    handleSummary(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
        } else {
          const key = column.property[0]?.toUpperCase() + column.property?.slice(1)
          sums[index] = data?.[0]?.[`total${key}`]
        }
      })
      return sums
    },
    // 设置数据为空时的方法
    setEmptyContent(n) {
      if (n) {
        this.$nextTick(() => {
          const emptyEle = this.$refs.multipleCascaderRef.popperElm?.querySelector('.el-cascader-menu__empty-text')
          if (emptyEle) {
            emptyEle.innerText = '请先选择分类'
          }
        })
      }
    }
  },
  computed: {
    totalList() {
      const data = this.tableList[0] || {}
      return [data]
    }
  }
}
</script>
<style lang="scss"></style>