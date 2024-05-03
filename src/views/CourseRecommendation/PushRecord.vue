<template>
  <div class="course-recommendation__push-record">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="推送人员设置">
          <gc-select v-model="queryForm.pushMode" :options="pushModeOptions"></gc-select>
        </el-form-item>
        <el-form-item label="推送状态">
          <gc-select v-model="queryForm.pushStatus" :options="pushStatusOptions"></gc-select>
        </el-form-item>
        <el-form-item label="推送时间" class="search-card__date">
          <el-date-picker
            v-model="pushTimer"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="pushDateChange"
          />
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 数据表格 card -->
    <el-card class="mt10">
      <gc-table
        class="general__table table-left"
        :list="list"
        :tableList="tableList"
      >
        <el-table-column label="推送人数" min-width="80">
          <template slot-scope="scope">
            <span
              :class="{ active: scope.row.pushNum > 0 }"
              @click="openCheckPerson(scope.row)"
            >{{ scope.row.pushNum || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="84">
          <template slot-scope="scope">
            <span
              v-if="scope.row.pushStatus === '02002'"
              class="active"
              @click="canclePush(scope.row.pushSettingId)"
            >取消推送</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
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

    <!-- 查看人员清单 dialog -->
    <PushPeopleList
      ref="pushPeopleListRef"
      :pushSettingId="pushSettingId"
      @close="checkPersonListsClose"
    />
  </div>
</template>

<script>
import {
  resetObj,
  sizeChange,
  currentChange
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import {
  fetchListPushSettingHistory,
  fetchCancelPush,
} from '@/fetch/courseRecommendation'
import {
  PUSH_MODE,
  PUSH_WHITELIST,
  PUSH_ORGAN_POST
} from '@/views/CourseRecommendation/enum'
import PushPeopleList from './components/CheckPersonelInventory'
export default {
  name: 'CRPushRecord',
  components: {
    PushPeopleList
  },
  data() {
    return {
      pushSettingId: '',
      pushParams: {
        businessType: '',
        businessId: null,
      },
      pushTimer: [],
      // 查询用的表单
      queryForm: {
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      total: 0,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {},
      // 分页函数
      sizeChange,
      currentChange,
      // 推送人员设置 下拉选项
      pushModeOptions: [
        {
          label: PUSH_MODE[PUSH_ORGAN_POST],
          value: PUSH_ORGAN_POST
        },
        {
          label: PUSH_MODE[PUSH_WHITELIST],
          value: PUSH_WHITELIST
        }
      ],
      pushStatusOptions: [
        {
          label: '待推送',
          value: '02001'
        },
        {
          label: '推送完成',
          value: '02002'
        },
        {
            label: "取消推送",
            value: "02004"
        }
      ],
      list: [
        {
          type: 'index',
          label: '序号',
          width: '64',
          'class-name': 'table-index'
        },
        {
          label: '推送人员设置',
          prop: 'pushModeName',
          width: '120'
        },
        {
          label: '推送状态',
          prop: 'pushStatusName',
          width: '90'
        },
        {
          label: '推送时间',
          prop: 'pushedDate',
          width: '150'
        },
        {
          label: '创建人',
          prop: 'createdBy',
          width: '150'
        }
      ],
      tableList: [],
      // 推送人员dialog状态
      pushPersonelVisible: false,
      // 推送人员dialog 字段数组
      pushPersonelList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '人员名单',
          prop: '',
          width: '108'
        },
        {
          label: '人员UM',
          prop: '',
          width: '132'
        },
        {
          label: '所属机构',
          prop: '',
          width: '108'
        },
        {
          label: '所属团队',
          prop: '',
          width: '156'
        },
        {
          label: '岗位',
          prop: '',
          width: '84'
        },
        {
          label: '推送结果',
          prop: '',
          width: '108'
        },
        {
          label: '失败原因',
          prop: '',
          width: '128'
        },
        {
          label: '推送时间',
          prop: '',
          width: '178'
        }
      ],
      // 推送人员dialog 数据数组
      pushPersonelTableList: []
    }
  },
  methods: {
    pushDateChange(arr = []) {
      this.queryForm.pushDateStart = arr[0] || null
      this.queryForm.pushDateEnd = arr[1] || null
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      this.pushTimer = []
      this.queryForm = this.$options.data.call(this).queryForm
      this.getList()
    },
    async getList() {
      const data = Object.assign({}, this.queryForm, this.pushParams)
      data.pushMode = data.pushMode || null
      const resData = await fetchListPushSettingHistory({ data })
      this.total = resData.total
      this.tableList = resData.list || []
    },
    async canclePush(pushSettingId) {
      try {
        const params = { pushSettingId }
        await fetchCancelPush(params)
          .then(() => {
            this.$message.success('取消推送成功')
            this.getList()
          })
      } catch (err) {
        console.error(err)
      }
    },
    openCheckPerson(row) {
      if (row.pushNum > 0) {
        this.pushSettingId = row.pushSettingId
        this.$nextTick(() => {
          this.$refs.pushPeopleListRef.open()
        })
      }
    },
    checkPersonListsClose() {
      this.handleNestingPopupAfterClose('pushPeopleListRef')
      this.getList()
    },
    // 解决嵌套弹窗的工具函数 之 dialog 关闭后的处理
    handleNestingPopupAfterClose(ref) {
      const parentNode = this.$refs[ref].$el
      const child = parentNode.querySelector('.v-modal')
      if (child) {
        parentNode.removeChild(child)
      }
    },
  },
  activated() {
    const params = this.$route.params
    if (params.businessType) {
      this.pushParams = params
    }
    // 默认进行查询
    this.query()
  }
}
</script>

<style lang="scss" scoped>
.course-recommendation__push-record {
  :deep(.search-card) {
    .el-form-item {
      margin-right: 20px;
    }
    .el-date-editor .el-range-separator {
      line-height: 22px;
    }
  }
}
</style>
