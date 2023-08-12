<template>
  <div class="course-table-box">
    <gc-table class="general__table" :list="list" :tableList="tableList">
      <!-- <el-table-column min-width="120" prop="liveStatus">
                <template slot="header">
                    <gc-tablecolumnfilters
                        label="直播状态"
                        className="table__screen__icon"
                        :list="liveStatusOptions"
                        confirmText="确定"
                        @filter="
                            commonFilter(
                                $event,
                                queryForm,
                                'liveStatus',
                                getList,
                                'filter'
                            )
                        "
                        @reset="
                            commonFilter(
                                $event,
                                queryForm,
                                'liveStatus',
                                getList
                            )
                        "
                        radio
                    >
                    </gc-tablecolumnfilters>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                min-width="84"
                prop=""
                fixed="right"
            >
                <template slot-scope="scope">
                    <el-tooltip
                        placement="left"
                        :visible-arrow="false"
                        popper-class="bgf shadow-1"
                    >
                        <div
                            slot="content"
                            class="tooltip__operation"
                        >
                            <span
                                class="active"
                                @click="openLiveEditPage(scope.row)"
                                >修改</span
                            >
                            <span class="active" @click="delLive(scope.row)">
                                删除
                            </span>
                            <span 
                                class="active" 
                                @click="setFinanceComplianceHandle(scope.row)" 
                                v-if="isSuperAdmin">
                                {{scope.row.isFinanceCompliance === 'Y' ? '取消' : ''}}纳入理财合规课程
                            </span>
                        </div>
                        <el-button class="button-48-24"
                            >操作</el-button
                        >
                    </el-tooltip>
                </template>
            </el-table-column> -->
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
  </div>
</template>

<script>
/**
 * 整合table和page，通过调用一个组件完成表格功能
 * 形成公用样式类
 */
export default {
  name: 'CourseTable',
  props: {
    columns: {
      type: Array,
      default: []
    },
    tableList: {
      type: Array,
      default: []
    },
    isNeedPage: {
      type: Boolean,
      default: true
    }
  }
}
</script>
