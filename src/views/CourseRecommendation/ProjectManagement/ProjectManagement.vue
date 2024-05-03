<template>
  <div class="course-recommendation__project-management">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="课程包名称">
          <el-input v-model="queryForm.projectName" class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <gc-select k="orgName" v="orgId" label="课程包属主部门" :options="orgOptions" v-model="queryForm.blgOrg"></gc-select>
        </el-form-item>
        <el-form-item label="课程包负责人">
          <el-input v-model="queryForm.leaderUm" class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <gc-select label="审批状态" label-width="60px" :options="eoaStatusOptions" v-model="queryForm.eoaStatus"></gc-select>
        </el-form-item>
        <el-form-item class="mr20">
          <gc-select label="课程包状态" :options="statusOptions" v-model="queryForm.status"></gc-select>
        </el-form-item>
        <el-form-item label="上架人">
          <el-input v-model="queryForm.upBy" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="下架人">
          <el-input v-model="queryForm.downBy" class="w200"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 数据表格 card -->
    <el-card class="mt10">
      <div class="menu-right icons no-line">
        <span class="icons__add" @click="add">
          <i class="icons__add__icon"></i>
          新增课程包</span
        >
      </div>
      <gc-table class="general__table table-left" :list="list" :tableList="tableList">
        <el-table-column label="关联课程" width="80" prop="linkCourse"></el-table-column>
        <el-table-column label="综合考试题数" width="96" prop="">
          <template slot-scope="scope">
            <span class="active underline">{{ scope.row.examinationNum }}</span>
          </template>
        </el-table-column>
        <el-table-column width="85" prop="" label="审批状态">
          <template slot-scope="scope">
            <gc-tag size="mini">{{ eoaStatusMap[scope.row.eoaStatus || '02000'] }}</gc-tag>
          </template>
        </el-table-column>
        <el-table-column label="课程包状态" width="80" prop="statusName"></el-table-column>
        <el-table-column label="上架人" min-width="92" prop="upBy"></el-table-column>
        <el-table-column label="实际上架时间" min-width="104">
          <template slot-scope="scope">
            {{ scope.row.upTime }}
          </template>
        </el-table-column>
        <el-table-column label="下架人" min-width="92" prop="downBy"></el-table-column>
        <el-table-column label="实际下架时间" min-width="104">
          <template slot-scope="scope">
            {{ scope.row.downTime }}
          </template>
        </el-table-column>
        <el-table-column label="课程包H5页面地址" min-width="200">
          <template slot-scope="scope">
            {{ scope.row.h5PageUrl || '' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="78" prop="" class-name="td-pr0" fixed="right">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.eoaStatus === '02001'">
              <el-button class="button-48-24" disabled>操作</el-button>
            </span> -->
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation">
                <span class="active" v-if="scope.row.eoaStatus !== '02001'" @click="openEditPage(scope.row, 'edit')">修改</span>
                <span class="active" @click="openEditPage(scope.row, 'copy')">复制</span>
                <span class="active" @click="del(scope.row)" v-if="scope.row.eoaStatus !== '02001'">删除</span>
                <span
                  class="active"
                  v-if="
                    scope.row.status === '02001' &&
                    scope.row.eoaStatus !== '02001' &&
                    scope.row.eoaStatus !== '02000' &&
                    scope.row.eoaStatus !== '02003'
                  "
                  @click="startOrStop(scope.row, '02000')"
                  >启用</span
                >
                <span class="active" v-if="scope.row.status === '02000' && scope.row.eoaStatus !== '02001'" @click="startOrStop(scope.row, '02001')"
                  >停用</span
                >
                <span v-if="scope.row.status === '02000' && scope.row.eoaStatus === '02002'" class="active" @click="openPushDialog(scope.row)"
                  >推送</span
                >
                <span class="active" @click="setMiddleValidHandle(scope.row)" v-if="isSuperAdmin">设置综推时间</span>
                <span class="active" @click="setMeilSendTimerHandle(scope.row)" v-if="isSuperAdmin">设置邮件推送频率</span>
                <span class="active" @click="formatH5DataInfo(scope.row)">{{ scope.row.h5PageUrl ? '编辑' : '制作' }}H5页面</span>
                <span v-if="scope.row.h5PageUrl" class="active" @click="openCode(scope.row)">课程包H5页面预览</span>
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
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
    <!-- 综推时间弹窗 -->
    <gc-model
      title="设置综推时间"
      width="800px"
      customClass="add-lecturer"
      :visible.sync="isMiddleValidShow"
      @comfirm="setMiddleValidSubmit"
      @close="isMiddleValidShow = false"
      class="middle-valid-dialog"
    >
      <el-radio-group v-model="middleValidType" @change="middleValidTypeChangeHandle">
        <div class="defaultTime mb10">
          <el-radio label="defaultTime">按综推月维度有效</el-radio>
        </div>
        <div class="date-time mb10">
          <el-radio label="dateTime">指定日期</el-radio>
          <el-date-picker
            class="w-196 ml10"
            v-model="middleValidParams.pushMiddleValidDate"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            value-format="yyyy-MM-dd"
            :disabled="middleValidType !== 'dateTime'"
            :picker-options="gtNow"
          >
          </el-date-picker>
        </div>
        <div class="continue-day">
          <el-radio label="continueDay">完成期限</el-radio>
          <el-input
            class="w-196 ml10 input-suffix-type"
            placeholder="请输入天数"
            v-model.number="middleValidParams.pushMiddleValidDays"
            :disabled="middleValidType !== 'continueDay'"
          >
            <template slot="suffix">天</template>
          </el-input>
        </div>
      </el-radio-group>
    </gc-model>
    <!-- 邮件频率弹窗 -->
    <gc-model
      title="设置邮件推送频率"
      width="800px"
      customClass="add-lecturer"
      :visible.sync="isMelSendShow"
      @comfirm="sentMeilSendTimer"
      @close="isMelSendShow = false"
      class="middle-valid-dialog"
    >
      <el-radio-group v-model="meilSendTimerParams.noticePeriod">
        <div class="defaultTime mb10">
          <el-radio label="1">每日</el-radio>
          <el-radio label="2">每周</el-radio>
          <el-radio label="3">每月</el-radio>
          <!-- <el-radio label="4">每年</el-radio> -->
        </div>
      </el-radio-group>
    </gc-model>
    <!-- 二维码预览 -->
    <gc-model width="500px" title="查看二维码" :isShowFooter="false" :visible.sync="codeVisible" @close="handleClose">
      <div class="relative">
        <div ref="ercode" class="dfc"></div>
        <img class="CaseCenter__CaseManagement__logo" src="~@/assets/images/zntk_title.jpg" alt="" />
      </div>

      <p class="fz20 tac mt20">请使用微信扫一扫查看课程包页面内容</p>
    </gc-model>
    <!-- 推送弹窗 -->
    <PushDialog :showPushDialog="showPushDialog" :pushInfo="pushInfo" @close="closePushDialog" />
    <!-- 课程包H5页面设置 -->
    <H5SharePage
      type="courseBag"
      :show.sync="isShowEditH5Page"
      :status="h5PageStatus"
      :data-info="h5PageDataInfo"
      @save="setPackH5Submit"
    ></H5SharePage>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref } from 'vue'
import router from '@/router'
import { addAllowKeepAlive } from '@/util/utils'
import { PUSH_TYPE } from '@/views/CourseRecommendation/enum'
import PushDialog from '../components/PushDialog'
import H5SharePage from '../components/H5SharePage/index.vue'
import { fetchGetProjectH5Detail, fetchDetailToProject, fetchSaveProjectH5Page } from '@/fetch/courseRecommendation'
import { Message } from 'element-ui'
const { mergeReactive, clearReactive } = useBaseDataEvents()

// 推送
const showPushDialog = ref(false)
const pushInfo = ref({})
const pushType = PUSH_TYPE['project']
const openPushDialog = (row) => {
  showPushDialog.value = true
  pushInfo.value = {
    ...row,
    businessId: row.projectId,
    businessType: pushType
  }
}

const isShowEditH5Page = ref(false)
const h5PageStatus = ref('edit')
const h5PageDataInfo = reactive({})
const h5FormDataOrigin = {
  projectId: '',
  h5PageOpen: 'Y',
  mainTitle: '',
  subTitle: '',
  backgroundUdmp: '',
  mainFeatureOne: '',
  subFeatureOne: '',
  mainFeatureTwo: '',
  subFeatureTwo: '',
  mainFeatureThree: '',
  subFeatureThree: '',
  backgroundImage: 'skyBlue',
  // 课程特色标题
  customTitleTop: '课程特色',
  // 课程简介标题
  customTitleCenter: '课程简介',
  // 课程列表标题
  customTitleUnder: '课程列表'
}
const packH5Form = reactive(CopyObj(h5FormDataOrigin))

const selectedProjectId = ref(null)
defineExpose({ showPushDialog, selectedProjectId })
const queryPackH5Info = async (projectId) => {
  const data = await fetchGetProjectH5Detail({ projectId })
  let {
    h5PageOpen,
    mainTitle,
    subTitle,
    backgroundUdmp,
    mainFeatureOne,
    subFeatureOne,
    mainFeatureTwo,
    subFeatureTwo,
    mainFeatureThree,
    subFeatureThree,
    backgroundImage,
    customTitleTop,
    customTitleCenter,
    customTitleUnder
  } = data
  packH5Form.h5PageOpen = h5PageOpen || 'Y'
  packH5Form.mainTitle = mainTitle || ''
  packH5Form.subTitle = subTitle || ''
  packH5Form.backgroundUdmp = backgroundUdmp || ''
  packH5Form.mainFeatureOne = mainFeatureOne || ''
  packH5Form.subFeatureOne = subFeatureOne || ''
  packH5Form.mainFeatureTwo = mainFeatureTwo || ''
  packH5Form.subFeatureTwo = subFeatureTwo || ''
  packH5Form.mainFeatureThree = mainFeatureThree || ''
  packH5Form.subFeatureThree = subFeatureThree || ''
  packH5Form.backgroundImage = backgroundImage || packH5Form.backgroundImage
  packH5Form.customTitleTop = customTitleTop || '课程特色',
  packH5Form.customTitleCenter =  customTitleCenter || '课程简介',
  packH5Form.customTitleUnder = customTitleUnder || '课程列表'
  mergeReactive({ origin: h5PageDataInfo, target: packH5Form })
}

// 格式化数据
const formatDetailInfo = (detailInfo) => {
  if (!detailInfo.subjectList) return
  const subjectList = detailInfo.subjectList

  // 设置标题index
  const setTitleIndex = (data, index, level, parent, isCourse = false) => {
    // 设置标题index
    if (parent) {
      // 如果层组在3级以上的话，第二级会被抽出去，这里把第二级的index排除
      if (level === 2 && !isCourse) {
        data.titleIndex = `${index + 1}.`
      } else {
        data.titleIndex = parent.titleIndex + `${index + 1}.`
      }
    } else {
      data.titleIndex = `${index + 1}.`
    }
  }

  // 计算各个层级和最大层级(从0开始)
  const countLevel = (datas, level, root, parent) => {
    datas.forEach((data, index) => {
      data.level = level
      root.maxLevel = level
      setTitleIndex(data, index, level, parent)
      if (data.children && data.children.length) {
        countLevel(data.children, level + 1, root, data)
      } else {
        data.courseList.forEach((course, courseIndex) => {
          setTitleIndex(course, courseIndex, level, data, true)
        })
      }
    })
  }

  // 给每个层级标记最大层级数
  const markMaxLevel = (datas, maxLevel) => {
    datas.forEach((data) => {
      data.maxLevel = maxLevel
      if (data.children) {
        markMaxLevel(data.children, maxLevel)
      }
    })
  }

  subjectList.forEach((subject) => {
    const level = 0
    subject.level = level
    // 标记根节点
    subject.isRoot = true
    if (subject.children) {
      countLevel(subject.children, level + 1, subject)
    }

    if (subject.children) {
      markMaxLevel(subject.children, subject.maxLevel)
    }
  })
}

// 获取详情数据
const getDetailInfo = async (projectId) => {
  const detailInfo = await fetchDetailToProject({ projectId })
  formatDetailInfo(detailInfo)
  mergeReactive({ origin: h5PageDataInfo, target: detailInfo })
}

// const packH5FormRulesRef = ref(null)
const formatH5DataInfo = async (row) => {
  // 重制数据
  mergeReactive({origin: packH5Form, target: CopyObj(h5FormDataOrigin)})
  clearReactive(h5PageDataInfo)
  const { projectId } = row
  selectedProjectId.value = projectId
  packH5Form.projectId = Number(row.projectId)
  await getDetailInfo(projectId)
  if (row.h5PageUrl) {
    await queryPackH5Info(row.projectId)
  } else {
    await nextTick()
    // packH5FormRulesRef.value.resetFields()
  }
  isShowEditH5Page.value = true
  console.log(535, row)
}

// const h5SaveHandle = async (dataInfo) => {
//   console.log(dataInfo, '====>>>>')
//   const data = { ...dataInfo }
//   await fetchSaveProjectH5Page({ data })
//   Message.success('设置成功')
// }
</script>
<script>
import { CopyObj, resetObj, hintFrame, sizeChange, jsonHeaders, commonFilter, currentChange, addAllowKeepAlive, gtNow } from '@/util/utils'
import { getOrg } from '../utils'
import gcTag from '@/components/chunk/tag'
import QRCode from 'qrcodejs2'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { fetchListToProject } from '@/fetch/courseRecommendation'
export default {
  name: 'CRProjectManagement',
  components: { gcTag },
  data() {
    return {
      codeVisible: false,
      // 查询用的表单
      queryForm: {
        // 项目名称
        projectName: '',
        blgOrg: '',
        leaderUm: '',
        courseName: '',
        eoaStatus: '',
        status: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        downBy: '',
        upBy: ''
      },
      // 部门下拉选项
      orgOptions: [],
      // 审批状态 下拉选项
      eoaStatusMap: {
        '02000':'草稿中',
        '02001':'审批中',
        '02002':'已通过',
        '02003':'已退回',
        '02004':'已撤回',
      },
      eoaStatusOptions: [
        {
          label: '草稿中',
          value: '02000'
        },
        {
          label: '审批中',
          value: '02001'
        },
        {
          label: '已通过',
          value: '02002'
        },
        {
          label: '已退回',
          value: '02003'
        },
        {
          label: '已撤回',
          value: '02004'
        }
      ],
      // 项目状态 下拉选项
      statusOptions: [
        {
          label: '启用',
          value: '02000'
        },
        {
          label: '未启用',
          value: '02001'
        }
      ],
      total: 0,
      // 分页函数
      sizeChange,
      currentChange,
      // 表格筛选公共函数
      commonFilter,
      list: [
        {
          type: 'component',
          label: '课程包名称',
          width: '234',
          prop: '',
          'show-overflow-tooltip': true,
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline ellipsis',
                    on: {
                      click() {
                        that.preview(row)
                      }
                    }
                  },
                  row.projectName
                )
              }
            }
          }
        },
        {
          label: '课程包属主部门',
          width: '200',
          prop: 'blgOrgName'
        },
        {
          label: '课程包负责人',
          width: '100',
          prop: 'leaderName'
        }
      ],
      tableList: [],
      // 难易程度选项
      difficultEasyOptions: [],
      // 课程类型 选项
      courseTypeOptions: [],
      // 课程状态 选项
      curriculumStatusOptions: [],
      // 审批状态 选项
      approvalStatusOptions: [],
      // 综推时间类型
      middleValidType: 'defaultTime',
      // 综推时间期限
      middleValidParams: {
        projectId: '',
        pushMiddleValidDays: '',
        pushMiddleValidDate: '',
        pushValidType: 'D'
      },
      isMiddleValidShow: false,
      isPackH5Show: false,
      isSuperAdmin: false,
      // 邮件频率发送入参
      meilSendTimerParams: {
        noticePeriod: '3'
      },
      // 邮件频率弹窗显示
      isMelSendShow: false,
      gtNow,
      // packH5Form: {
      //   projectId: '',
      //   h5PageOpen: 'Y',
      //   mainTitle: '',
      //   subTitle: '',
      //   backgroundUdmp: '',
      //   mainFeatureOne: '',
      //   subFeatureOne: '',
      //   mainFeatureTwo: '',
      //   subFeatureTwo: '',
      //   mainFeatureThree: '',
      //   subFeatureThree: '',
      //   backgroundImage: 'blue'
      // },
      // H5制作页面
      packH5FormRules: {
        h5PageOpen: [{ required: true, message: '请选择是否分享' }],
        mainTitle: [{ required: true, message: '请填写主标题' }],
        subTitle: [{ required: true, message: '请填写副标题' }]
        // mainFeatureOne: [{ required: false, message: '请填选择答案' }],
        // subFeatureOne: [{ required: false, message: '请填选择答案' }],
        // mainFeatureTwo: [{ required: false, message: '请填选择答案' }],
        // subFeatureTwo: [{ required: false, message: '请填选择答案' }],
        // mainFeatureThree: [{ required: false, message: '请填选择答案' }],
        // subFeatureThree: [{ required: false, message: '请填选择答案' }]
      }
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
    },
    async getList() {
      const data = this.queryForm
      const { total, list } = await fetchListToProject({ data })
      this.total = total
      this.tableList = list
    },
    add() {
      const params = { state: 'add' }
      addAllowKeepAlive('/CRNewProject')
      this.$router.push({
        name: '新增课程包',
        params
      })
    },
    // 打开修改项目界面
    openEditPage(row, editStatus) {
      const { projectId } = row
      const data = { projectId }
      this.$axios.post('/fn/privatewealth/project/detailToProject', data, jsonHeaders).then((res) => {
        const { code, data: params } = res.data
        if (code === 0) {
          addAllowKeepAlive('/CRNewProject')
          params.state = editStatus
          this.$router.push({
            name: '新增课程包',
            params
          })
        }
      })
    },
    del(row) {
      hintFrame('确定删除课程包？').then((res) => {
        const { projectId, eoaStatus } = row
        const data = { projectId, eoaStatus }
        this.$axios.post('/fn/privatewealth/project/deleteProject', data, jsonHeaders).then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
    },
    // 启用/停用
    startOrStop(row, status) {
      const { projectId } = row
      const data = { projectId, status }
      this.$axios.post('/fn/privatewealth/project/startOrStop', data, jsonHeaders).then((res) => {
        const { code } = res.data
        if (code === 0) {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    // 跳转到预览界面
    preview(row) {
      const { projectId } = row
      const data = { projectId }
      this.$axios.post('/fn/privatewealth/project/detailToProject', data, jsonHeaders).then((res) => {
        const { code, data: params } = res.data
        if (code === 0) {
          addAllowKeepAlive('/CRPreviewProject')
          this.$router.push({
            name: '课程包详情',
            params
          })
        }
      })
    },
    // 设置综推时间 根据pushValidType进行状态设置，pushValidType为D且值为0是默认综推时间
    setMiddleValidHandle(row) {
      this.middleValidParams.projectId = Number(row.projectId)
      this.middleValidParams.pushValidType = row.pushValidType

      if (row.pushValidType === 'T') {
        this.middleValidType = 'dateTime'
        this.middleValidParams.pushMiddleValidDate = row.pushMiddleValidDate
      }
      if (row.pushValidType === 'D') {
        this.middleValidType = row.pushMiddleValidDays === 0 ? 'defaultTime' : 'continueDay'
        this.middleValidParams.pushMiddleValidDays = row.pushMiddleValidDays === 0 ? '' : row.pushMiddleValidDays
      }

      this.isMiddleValidShow = true
    },
    // 生成二维码
    openCode(row) {
      const { h5PageUrl } = row
      this.codeVisible = true
      const text = `${h5PageUrl}`
      this.$nextTick(() => {
        new QRCode(this.$refs.ercode, {
          text,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff'
        })
      })
    },
    // 弹框关闭后清除二维码
    handleClose() {
      this.$refs.ercode.innerHTML = ''
      this.codeVisible = false
    },
    // setH5(row) {
    //   this.packH5Form.projectId = Number(row.projectId)
    //   if (row.h5PageUrl) {
    //     this.queryPackH5Info()
    //   } else {
    //     this.isPackH5Show = true
    //     this.$nextTick(() => {
    //       this.$refs.packH5FormRulesRef.resetFields()
    //     })
    //   }
    //   console.log(535, row)
    // },
    // 提交课程包H5页面制作
    async setPackH5Submit(dataInfo) {
      console.log(this.selectedProjectId);
      const data = { ...dataInfo, projectId: this.selectedProjectId }
      await fetchSaveProjectH5Page({ data })
      this.$message.success('设置成功')
      this.getList()
      // this.$refs.packH5FormRulesRef.validate((valied) => {
      //   if (!valied) {
      //     this.$message.warning('请补充必填信息')
      //     return
      //   }
      //   this.savePackH5Info()
      // })
    },
    setPackH5Close() {
      this.packH5Form = this.$options.data.call(this).packH5Form
      this.isPackH5Show = false
    },
    // queryPackH5Info() {
    //   this.$axios
    //     .post(
    //       '/fn/privatewealth/project/getProjectH5Detail',
    //       {
    //         projectId: this.packH5Form.projectId
    //       },
    //       jsonHeaders
    //     )
    //     .then((res) => {
    //       let { code, data } = res.data
    //       if (code === 0) {
    //         console.log(640, data)
    //         if (data) {
    //           let {
    //             h5PageOpen,
    //             mainTitle,
    //             subTitle,
    //             backgroundUdmp,
    //             mainFeatureOne,
    //             subFeatureOne,
    //             mainFeatureTwo,
    //             subFeatureTwo,
    //             mainFeatureThree,
    //             subFeatureThree,
    //             backgroundImage
    //           } = data
    //           this.packH5Form.h5PageOpen = h5PageOpen || 'Y'
    //           this.packH5Form.mainTitle = mainTitle || ''
    //           this.packH5Form.subTitle = subTitle || ''
    //           this.packH5Form.backgroundUdmp = backgroundUdmp || ''
    //           this.packH5Form.mainFeatureOne = mainFeatureOne || ''
    //           this.packH5Form.subFeatureOne = subFeatureOne || ''
    //           this.packH5Form.mainFeatureTwo = mainFeatureTwo || ''
    //           this.packH5Form.subFeatureTwo = subFeatureTwo || ''
    //           this.packH5Form.mainFeatureThree = mainFeatureThree || ''
    //           this.packH5Form.subFeatureThree = subFeatureThree || ''
    //           this.packH5Form.backgroundImage = backgroundImage || this.$options.data.call(this).packH5Form.backgroundImage
    //         }
    //         this.isPackH5Show = true
    //       }
    //     })
    // },
    // 保存H5页面信息
    savePackH5Info() {
      let params = { ...this.packH5Form }
      this.$axios
        .post(
          '/fn/privatewealth/project/saveProjectH5Page',
          {
            data: params
          },
          jsonHeaders
        )
        .then((res) => {
          let { code } = res.data
          if (code === 0) {
            this.$message.success('设置成功')
            this.isPackH5Show = false
            setTimeout(() => this.getList(), 200)
          }
        })
    },
    // 提交综推
    setMiddleValidSubmit() {
      let params = { ...this.middleValidParams }
      // 校验学习期限要为整数
      if (this.middleValidType === 'continueDay') {
        if (typeof params.pushMiddleValidDays === 'string' || parseInt(params.pushMiddleValidDays) !== params.pushMiddleValidDays) {
          return this.$message.warning('完成期限要输入整数')
        }
      }

      if (this.middleValidType === 'defaultTime') {
        params.pushValidType = 'D'
        params.pushMiddleValidDays = 0
        params.pushMiddleValidDate = undefined
      }

      if (this.middleValidType === 'continueDay') {
        params.pushValidType = 'D'
        params.pushMiddleValidDate = undefined
      }

      if (this.middleValidType === 'dateTime') {
        params.pushValidType = 'T'
        params.pushMiddleValidDays = undefined
      }

      this.$axios.post('/fn/privatewealth/project/savePushMiddleValidDays', params, jsonHeaders).then((res) => {
        let { code } = res.data
        if (code === 0) {
          this.$message.success('设置成功')
          this.isMiddleValidShow = false
          this.getList()
        }
      })
    },
    // 类型切换
    middleValidTypeChangeHandle() {
      this.middleValidParams.pushMiddleValidDays = ''
      this.middleValidParams.pushMiddleValidDate = ''
    },
    // 邮件频率设置
    setMeilSendTimerHandle(row) {
      this.meilSendTimerParams.projectId = row.projectId
      this.meilSendTimerParams.noticePeriod = row.noticePeriod ? String(row.noticePeriod) : '3'
      this.isMelSendShow = true
    },
    // 提交邮件频率设置
    sentMeilSendTimer() {
      // 1-每日、2-周、3-月、4-年
      const data = {
        projectId: Number(this.meilSendTimerParams.projectId),
        noticePeriod: Number(this.meilSendTimerParams.noticePeriod)
      }
      this.$axios.post('/fn/privatewealth/project/saveNoticePeriod', data, jsonHeaders).then((res) => {
        const { code } = res.data
        if (code === 0) {
          this.$message.success('操作成功')
          this.isMelSendShow = false
          this.getList()
        }
      })
    },
    // 关闭推送弹窗
    closePushDialog(flag) {
      this.showPushDialog = false
      if (flag) this.getList()
    }
  },
  mounted() {
    this.isSuperAdmin = this.$store.state.userInfo.roleIds.includes('50001')
    this.query()
    getOrg().then((res) => {
      this.orgOptions = res
    })
  },
  activated() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.pack-h5 {
  padding-right: 30px;
  width: 410px;
  height: 550px;
  overflow-x: hidden;
}
.pack-h5-url span {
  display: inline-block;
}
.pack-h5-title,
.pack-h5-url span {
  width: 100px;
  font-weight: bolder;
  text-align: right;
  margin-bottom: 10px;
}
.CaseCenter__CaseManagement__logo {
  position: absolute;
  width: 40px;
  height: 40px;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
}

.h5-wrapper {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto 360px;
}

.style-preview-wrapper {
  padding-left: 10px;
  .title {
    margin-bottom: 10px;
  }
  .sec-title {
    font-size: 12px;
    opacity: 0.4;
    margin-left: 5px;
    font-family: initial;
  }
  .preview-container {
    width: 350px;
    height: 500px;
    border-radius: 10px;
    background-color: #ddd;
    overflow: hidden;
  }
}
</style>