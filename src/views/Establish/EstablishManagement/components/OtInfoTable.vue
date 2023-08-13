<template>
  <div class="OtInfoTable">
    <div class="title">
      <div class="title__menu"></div>
      <span class="necessary-before l1">
        课程内容
      </span>
      <el-tooltip effect="light" placement="right"><i class="el-icon-question active"></i>
        <div slot="content" :style="{ width: '350px' }">
          <p>1、根据拟定日期计算天数，天数不可超过拟定日期的天数</p>
          <p>2、每天的学时最多计算8小时，总学时不可超过<span class="active">最大天数*8小时</span></p>
        </div>
      </el-tooltip>
    </div>
    <table-pagination drop row-key="customId" class="mt20" :hidePagination="true" :queryForm="{}" :list="timetableList" :tableList="tableListData">
      <el-table-column label="课程内容描述" min-width="236">
        <template v-slot="scope">
          <el-input :disabled="disabled" v-model.trim="scope.row.courseName" :maxlength="20" show-word-limit placeholder="请输入描述，20字以内"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="总时长" min-width="136">
        <template #header>
          总时长：<span ref="totalTimeTip">{{tableTotalTime}}</span>小时
        </template>
        <template v-slot="scope">
          <gc-input-number :disabled="disabled" :controls="false" :precision="1" :step="0.1" step-strictly :min="0" @change="changeInputNum" v-model="scope.row.hour"></gc-input-number>
          小时
        </template>
      </el-table-column>
      <el-table-column label="操作" width="76">
        <template v-slot="scope">
          <span class="active mr10" :class="{'disabled': disabled}" @click="delTimetableItem(scope.$index,scope.row)">
            <el-tooltip content="删除" popper-class="icon-popper">
              <i :class="{'operation__del': !disabled,'operation__del-disabled': disabled}"></i>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
    </table-pagination>
    <div class="btns" v-show="!disabled">
      <div class="add" @click="addTimetableItem">添加</div>
    </div>
  </div>
</template>
<script>
import { uuid, sum, numerationTimeFateDifference, CopyObj } from '@/util/utils'
export default {
  name: 'OtInfoTable',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    baseInfoForm: {
      type: Object,
      default: {
        dateStart: '',
        dateEnd: ''
      }
    }
  },
  data() {
    return {
      // 课程表 表格字段数组
      timetableList: [
        {
          width: '64',
          'class-name': 'drop',
          formatter: () => {
            return <i class="el-icon-rank drop"></i>
          }
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        }
      ],
      // 课程表 数据数组
      tableListData: [],
      // 总时长
      tableTotalTime: 0,
      // 拟定日期的总天数
      limTotalTime: 0,
      addCourseRules: {
        hour: [{ required: true, message: '请输入有效期' }]
      }
    }
  },
  methods: {
    changeInputNum() {
      this.tableTotalTime = sum(this.tableListData, 'hour')
      if (this.limTotalTime < this.tableTotalTime) {
        this.$message.warning(
          `根据此立项的拟定日期，总时长不可超过${this.limTotalTime}小时`
        )
      }
    },
    // 父组件验证课表数据
    verifyTimetable() {
      if (this.tableListData.length < 1) {
        this.$message.warning('课表是必填项')
        return true
      }
      // 查找不符合条件的一项
      const flag = this.tableListData.some((v, i) => {
        i++
        if (!v.courseName) {
          this.$message.warning(`课程表第${i}行课程内容必填`)
          return true
        }
        if (!v.hour || v.hour == 0.0) {
          this.$message.warning(`课程表第${i}行课程时长必填`)
          return true
        }
      })
      if (flag) return true
      if (!flag && this.limTotalTime < this.tableTotalTime) {
        this.$message.warning(
          `根据此立项的拟定日期，总时长不可超过${this.limTotalTime}小时`
        )
        return true
      }
    },
    // 课程表 添加一项
    addTimetableItem() {
      this.tableListData.push({
        hour: 0,
        customId: uuid()
      })
    },
    // 删除课表一项
    delTimetableItem(index, row) {
      if (this.disabled) return
      this.tableListData.splice(index, 1)
      this.tableTotalTime = sum(this.tableListData, 'hour')
    },
    _initData(data) {
      let symbolData = CopyObj(data).map(item => ({
        ...item,
        customId: uuid()
      }))
      this.tableListData = symbolData
      this.tableTotalTime = sum(this.tableListData, 'hour')
      if (this.disabled) {
        this.timetableList.splice(0, 1)
      }
    }
  },
  watch: {
    tableListData: {
      deep: true,
      handler(n) {
        this.$emit('input', this.tableListData)
      }
    },
    baseInfoForm: {
      deep: true,
      handler(n) {
        if (this.baseInfoForm.dateEnd) {
          const dateSpan = numerationTimeFateDifference(
            this.baseInfoForm.dateEnd,
            this.baseInfoForm.dateStart
          )
          this.limTotalTime = (dateSpan + 1) * 8
        }
      }
    },
    list: {
      handler(n) {
        if (n.length) {
          this._initData(n)
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.OtInfoTable {
  .btns {
    display: flex;
    height: 30px;
    margin-top: 20px;
    padding: 0 10px;
    line-height: 30px;
    text-align: center;

    > div {
      flex: 1;
      border: 1px dashed #e2e3e6;
      border-radius: 2px;
      cursor: pointer;
      &:first-child {
        margin-right: 22px;
      }
    }
  }
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
</style>
