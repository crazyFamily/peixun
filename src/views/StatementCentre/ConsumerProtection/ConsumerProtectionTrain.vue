<template>
  <div class="StatementCentre__ConsumerProtection__Train">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="项目所属机构">
          <gc-institution v-model="queryForm.busiType" :fetchParams="{ module: CLASS_MODULE }"> </gc-institution>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input
            v-model="queryForm.classId"
            placeholder="项目名称/项目编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否结训">
          <el-select v-model="queryForm.classStatus">
            <el-option label="是" value="Y"></el-option>
            <el-option label="否" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目分类">
          <ClassTypesCascader class="w-300" v-model="queryForm.classTypeList" ref="classTypesCascaderRef"></ClassTypesCascader>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        v-loading="getLoadingStatus('LOADING_CONSUMERISM_CLASS_MANAGER')"
        ref="tablePagination"
      >
        <el-table-column slot="projectName" label="项目名称" min-width="160">
          <template slot-scope="scope">
            <span class="active" @click="openEstablish(scope.row)">
              {{ scope.row.className }}
            </span>
          </template>
        </el-table-column>
        <el-table-column slot="trainShape" prop="trainingModeDesc" width="100">
          <template slot="header">
            <gc-tablecolumnfilters
              label="培训形式"
              className="table__screen__icon"
              :list="statusOptions"
              confirmText="确定"
              popperClass="circular m183"
              @filter="commonFilter($event, queryForm, 'trainingModes', getList, 'filter', true)"
              @reset="commonFilter($event, queryForm, 'trainingModes', getList)"
            >
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
        <el-table-column label="资料">
          <template slot-scope="scope">
            <span v-if="showViewBtn(scope.row)" class="active" @click="openViewForm(scope.row)">
              查看
            </span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 批量新增弹框 -->
    <gc-model title="录入资料查看" width="500px" :visible="viewFormShow" :isShowFooter="false" @close="closeViewForm">
      <div>
        <p class="info-title mt0"><span class="fg"></span>立项附件</p>
        <ul class="info-content">
          <li class="item" v-for="item in viewFormData.setup" :key="item.udmpId">
            <div class="right" >
              <div><i class="icon-doc" ></i>{{ item.fileName }}</div>
              <i class="icon-down" @click="handleDownloadFile(item)"></i>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <p class="info-title">
          <span class="fg"></span>
          {{ row.classTypeTwo === CLASS_TYPE_TWO_KSWJXX ? '考试文件信息' : inputDataMaping[row.classTypeTwo] || '录入资料' }}
        </p>
        <div class="info-content">
          <div class="reimliveno" v-if="inputDataMaping[row.classTypeTwo]">
            <p class="left">{{ inputDataMaping[row.classTypeTwo] }}</p>
            <ul class="right">
              <li v-for="item in viewFormData.reimLiveNo" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
          <ul v-else>
            <li v-if="row.classTypeOpr && row.classTypeOpr.indexOf('UPLOAD_STU') > -1">
              <p class="left">学员信息</p>
              <div class="right">
                <div><i class="icon-doc"></i>学员导出</div>
                <i class="icon-down" @click="downloadStudent"></i>
              </div>
            </li>
            <li v-for="item in viewFormData.upload" :key="item.udmpId">
              <div class="left"> {{ uploadOptions[item.busiId] }} </div>
              <div class="right">
                <div><i class="icon-doc"></i>{{ item.fileName }}</div>
                <i class="icon-down" @click="handleDownloadFile(item)"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </gc-model>
  </div>
</template>

