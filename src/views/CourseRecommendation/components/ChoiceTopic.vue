<template>
  <div class="course-recommendation__choice-topic">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item class="mt10 mr100" label="题目">
          <el-input v-model="queryForm.dataCtgy" class="w200"></el-input>
        </el-form-item>
        <el-form-item class="mr154">
          <gc-select label="题目标签"></gc-select>
        </el-form-item>
        <el-form-item class="r0">
          <gc-select label="题型"></gc-select>
        </el-form-item>
        <el-form-item class="mt10 mr100" label="难度">
          <el-input v-model="queryForm.dataCtgy" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" class="search-card__date mr10 df">
          <el-date-picker
            v-model="queryForm.dateStart"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
            popper-class="date-picker"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" class="search-card__date r0 df">
          <el-date-picker
            v-model="queryForm.dateEnd"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="endPickerOptions"
            value-format="yyyy-MM-dd"
            popper-class="date-picker"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="search-card__button">
        <el-button @click="query">查询</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </div>
    </el-card>

    <!-- 数据表格 card -->
    <div class="mt10 bgf">
      <div class="table-box">
        <p>
          已选
          <span class="active-no-pointer">{{ 100 }}</span>
          题
          <span class="tintColor">
            （其中单选题：20题，多选题：20题，判断题：60题）
          </span>
        </p>
        <gc-table
          class="general__table mt20"
          :list="list"
          :tableList="tableList"
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
      </div>

      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="$emit('cancel')"
          >取消</el-button
        >
        <el-button class="button-w90-h30" type="primary"
          >加入课程练习</el-button
        >
      </div>
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
  addAllowKeepAlive
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
export default {
  name: 'CRChoiceTopic',
  mixins: [handlePickerOptions],
  data() {
    return {
      // 查询用的表单
      queryForm: {
        // 条线
        busiType: [],
        orgId: '',
        // 开始日期  格式: yyyy-MM-dd
        dateStart: '',
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        tip: 'Y',
        // 选择子机构标识
        isGotSubBranch: false
      },
      total: 0,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {},
      // 分页函数
      sizeChange,
      currentChange,
      list: [
        {
          type: 'selection'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '题型',
          width: '70',
          prop: ''
        },
        {
          label: '题目',
          width: '148',
          prop: ''
        },
        {
          label: '选项',
          width: '232',
          prop: ''
        },
        {
          label: '答案',
          width: '166',
          prop: ''
        },
        {
          label: '标签',
          width: '174',
          prop: ''
        },
        {
          label: '创建日期',
          width: '200',
          prop: ''
        }
      ],
      tableList: [{}]
    }
  },
  methods: {
    query() {},
    reset() {},
    getList() {}
  }
}
</script>

<style lang="scss">
.course-recommendation__choice-topic {
  .table-box {
    padding: 20px;
  }
}
</style>
