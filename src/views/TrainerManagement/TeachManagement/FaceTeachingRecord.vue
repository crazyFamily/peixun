<template>
  <div class="TrainerManagement">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="讲师所在部门">
          <div class="df">
            <gc-institution
              v-model="queryForm.busiType"
              @change="busiTypeChange"
            >
            </gc-institution>

            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10"
              >含下属机构</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item label="班主任UM号/姓名">
          <el-input v-model.trim="queryForm.headTeacherUm"></el-input>
        </el-form-item>
        <el-form-item label="讲师UM号/姓名">
          <el-input v-model.trim="queryForm.teacherUm"></el-input>
        </el-form-item>
        <el-form-item label="培训班ID/名称">
          <el-input v-model.trim="queryForm.classId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="授课时间" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateStart"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0" label-width="22px">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateEnd"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>

        <el-form-item label="在职状态">
          <gc-select
            v-model="queryForm.isLeaved"
            :options="isLeavedOptions"
          ></gc-select>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
          <el-button @click="download" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <gc-table class="general__table" :list="list" :tableList="tableList">
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
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  handleBlob,
  sizeChange,
  formatDate,
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
export default {
  name: 'FaceTeachingRecord',
  mixins: [handlePickerOptions],
  data() {
    return {
      // 查询用的表单
      queryForm: {
        headTeacherUm: '',
        teacherUm: '',
        classId: '',
        isLeaved: '',
        // 条线
        busiType: '',
        orgId: '',
        // 选择子机构标识
        isGotSubBranch: false,
        // 开始日期  格式: yyyy-MM-dd
        dateStart: '',
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        tip: 'Y'
      },
      isLeavedOptions: [
        {
          label: '在职',
          value: 'N'
        },
        {
          label: '离司',
          value: 'Y'
        }
      ],
      total: 0,
      // 字段数组
      list: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: '培训班编号',
          prop: 'classId',
          width: '120'
        },
        {
          label: '培训班名称',
          prop: 'className',
          width: '120'
        },
        {
          label: '举办部门',
          prop: 'orgName',
          width: '120'
        },
        {
          label: '讲师姓名',
          prop: 'teacherName',
          width: '120'
        },
        {
          label: '讲师UM账号',
          prop: 'teacherUm',
          width: '120'
        },
        {
          label: '讲师所在部门',
          prop: 'teacherOrgName',
          width: '180'
        },
        {
          label: '授课类型',
          prop: 'teacherTypeDesc',
          width: '100'
        },
        {
          label: '授课名称',
          prop: 'courseName',
          width: '100'
        },
        {
          label: '授课日期',
          prop: 'courseDate',
          width: '100'
        },
        {
          label: '开始时间',
          prop: 'dateStart',
          width: '100'
        },
        {
          label: '结束时间',
          prop: 'dateEnd',
          width: '100'
        },
        {
          label: '授课时长(分钟)',
          prop: 'teachFaceTime',
          width: '120'
        },
        {
          label: '班主任姓名',
          prop: 'headTeacherName',
          width: '100'
        },
        {
          label: '班主任UM账号',
          prop: 'headTeacherUm',
          width: '140'
        },
        {
          label: '结训日期',
          prop: 'trainedDate',
          width: '120'
        },
        {
          label: '同步时间',
          prop: 'syncTime',
          width: '150'
        },
        {
          label: '积分状态',
          prop: 'scoreStatus',
          width: '100'
        },
        // {
        //     label: "总积分",
        //     prop: "totalPoints",
        //     width: "120",
        // },
        {
          label: '在职状态',
          prop: 'isLeaved',
          width: '100'
        }
      ],
      // 数据数组
      tableList: [],
      // 分页函数
      sizeChange,
      currentChange,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {}
    }
  },
  methods: {
    // 处理请求数据
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      const [busiType, orgId] = data.busiType
      ;[data.busiType, data.orgId] = [busiType, orgId]
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      if (!/^[\da-zA-Z]+$/.test(data.headTeacherUm)) {
        data.headTeacherName = data.headTeacherUm
        data.headTeacherUm = ''
      }
      if (!/^[\da-zA-Z]+$/.test(data.teacherUm)) {
        data.teacherName = data.teacherUm
        data.teacherUm = ''
      }
      if (!/^\d+$/.test(data.classId)) {
        data.className = data.classId
        data.classId = ''
      }
      return data
    },
    // 查询
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    // 重置
    reset() {
      resetObj(this.queryForm)
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    // 下载文件
    download() {
      const data = this.getQueryForm()
      data.tip = 'N'
      this.$axios
        .post(
          '/fn/trainer/eval/faceToFaceList',
          { data },
          { ...jsonHeaders, responseType: 'blob' }
        )
        .then((res) => {
          if (res.data.type === 'application/json') {
            const reader = new FileReader()
            const that = this
            reader.onload = function (event) {
              var content = reader.result //内容就在这里
              that.$message.error(JSON.parse(content).msg)
            }
            reader.readAsText(res.data)
          } else {
            handleBlob(res)
          }
        })
    },
    // 获取数据
    getList() {
      const data = this.getQueryForm()
      if (!data.orgId) return this.$message.warning('请先选择机构和条线')
      data.tip = 'Y'
      this.$axios
        .post('/fn/trainer/eval/faceToFaceList', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableList = list
          }
        })
    },
    busiTypeChange(orgName) {
      if (orgName) {
        this.queryForm.isGotSubBranch = true
      }
    }
  }
}
</script>

<style lang="scss">
.TrainerManagement {
  .search-form {
    min-width: 1056px;
    max-width: 1500px;
    width: auto;
    > .el-form-item {
      width: 426px;
      margin-right: 74px;
    }
  }
  .fwrap-end-1 {
    min-width: 180px;
  }
}
</style>