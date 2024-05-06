<template>
  <div class="tanlents-plan">
    <el-card>
      <StepTopbar current-step="议题创建" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <el-card class="search-card mt10">
      <el-form :model="queryForm" inline ref="querFormRef" label-width="70px">
        <el-form-item label="年度" prop="annual">
          <gc-select :options="annualList" v-model="queryForm.annual"> </gc-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <gc-select :options="projectTypeList" v-model="queryForm.projectType" :clearable="false" @change="projectTypeChangeHandle"> </gc-select>
        </el-form-item>
        <el-form-item label="所属单位">
          <headquarter-tree
            :tree-options="treeOptions"
            :normalizer="normalizer"
            class="tree-container"
            v-model="treeData"
            :disabled="queryForm.projectType === '0' || treeData === 'headquarter'"
          ></headquarter-tree>
        </el-form-item>
        <el-form-item label="主办单位" prop="deptIds">
          <gc-institution v-model="queryForm.deptIds" ref="institutionRef" :left-show="false" busi-type="FL" :fetchParams="{ showBusiType: 'FL' }">
          </gc-institution>
        </el-form-item>
        <el-form-item label="项目信息" prop="projectInfo">
          <el-input v-model="queryForm.projectInfo" placeholder="请输入项目ID/项目名称"></el-input>
        </el-form-item>
        <el-form-item label="议题信息" prop="subjectInfo">
          <el-input v-model="queryForm.subjectInfo" placeholder="请输入议题ID/议题名称"></el-input>
        </el-form-item>
        <el-form-item label="导师" prop="teacher">
          <el-input v-model="queryForm.teacher" placeholder="请输入导师姓名/UM"></el-input>
        </el-form-item>
        <el-form-item label="战队成员" prop="teamMember">
          <el-input v-model="queryForm.teamMember" placeholder="请输入战队成员姓名/UM" style="width: 160px"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryDatas">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="openCreateHandle">
          <i class="instructor-icons__add__icon"></i>
          添加议题
        </span>
        <span class="instructor-icons__add" @click="importHandle(IMPORT_TYPE_TOPIC)">
          <i class="instructor-icons__add__icon"></i>
          批量添加议题
        </span>
        <span class="instructor-icons__add" @click="importHandle(IMPORT_TYPE_TEAM)">
          <i class="instructor-icons__add__icon"></i>
          批量添加战队
        </span>
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
        @selection-change="selectionHandle"
        ref="tablePagination"
      >
        <el-table-column slot="subjectName" prop="subjectName" label="议题名称" width="230" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="active" @click="openViewHandle(scope.row)">{{ scope.row.subjectName }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="teamMembers" prop="teamMembers" label="战队成员" show-overflow-tooltip width="200px">
          <template slot-scope="scope">
            <span class="team-leader-row" v-if="scope.row.teamMembers.find((item) => Number(item.isType) === 2)"
              >{{ scope.row.teamMembers.find((item) => Number(item.isType) === 2)?.umName }}
              <img class="flag" src="~@/assets/images/team-leader.png" alt="" />
            </span>
            <span>{{ renderTeamList(scope.row.teamMembers) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <!-- <span class="item active">查看</span> -->
              <span class="item active" @click="openEditHandle(scope.row)">编辑</span>
              <span class="item active" @click="removeHandle(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 批量添加战队成员 -->
    <TanlentsUpload
      :title="importFn.title"
      :show.sync="isUploadShow"
      :templateCode="importFn.templateCode"
      :fetchFn="importFn.fn"
      @comfirm="imortSuccessHandle"
    ></TanlentsUpload>
  </div>
</template>

<script setup>
import { TALENT_STEP } from '@/views/TalentsCultivation/enum'
import StepTopbar from '../components/StepTopbar.vue'
</script>
<script>
import HeadquarterTree from '@/components/tree/HeadquarterTree.vue'
import TanlentsUpload from '../components/TanlentsUpload.vue'
import {
  fetchQCSotreQryParam,
  fetchQcFosterSubjectList,
  fetchExportQcFosterSubjectList,
  fetchRemoveQcFosterSubjects,
  fetchBatchImportQcSubjects,
  fetchBatchImportQcSubjectTeamsInfo,
  fetchHandleQcSubjectNew,
  fetchHandleQcSubjectTeamsInfo
} from '@/fetch/tanlents'
import { formatTreeData, projectTypeEvents, goToPage, formatParamsByProjectType } from '@/views/TalentsCultivation/utils'
import store from '@/store'

const IMPORT_TYPE_TOPIC = 'topick'
const IMPORT_TYPE_TEAM = 'team'
export default {
  name: 'TanlentsTopicManagement',

  props: {},

  data() {
    return {
      // 年度下拉选项
      annualList: [],
      // 项目类型
      projectTypeList: [],
      // 状态
      statusList: [],
      // 部门
      orgList: [],
      // 条线
      lineList: [],
      queryForm: {
        annual: '',
        projectType: '',
        lineIds: [],
        orgIds: [],
        organIds: [],
        empInfo: '',
        deptIds: [],
        projectInfo: '',
        subjectInfo: '',
        teacher: '',
        teamMember: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      list: [
        {
          type: 'selection'
        },
        {
          label: '年度',
          prop: 'annual',
          type: 'setWidth',
          width: 70,
          formatter: (row) => `${row.annual}年`
        },
        {
          label: '议题ID',
          prop: 'subjectId',
          type: 'setWidth',
          width: 80
        },
        // {
        //   label: '议题名称',
        //   prop: 'subjectName'
        // },
        {
          slot: 'subjectName'
        },
        {
          label: '议题方向',
          prop: 'directionStr'
        },
        {
          label: '其他说明',
          prop: 'directionIllustrate',
          width: 200
        },
        {
          label: '项目ID',
          prop: 'projectId',
          type: 'setWidth',
          width: 80
        },
        {
          label: '项目名称',
          prop: 'projectName',
          width: '200'
        },
        {
          label: '项目类型',
          prop: 'projectTypeDesc',
          type: 'setWidth',
          width: 120
        },
        {
          label: '方案ID',
          prop: 'customizePlanId',
          type: 'setWidth',
          width: 100
        },
        {
          label: '所属单位',
          prop: 'projectBlg',
          type: 'setWidth',
          width: 100
        },
        {
          label: '主办单位',
          prop: 'orgName',
          type: 'setWidth',
          width: 150
        },
        {
          label: '导师',
          prop: 'projectBlg',
          formatter: (row) => {
            return row.teamMembers
              .filter((item) => Number(item.isType) === 0)
              .map((item) => item.umName)
              .join('|')
          },
          type: 'setWidth',
          width: 150
        },
        { slot: 'teamMembers' },
      ],
      // 树级下拉
      treeOptions: [{ parentQcCode: null, qCCode: '', qCMsg: '全部' }],
      normalizer(node) {
        return {
          id: node.qCCode,
          label: node.qCMsg,
          children: node.subLine
        }
      },
      // 组件关系，空数据必须为null，否则会有UI显示问题
      treeData: null,
      selectedList: [],
      isUploadShow: false,
      importType: IMPORT_TYPE_TOPIC,
      IMPORT_TYPE_TOPIC,
      IMPORT_TYPE_TEAM,
      fetchBatchImportQcSubjects,
      fetchBatchImportQcSubjectTeamsInfo
    }
  },

  components: {
    HeadquarterTree,
    TanlentsUpload
  },

  computed: {
    isHideOrg() {
      return this.queryForm.projectType === '0'
    },
    importFn() {
      if (this.importType === IMPORT_TYPE_TOPIC)
        return {
          title: '批量添加议题',
          templateCode: 'TANLENTS_TOPIC_INFO',
          fn: fetchBatchImportQcSubjects
        }
      if (this.importType === IMPORT_TYPE_TEAM)
        return {
          title: '批量添加战队',
          templateCode: 'TANLENTS_TOPIC_TEAMS_INFO',
          fn: fetchBatchImportQcSubjectTeamsInfo
        }
    }
  },

  mounted() {
    this.treeData = ''
    this._getSeachDatas()
    this.queryDatas()
  },

  activated() {
    if(store.getters.getRefreshQueue.find(row => row === this.$route.path)) {
      this.queryDatas()
    }
  },

  methods: {
    // 获取查询条件的下拉列表
    async _getSeachDatas() {
      let data = {}
      let { annual, projectType, orgs, lines, role } = await fetchQCSotreQryParam({
        data
      })

      this.annualList = annual.map((item) => ({
        label: `${item.qCCode}年`,
        value: item.qCCode
      }))

      // 数据格式化处理
      this.roleList = role.map((item) => ({
        label: item.qCMsg,
        value: item.qCCode
      }))
      this.projectTypeList = projectType.map((item) => ({
        label: item.qCMsg,
        value: item.qCCode
      }))
      this.orgList = formatTreeData(orgs)
      this.lineList = formatTreeData(lines)
      this.queryForm.projectType = this.projectTypeList[0].value
      this.projectTypeChangeHandle(this.queryForm.projectType)
    },
    queryDatas() {
      this.queryForm.currPage = 1
      this.getList()
      store.commit('removeQueue', this.$route.path)
    },
    async getList() {
      let data = formatParamsByProjectType(this.queryForm, this.treeData)
      let { list, total } = await fetchQcFosterSubjectList({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    reset() {
      this.treeData = ''
      this.$refs.querFormRef.resetFields()
      this.$refs.institutionRef.createTreeData()
      this.queryForm.projectType = '0'
      projectTypeEvents(this.queryForm.projectType, this)
      this.queryDatas()
    },
    projectTypeChangeHandle(value) {
      projectTypeEvents(value, this)
    },
    selectionHandle(list) {
      this.selectedList = list
    },
    async exportHandle() {
      let data
      if (this.selectedList.length) {
        data = { ids: this.selectedList.map((item) => item.id) }
      } else {
        data = formatParamsByProjectType(this.queryForm, this.treeData)
      }
      await fetchExportQcFosterSubjectList({ data })
    },
    openViewHandle(row) {
      goToPage('/AddTalentsTopic', this.$router, {
        type: 'view',
        id: row.id
      })
    },
    openEditHandle(row) {
      goToPage('/AddTalentsTopic', this.$router, {
        type: 'edit',
        id: row.id
      })
    },
    openCreateHandle() {
      goToPage('/AddTalentsTopic', this.$router, { type: 'create' })
    },
    async removeHandle(row) {
      await this.removeTips()
      await fetchRemoveQcFosterSubjects({ ids: [row.id] })
      this.$message.success('删除成功')
      this.queryDatas()
    },
    // 删除操作的二次提示
    removeTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定删除选中项', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout'
        })
          .then(() => {
            return resolve()
          })
          .catch(() => {
            return reject()
          })
      })
    },
    importHandle(type) {
      this.importType = type
      this.isUploadShow = true
    },
    async imortSuccessHandle(sucessList) {
      if (this.importType === IMPORT_TYPE_TOPIC) {
        await fetchHandleQcSubjectNew({ sucessList })
      }
      if (this.importType === IMPORT_TYPE_TEAM) {
        await fetchHandleQcSubjectTeamsInfo({ sucessList })
      }
      this.queryDatas()
    },
    renderTeamList(list) {
      let captain = list.find((item) => Number(item.isType) === 2) || {}
      let teamList = list
        .filter((item) => ![0, 2].includes(Number(item.isType)))
        .filter((item) => item.umId !== captain.umId)
        .map((item) => item.umName)
        .join('|')
      return teamList
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';

.team-leader-row {
  .flag {
    display: inline;
    width: 15px;
    margin-right: 10px;
    transform: translateY(-3px);
  }
}

.form-item-df {
  :deep(.el-form-item__content) {
    display: inline-flex;
    align-items: center;
  }
}

.long-content {
  :deep(.el-form-item__content) {
    max-width: calc(100% - 180px);
  }
}
</style>