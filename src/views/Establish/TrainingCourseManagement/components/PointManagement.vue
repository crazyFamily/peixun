<template>
  <div class="PointManagement">
    <!-- 头部输入框及按钮 -->
    <el-card class="PointCard">
      <div class="between mb20">
        <div>
          <span>所属机构</span>
          <gc-institution class="ml10" style="top:10px;" orgUrl="/fn/user/selectAllTree" v-model="blgOrgIds" />
          <span class="ml20">学员信息</span>
          <el-input
            class="w200 ml10"
            placeholder="请输入姓名/UM号"
            v-model.trim="queryForm.umId"
            clearable
          ></el-input>
          <el-button
            type="primary"
            class="button-60-h30 ml20"
            @click="query"
            >查询</el-button
          >
          <el-button
            class="button-60-h30 ml20"
            @click="reset"
            >重置</el-button
          >
        </div>
      </div>
      <div class="PointManagementMenu">
        <div class="PointLeft">
          <!-- <el-button class="button-w80-h30" @click="synchronizedScoreClick()">同步知鸟考试</el-button> -->
          <el-button class="button-w80-h30" @click="configureTermsClick()">配置积分项</el-button>
          <el-button class="button-w80-h30" @click="batchPointsClick()">批量加分</el-button>
          <el-button class="button-w80-h30" @click="batchChannelPointClick()">批量导入积分</el-button>
          <el-button class="button-w80-h30" @click="editAllClick()">编辑全部</el-button>
          <el-button class="button-w80-h30" @click="download()">导出</el-button>
        </div>
      </div>
      <!-- 积分管理表格区域 -->
      <div class="PointManagementTable">
        <table-pagination
          :list="list"
          :tableList="tableList"
          :queryForm="queryForm"
          :getList="getList"
          @selection-change="selectionHandle"
          :page-sizes="[50, 100]"
          ref="tableRef"
          style="margin-bottom: 55px"
        >
          <el-table-column
            prop="classContactScore"
            slot="classContactScore"
            label="课堂互动"
            width="150"
          >
            <template slot-scope="scope">
              <div v-if="editAllVisible">
                <gc-input-number
                  :controls="false"
                  :precision="1"
                  :step="0.1"
                  step-strictly
                  :min="0"
                  :max="9999"
                  v-model="scope.row.classContactScore"
                />
              </div>
              <span v-else>{{ handleNum(scope.row.classContactScore) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in classIntegrationConfigDTOS"
            :key="item.configValue"
            :prop="item.configValue"
            :label="item.configName"
            width="150"
          >
            <template slot-scope="scope">
              <div v-if="editAllVisible">
                <template v-if="item.testId ">{{ scope.row[item.configValue] }}</template>
                <gc-input-number
                  v-else
                  :controls="false"
                  :precision="1"
                  :step="0.1"
                  step-strictly
                  :min="-9999"
                  :max="9999"
                  v-model="scope.row[item.configValue]"
                />
              </div>
              <span v-else>{{ handleNum(scope.row[item.configValue]) }}</span>
            </template>
          </el-table-column>
        </table-pagination>
      </div>
    </el-card>
    <!-- 点击编辑全部后底部按钮 -->
    <div class="footer-box dfc fixed" v-if="editAllVisible">
      <el-button
        class="button-w80-h30 btnheight"
        @click="cancell()"
        >取消</el-button
      >
      <el-button
        class="button-w80-h30 btnheight"
        type="primary"
        style="margin-left: 20px"
        @click="preserve()"
        >保存</el-button
      >
    </div>
    <!-- 同步知鸟考试分数dialog -->
    <gc-model
      :title="integralTransformVisible ? '积分转换' : '同步知鸟考试分数'"
      :visible.sync="synchronizedScoreVisible"
      width="560px"
      @close="synchronizedScoreClose"
      @cancel="synchronizedScoreClose"
      isAppend
      @comfirm="synchronizedScoreComfirm"
    >
      <div v-if="!integralTransformVisible">
        <el-form
          ref="synchronizedScoreRef"
          :model="synchronizedScoreForm"
          :inline="true"
        >
          <el-form-item label="输入知鸟考试编号">
            <el-input
              v-model.trim="synchronizedScoreForm.testId"
              style="width: 160px"
              placeholder="请输入编号"
            ></el-input>
            <el-button
              @click="verrifyClick()"
              type="primary"
              class="ml20"
              >{{ synchronizedScoreStatus }}</el-button
            >
            <el-button type="default" @click="integralTransformClick">积分转换</el-button>
          </el-form-item>
        </el-form>
        <div class="mb10" style="padding-left:110px;" v-show="messageShow">
          {{ `匹配成功${matchNum}人` }}
          <span class="ml10" style="cursor:pointer;color:#fd6720;" @click="checkList()">查看名单</span>
        </div>
        <div class="mb20">注：知鸟考试分数需考试后第二天才可同步</div>
      </div>
      <div v-else>
        <div v-if="JFZHRuleList.length < 10" class="mb30" style="border-bottom: 1px solid #e9e9e9;">
          <el-button class="button-w80-h30- mb20" type="default" @click="addJFGZClick">新增积分规则</el-button>
        </div>
        <div v-for="(item, index) in JFZHRuleList" :key="`${item.id}${index}`" class="mb10" style="display:flex;">
          <p class="w-80 lh30">{{ `积分规则 ${index + 1}：` }}</p>
          <gc-select
            class="p0 w-100 mr10"
            placeholder="无"
            :options="JFZHOptions"
            v-model="item.symbol"
            :clearable="false"
          />
          <gc-input-number
            class="p0 w-100 mr10"
            v-model="item.conditionsScore"
            controls-position="right"
            :precision="1"
            :step="0.1"
            :min="0"
            :max="9999"
          />
          <p class="mr10 lh30">转换为</p>
          <gc-input-number
            class="p0 w-100 mr20"
            v-model="item.score"
            controls-position="right"
            :precision="1"
            :step="0.1"
            :min="0"
            :max="9999"
          />
          <span class="active lh30" @click="delJFGZClick(index)">删除</span>
        </div>
        <div v-if="JFZHRuleList.length === 0">暂无数据，可以新增一条积分规则</div>
      </div>
    </gc-model>
    <!-- 查看名单dialog -->
    <gc-model
      title="查看名单"
      :visible.sync="checkListVisible"
      width="1000px"
      height="497px"
      isAppend
      @comfirm="checkListComfirm"
    >
      <el-table :data="checkListData" style="width: 1000px">
        <el-table-column prop="name" label="姓名" width="320"></el-table-column>
        <el-table-column
          prop="score"
          label="成绩"
          width="320"
        ></el-table-column>
        <el-table-column min-width="96" prop="isMatch">
          <template slot="header">
            <gc-tablecolumnfilters
              label="是否匹配学员名单"
              ref="classStatusNameRef"
              className="table__screen__icon"
              :list="checkListStatus"
              confirmText="确定"
              popperClass="circular"
              @filter="trainingStateFilter"
              @reset="trainingStateReset"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.isMatch === 'N' ? '否' : '是' }}</span>
          </template>
        </el-table-column>
      </el-table>

      <gc-pagination
        :total="checkListForm.checkListTotal"
        :page-sizes="[50, 100]"
        :page-size="checkListForm.pageSize"
        :current-page="checkListForm.currPage"
        @sizeChange="sizeChange($event, checkListForm, getcheckList)"
        @currentChange="currentChange($event, checkListForm, getcheckList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </gc-model>
    <!-- 配置积分项dialog -->
    <gc-model
      title="配置积分项"
      :visible.sync="configureTermsVisible"
      width="1000px"
      height="500px"
      isAppend
      @close="closeClick"
      @cancel="closeClick"
      @comfirm="configureTermsComfirm"
    >
      <el-button
        v-if="configureTermstableList.length < 10"
        class="button-w80-h30"
        style="margin-bottom: 10px"
        @click="addconfigItem()"
        >新增积分项</el-button
      >
      <el-table ref="studentTableRef" :data="configureTermstableList">
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column label="积分项" width="300" prop="configName">
          <template slot-scope="scope">
            <div v-show="scope.row.edit">
              <el-input
                v-model="scope.row.configName"
                :maxlength="10"
              ></el-input>
            </div>
            <div v-show="!scope.row.edit">{{ scope.row.configName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="说明" width="300" prop="configDesc">
          <template slot-scope="scope">
            <div v-show="scope.row.edit">
              <el-input
                v-model="scope.row.configDesc"
                :maxlength="20"
              ></el-input>
            </div>
            <div v-show="!scope.row.edit">{{ scope.row.configDesc }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <template v-if="!scope.row.isEdit">
              <div v-show="scope.row.edit">
                <span
                  class="active mr20"
                  @click="configureTermsPresave(scope.row, scope.$index)"
                  >保存</span
                >
                <span
                  class="active mr20"
                  @click="cancellClick(scope.row, scope.$index)"
                  >取消</span
                >
                <span class="active" @click="synchronizedScoreClick(scope.row, scope.$index)">{{ scope.row.testId ? `已同步：${scope.row.testId}` : '同步知鸟考试' }}</span>
              </div>
              <div v-show="!scope.row.edit">
                <span
                  class="active mr20"
                  @click="editClick(scope.row, scope.$index)"
                  >编辑</span
                >
                <span
                  class="active mr20"
                  @click="delconfigureTerms(scope.row, scope.$index)"
                  >删除</span
                >
                <span class="active" @click="synchronizedScoreClick(scope.row, scope.$index)">{{ scope.row.testId ? `已同步：${scope.row.testId}` : '同步知鸟考试' }}</span>
              </div>
            </template>
            <template v-else>
              <div>-</div>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </gc-model>
    <!-- 批量加分dialog -->
    <gc-model
      title="批量加分"
      :visible.sync="batchPointsVisible"
      width="400px"
      height="320px"
      isAppend
      @close="batchcloseClick"
      @cancel="batchcloseClick"
      @comfirm="batchPointsComfirm"
    >
      <div style="text-align: center">
        <span style="font-weight: 700">给选中的学员同时加相同的分数</span>
        <br />
        <br />
        <!-- <span class="gc-span">
          <i class="pointTegger">课堂互动 :</i>
          <gc-input-number
            v-model="batchPointForm.classContactScore"
            controls-position="right"
            @change="handleChange"
            :precision="1"
            :step="0.1"
            :min="0"
            :max="9999"
          ></gc-input-number>
        </span>
        <br />
        <br /> -->
        <div class="pointNumtex"  v-for="(item,index) in classIntegrationConfigDTOS" :key="index">
          <span class="pointTegger">{{item.configName+ `:` }}</span>
          <gc-input-number
            :disabled="item.testId ? true : false"
            v-model="batchPointForm[item.configValue]"
            controls-position="right"
            @change="handleChange"
            :precision="1"
            :step="0.1"
            :min="-9999"
            :max="9999"
          />
        </div>
      </div>
    </gc-model>
    <!-- 批量导入积分dialog -->
    <gc-model
      title="批量导入积分"
      :visible.sync="batchChannelPointVisible"
      width="500px"
      height="285px"
      isAppend
      @comfirm="batchChannelPointComfirm"
    >
      <InstructorBatchImport
        title="批量导入积分"
        :visible="batchChannelPointVisible"
        @close="batchChannelPointClose"
        @cancel="batchChannelPointClose"
        @comfirm="batchChannelPointComfirm"
        @change="batchChannelPointChange"
        @templateDownload="templateDownload('/common/file/download/classIntegrationTeamplate', { classId: commcClassId })"
      >
        <div v-if="failStrList && JSON.stringify(failStrList) !== '{}'">
          <p>{{ `${failStrList.successNum}条数据导入成功，${failStrList.failNum}条数据导入失败` }}</p>
          <p v-for="error in failStrList.errorTips" :key="error" class="error-color" >{{ error }}</p>
        </div>
      </InstructorBatchImport>
    </gc-model>
  </div>
</template>

<script>
import {
  templateDownload,
  customHint,
  tableSelectionChange,
  currentChange,
  sizeChange,
  CopyObj
} from '../../../../util/utils'
import {
  fetchQueryStudentIntergration,
  fetchVolidateZnTest,
  fetchQueryZNExamStudent,
  fetchQueryClassIntergrationConfig,
  fetchModifyScoreByTestId,
  fetchBatchAddIntergration,
  fetchConfigClassIntergration,
  fetchUpLoadIntergrationTeamplate,
  fetchUpdateAllStudentIntergration
} from '../../../../fetch/pointManagement'
import InstructorBatchImport from '../../../../components/dialogs/InstructorBatchImport.vue'
export default {
  components: { InstructorBatchImport },
  name: 'PointManagement',
  props: {
    commcClassId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 表格字段数组
      list: [
        {
          type: 'selection',
          width: 50
        },
        { label: '姓名', prop: 'name', width: '120px',
          ctx: (row) => row.name ? row.name.substring(0,row.name.indexOf('(')) : ''
        },
        {
          label: 'UM号',
          prop: 'umId',
          width: '160px'
        },
        {
          label: '所属机构',
          prop: 'orgName',
          width: '300px'
        },
        {
          label: '总排名',
          prop: 'rank',
          width: '100px'
        },
        {
          label: '总得分',
          prop: 'score',
          width: '100px',
          ctx: row => this.handleNum(row.score)
        },
        {
          slot: 'extendIntegration1'
        },
        {
          slot: 'extendIntegration2'
        },
        {
          slot: 'extendIntegration3'
        },
        {
          slot: 'extendIntegration4'
        },
        {
          slot: 'extendIntegration5'
        },
        {
          slot: 'extendIntegration6'
        },
        {
          slot: 'extendIntegration7'
        },
        {
          slot: 'extendIntegration8'
        },
        {
          slot: 'extendIntegration9'
        },
        {
          slot: 'extendIntegration10'
        }
      ],
      // 自定义积分数组
      classIntegrationConfigDTOS: [],
      // 表格内容数组
      tableList: [],
      // 配置积分表格内容数组
      configureTermstableList: [],
      // 模版下载工具
      templateDownload,
      // 分页工具
      currentChange,
      sizeChange,
      // 表格单选工具函数
      tableSelectionChange,
      blgOrgIds: [],
      queryForm: {
        umId: '', // UM号或者姓名
        total: 0,
        currPage: 1,
        pageSize: 50
      },
      // 知鸟考试编号
      synchronizedScoreForm: {
        testId: '', // 知鸟考试编号
        row: {}, // 配置积分项时，目前需要同步知鸟考试的积分项数据
        index: 0
      },
      synchronizedScoreStatus: '校验考试',
      // 同步知鸟分数状态
      synchronizedScoreVisible: false,
      // 校验考试后提示状态
      messageShow: false,
      // 匹配成功人数
      matchNum: '',
      // 积分转换状态
      integralTransformVisible: false,
      JFZHOptions: [
        { label: '小于', value: '1' },
        { label: '小于等于', value: '2' },
        { label: '等于', value: '3' },
        { label: '大于等于', value: '4' },
        { label: '大于', value: '5' }
      ],
      JFZHRuleList: [],
      checkListForm: {
        isMatch: '',
        currPage: 1,
        pageSize: 50,
        checkListTotal: 0
      },
      // 查看名单状态
      checkListVisible: false,
      // 查看名单数据
      checkListData: [],
      // 是否匹配学员名单状态
      checkListStatus: [
        {
          value: 'Y',
          label: '是'
        },
        {
          value: 'N',
          label: '否'
        }
      ],

      // 配置积分项状态
      configureTermsVisible: false,
      // 配置积分项提示
      configNewList: [],
      // 配置积分项编辑原始数据
      oldConfigList: [],
      // 批量加分 分数
      batchPointForm: {
        classContactScore: 0,
        extendIntegration1: 0,
        extendIntegration2: 0,
        extendIntegration3: 0,
        extendIntegration4: 0,
        extendIntegration5: 0,
        extendIntegration6: 0,
        extendIntegration7: 0,
        extendIntegration8: 0,
        extendIntegration9: 0,
        extendIntegration10: 0
      },
      // 批量加分状态
      batchPointsVisible: false,
      // 批量导入积分状态
      batchChannelPointVisible: false,
      // 批量导入文件对象
      batchChannelPointFile: {},
      // 编辑全部状态
      editAllVisible: false,
      // 当前操作的行
      row: {},
      // 选择后当前行的数据
      selectedList: [],
      // 编辑时当前行的数据
      editList: [],
      synchronBlur: false,
      // 上传后提示信息
      failStrList: {},
      // 导入失败人数
      failNum: '',
      // 导入成功人数
      successNum: '',
      // 配置积分项删除List
      removeList: [],
      buttonDisable: true
    }
  },
  watch: {
    tableList: {
      handler(list) {
        this.editList = []
        list.forEach((item) => {
          this.editList.push({
            classId: item.classId,
            umId: item.umId,
            score: item.score,
            znScore: item.znScore,
            classContactScore: item.classContactScore,
            extendIntegration1: item.extendIntegration1,
            extendIntegration2: item.extendIntegration2,
            extendIntegration3: item.extendIntegration3,
            extendIntegration4: item.extendIntegration4,
            extendIntegration5: item.extendIntegration5,
            extendIntegration6: item.extendIntegration6,
            extendIntegration7: item.extendIntegration7,
            extendIntegration8: item.extendIntegration8,
            extendIntegration9: item.extendIntegration9,
            extendIntegration10: item.extendIntegration10
          })
        })
      },
      deep: true
    },
    $route: {
      handler: function (val, oldVal) {
        if (
          val &&
          val.path === '/TrainingCourseSeeEdit' &&
          oldVal &&
          oldVal.path === '/TrainingCourseManagement' &&
          JSON.stringify(this.$route.params) !== '{}'
        ) {
          this.queryForm.currPage = 1
          this.queryForm.pageSize = 50
          this.getList()
        }
      },
      deep: true
    }
  },
  methods: {
    // 查询
    query () {
      this.queryForm.currPage = 1
      this.getList()
    },
    // 重置
    reset () {
      this.blgOrgIds = []
      this.queryForm.umId = ''
      this.queryForm.pageSize = 50
      this.query()
    },
    // 导出
    async download () {
      const classId = this.commcClassId
      const searchWord = this.queryForm.umId
      const busiType = this.blgOrgIds?.[0]
      const orgId = this.blgOrgIds?.[1]
      await templateDownload(
        '/common/file/download/exportClassStudentIntergrationList',
        { classId, searchWord, busiType, orgId }
      )
    },
    // 获取内容
    async getList () {
      const classId = this.commcClassId
      const searchWord = this.queryForm.umId
      const currPage = this.queryForm.currPage
      const pageSize = this.queryForm.pageSize
      const busiType =  this.blgOrgIds?.[0]
      const orgId =  this.blgOrgIds?.[1]
      const data = { classId, currPage, pageSize, searchWord, busiType, orgId }
      const { classIntegrationConfigDTOS, pageResp } =
        await fetchQueryStudentIntergration({ data })
      // 后端没返回该字段数据或者为null 列表数据 展示为0
      pageResp.list.forEach((item) => {
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            if (!item[key] || item[key] === null) {
              item[key] = 0
            }
          }
        }
        // 将name中的名字取出来
        if (item.name) {
          item.name2 = item.name.substring(0,item.name.indexOf('('))
        }
      })
      this.tableList = pageResp.list
      this.classIntegrationConfigDTOS = classIntegrationConfigDTOS
      this.queryForm.total = pageResp.total
      this.queryForm.pageSize = pageResp.size
      this.queryForm.currPage = pageResp.page
    },
    // 小数点处理
    handleNum (val) {
      if (val === '' || String(val) === 'undefined' || String(val) === 'null' || val === '-') {
        return val
      }
      return parseFloat(val).toFixed(1)
    },
    // 表格选择回调
    selectionHandle(list) {
      this.selectedList = list
    },
    // 打开同步知鸟分数弹框
    synchronizedScoreClick (row, idx) {
      this.synchronizedScoreForm.testId = row.testId || ''
      this.synchronBlur = row.testId ? true : false
      this.buttonDisable = row.testId ? true : false
      this.messageShow = false
      this.synchronizedScoreForm.row = row
      this.synchronizedScoreForm.index = idx
      this.integralTransformVisible = false
      this.synchronizedScoreVisible = true
    },
    // 同步知鸟考试分数弹框关闭
    synchronizedScoreClose() {
      this.synchronizedScoreForm.testId = ''
      this.synchronizedScoreVisible = false
      this.messageShow = false
      this.synchronBlur = false
      this.synchronizedScoreStatus = '校验考试'
    },
    // 判断积分规则是否满足分数区间不重叠，co 是按照分数排序后的复制数组，1 小于、2 小于等于、3 等于、4 大于等于、5 大于
    handleCo (co, index, nextIndex) {
      // console.log('index, nextIndex.....', index, nextIndex)
      // 数据只有一条或是最后一条数据时候
      if (co.length === index + 1) {
        return true
      }
      let conditionsScore = co[index].conditionsScore === co[nextIndex].conditionsScore
      let symbolStr = `${co[index].symbol}${co[nextIndex].symbol}`
      let objIdx1 = this.JFZHRuleList.findIndex(item => item.id === co[index].id)
      let objIdx2 = this.JFZHRuleList.findIndex(item => item.id === co[nextIndex].id)
      // 分数相等
      if (conditionsScore && ['22', '23', '24', '32', '33', '34', '42', '43', '44'].includes(symbolStr)) {
        console.log('分数相等.....')
        this.$message.warning(`积分规则${objIdx1 > objIdx2 ? objIdx2 + 1 : objIdx1 + 1} 和 积分规则${objIdx1 > objIdx2 ? objIdx1 + 1 : objIdx2 + 1} 的分数区间重叠，请调整！`)
        return false
      }
      // 分数不等
      if (!conditionsScore && ['14', '15', '24', '25'].includes(symbolStr)) {
        console.log('分数不等.....')
        this.$message.warning(`积分规则${objIdx1 > objIdx2 ? objIdx2 + 1 : objIdx1 + 1} 和 积分规则${objIdx1 > objIdx2 ? objIdx1 + 1 : objIdx2 + 1} 的分数区间重叠，请调整！`)
        return false
      }
      // 最后一条数据时，将对比数据进行递增切换
      if (nextIndex === co.length - 1) {
        index = index + 1
        nextIndex = index
      }
      // 继续循环判断，最多循环9次
      return this.handleCo(co, index, nextIndex + 1)
    },
    // 同步知鸟分数提交
    async synchronizedScoreComfirm () {
      if (this.integralTransformVisible) {
        if (this.JFZHRuleList.length > 0) {
          // 所有值不能为空
          let arr = this.JFZHRuleList.filter(item => item.symbol && item.conditionsScore >= 0 && item.score >= 0)
          if (arr.length !== this.JFZHRuleList.length) {
            this.$message.warning('请先完善所有积分规则')
            return
          }
          // 积分规则重叠判断
          let co = CopyObj(this.JFZHRuleList)
          co.sort((a, b) => b.conditionsScore - a.conditionsScore)
          // console.log('this.handleCo(co, 0).....', this.handleCo(co, 0))
          if (!this.handleCo(co, 0, 1)) {
            return
          }
        }
        // 挂载入参数据，继续正常流程
        this.configureTermstableList[this.synchronizedScoreForm.index].ruleList = this.JFZHRuleList
        this.integralTransformVisible = false
        return
      }

      if (this.synchronizedScoreForm.testId === '') {
        return this.$message.warning('请输入考试编号再查询')
      }
      if (!this.synchronBlur) {
        return this.$message.warning('请先校验完考试！')
      }
      if (!this.buttonDisable) {
        return this.$message.warning('请输入正确的考试编号')
      }
      const self = this
      const testId = this.synchronizedScoreForm.testId
      // const classId = this.commcClassId
      // const data = {
      //   data: { testId, classId }
      // }
      customHint(`以最新一次同步的知鸟考试成绩为准`, '提示', '取消').then(() => {
        // self.synchronization(data)
        const idx = this.synchronizedScoreForm.index
        this.$set(this.configureTermstableList[idx], 'testId', testId)
        this.$message.success('同步成功')
      }).catch(() => {
        self.$message.warning('已取消再次同步')
      })
      this.synchronizedScoreVisible = false
      this.messageShow = false
    },
    // 校验考试
    async verrifyClick () {
      if (this.synchronizedScoreForm.testId === '') {
        this.synchronBlur = false
        this.$message.warning('请输入考试编号再查询')
      } else {
        this.messageShow = false
        this.buttonDisable = false
        this.synchronizedScoreStatus = '校验中...'
        const classId = this.commcClassId
        const testId = this.synchronizedScoreForm.testId
        const data = { testId , classId}
        const { ...synchronizedScoreData } = await fetchVolidateZnTest({ data })
        if (+synchronizedScoreData.data.code === 0) {
          this.matchNum = synchronizedScoreData.data.data.matchNum
          this.messageShow = true
          this.synchronBlur = true
          this.buttonDisable = true
        } else {
          this.messageShow = false
          this.$message.error(synchronizedScoreData.data.msg)
        }
        setTimeout(() => {
          this.synchronizedScoreStatus = '校验考试'
        }, 100)
      }
    },
    // 生成随机数 id
    getDiffId () {
      return `${new Date() % 100}${Math.random().toString(16).substring(2, 15)}${new Date() % 10}`
    },
    // 积分转换
    async integralTransformClick () {
      this.JFZHRuleList = this.synchronizedScoreForm.row.ruleList || [{ id: this.getDiffId(), symbol: '', conditionsScore: '0', score: '0' }]
      this.integralTransformVisible = true
    },
    // 新增积分规则
    addJFGZClick () {
      this.JFZHRuleList.push({ id: this.getDiffId(), symbol: '', conditionsScore: '0', score: '0' })
    },
    // 删除积分规则
    delJFGZClick (index) {
      this.JFZHRuleList.splice(index, 1)
    },

    // 同步知鸟编号
    async synchronization (data) {
      if (!data) return
      const res = await fetchModifyScoreByTestId(data)
      const {code} = res.data
      if (+code === 0) {
        this.getList()
        this.$message.success('同步成功')
      } else {
        this.$message.success('同步失败')
      }
    },
    // 查看名单
    async checkList () {
      await this.getcheckList()
      this.checkListVisible = true
    },
    // 查看名单dialog提交
    checkListComfirm() {
      this.checkListVisible = false
    },
    // 获取查看匹配学员名单数据
    async getcheckList () {
      const testId = this.synchronizedScoreForm.testId
      const classId = this.commcClassId
      const currPage = this.checkListForm.currPage
      const pageSize = this.checkListForm.pageSize
      const isMatch = this.checkListForm.isMatch
      const data = { testId, classId, isMatch, currPage, pageSize }
      const { total, list, page, size } = await fetchQueryZNExamStudent({
        data
      })
      this.checkListForm.checkListTotal = total
      this.checkListData = list
      this.checkListForm.currPage = page
      this.checkListForm.pageSize = size
    },
    // 筛选匹配学员名单状态
    trainingStateFilter(list) {
      list = list.list
      this.checkListForm.currPage = 1
      this.checkListForm.isMatch = list.length === 1 ? list[0] : ''
      this.getcheckList()
    },
    //重置匹配学员名单状态
    trainingStateReset() {
      this.checkListForm.currPage = 1
      this.checkListForm.isMatch = ''
      this.getcheckList()
    },
    // 打开配置积分项弹框
    async configureTermsClick () {
      await this.getconfigureTermstableList()
      this.removeList = []
      this.configureTermsVisible = true
    },
    // 配置积分项匹配数据
    async getconfigureTermstableList() {
      const classId = this.commcClassId
      const data = { classId }
      const resList = await fetchQueryClassIntergrationConfig(data)
      this.configureTermstableList = resList || []
      let dataList = JSON.parse(
        JSON.stringify(
          this.configureTermstableList ? this.configureTermstableList : []
        )
      )
      dataList.forEach((item) => {
        return (item['edit'] = false)
      })
      // dataList[0].testId = '00000'
      // dataList[1].testId = '00001'
      this.configureTermstableList = dataList
    },
    // 配置积分项取消
    cancellClick(row, index) {
      if (this.oldConfigList[index]) {
        this.$set(this.configureTermstableList, index, this.oldConfigList[index])
      }else {
        row.configName = ''
        row.configDesc = ''
      }

      row.edit = false
    },
    // 配置积分项编辑
    editClick(row, index) {
      row.edit = true
      this.oldConfigList[index] = JSON.parse(JSON.stringify(row))
      this.oldConfigList[index].edit = false
    },
    // 配置积分项取消按钮
    closeClick() {
      this.removeList = []
      this.configureTermsVisible = false
    },
    // 新增积分项
    addconfigItem() {
      if (this.configureTermstableList.length < 10) {
        this.configureTermstableList.push({
          classId: this.commcClassId,
          configName: '',
          configDesc: '',
          configValue: '',
          edit: true
        })
      }
    },
    // 配置积分项提交
    async configureTermsComfirm() {
      const availableConfigValues = [
        'extendIntegration1',
        'extendIntegration2',
        'extendIntegration3',
        'extendIntegration4',
        'extendIntegration5',
        'extendIntegration6',
        'extendIntegration7',
        'extendIntegration8',
        'extendIntegration9',
        'extendIntegration10'
      ]
      // console.log('this.configureTermstableList.....', this.configureTermstableList)
      // this.configureTermstableList[0].configValue = 'extendIntegration1'
      this.configureTermstableList.forEach((item, index) => {
        if (item && item.configValue) {
          const idx = availableConfigValues.indexOf(item.configValue)
          availableConfigValues.splice(idx, 1)
          // this.removeList.push(item)
          // this.configureTermstableList[index].configValue = ''
        }
        // this.configureTermstableList[index].configValue = availableConfigValues[index]
      })
      // console.log('availableConfigValues.....', availableConfigValues)

      let availableIndex = 0
      this.configureTermstableList.forEach((item, index) => {
        // if (item && item.configValue || index === 0) {
        //   return
        // }
        if (item && item.configValue) {
          return
        }
        item.configValue = availableConfigValues[availableIndex]
        availableIndex++
      })

      const noVerify = this.configureTermstableList.filter((item) => item.edit)
      if (noVerify.length > 0) {
        return this.$message.warning('请保存所有项再操作')
      }
      const list = []
      const removeList = this.removeList || []
      let nullValue = true
      this.configureTermstableList.forEach((item, index) => {
        // if (index !== 0 && item.configDesc && item.configName) {
        //   list.push(item)
        // } else if (index !== 0 && !item.configDesc && !item.configName) {
        //   nullValue = false
        // }
        if (item.configDesc && item.configName) {
          list.push(item)
        } else if (!item.configDesc && !item.configName) {
          nullValue = false
        }
      })
      if (!nullValue) {
        return this.$message.warning('积分项或者说明存在空值，请补充未填项')
      }

      const resData = await fetchConfigClassIntergration({ list, removeList })
      this.getList()
      this.configureTermsVisible = false
    },

    // 配置积分项保存
    configureTermsPresave(row, curIndex) {
      if (!row.configDesc || !row.configName) {
        return this.$message.warning('新增的积分项不能为空')
      }
      const newArr = this.configureTermstableList.filter((item, index) => {
        return item.configName === row.configName && curIndex !== index
      })

      if (newArr.length >= 1) {
        this.$message.warning(
          '您输入的积分项名称有重复 请重新输入'
        )
        return
      }
      row.edit = false
    },
    // 配置几分项删除
    delconfigureTerms(row, index) {
      if (!row.configValue) {
        return this.configureTermstableList.splice(index, 1)
      } else {
        this.configureTermstableList.splice(index, 1)
        this.removeList.push(row)
      }

    },
    // 打开批量加分弹框
    batchPointsClick() {
      if (!this.classIntegrationConfigDTOS.length) {
        return this.$message.warning('当前未配置积分项')
      }
      if (!this.selectedList.length) {
        return this.$message.warning('至少选择一位学员进行批量加分')
      }
      this.batchPointsVisible = true
    },
    // 批量加分提交
    async batchPointsComfirm () {
      let parmlist = []
      const umId = this.selectedList.map((item) => {
        parmlist.push({
          classId: item.classId,
          umId: item.umId,
          classContactScore: this.batchPointForm.classContactScore,
          extendIntegration1: this.batchPointForm.extendIntegration1,
          extendIntegration2: this.batchPointForm.extendIntegration2,
          extendIntegration3: this.batchPointForm.extendIntegration3,
          extendIntegration4: this.batchPointForm.extendIntegration4,
          extendIntegration5: this.batchPointForm.extendIntegration5,
          extendIntegration6: this.batchPointForm.extendIntegration6,
          extendIntegration7: this.batchPointForm.extendIntegration7,
          extendIntegration8: this.batchPointForm.extendIntegration8,
          extendIntegration9: this.batchPointForm.extendIntegration9,
          extendIntegration10: this.batchPointForm.extendIntegration10
        })
        return parmlist
      })

      const list = parmlist
      const code = await fetchBatchAddIntergration({ list })
      this.$message.success('批量加分成功')
      this.batchPointsVisible = false
      this.getList()
      this.batchPointForm = {
        classContactScore: 0,
        extendIntegration1: 0,
        extendIntegration2: 0,
        extendIntegration3: 0,
        extendIntegration4: 0,
        extendIntegration5: 0,
        extendIntegration6: 0,
        extendIntegration7: 0,
        extendIntegration8: 0,
        extendIntegration9: 0,
        extendIntegration10: 0
      }
    },
    // 批量加分
    handleChange(value) {
      console.log(value)
    },
    // 批量加分弹框关闭
    batchcloseClick() {
      this.batchPointsVisible = false
      this.batchPointForm = {
        classContactScore: 0,
        extendIntegration1: 0,
        extendIntegration2: 0,
        extendIntegration3: 0,
        extendIntegration4: 0,
        extendIntegration5: 0,
        extendIntegration6: 0,
        extendIntegration7: 0,
        extendIntegration8: 0,
        extendIntegration9: 0,
        extendIntegration10: 0
      }
    },
    // 打开批量导入积分弹框
    batchChannelPointClick() {
      if (!this.classIntegrationConfigDTOS.length) {
        return this.$message.warning('当前未配置积分项')
      }
      this.batchChannelPointVisible = true
    },
    // 批量导入积分提交
    async batchChannelPointComfirm() {
      if (!this.batchChannelPointFile.name) {
        return this.$message.warning('请选择文件后再提交')
      }
      if (this.batchChannelPointFile) {
        const data = new FormData()
        data.append('file', this.batchChannelPointFile)
        data.append('classId', this.commcClassId)
        const dataList = await fetchUpLoadIntergrationTeamplate(data)
        this.failStrList = dataList
        if (+this.failStrList.errorTips === 0) {
          this.$message.success('批量上传积分成功')
          this.getList()
          this.batchChannelPointVisible = false
        }
      }
    },
    // 批量导入 关闭事件
    batchChannelPointClose() {
      this.batchChannelPointVisible = false
      this.batchChannelPointFile = {}
      this.failStrList = {}
    },
    // 批量导入Change事件
    async batchChannelPointChange($event) {
      this.batchChannelPointFile = $event.target.files[0]
      $event.target.value = ''
    },
    // 打开编辑全部弹框
    editAllClick() {
      if (this.classIntegrationConfigDTOS.find(item => !item.testId)?.id) {
        this.editAllVisible = true
      } else {
        this.$message.warning('当前无可编辑的积分项')
      }
    },
    // 保存
    async preserve() {
      let list = []
      list = this.editList
      const resData =
        list && (await fetchUpdateAllStudentIntergration({ list }))
      this.$message.success('保存成功')
      this.getList()
      this.editAllVisible = false
    },
    // 取消
    cancell() {
      this.editAllVisible = false
      this.getList()
    }
  },
  created() {
   this.getList()
  }
}
</script>

<style lang="scss">
.PointManagement {
  .PointManagementMenu {
    height: 18px;
    display: flex;
    .PointLeft {
      flex: 1;
    }
    .PointRight {
      width: 200px;
      .PointInput {
        width: 200px;
      }
    }
  }
  .PointManagementTable {
    padding-top: 35px;
  }
  .gc-span {
    padding-left: 30px;
  }
}
.pointNumtex {
  padding-bottom: 16px;
}
.pointTegger {
  width: 120px;
  display: inline-block;
  text-align: right;
  padding-right: 10px;
}
.fixed {
  position: fixed;
  width: 100%;
  left: 5px;
  bottom: 0px;
  padding: 10px 0;
  box-sizing: border-box;
}
.btnheight{
  text-align: center;
}
</style>
<style lang="scss" scoped>
.lh30 {
  line-height: 30px;
}
</style>
