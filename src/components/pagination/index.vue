<template>
  <div class="gc-pagination">
    <div v-if="totalisShow" class="gc-pagination__total">
      共有<span class="span">{{ total }}</span
      >条数据
    </div>
    <el-pagination
      :background="background"
      :layout="layout"
      :small="small"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :prev-text="prevText"
      :next-text="nextText"
      :hide-on-single-page="hideOnSinglePage"
      :total="total"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <span v-else class="text">每页显示</span>
    </el-pagination>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'gc-pagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'prev, pager, next,slot, sizes'
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [5]
    },
   background: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      defauly: 1
    },
    small: {
      type: Boolean,
      default: false
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },
    prevText: {
      type: String,
      default: ''
    },
    nextText: {
      type: String,
      default: ''
    },
    pageSizeName: {
      type: String,
      default: 'pageSize'
    },
    currentName: {
      type: String,
      default: 'pageNum'
    },
    totalisShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    sizeChange(size) {
      this.handlePaginationChange()
      this.$emit('sizeChange', {
        [this.pageSizeName]: size,
        send: Math.ceil(this.total / size) >= this.currentPage
      })
    },
    currentChange(current) {
      //   console.log(current,'current-change');
      this.$emit('currentChange', { [this.currentName]: current })
    },
    handlePaginationChange() {
    this.$nextTick(() => {
        $('.el-pagination__sizes .el-input__inner').val(function (
          index,
          oldcontent
        ) {
          let newcontent = oldcontent.replace('条/页', '')
          return newcontent
        })
      })
    },
    hideStr() {
      this.$nextTick(() => {
        $('.el-select-dropdown__item span').text(function (index, oldcontent) {
          let newcontent = oldcontent.replace('条/页', '')
          return newcontent
        })
        $('.el-pagination__sizes .el-input__inner').val(function (
          index,
          oldcontent
        ) {
          let newcontent = oldcontent.replace('条/页', '')
          return newcontent
        })
        $(this.$el)
          .find('.el-pagination')
          .append('<div class="el-pagination__after">条</div>')
      })
    }
  },
  mounted() {
    this.hideStr()
  },
  watch: {
    currentPage(n) {},
    pageSize(n) {
      this.handlePaginationChange()
    }
  }
}
</script>

<style lang="scss" scoped>
@charset "UTF-8";
.gc-pagination {
  display: flex;
  margin-top: 20px;
  padding: 0;
  font-size: 12px;
  justify-content: flex-end;

  &__total {
    height: 24px;
    line-height: 24px;
  }

  :deep(.el-pagination) {
    display: flex;
    padding: 0;
    height: 24px;
    .el-input--suffix {
      position: relative;
      top: -3px;
      width: 60px;
      .el-input__inner {
        height: 24px !important;
      }
    }
    .el-input__validateIcon {
      display: none;
    }
    .el-input__inner {
      text-align: left;
    }
    .el-pagination__sizes {
      margin-right: 0;
    }
    .text {
      line-height: 26px;
      font-weight: 400;
    }
    // &__after {
    //   line-height: 26px;
    //   font-weight: 400;
    // }
    .el-pager {
      li {
        min-width: 16px;
        height: 16px;
        margin-top: 6px;
        margin-right: 11px;
        line-height: 17px;
        &.active {
          background-color: #fd6720;
          color: #ffffff;
          border-radius: 2px;
        }
        &:last-child {
          margin-right: 0;
        }

        &.number {
          font-weight: 400;
        }
        &.el-icon-more::before {
          line-height: 16px;
        }
      }
      .more::before {
        line-height: 18px;
      }
    }

    .el-select,
    .el-input,
    input,
    .el-input__suffix {
      height: 24px;
      line-height: 24px;
    }
  }
  :deep(.el-pagination__after){
    line-height: 26px;
    font-weight: 400;
  }
  &.between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .span {
      color: #000000;
      margin: 0 4px;
    }
  }
}
</style>
