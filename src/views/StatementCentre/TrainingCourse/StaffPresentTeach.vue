<template>
  <div class="statementCentre__tutorAllowance">
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="培训班举办机构" class="first">
          <div class="df">
            <gc-institution v-model="queryForm.busiType" :fetchParams="{module: CLASS_MODULE }"> </gc-institution>
            <div class="checkbox-wrap ml10">
              <el-checkbox v-model="queryForm.isGotSubBranch"
                >含下属机构</el-checkbox
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item label="员工所属机构">
            <gc-institution orgUrl="/fn/user/selectAllTree" v-model="queryForm.blgBusiType"> </gc-institution>
        </el-form-item>
        <el-form-item label="培训班名称">
          <el-input v-model="queryForm.className" class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <gc-select label="培训班类型" :options="classTypeOptions" v-model="queryForm.classType">
          </gc-select>
        </el-form-item>
        <el-form-item label="UM号">
          <el-input v-model="queryForm.umId" class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="培训班开始时间" class="search-card__date mr10 df">
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
          <el-form-item label="至" class="search-card__date df">
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
        </el-form-item>

        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="download" type="primary">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10" v-loading="getLoadingStatus('LOADING_FACETOTRAIN')">
      <gc-table class="general__table" :list="list" :tableList="tableList">
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  handleBlob,
  sizeChange,
  jsonHeaders,
  currentChange,
  getLoadingStatus
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import { CLASS_MODULE } from '../enum'
import { fetchFaceToTrain } from '@/fetch/statementCentre'

export default {
  name: 'StaffPresentTeach',
  mixins: [handlePickerOptions],
  data() {
    return {
      // 查询用的表单
      queryForm: {
        // 条线
        busiType: [],
        // 员工所属机构
        blgBusiType: [],
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
      // 字段数组
      list: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: 'UM账号',
          prop: 'umId',
          width: '120'
        },
        {
          label: '姓名',
          prop: 'empName',
          width: '120'
        },
        {
          label: '员工所属机构',
          prop: 'blgOrgName',
          width: '120'
        },
        {
          label: '培训班举办机构',
          prop: 'orgName',
          width: '240'
        },
        {
          label: '培训班编号',
          prop: 'classId',
          width: '120'
        },
        {
          label: '培训班名称',
          prop: 'className',
          width: '240'
        },
        {
          label: '培训时长',
          prop: 'studyTime',
          width: '200'
        },
        {
          label: '结束日期',
          prop: 'dateEnd',
          width: '100'
        }
      ],
      // 数据数组
      tableList: [],
      // 分页函数
      sizeChange,
      currentChange,
      // 培训班类型下拉选项
      classTypeOptions: [
        {
          label: '项目性培训',
          value: '02000'
        },
        {
          label: '大学专班',
          value: '02002'
        },
        {
          label: '阶梯培训',
          value: '02001'
        }
      ],
      getLoadingStatus,
      CLASS_MODULE
    }
  },
  methods: {
    // 处理请求数据
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      const [busiType, orgId] = data.busiType
      ;[data.busiType, data.orgId] = [busiType, orgId]
      const [blgBusiType, blgOrgId] = data.blgBusiType
      ;[data.blgBusiType, data.blgOrgId] = [blgBusiType, blgOrgId]
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
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
      this.queryForm.tip = 'Y'
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
          '/fn/report/class/faceToTrain',
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
    async getList() {
      const data = this.getQueryForm()
      data.tip = 'Y'
      const { total, list } = await fetchFaceToTrain({ data }) 
      this.total = total
      this.tableList = list
    }
  }
}
</script>

<style lang="scss"></style>