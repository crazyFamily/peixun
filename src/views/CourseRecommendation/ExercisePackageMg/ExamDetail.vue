<template>
  <div class="exam-detail">
    <el-form
      :model="exerciseForm"
      ref="exerciseSearchForm"
      class="form-container"
    >
      <el-form-item label="题型" prop="exerciseType">
        <el-col :span="20">
          <el-select
            v-model="exerciseForm.exerciseType"
            placeholder="请选择题型"
            clearable
          >
            <el-option
              v-for="item in titleOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
              >{{ item.value }}</el-option
            >
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="题目" prop="exerciseContent">
        <el-col :span="20">
          <el-input
            v-model="exerciseForm.exerciseContent"
            placeholder="请输入题目"
          >
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item class="self-item">
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button @click="toReset">重置</el-button>
        <el-button @click="exportHandle">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="exerciseTable"
      :data="exerciseList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        v-for="item in exerciseListTabHeader"
        :sortable="item.sortable"
        :key="item.label"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ transformText(scope.row[item.prop], item.prop) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.stop="exportExamExerciseDetail(scope.row)"
            >详情下载</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <gc-pagination
      class="between"
      :total="total"
      layout="prev, pager, next,slot, sizes"
      prev-text=""
      next-text=""
      :page-sizes="[20, 40, 60, 80, 100]"
      :page-size="queryForm.pageSize"
      :current-page="queryForm.currPage"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    >
      <span class="text">每页显示</span>
    </gc-pagination>
  </div>
</template>

<script>
import { jsonHeaders, handleBlob } from '@/util/utils'
import { exercisePackageHooks } from './hooks/exercisePackageHooks'
import { fetchExportAllExamExercise } from '@/fetch/courseRecommendation'
const { useCacheParams } = exercisePackageHooks()
export default {
  data() {
    return {
      total: 0,
      exerciseList: [],
      exerciseForm: {
        exerciseContent: '',
        exerciseType: ''
      },
      queryForm: {
        size: 20,
        page: 1
      },
      titleOptions: [
        {
          key: 'jc',
          value: '判断题'
        },
        {
          key: 'sc',
          value: '单选题'
        },
        {
          key: 'mc',
          value: '多选题'
        }
      ],
      exerciseListTabHeader: [
        {
          label: '题型',
          prop: 'exerciseType',
          width: '70',
          formatter: (row) => row.exerciseType === 'sc' ? '单选题' : row.exerciseType === 'mc' ? '多选题' : row.exerciseType === 'jc' ? '判断题' : row.exerciseType,
        },
        {
          label: '题目',
          prop: 'exerciseContent',
          width: '120'
        },
        {
          label: '选项',
          prop: 'exerciseOptions',
          width: '220'
        },
        {
          label: '答案',
          prop: 'exerciseAnswers',
          width: '120'
        },
        {
          label: '正确率',
          prop: 'rightRate',
          width: '80',
          sortable: true,
          formatter: (row) => (row.rightRate === null ? '-' : row.rightRate),
        },
        {
          label: '是否底层资产',
          prop: 'ifBottomAsset',
          width: '100'
        },
        {
          label: '考察能力',
          prop: 'examineContent',
          width: '90'
        },
        {
          label: '资产标签-产品策略分类',
          prop: 'tkExerciseAssetTag',
          width: '150'
        },
        {
          label: '综合产品分类',
          prop: 'tkExerciseProductTag',
          width: '120'
        }
      ]
    }
  },
  activated() {
    const { params } = this.$route
    this.params = useCacheParams({ ...params }, this)
    if (this.params.examId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.selectExamExerciseStatisticsPage()
    },
    selectExamExerciseStatisticsPage() {
      const { queryForm, exerciseForm, params } = this
      const { examId } = params
      this.$axios
        .post(
          '/fn/privatewealth/exam/selectExamExerciseStatisticsPage',
          {
            data: { examId: +examId, tip: 'Y', ...queryForm, ...exerciseForm }
          },
          jsonHeaders
        )
        .then((res) => {
          console.log('selectExamExerciseStatisticsPage --> success', res.data)
          const { code, data } = res.data
          if (code === 0) {
            const list = data.list.map((item) => {
              return {
                ...item,
                rightRate: +item.rightRate.slice(0, -1)
              }
            })
            this.exerciseList = [...list]
            this.total = data.total
          }
        })
        .catch((err) => {
          console.log('selectExamExerciseStatisticsPage --> err', err)
        })
    },
    transformText(text, prop) {
      if (prop === 'exerciseType') {
        const title = this.titleOptions.find((item) => item.key === text)
        return title ? title.value : text
      }
      if (prop === 'rightRate') {
        return text + '%'
      }
      return text
    },
    toSearch() {
      this.queryForm.page = 1
      this.selectExamExerciseStatisticsPage()
    },
    toReset() {
      this.$refs['exerciseSearchForm'].resetFields()
      this.toSearch()
    },
    exportExamExerciseDetail(row) {
      const { examId, exerciseId } = row
      this.$axios
        .post(
          '/fn/privatewealth/exam/exportExamExerciseDetail',
          { examId, exerciseId },
          {
            ...jsonHeaders,
            responseType: 'blob'
          }
        )
        .then((res) => {
          handleBlob(res)
        })
    },
    currentChange(event) {
      this.queryForm.page = event.pageNum
      this.selectExamExerciseStatisticsPage()
    },
    sizeChange(event) {
      console.log('event', event)
      this.queryForm.size = event.pageSize
      this.selectExamExerciseStatisticsPage()
    },
    async exportHandle() {
      const data = {
        ...this.params,
        ...this.exerciseForm
      }
      await fetchExportAllExamExercise({ data })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  & .el-select {
    width: 100%;
  }
  & .self-item {
    grid-column-start: 1;
    grid-column-end: 4;
    text-align: right;
  }
}
</style>
