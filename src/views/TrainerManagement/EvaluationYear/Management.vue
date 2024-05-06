<template>
  <div class="trainer-management__trainer-evaluation">
    <!-- 数据表格 card -->
    <el-card class="mt10">
      <div class="menu-right icons no-line">
        <span class="icons__add" @click="add">
          <i class="icons__add__icon"></i>
          新增</span
        >
        <span class="icons__save" @click="save">
          <i class="icons__save__icon"></i>
          保存</span
        >
      </div>
      <gc-table
        class="general__table"
        ref="tableRef"
        no-list
        :tableList="tableList"
      >
        <el-table-column label="评聘年度ID">
          <template slot-scope="scope">
            <el-input
              class="ml20 mr20"
              v-model="scope.row.evaluateYearId"
              @input="handleInput($event, scope.row)"
              @change="handleInput($event, scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="评聘年度">
          <template slot-scope="scope">
            <el-input v-model="scope.row.evaluateYearName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="开始日期">
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              class="w-full"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :clearable="false"
              v-model="scope.row.startDate"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="结束日期">
          <template slot-scope="scope">
            <el-date-picker
              type="date"
              class="w-full"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :clearable="false"
              v-model="scope.row.endDate"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <span class="active" @click="del(scope.$index)">删除</span>
          </template>
        </el-table-column>
      </gc-table>
    </el-card>
  </div>
</template>

<script>
import {
  CopyObj,
  jsonHeaders,
  manyLineHint,
  numerationAfterwardsDays
} from '@/util/utils'
export default {
  name: 'EvaluationYearManagement',
  data() {
    return {
      total: 0,
      tableList: []
    }
  },
  methods: {
    getList() {
      this.$axios
        .post('/fn/trainer/setting/listEvaluationYear', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.tableList = data
          }
        })
    },
    add() {
      const prev = this.tableList.slice(-1)[0]
      this.tableList.push({
        evaluateYearId: '',
        evaluateYearName: '',
        startDate: prev?.endDate
          ? numerationAfterwardsDays(prev.endDate, 1)
          : null,
        endDate: null,
        edit: true
      })
    },
    del(index) {
      this.tableList.splice(index, 1)
    },
    save(row) {
      const data = CopyObj(this.tableList)
      data.forEach((v) => {
        v.evaluateYearId = v.evaluateYearId || 0
      })
      this.$axios
        .post(
          '/fn/trainer/setting/saveEvaluationYearList',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            if (data?.length) {
              manyLineHint(data)
            } else {
              this.$message.success('保存成功')
              this.getList()
            }
          }
        })
    },
    handleInput(value, row) {
      row.evaluateYearId = value.match(/^\d+/)?.[0] || ''
      if (value.length > 4) {
        row.evaluateYearId = value.slice(0, 4)
      }
    }
  },
  mounted() {
    this.getList()
  },
  activated() {
    this.getList()
  }
}
</script>

<style lang="scss"></style>