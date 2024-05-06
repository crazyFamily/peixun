<template>
  <div class="TrainerManagement__integrationConfiguration">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="规则生效日期">
          <el-date-picker
            class="w-200"
            v-model="queryForm.date"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            value-format="yyyy-MM-dd"
            popper-class="date-picker"
          >
          </el-date-picker>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="add" class="button-w80-h30">新增</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right icons no-line">
        <span class="icons__upload ml10" @click="educe">
          <i class="icons__upload__icon"></i>
          导出</span
        >
      </div>
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column label="规则生效日期">
          <template slot-scope="scope">
            <span class="active" @click="editItem(scope.row)">
              {{ scope.row.date }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="active" @click="delOne(scope.row)">删除</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>

    <!-- 新增修改dialog -->
    <gc-model
      title="新增/修改规则"
      width="1000px"
      :visible.sync="editVisible"
      @comfirm="confirm"
    >
      <div>
        <div>
          <span class="mr20">规则生效日期</span>
          <el-date-picker
            class="w-200"
            v-model="startTime"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <gc-table
          noList
          :tableList="trainerTableList"
          class="general__table mt20"
        >
          <el-table-column
            label="培训师类型"
            prop="lecturerType"
          ></el-table-column>
          <el-table-column label="面授积分（分/小时）">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.faceScore"
                @blur="transformFloatGt(scope.row, 'faceScore')"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="直播积分（分/小时）">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.liveScore"
                @blur="transformFloatGt(scope.row, 'liveScore')"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="微课积分（分/门）">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.microScore"
                @blur="transformFloatGt(scope.row, 'microScore')"
              ></el-input>
            </template>
          </el-table-column>
        </gc-table>
      </div>
    </gc-model>
  </div>
</template>

<script>
import {
  CopyObj,
  downHeaders,
  jsonHeaders,
  transformFloatGt,
  handleDownload,
  hintFrame
} from '@/util/utils'
export default {
  name: 'integrationConfiguration',
  data() {
    return {
      queryForm: {
        date: '',
        page: 1,
        size: 10,
        total: 0
      },
      list: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        }
      ],
      tableList: [],
      editVisible: false,
      trainerTableList: [],
      startTime: '',
      state: '',
      transformFloatGt
    }
  },
  methods: {
    query() {
      this.getList()
    },
    add() {
      this.$axios.post('/fn/trainer/eval/selectRuleTemplate').then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.trainerTableList = data
          this.startTime = ''
          this.editVisible = true
          this.state = 'add'
        }
      })
    },
    getList() {
      this.$axios
        .post('/fn/trainer/eval/selectRuleDate', this.queryForm, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.tableList = list.map((v) => ({ date: v }))
            this.queryForm.total = total
          }
        })
    },
    confirm() {
      let url, data
      if (this.state === 'add') {
        if (!this.startTime) return this.$message.warning('请填写规则生效日期')
        url = '/fn/trainer/eval/addScoreRuleDate'
        data = {
          date: this.startTime,
          scoreRuleList: this.trainerTableList
        }
      } else {
        url = '/fn/trainer/eval/updateScoreRule'
        data = CopyObj(this.trainerTableList)
        data = {
          scoreRuleList: data,
          newRuleDate: this.startTime,
          oriRuleDate: data[0]?.beginDate
        }
      }
      this.$axios.post(url, data, jsonHeaders).then((res) => {
        const { code } = res.data
        if (code === 0) {
          this.editVisible = false
          this.$message.success('操作成功')
          this.query()
        }
      })
    },
    delOne(row) {
      hintFrame('确定删除这条积分规则？').then((res) => {
        const { date } = row
        const scoreRule = { beginDate: date }
        this.$axios
          .post('/fn/trainer/eval/deleteScoreRule', { scoreRule }, jsonHeaders)
          .then((res) => {
            const { code } = res.data
            if (code === 0) {
              this.$message.success('删除成功')
              this.query()
            }
          })
      })
    },
    editItem(row) {
      const { date } = row
      const data = { date }
      this.$axios
        .post('/fn/trainer/eval/selectRule', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.trainerTableList = data
            this.editVisible = true
            this.state = 'edit'
            this.startTime = data[0]?.beginDate
          }
        })
    },
    educe() {
      const data = { date: this.queryForm.date }
      this.$axios
        .post('/fn/trainer/eval/reportRuleList', data, downHeaders)
        .then(handleDownload)
    }
  },
  activated() {
    this.query()
  }
}
</script>
<style lang="scss"></style>