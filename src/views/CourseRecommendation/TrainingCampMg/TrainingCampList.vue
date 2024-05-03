<template>
  <div class="training-container">
    <el-card class="search-card box-card">
      <el-form :model="queryForm" ref="queryForm" class="form-container" inline>
        <el-form-item label="训练营名称：" prop="trainingName">
          <el-input v-model="queryForm.trainingName" placeholder="请输入"> </el-input>
        </el-form-item>
        <el-form-item label="班主任：" prop="classAdviser">
          <el-input v-model="queryForm.classAdviser" placeholder="请输入"> </el-input>
        </el-form-item>
        <el-form-item label="创建人：" prop="createdBy">
          <el-input v-model="queryForm.createdBy" placeholder="请输入"> </el-input>
        </el-form-item>
        <!-- <el-form-item class="self-item">
          <el-button type="primary" @click="toSearch">查询</el-button>
          <el-button @click="toReset">重置</el-button>
        </el-form-item> -->
        <div class="search-card__button">
          <el-button @click="toSearch" type="primary">查询</el-button>
          <el-button @click="toReset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card class="box-card mt20">
      <div class="menu-right icons no-line">
        <span class="icons__add" @click="toTrainingCampEditor">
          <i class="icons__add__icon"></i>
          新增</span
        >
      </div>
      <!-- <el-row class="mb20">
        <el-col>
          <el-button type="primary" @click="toTrainingCampEditor"
            >新 增</el-button
          >
        </el-col>
      </el-row> -->
      <table-pagination :list="tableColumns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePagination">
        <el-table-column width="70" prop="statusName">
          <template slot="header">
            <gc-tablecolumnfilters
              label="状态"
              ref="costTypeRef"
              className="table__screen__icon"
              :list="statusList"
              confirmText="确定"
              popperClass="circular m183"
              @filter="commonFilter($event, queryForm, 'status', getList, 'filter')"
              @reset="commonFilter($event, queryForm, 'status', getList)"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
        <el-table-column width="85" prop="eoaStatusName">
          <template slot="header">
            <gc-tablecolumnfilters
              label="审批状态"
              ref="costTypeRef"
              className="table__screen__icon"
              :list="eoaStatusList"
              confirmText="确定"
              popperClass="circular m183"
              @filter="commonFilter($event, queryForm, 'eoaStatus', getList, 'filter')"
              @reset="commonFilter($event, queryForm, 'eoaStatus', getList)"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="85" fixed="right">
          <template slot-scope="scope">
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation">
                <template v-for="button in buttonList">
                  <span class="active" :key="button.name" v-if="validateStatusMap(scope.row, button.operate)" @click="operateType(button, scope.row)">{{
                    button.name
                  }}</span>
                </template>
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 二维码预览 -->
    <gc-model width="500px" title="查看二维码" :isShowFooter="false" :visible.sync="codeVisible" @close="handleClose">
      <div class="relative">
        <div ref="ercode" class="dfc"></div>
        <img class="CaseCenter__CaseManagement__logo" src="~@/assets/images/zntk_title.jpg" alt="" />
      </div>

      <p class="fz20 tac mt20">请使用微信扫一扫查看H5页面内容</p>
    </gc-model>
    <H5SharePage type="training" :show.sync="isShowEditH5Page" :status="h5PageStatus" :data-info="h5PageDataInfo" @save="setPackH5Submit"></H5SharePage>
    <!-- 推送弹窗 -->
    <PushDialog :showPushDialog="showPushDialog" :pushInfo="pushInfo" @close="closePushDialog" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Message } from 'element-ui'
import router from '@/router'
import { addAllowKeepAlive } from '@/util/utils'
import {
  PUTAWAY,
  SOLDOUT,
  EOA_DRAFTS,
  EOA_WAITTING,
  EOA_DONE,
  EOA_BACK,
  EOA_WITHDRAW,
  PUSH_TYPE,
} from '@/views/CourseRecommendation/enum'
import PushDialog from '../components/PushDialog'

// 操作相关状态属性
const validateStatusMap = (row, type) => {
  switch (type) {
    // case 'modify':
    //   return row.eoaStatus !== EOA_WAITTING
    case 'del':
      return row.eoaStatus === EOA_DRAFTS
    // case 'up':
    //   return row.eoaStatus === EOA_DONE && row.status !== PUTAWAY
    // case 'down':
    //   return row.eoaStatus === EOA_DONE && row.status !== SOLDOUT
    // case 'push':
    //  return row.eoaStatus === EOA_DONE && row.status === PUTAWAY
    case 'previewH5':
      return row.h5PageFlag
  }
  return true
}

// 推送
const showPushDialog = ref(false)
const pushInfo = ref({})
const pushType = PUSH_TYPE['training']
const openPushDialog = (row) => {
  if (!(row.eoaStatus === EOA_DONE && row.status === PUTAWAY)) {
    return Message.warning('只有审批通过且上架后,才能推送!')
  }
  showPushDialog.value = true
  pushInfo.value = {
    ...row,
    businessId: row.id,
    businessType: pushType
  }
}

