<template>
  <div class="add-example-package_container">
    <el-card
      class="search-card"
      style="border: 0; margin-top: -20px; margin-left: 14 px"
    >
      <el-form ref="exampleForm" :model="exampleForm" :inline="true">
        <el-form-item label="习题包ID" prop="sortNum">
          <el-input v-model.trim="exampleForm.sortNum" clearable></el-input>
        </el-form-item>
        <el-form-item label="习题包名称" prop="exerciseProjectName">
          <el-input
            v-model.trim="exampleForm.exerciseProjectName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="创建时间"
          class="search-card__date mr10"
          prop="createdDate"
        >
          <el-date-picker
            v-model="exampleForm.createdDate"
            type="daterange"
            placeholder="选择日期"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changCreatedDate"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="负责人UM" prop="responsibleUmId">
          <el-input
            v-model.trim="exampleForm.responsibleUmId"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchExample">查询</el-button>
          <el-button type="primary" @click="resetExample">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="border: 0; margin-left: 14 px">
      <el-table
        ref="exampleTable"
        :data="exampleTableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
        max-height="300"
      >
        <el-table-column
          fixed
          type="selection"
          :reserve-selection="true"
          width="55"
        >
        </el-table-column>
        <el-table-column
          v-for="item in exampleTableHeader"
          :key="item.label"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="题目难度" header-align="center">
          <el-table-column
            prop="ryPercent"
            label="容易"
            width="70">
          </el-table-column>
          <el-table-column
            prop="zdPercent"
            label="中等"
            width="70">
          </el-table-column>
          <el-table-column
            prop="knPercent"
            label="困难"
            width="70">
          </el-table-column>
        </el-table-column>
      </el-table>
      <gc-pagination
        class="between"
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[5, 10]"
        :page-size="exampleForm.pageSize"
        :current-page="exampleForm.currPage"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
      <el-row class="mt20" style="text-align: center">
        <el-button style="width: 90px" @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="addExam">加入综合考试</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { jsonHeaders } from '@/util/utils'
import { useTable } from '../hooks/useTable'
export default {
  name: 'examplePackageList',
  props: {
    exerciseProjectIds: {
      type: Array,
      default: () => []
    },
    exerciseProjectList: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { updateUnshowDatasMaps, getUnshowPageSelectedDatas } = useTable({ selectedList: props.exerciseProjectList })
    return {
      updateUnshowDatasMaps,
      getUnshowPageSelectedDatas
    }
  },
  data() {
    return {
      exampleForm: {
        sortNum: '',
        exerciseProjectName: '',
        createdDate: null,
        createStartDate: null,
        createEndDate: null,
        responsibleUmId: '',
        pageSize: 5,
        currPage: 1
      },
      total: 0,
      exampleTableData: [],
      exampleTableHeader: [
        {
          label: '习题包id',
          prop: 'id',
          width: '90'
        },
        {
          label: '习题包名称',
          prop: 'exerciseProjectName',
          width: '150'
        },
        {
          label: '单选',
          prop: 'scNum',
          width: '60'
        },
        {
          label: '多选',
          prop: 'mcNum',
          width: '60'
        },
        {
          label: '判断',
          prop: 'jcNum',
          width: '60'
        },
        {
          label: '负责人UM',
          prop: 'responsibleUmId',
          width: '120'
        },
        {
          label: '创建时间',
          prop: 'createdDate',
          width: '100'
        }
      ],
      multipleSelection: [],
      multipleSelectionIds: [...this.exerciseProjectIds],
      selectedData: [...this.exerciseProjectList],
      isClearCurrentList: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.selectExerciseProjectForExam()
    },
    selectExerciseProjectForExam() {
      const { exampleForm } = this
      this.isClearCurrentList = false
      this.$axios
        .post(
          '/fn/privatewealth/exerciseproject/selectExerciseProjectForExam',
          { data: { ...exampleForm, createdDate: null } },
          jsonHeaders
        )
        .then((res) => {
          console.log('selectExerciseProjectForExam-res', res.data)
          const { code, data } = res.data
          if (code === 0) {
            this.exampleTableData = [...data.list]
            this.total = data.total
          }
          this.$nextTick(() => {
            // 设置选中
            this.setTableCheckBox()
          })
        })
        .catch((err) => {
          console.log('selectExerciseProjectForExam-err', err)
        })
    },
    resetExample() {
      this.$refs['exampleForm'].resetFields()
      this.exampleForm.createStartDate = null
      this.exampleForm.createEndDate = null
      this.searchExample()
    },
    getRowKeys(row) {
      return row.id
    },
    setTableCheckBox() {
      const { exampleTableData, multipleSelectionIds } = this
      exampleTableData.forEach((row) => {
        if (multipleSelectionIds.indexOf(row.id) > -1) {
          this.$refs['exampleTable'].toggleRowSelection(row, true)
        }
      })
    },
    changCreatedDate(event) {
      console.log('changCreatedDate', event)
      this.exampleForm.createStartDate = (event && event[0]) || null
      this.exampleForm.createEndDate = (event && event[1]) || null
    },
    searchExample() {
      this.exampleForm.currPage = 1
      this.selectExerciseProjectForExam()
    },
    addExam() {

      if (this.selectedData.length === 0 && this.getUnshowPageSelectedDatas().length === 0) {
        this.$message.warning('未勾选需要关联的考试包')
        return
      }

      const resultDatas = this.selectedData.concat(this.getUnshowPageSelectedDatas())

      // 去重
      const res = this._.uniqWith(resultDatas, this._.isEqual)
      console.log('uniqWith', res, resultDatas)
      this.$emit('selectionPackage', res)
    },
    handleSelectionChange(val) {
      this.isClearCurrentList = val.length === 0
      this.multipleSelection = val
      this.updateUnshowDatasMaps(val)
      this.changeSelectionIds()
      console.log(this.getUnshowPageSelectedDatas() , 'updateUnshowDatasMaps');
      this.selectedData = [...val]
      // const { exampleTableData, selectedData } = this
      // if (this.isClearCurrentList) {
      //   this.changeSelectionIds()
      //   this.selectedData = this._.xorWith(
      //     selectedData,
      //     exampleTableData,
      //     this._.isEqual
      //   )
      // } else {
      //   // this.selectedData = [...selectedData, ...val]
      //   this.selectedData = [...val]
      // }
    },
    currentChange(event) {
      this.exampleForm.currPage = event.pageNum
      this.selectExerciseProjectForExam()
    },
    sizeChange(event) {
      this.exampleForm.pageSize = event.pageSize
      this.selectExerciseProjectForExam()
    },
    changeSelectionIds() {
      const { multipleSelectionIds, exampleTableData } = this
      // 修改multipleSelectionIds, 防止取消勾选后,再次返回当前页,数据又被选中
      this.multipleSelectionIds = multipleSelectionIds.filter(
        (item) => !exampleTableData.map((item) => item.id).includes(item)
      )
    }
  }
}
</script>

<style></style>
