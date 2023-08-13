<template>
  <div class="exam-statistics_container">
    <el-card class="box-card">
      <h2 class="mb20" style="font-size: 20px">数据统计</h2>
      <h3 class="mb20" style="font-size: 14px">
        考试名称: {{ currentExamDetailList.examName }}
      </h3>
      <section class="exam-detail">
        <ul class="detail-container">
          <li class="mb12" v-for="(item, index) in detailMap" :key="index">
            <span>{{ item.name }} ：</span>
            <span
              >{{ currentExamDetailList[index] | filterDetail }}
              {{
                ['', null].includes(currentExamDetailList[index])
                  ? '--'
                  : item.unit
              }}
            </span>
          </li>
        </ul>
      </section>
    </el-card>
    <el-card class="box-card mt20">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="item.name"
          :name="item.name"
          v-for="item in tabConfig"
          :key="item.tabIndex"
        >
          <component
            :is="item.componentName"
            :ref="`business${item.tabIndex}`"
          ></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { jsonHeaders, setPageTitle } from '@/util/utils'
import StudensDetail from './StudensDetail.vue'
import ExamDetail from './ExamDetail.vue'
import { exercisePackageHooks } from './hooks/exercisePackageHooks'
const { useCacheParams } = exercisePackageHooks()
export default {
  name: 'CRExaminationStatistics',
  components: {
    StudensDetail,
    ExamDetail
  },
  data() {
    return {
      params: {},
      activeName: '学员明细',
      tabIndex: '0',
      tabConfig: [
        {
          name: '学员明细',
          componentName: 'StudensDetail',
          tabIndex: '0'
        },
        {
          name: '试题明细',
          componentName: 'examDetail',
          tabIndex: '1'
        }
      ],
      currentExamDetailList: {
        examName: '',
        exerciseNum: '',
        totalScore: '',
        passScore: '',
        pushNum: '',
        maxScore: '',
        passNum: '',
        partakeNum: '',
        minScore: '',
        passRate: '',
        finishNum: '',
        avgScore: ''
      },
      detailMap: {
        exerciseNum: {
          name: '题目总数',
          unit: '道'
        },
        totalScore: {
          name: '总分',
          unit: '分'
        },
        passScore: {
          name: '及格分数',
          unit: '分'
        },
        pushNum: {
          name: '推送人数',
          unit: '人'
        },
        maxScore: {
          name: '最高分',
          unit: '分'
        },
        passNum: {
          name: '及格人数',
          unit: '人'
        },
        partakeNum: {
          name: '参与人数',
          unit: '人'
        },
        minScore: {
          name: '最低分',
          unit: '分'
        },
        passRate: {
          name: '及格率',
          unit: ''
        },
        finishNum: {
          name: '完成人数',
          unit: '人'
        },
        avgScore: {
          name: '平均分',
          unit: '分'
        }
      }
    }
  },
  filters: {
    filterDetail(val) {
      return val === null ? '--' : val
    }
  },
  activated() {
    const { params } = this.$route
    this.params = useCacheParams({ ...params }, this)
    console.log(this.params, 'pp')
    if (this.params.examId) {
      this.init()
      setPageTitle(`考试统计:${this.params.examName}`)
    } else {
      setPageTitle(`考试统计`)
    }
    this.$wenEvent.$emit('getTiele')
  },
  methods: {
    init() {
      const { params } = this
      this.setHeaderNav(params)
      this.queryExamStatistics(params)
    },
    setHeaderNav(params) {
      setPageTitle(`考试统计:${params.examName}`)
      this.$wenEvent.$emit('getTiele')
    },
    queryExamStatistics(params) {
      const { examId } = params
      this.$axios
        .post(
          '/fn/privatewealth/exam/queryExamStatistics',
          { examId: +examId },
          jsonHeaders
        )
        .then((res) => {
          console.log('queryExamStatistics --> success', res.data)
          const { code, data } = res.data
          if (code === 0) {
            this.currentExamDetailList = { ...data }
          }
        })
        .catch((err) => {
          console.log('queryExamStatistics --> err', err)
        })
    },
    handleClick(tab) {
      this.tabIndex = tab.index
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>
