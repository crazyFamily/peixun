export default {
    methods: {
      // 合计金额合并列
      objectSpanMethod(refsDom) {
        this.$nextTick(x => {
          if (this.$refs[refsDom].$el) {
            var current = this.$refs[refsDom].$el
              .querySelector('.el-table__footer-wrapper')
              .querySelector('.el-table__footer')
            var cell = current.rows[0].cells
            cell[0].style.display = 'none'
            cell[1].colSpan = '2'
          }
        })
      },
      /**
       * 合计金额行计算函数
       * @param tips String 展示合并文案
       * @param arr 需要计算合并列的数组
       */
      getNodeSummaries(param, tips, arr) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = tips || '合 计'
            return
          }
          if (arr.some(x => column.property === x)) {
            sums[index] = 0
            data.map(item => {
              let num = item[column.property]
              sums[index] += Number.parseFloat(num) || 0
            })
            sums[index] = Number.parseFloat(sums[index]).toFixed(2)
          } else {
            sums[index] = ''
          }
        })
        return sums
      }
    }
  }