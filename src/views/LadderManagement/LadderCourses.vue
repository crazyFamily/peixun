<template>
  <div class="LadderManagement__LadderCourse">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="课程所属机构">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              :busiType="$store.state.userInfo.blgStripLine"
              :left-show="false"
              :default-show="true"
              @setDataFinish="orgIdsFinish"
              ref="institutionRef"
            >
            </gc-institution>
          </div>
        </el-form-item>
        <el-form-item label="课程信息">
          <gc-input
            placeholder="请输入课程ID/名称"
            v-model.trim="queryForm.courseIdOrName"
          ></gc-input>
        </el-form-item>
        <el-form-item label="创建人信息">
          <gc-input
            placeholder="请输入姓名/UM号"
            v-model.trim="queryForm.createByNameOrUm"
          ></gc-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="课程创建时间" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.startDate"
              type="date"
              placeholder="开始日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0">
            <el-date-picker
              class="w-120"
              v-model="queryForm.endDate"
              type="date"
              placeholder="结束日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="适用对象" class="applicable-cascader">
          <el-cascader
            popper-class="LadderManagement__LadderCourse__cascader"
            clearable
            v-model="queryForm.applicableTargetDTOList"
            :options="planOptions"
            :props="{
              label: 'dataValue',
              value: 'dataEncode',
              children: 'childPlanDict',
              checkStrictly: true
            }"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item  label="课程分类">
          <gc-select
            class="w-200"
            :options="courseClassifyOptions"
            @change="changeCaseClassify($event)"
            v-model="queryForm.businessLine"
          ></gc-select>
        </el-form-item>
        <el-form-item label="课程标签">
          <el-cascader
            clearable
            :options="tagOptions"
            :props="cascaderProps"
            collapse-tags
            @visible-change="setEmptyContent"
            v-model="queryForm.tagChildIds"
            ref="multipleCascaderRef"
          >
          </el-cascader>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="openAddCurriculumt">
          <i class="instructor-icons__add__icon"></i>
          新增
        </span>
        <span class="instructor-icons__download" @click="exportTable">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getLadderList"
        ref="tablePagination"
      >
        <el-table-column slot="courseName" width="226px;" label="课程名称">
          <template slot-scope="scope">
            <span @click="showUmInfo(scope.row)" class="active">{{
              scope.row.courseName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="tagName" label="课程标签" min-width="212" class-name="coursetagname">
          <template slot-scope="scope">
            <div v-if="scope.row.tagName.length < 3">
              <template v-for="(tag,index) in scope.row.tagName">
                <span class="coursetagname__tag" :key="index" v-if="tag">
                  {{ tag }}
                </span>
              </template>
            </div>
            <span v-else v-for="tagIndex in 2" class="coursetagname__tag" :key="tagIndex">
              {{ scope.row.tagName[tagIndex] }}
            </span>
            <el-tooltip v-if="scope.row.tagName.length >= 3" class="coursetagname" placement="bottom" popper-class="coursetagname " effect="light">
              <div slot="content">
                <template v-for="(tag,tagIndex) in scope.row.tagName">
                  <span class="coursetagname__tag" :key="tagIndex" v-if="tag">
                    {{ tag }}
                  </span>
                </template>
              </div>
              <div>
                <span class="coursetagname__tag circle">
                  +{{ scope.row.tagName.length - 2 }}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column slot="applicableTargetStrAll" width="226px;" label="适用对象">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content" v-html="toBreak(scope.row.applicableTargetStrAll)"></div>
              <div class="onLine" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{scope.row.applicableTargetStrAll}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <span class="active ml20 mr20" @click="editCurriculumt(scope.row)"
              >编辑</span
            >
            <span class="active" @click="delCourse(scope.row)">删除</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <CourseInfo :course="courseRow" :show.sync="courseInfoVisible" />
  </div>
</template>

<script>
import { CopyObj, resetObj, filterObj, arrToTree, systemConfigParameters } from '../../util/utils'
import { goToPage } from '@/views/TalentsCultivation/utils'
import {
  fetchListLadderCourse,
  fetchDeleteLadderCourse,
  fetchExportListLadderCourse,
  fetchSelectByCourseId
} from '@/fetch/ladderManagement'
import { fetchListPlanDict } from '@/fetch/public'
import { handlePickerOptions } from '@/mixins/component'
import CourseInfo from './compontes/CourseInfo'
import { fetchListTags } from '@/fetch/caseCenter'
import CurriculumLabel from './compontes/CurriculumLabel.vue'
export default {
  name: 'LadderCourses',
  mixins: [handlePickerOptions],
  components: {
    CurriculumLabel,
    CourseInfo
  },
  data() {
    return {
      queryForm: {
        startDate: '',
        endDate: '',
        currPage: 1,
        pageSize: 10,
        isShow: 'Y',
        businessLine: '',
        tagChildIds: [],
        applicableTargetDTOList: [],
        blgStripLine: this.$store.state.userInfo.blgStripLine || systemConfigParameters().defaultBusiType
      },
      list: [
        {
          width: '100',
          label: '课程ID',
          prop: 'courseId'
        },
        { slot: 'courseName', width: '226' },
        {
          width: '200',
          label: '课程所属机构',
          prop: 'orgName'
        },
        {
          width: '110',
          label: '课程授课次数',
          prop: 'lecturesNum'
        },
        {
          width: '90',
          label: '授课评分',
          prop: 'courseScore'
        },
        {
          label: '课程分类',
          prop: 'businessLineStr',
          width: '226px',
          'show-overflow-tooltip': true
        },
        { slot: 'tagName' },
        { slot: 'applicableTargetStrAll', width: '226' },
        {
          width: '110',
          label: '课程来源',
          prop: 'courseType',
          type: 'tablecolumnfilters',
          labelKey: 'courseType',
          radio: true,
          list: [
            {
              label: '内部',
              value: '05002'
            },
            {
              label: '外部',
              value: '05003'
            }
          ]
        },
        {
          width: '110',
          label: '课件上传',
          prop: 'isUpload',
          type: 'tablecolumnfilters',
          labelKey: 'isUpload',
          radio: true,
          list: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ]
        },
        {
          width: '120',
          label: '创建时间',
          prop: 'createdDateStr'
        },
        {
          width: '150',
          label: '创建人',
          prop: 'userName'
        }
      ],
      queryOrgIds: [],
      tableList: [],
      // 计划 所有 下拉选项
      planOptions: [],
      courseInfoVisible: false,
      courseRow: {},
      tagsList: [],
      cascaderProps: { value: 'value', label: 'label', multiple: true },
      tagOptions: [],
      courseClassifyOptions: [],
      systemConfigParameters
    }
  },
  methods: {
    toBreak(val){
      return val?.replace(/\n/g,'<br />')
    },
    showUmInfo(row) {
      this.courseRow = row
      row.module = 'ladderCourseModule'
      row.blgStripLine = row.blgStripLine || this.$store.state.userInfo.blgStripLine
      this.courseInfoVisible = true
    },
    reset() {
      resetObj(this.queryForm, {
        orgId: '',
        tip: 'list',
        isGotSubBranch: '',
        umOrName: '',
        currPage: 1,
        pageSize: 10,
        isShow: 'Y',
        applicableTargetDTOList: [],
        blgStripLine: this.$store.state.userInfo.blgStripLine,
        orgIds: this.queryOrgIds
      })
      this.$nextTick(() => {
        this.tagOptions = []
      })
      this.$refs.tablePagination.resetFilters()
      this.$refs.institutionRef.createTreeData()
    },
    getLadderList() {
      this.queryForm.isShow = 'Y'
      let data = this._formatSendParams(this.queryForm)
      fetchListLadderCourse({ data }).then(res => {
        const { list, total } = res || {}
        this.tableList = list
        this.tableList.forEach(v=>{
          v.tagName = v.tagName?.split(';') || []
        })
        this.queryForm.total = total
      })
    },
    // 查询函数
    query() {
      this.queryForm.currPage = 1
      this.getLadderList()
    },
    orgIdsFinish() {
      this.queryOrgIds = CopyObj(this.queryForm.orgIds)
      this.getLadderList()
    },
    async getPlanOptions() {
      let { trainSeries, keyJobs } = await fetchListPlanDict({
        line: this.$store.state.userInfo.blgStripLine,
        type: '01001'
      })
      keyJobs = keyJobs.map((item) => {
        item.childPlanDict = trainSeries
        return item
      })
      this.planOptions = keyJobs
    },
    openAddCurriculumt() {
      goToPage('/AddLadderCourses', this.$router, { type: 'create' })
    },
    editCurriculumt(row) {
      goToPage('/AddLadderCourses', this.$router, {
        type: 'edit',
        courseId: row.courseId,
        module: 'ladderCourse'
      })
    },
    // 删除
    delCourse(row) {
      fetchSelectByCourseId({ courseId: row.courseId }).then((res) => {
        let str
        if (res && res.length) {
          let courseHtml = []
          res.forEach((v) => {
            courseHtml.push('<span style="color:#fec85d;">"' + v + '"</span>')
          })
          str = `此课程已被${courseHtml.join(
            '、'
          )}阶梯培训课程表引用，无法直接删除！`
          this.$alert(str, '提示', {
            confirmButtonText: '知道了',
            dangerouslyUseHTMLString: true,
            customClass: 'loginTimeout ladder_del_tip'
          }).then(() => {})
        } else {
          this.$alert('此课程所有讲师的授权将同步失效。', '确认删除？', {
            confirmButtonText: '确定',
            showCancelButton: true,
            cancelButtonClass: 'cancel',
            customClass: 'loginTimeout'
          }).then(() => {
            if (!res.length) {
              fetchDeleteLadderCourse({ courseId: row.courseId }).then(res => {
                this.$message.success('删除成功')
                this.query()
              })
            }
          })
        }
      })
    },
    exportTable() {
      this.queryForm.isShow = 'N'
      let data = this._formatSendParams(this.queryForm)
      fetchExportListLadderCourse({ data })
    },
    // 格式化发送数据
    _formatSendParams(params) {
      let data = filterObj(params)
      data.orgId = data.orgIds?.[1]
      data.applicableTargetDTO = {
        keyJobs: data.applicableTargetDTOList[0],
        trainSeries: data.applicableTargetDTOList[1],
        childSeries: data.applicableTargetDTOList[2]
      }
      data.tagChildIds = this.$refs.multipleCascaderRef.getCheckedNodes().map(v=>v.value)
      Reflect.deleteProperty(data, 'applicableTargetDTOList')
      Reflect.deleteProperty(data, 'orgIds')
      Reflect.deleteProperty(data, 'courseInfo')
      Reflect.deleteProperty(data, 'trainingInfo')
      return data
    },
    changeCaseClassify(val) {
      let selectItem = this.courseClassifyOptions.find(item => item.value === val)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      this.queryForm.tagChildIds = []
      this.$nextTick(() => {
        this.tagOptions = newArr
      })
    },
    // 获取 案例分类 案例标签 下拉选项
    async getAllFilter() {
      const blgStripLine = this.$store.state.userInfo.blgStripLine
      const data = await fetchListTags({ data: { blgStripLine, tagType: 5 } })
      this.tagsList =
        data?.map(v => ({
          value: v.tagId,
          tagId: v.tagId,
          label: v.tagName,
          tagName: v.tagName,
          tagLevel: v.tagLevel,
          parentTagId: v.parentTagId
        })) || []
      this.courseClassifyOptions = this.tagsList.filter(v => v.tagLevel === '1')
    },
    // 设置数据为空时的方法
    setEmptyContent(n) {
      if (n) {
        this.$nextTick(() => {
          const emptyEle = this.$refs.multipleCascaderRef.popperElm.querySelector('.el-cascader-menu__empty-text')
          if (emptyEle) {
            emptyEle.innerText = '请先选择分类'
          }
        })
      }
    }
  },
  mounted() {
    this.getPlanOptions()
    this.getAllFilter()
    this.$refs.multipleCascaderRef.$el.querySelector('.el-input').style.width = '350px'
  },
  activated() {
    const params = this.$route.params
    if (params.state) {
      this.query()
    }
  }
}
</script>
<style lang="scss">
.LadderManagement__LadderCourse {
}
.LadderManagement__LadderCourse__cascader {
  .el-radio__inner {
    top: -18px;
    left: -19px;
    border-radius: 0;
    border: 0;
    width: 170px;
    height: 34px;
    background-color: transparent;
    cursor: pointer;
    box-sizing: border-box;
    position: absolute;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: transparent;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border: 0 none;
  }
  .el-radio__input.is-checked .el-radio__inner::after {
    width: 0;
    height: 0;
    background-color: #fff;
  }
  // .el-cascader-panel .el-scrollbar.el-cascader-menu::before {
  //   content: '业务模块';
  //   height: 34px;
  //   display: block;
  //   text-align: center;
  //   line-height: 34px;
  //   color: #fff;
  //   background-color: #f39a35;
  // }
}
.ladder_del_tip.loginTimeout {
  height: auto !important;
}
</style>
<style lang="scss" scoped>
.coursetagname {
  .coursetagname__tag {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    color: #909399;
    line-height: 22px;
    padding: 0 8px;
    margin: 10px 0px 0 10px;
    background: #f4f4f5;
  }
  .circle {
    border-radius: 11px;
    padding: 0 4px;
  }
}
.div :deep(td.coursetagname .cell) {
  margin: -10px 0 0 -10px;
}
.applicable-cascader {
  :deep(.el-cascader) {
    .el-input {
      width: 300px;
    }
  }
}
</style>