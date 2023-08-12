<template>
  <div class="course-recommendation__project-management">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="习题名称">
          <el-input
            v-model="queryForm.exerciseContent"
            clearable
            class="w200"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="创建时间" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.createStartDate"
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
              v-model="queryForm.createEndDate"
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
        <el-form-item label="题型">
          <gc-select
            :options="exerciseTypeOptions"
            v-model="queryForm.exerciseType"
            clearable
          ></gc-select>
        </el-form-item>
        <el-form-item label="难度">
          <gc-select
            :options="difficultLevelOptions"
            v-model="queryForm.difficultLevel"
            clearable
          ></gc-select>
        </el-form-item>
        <el-form-item label="创建人UM">
          <el-input
            v-model="queryForm.updatedBy"
            class="w200"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="题目负责人">
          <el-input
            v-model="queryForm.responsibleUm"
            class="w200"
            clearable
          ></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 数据表格 card -->
    <el-card class="mt10">
      <p style="margin-top: 10px">
        已选择{{ currentSelectList.length }}个习题，包括{{
          currSelInfo.singelChoice
        }}单选，{{ currSelInfo.multipleChoice }}多选，{{
          currSelInfo.judgeChoice
        }}判断题
      </p>
      <gc-table
        class="general__table mt20"
        ref="tableRef"
        :list="list"
        row-key="id"
        :tableList="tableList"
        @selection-change="selectionChange"
      >
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
      />
    </el-card>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="cancle">取消</el-button>
      <el-button @click="submit" type="primary">加入综合考试</el-button>
    </div>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  sizeChange,
  jsonHeaders,
  commonFilter,
  currentChange,
  getCurriculumTree,
  addAllowKeepAlive
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import { getOrg } from '../utils'
import gcTag from '@/components/chunk/tag'
export default {
  name: 'CRExercisesBookMg',
  mixins: [handlePickerOptions],
  components: { gcTag },
  props: {
    // tabSelLists: {
    //   type: [Array, String]
    // }
  },
  data() {
    return {
      // 查询用的表单
      queryForm: {
        exerciseContent: '',
        exerciseType: '',
        difficultLevel: '',
        createStartDate: null,
        createEndDate: null,
        exerciseProjectName: '',
        updatedBy: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      total: 0,
      // 分页函数
      sizeChange,
      currentChange,
      // 表格筛选公共函数
      commonFilter,
      list: [
        {
          type: 'selection',
          width: '50',
          'reserve-selection': true
        },
        {
          label: '题型',
          width: '40',
          prop: 'exerciseType',
          formatter: (row) => row.exerciseType === 'sc' ? '单选题' : row.exerciseType === 'mc' ? '多选题' : row.exerciseType === 'jc' ? '判断题' : row.exerciseType,
        },
        {
          label: '习题名称',
          width: '150',
          prop: 'exerciseContent'
        },
        {
          label: '选项',
          width: '150',
          prop: 'exerciseOptionsStr'
        },
        {
          label: '答案',
          width: '100',
          prop: 'exerciseOptionsAnswerStr'
        },
        {
          label: '难度',
          width: '40',
          prop: 'difficultLevel',
          formatter: (row) => row.difficultLevel === 'ry' ? '容易' : row.difficultLevel === 'zd' ? '中等' : row.difficultLevel === 'kn' ? '困难' : row.difficultLevel,
        },
        {
          label: '创建时间',
          width: '70',
          prop: 'createdDate'
        }
      ],
      tableList: [],
      // 难易程度选项
      difficultLevelOptions: [
        {
          label: '困难',
          value: 'kn'
        },
        {
          label: '中等',
          value: 'zd'
        },
        {
          label: '容易',
          value: 'ry'
        }
      ],
      // 课程类型 选项
      exerciseTypeOptions: [
        {
          label: '单选',
          value: '单选题'
        },
        {
          label: '多选',
          value: '多选题'
        },
        {
          label: '判断',
          value: '判断题'
        }
      ],
      currentSelectList: []
    }
  },
  computed: {
    currSelInfo() {
      let _singelChoice = this.currentSelectList.filter(
        (o) => o.exerciseType === '单选题' || o.exerciseType === 'sc'
      ).length
      let _multipleChoice = this.currentSelectList.filter(
        (o) => o.exerciseType === '多选题' ||  o.exerciseType === 'mc'
      ).length
      let _judgeChoice = this.currentSelectList.filter(
        (o) => o.exerciseType === '判断题' ||  o.exerciseType === 'jc'
      ).length
      return {
        singelChoice: _singelChoice,
        multipleChoice: _multipleChoice,
        judgeChoice: _judgeChoice
      }
    }
  },
  methods: {
    cancle() {
      this.$emit('cancleChoice')
      this.clear()
    },
    submit() {
      this.$emit('acknowledgement', this.currentSelectList)
      this.clear()
    },
    selectionChange(selection) {
      this.currentSelectList = selection
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    clear() {
      this.reset()
      this.tableList = []
      this.$nextTick(() => {
        this.$refs.tableRef.$children[0].clearSelection()
      })
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
      this.getList()
    },
    getList() {
      let data = this.queryForm
      data.createStartDate = data.createStartDate ? data.createStartDate : null
      data.createEndDate = data.createEndDate ? data.createEndDate : null
      this.$axios
        .post(
          '/fn/privatewealth/exerciseinfo/selectExerciseInfoListForProjectByPage',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableList = list
            // if (this.tabSelLists && this.tabSelLists.length) {
            //   this.tableList.forEach((item) => {
            //     let _currSel = this.tabSelLists.find((o) => o === item.id)
            //     if (_currSel) {
            //       this.$nextTick(() => {
            //         this.$refs.tableRef.$children[0].toggleRowSelection(
            //           item,
            //           true
            //         )
            //       })
            //     }
            //   })
            // }
          }
        })
    }
  },
  watch: {
    tabSelLists: {
      handler(n) {
        if (n && n.length) {
          if (this.tabSelLists && this.tabSelLists.length) {
            this.$refs.tableRef.$children[0].clearSelection()
            this.tableList.forEach((item) => {
              let _currSel = this.tabSelLists.find((o) => o === item.id)
              if (_currSel) {
                this.$nextTick(() => {
                  this.$refs.tableRef.$children[0].toggleRowSelection(
                    item,
                    true
                  )
                })
              }
            })
          }
        }
      }
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style lang="scss"></style>
