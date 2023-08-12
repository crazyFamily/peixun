<template>
  <div class="package-list_container">
    <el-table
      class="package-list"
      :data="tableData"
      :summary-method="getSummaries"
      show-summary
      style="width: 100%"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item.label"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        :formatter="item.formatter"
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
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="handleCheck(scope.row)"
            >查看</el-button
          >
          <el-button
            type="text"
            v-if="isShowButton"
            @click.stop="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <p v-show="tableData.length > 0" class="tip mt20">
      提示:已添加的习题包可能存在重复题目
    </p>
  </div>
</template>

<script>
import { addAllowKeepAlive } from '@/util/utils'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    isDetails: {
      type: Boolean,
      default: false
    },
    scNum: {
      type: Number,
      default: 0
    },
    mcNum: {
      type: Number,
      default: 0
    },
    jcNum: {
      type: Number,
      default: 0
    },
    isShowButton: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      tableHeader: [
        {
          label: '习题包id',
          prop: 'id',
          width: '70'
        },
        {
          label: '习题包名称',
          prop: 'exerciseProjectName',
          width: '200'
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
      ]
    }
  },
  methods: {
    getSummaries(params) {
      const { columns, data } = params
      const sums = []
      columns.forEach((column, index) => {
        if (index < 1 || index > 5) {
          sums[index] = ''
          return
        }
        if (index === 1) {
          sums[index] = '总共(去重后)'
          return
        }
        if (index === 2) {
          sums[index] = this.scNum
          return
        }
        if (index === 3) {
          sums[index] = this.mcNum
          return
        }
        if (index === 4) {
          sums[index] = this.jcNum
          return
        }
        sums[index] = ''
      })
      return sums
    },
    handleCheck(row) {
      addAllowKeepAlive('/CRExercisePackageDetail')
      this.$router.push({
        name: '习题包习题列表',
        params: {
          exerciseProjectId: row.id + '',
          exerciseProjectName: row.exerciseProjectName,
          pageSource: 'exam' // 标识 从考试页面到习题包页面
        }
      })
    },
    handleDelete(row) {
      this.$emit('delExerciseProject', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.package-list_container {
  padding: 0 10px;
  & .tip {
    font-size: 14px;
    color: red;
  }

  :deep(.el-table__empty-text) {
    display: inline-block;
  }
}
</style>