// 打开考勤管理
const openAttendanceManagement = (row) => {
  if (!(row.eoaStatus === EOA_DONE && row.status === PUTAWAY)) {
    return Message.warning('只有审批通过且上架后,才能考勤管理!')
  }
  addAllowKeepAlive('/CRAttendanceManagement')
  router.push({
    name: '智推考勤管理',
    params: {
      businessId: row.id,
      businessType: pushType
    }
  })
}

defineExpose({
  showPushDialog,
  openPushDialog,
  openAttendanceManagement
})
</script>
<script>
import { addAllowKeepAlive, commonFilter, CopyObj, customHint } from '@/util/utils'
import { TRAIN_EOA_STATUS, TRAIN_STATUS } from '@/util/constants'
import QRCode from 'qrcodejs2'
import {
  queryTrainingPage,
  upOrDownStatus,
  queryTrainingDetail,
  saveTrainingInfo,
  deleteTraining,
  fetchSaveOrUpdateH5Page,
  fetchGetCommonH5Detail
} from '@/fetch/courseRecommendation'
import { OPERATE_STATUS, SET_EOA_STATUS, CLEAR, defaultData } from '@/store/trainingCamp'
import H5SharePage from '../components/H5SharePage/index'
import store from '@/store'
import { nextTick } from 'vue'
export default {
  data() {
    return {
      commonFilter,
      queryForm: {
        trainingName: '',
        createdBy: '',
        classAdviser: '',
        status: '',
        eoaStatus: '',
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      statusList: TRAIN_STATUS,
      eoaStatusList: TRAIN_EOA_STATUS,
      tableColumns: [
        { type: 'index', label: '序号' },
        { label: '训练营名称', prop: 'trainingName', width: '350' },
        { label: '机构部门', prop: 'orgName', width: '150' },
        { label: '开始时间', prop: 'startTime', width: '100' },
        { label: '结束时间', prop: 'endTime', width: '100' },
        { label: '班主任', prop: 'classAdviserName', width: '150' },
        { label: '学员人数', prop: 'studentNum', width: '70' },
        { label: '创建人', prop: 'createdByName', width: '150' },
        { label: '最近修改时间', prop: 'updatedDate', width: '145' }
      ],
      tableList: [],
      buttonList: [
        {
          name: '详情',
          routePath: '/CRTrainingCampEditor',
          routeName: '',
          operate: 'details'
        },
        {
          name: '修改',
          routePath: '/CRTrainingCampEditor',
          routeName: '',
          operate: 'modify'
        },
        {
          name: '删除',
          routePath: '',
          routeName: '',
          operate: 'del'
        },
        {
          name: '复制',
          routePath: '/CRTrainingCampEditor',
          routeName: '',
          operate: 'copy'
        },
        {
          name: '上架',
          routePath: '',
          routeName: '',
          operate: 'up'
        },
        {
          name: '下架',
          routePath: '',
          routeName: '',
          operate: 'down'
        },
        {
          name: '推送',
          routePath: '',
          routeName: '',
          operate: 'push'
        },
        {
          name: '数据统计',
          routePath: '/CRTrainingCampStatistics',
          routeName: '',
          operate: 'total'
        },
        {
          name: '编辑H5页面',
          status: 'edit',
          operate: 'editH5'
        },
        {
          name: '训练营H5页面预览',
          status: 'preview',
          operate: 'previewH5'
        },
        {
          name: '考勤管理',
          operate: 'attendance'
        }
      ],
      h5PageStatus: 'edit',
      isShowEditH5Page: false,
      h5PageDataInfo: {
        backgroundImage: 'skyBlue'
      },
      codeVisible: false,
    }
  },
  components: { H5SharePage },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { queryForm } = this
      try {
        const result = await queryTrainingPage({ data: queryForm })
        const { list, total } = result
        this.tableList = list
        this.queryForm.total = total
      } catch (error) {
        console.log('error', error)
      }
    },
    toTrainingCampEditor() {
      store.commit(OPERATE_STATUS, 'add')
      store.commit(CLEAR, defaultData())
      addAllowKeepAlive('/CRTrainingCampEditor')
      this.$router.push({
        name: '编辑训练营',
        params: {
          operate: 'add'
        }
      })
    },
    async operateType(button, row) {
      const { operate } = button
      console.log('operate', operate)
      switch (operate) {
        case 'up':
        case 'down':
          this.upOrDownStatus(row, operate)
          break
        case 'del':
          this.deleteTraining(row)
          break
        case 'modify':
          this.$message.warning(`仅支持修改课表`)
          this.toPage(button, row, operate)
          break
        case 'copy':
        case 'details':
          this.toPage(button, row, operate)
          break
        case 'push':
          this.openPushDialog(row)
          break
        case 'total':
          this.toStaticPage(button, row, operate)
          break
        case 'editH5':
          try {
            await this.getDetailInfo(row.id)
            if (row.h5PageFlag) {
              await this.queryPackH5Info(row.id)
            }
            this.h5PageStatus = button.status
            this.isShowEditH5Page = true
          } catch (e) {
            console.log(e)
          }
          break
        case 'previewH5':
          this.openCode(row)
          break
        case 'attendance':
          this.openAttendanceManagement(row)
          break
        default:
          break
      }
    },
    async queryPackH5Info(id) {
      // 课程包传project，训练营传training
      const data = await fetchGetCommonH5Detail({ relationId: id, busType: this.type === 'courseBag' ? 'project' : 'training'  })
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
        backgroundImage
      } = data
      this.h5PageDataInfo.h5PageOpen = h5PageOpen || 'Y'
      this.h5PageDataInfo.mainTitle = mainTitle || ''
      this.h5PageDataInfo.subTitle = subTitle || ''
      this.h5PageDataInfo.backgroundUdmp = backgroundUdmp || ''
      this.h5PageDataInfo.mainFeatureOne = mainFeatureOne || ''
      this.h5PageDataInfo.subFeatureOne = subFeatureOne || ''
      this.h5PageDataInfo.mainFeatureTwo = mainFeatureTwo || ''
      this.h5PageDataInfo.subFeatureTwo = subFeatureTwo || ''
      this.h5PageDataInfo.mainFeatureThree = mainFeatureThree || ''
      this.h5PageDataInfo.subFeatureThree = subFeatureThree || ''
      this.h5PageDataInfo.backgroundImage = backgroundImage || this.h5PageDataInfo.backgroundImage
    },
    async setPackH5Submit(dataInfo) {
      console.log(dataInfo, '====>>>>')
      const data = { ...dataInfo }
      await fetchSaveOrUpdateH5Page({ data })
      this.$message.success('设置成功')
      this.getList()
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
    async upOrDownStatus(data, operate) {
      if (data.eoaStatus !== '02002') {
        this.$message.warning(`只有审批通过后,才能${operate === 'up' ? '上架' : '下架'}!`)
        return
      }
      await upOrDownStatus({
        id: data.id,
        status: operate === 'up' ? '02001' : '02002'
      })
      this.$message.success(`${operate === 'up' ? '上架' : '下架'}成功！`)
      this.getList()
    },
    async deleteTraining({ id }) {
      await customHint('确定需要删除当前草稿？', '提示', '取消')
      await deleteTraining({ id })
      this.$message.success('删除成功！')
      this.getList()
    },
    toPage(button, row, operate) {
      if (operate === 'modify' && row.eoaStatus === '02001') {
        this.$message.warning('训练营审批中，不允许修改！')
        return
      }
      store.commit(OPERATE_STATUS, operate)
      store.commit(SET_EOA_STATUS, row.eoaStatus)
      addAllowKeepAlive(button.routePath)
      this.$router.push({
        name: '编辑训练营',
        params: {
          name: row.trainingName,
          id: row.id,
          operate: button.operate
        }
      })
    },
    toSearch() {
      this.queryForm.currPage = 1
      console.log('this.queryForm', this.queryForm)
      this.queryForm.pageSize = 10
      this.getList()
    },
    toReset() {
      this.$refs['queryForm'].resetFields()
      this.getList()
    },
    isDelButtonShow(button, row) {
      // 非草稿状态，不显示删除
      if (row.eoaStatus !== '02000' && button.operate === 'del') return false
      return true
    },
    isH5PreviewButtonShow(button, row) {
      if(button.operate !== 'previewH5') return true
      if(button.operate === 'previewH5' && row.h5PageFlag) {
        return true
      }
      return false
    },
    toStaticPage(button, row, operate) {
      store.commit(OPERATE_STATUS, operate)
      store.commit(SET_EOA_STATUS, row.eoaStatus)
      addAllowKeepAlive(button.routePath)
      this.$router.push({
        name: '训练营数据统计',
        params: {
          name: row.trainingName,
          id: row.id,
          operate: button.operate,
          trainingStageList: row.trainingStageList,
          trainingInfo: row
        }
      })
    },
    // 获取训练营详情数据
    async getDetailInfo(id) {
      await store.dispatch('getDetailData', { id })
      this.h5PageDataInfo = CopyObj({...store.state.trainingCamp, backgroundUdmp: ''})
    },
    // 关闭推送弹窗
    closePushDialog(flag) {
      this.showPushDialog = false
      if (flag) this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
.training-container {
  & .form-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: flex-end;
    & .el-form-item {
      margin-right: 10px;
      &.self-item {
        grid-column-start: 3;
        grid-column-end: 4;
        text-align: right;
      }
    }
  }
}
.CaseCenter__CaseManagement__logo {
  position: absolute;
  width: 40px;
  height: 40px;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
}
</style>