<script>
import {
  isIE,
  message,
  downloadFile,
  commonFilter,
  filterObj,
  jsonHeaders,
  resetObj,
  downHeaders,
  handleDownload,
  downloadFileAsAlink,
  addAllowKeepAlive,
  getLoadingStatus
} from '@/util/utils'
import $ from 'jquery'
import { 
  fetchListConsumerismClassManager, 
  fetchSelectUploadFileInfo,
  fetchSelectReimLiveNo
} from '@/fetch/statementCentre'
import { TRAIN_SHAPE_OPTIONS, CLASS_STATUS_YJX, CLASS_TYPE_TWO_KSWJXX, CLASS_MODULE } from '../enum'
import { TRAINING_COURSE_TYPE, NOT_TRAINING_COURSE_TYPE } from '@/views/Establish/enum'
import ClassTypesCascader from '@/components/ClassTypesCascader.vue'
import { fileDownload } from '@/util/udmp'
export default {
  name: 'ConsumerProtectionTrain',
  components: { ClassTypesCascader },
  data() {
    return {
      queryForm: {
        orgId: '',
        busiType: [],
        classStatus: '',
        classId: '',
        pageSize: 1,
        currPage: 10,
        tip: '',
        trainingModes: [],
        classType: '',
        classTypeList: []
      },
      list: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '机构名称',
          prop: 'orgName',
          width: '180'
        },
        {
          slot: 'projectName'
        },
        {
          label: '项目编号',
          prop: 'classId',
          width: '140'
        },
        {
          label: '项目分类',
          prop: 'classTypeDesc',
          width: '200'
        },
        {
          label: '培训时间',
          prop: 'dateTime',
          width: '180'
        },
        {
          label: '培训班状态',
          prop: 'classStatusDesc',
          width: '120'
        },
        {
          slot: 'trainShape'
        },
        {
          label: '覆盖人群',
          prop: 'coveragePopulation',
          width: '120'
        },
        {
          label: '计划参加人数',
          prop: 'planNum',
          width: '100'
        },
        {
          label: '实际参加人数',
          prop: 'actualNum',
          width: '100'
        }
      ],
      tableList: [],
      statusOptions: TRAIN_SHAPE_OPTIONS,
      commonFilter,
      getLoadingStatus,
      CLASS_STATUS_YJX,
      CLASS_TYPE_TWO_KSWJXX,
      // 录入资料查看-弹框
      viewFormShow: false,
      viewFormData: {},
      // 录入资料小标题映射
      inputDataMaping: {
        '05008': '知鸟直播号',
        '05011': '知鸟考试编号',
        '05009': '智能通关编号'
      },
      // 二级分类 options
      uploadOptions: {
        advice: '建议书',
        plan: '计划书',
        exam: '考试信息'
      },
      // 当前操作行 的数据对象
      row: {},
      CLASS_MODULE
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
      this.$refs.classTypesCascaderRef?.reset()
      this.getList()
    },
    async getList() {
      const data = filterObj(this.queryForm)
      ;[data.busiType, data.orgId] = data.busiType
      if (!data.orgId) {
        return this.$message.warning('请先选择机构')
      }
      data.tip = 'Y'
      const {total, list} = await fetchListConsumerismClassManager({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    async openEstablish(row) {
      const classId = row.classId
      let data
      try {
        data = await this.getEstablishProject(
          classId,
          '/fn/classes/lixiang/showClass'
        )
      } catch {}
      if (!data) return
      data.blgStripLine = row.blgStripLine
      addAllowKeepAlive('/PreviewEstablishProject')
      this.$router.push({
        name: '查看立项',
        params: { ...data }
      })
    },
    // 获取立项数据
    getEstablishProject(classId, url) {
      url = url || '/fn/classes/lixiang/initClass'
      return this.$axios.post(url, { classId }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          return data
        }
      })
    },
    // 跳转到归档
    showViewBtn (row) {
      const { classType, classStatus } = row
      return classType === TRAINING_COURSE_TYPE 
          || ( classType === NOT_TRAINING_COURSE_TYPE && classStatus === CLASS_STATUS_YJX )
    },
    async openViewForm (row) {
      this.row = row
      const { classId, className, classType } = row
      if (classType === TRAINING_COURSE_TYPE ) { // 培训班
        const params = { id: classId, className }
        addAllowKeepAlive('/TrainingCoursePigeonhole')
        this.$router.push({
          name: '培训班归档',
          params
        })
      } else { // 非培训班
        const resUploadFile = await fetchSelectUploadFileInfo({ classId })
        this.viewFormData = {
          ...resUploadFile,
          ...this.viewFormData
        }
        const resReimLiveNo = await fetchSelectReimLiveNo({ classId })
        this.$set(this.viewFormData, 'reimLiveNo', resReimLiveNo)
        this.viewFormShow = true
      }
    },
    closeViewForm () {
      this.viewFormShow = false
      this.viewFormData = {}
    },
    async handleDownloadFile(row) {
      try {
        downloadFileAsAlink(await fileDownload(row.udmpId))
      } catch (error) {}
    },
    // 下载学员
    downloadStudent() {
      const classId = this.row.classId
      const url = `/tms-new/api/reim_export/stu/${classId}`
      if (isIE()) {
        window.location = url
        return
      }
      const a = document.createElement('a')
      $(a).css({ position: 'absolute', top: '-99999px', zIndex: -9999 })
      a.href = url
      a.click()
      $(a).remove()
    },
    exportHandle() {
      const data = filterObj(this.queryForm)
      ;[data.busiType, data.orgId] = data.busiType
      if (!data.orgId) {
        return this.$message.warning('请先选择机构')
      }
      data.tip = 'N'
      this.$axios
        .post(
          '/fn/classes/manager/listConsumerismClassManager',
          { data },
          downHeaders
        )
        .then(handleDownload)
    }
  }
}
</script>
<style lang="scss" scoped>
.StatementCentre__ConsumerProtection__Train {
}
.info-title {
  margin-top: 31px;
  margin-bottom: 15px;
  font-size: 14px;
  .fg {
    display: inline-block;
    width: 3px;
    height: 10px;
    margin-right: 7px;
    background-color: #fd6720;
  }
}
.icon-doc {
  display: inline-block;
  width: 17px;
  height: 20px;
  margin-right: 11px;
  vertical-align: middle;
  background: url('~@/assets/svg/putongwendang.svg') no-repeat center;
}
.icon-down {
  width: 14px;
  height: 15px;
  background: url('~@/assets/svg/xiazaiyingxiang.svg') no-repeat center;
  cursor: pointer;
}

.reimliveno {
  display: flex;
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    flex: 1;
    li {
      padding-left: 20px;
      height: 48px;
      line-height: 48px;
    }
  }
}

.info-content {
  box-sizing: border-box;
  border: 1px solid #eaecf1;
  border-bottom: 0;
  .item {
    display: flex;
    flex-grow: 1;
    height: 48px;
    border-bottom: 1px solid #eaecf1;
  }
  li {
    display: flex;
    flex-grow: 1;
    height: 48px;
    border-bottom: 1px solid #eaecf1;
    .left {
      width: 140px;
      padding-left: 20px;
      background-color: #f7f8fa;
      line-height: 48px;
    }
    .right {
      display: flex;
      flex: 1;
      padding: 0 20px 0 30px;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>