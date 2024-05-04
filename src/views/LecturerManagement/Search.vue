<template>
  <div class="LecturerManagement__Apply LecturerManagement__Search">
    <!-- 搜索card -->
    <el-card class="search-card LecturerManagement__Apply__search">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item
          class="LecturerManagement__Apply__search__select"
          label="机构"
        >
          <gc-institution v-model="queryForm.busiType"> </gc-institution>
          <el-checkbox v-model="queryForm.isGotSubBranch"
            >含下属机构</el-checkbox
          >
        </el-form-item>
        <el-form-item label="受聘时间" class="search-card__date mr10">
          <el-date-picker
            v-model="queryForm.applyStart"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
            popper-class="date-picker"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" class="search-card__date">
          <el-date-picker
            v-model="queryForm.applyEnd"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="endPickerOptions"
            value-format="yyyy-MM-dd"
            popper-class="date-picker"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <gc-input
            label="姓名"
            v-model="queryForm.teacherUm"
            placeholder="输入姓名/UM号"
          ></gc-input>
        </el-form-item>
        <el-form-item
          label="受聘年份"
          class="LecturerManagement__Apply__search__integral search-card__date"
        >
          <el-date-picker
            v-model="queryForm.year"
            type="year"
            placeholder="选择年份"
            :clearable="false"
            value-format="yyyy"
            popper-class="date-picker"
          >
          </el-date-picker>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="LecturerManagement__Apply__content mt10">
      <div
        class="
          LecturerManagement__Apply__content__menu
          instructor-icons
          menu-right
        "
      >
        <div
          class="
            LecturerManagement__Apply__content__menu__instructor-application
          "
        >
          <span
            class="instructor-icons__add"
            @click="
              instructorInfo = {}
              rewardPunishmentRecordList = []
              addInstructorInfoVisible = true
            "
          >
            <i class="instructor-icons__add__icon"></i>
            新增讲师</span
          >
        </div>
      </div>
      <gc-table
        :list="instructorList"
        :tableList="instructorTableList"
        class="LecturerManagement__Apply__content__table general__table"
      >
        <el-table-column label="讲师姓名" min-width="92">
          <template slot-scope="scope">
            <span class="active" @click="row = CopyObj(scope.row)">{{
              scope.row.teacherName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="UM号"
          prop="teacherUm"
          min-width="156"
        ></el-table-column>
        <el-table-column
          label="性别"
          prop="gender"
          min-width="88"
        ></el-table-column>
        <el-table-column
          label="归属机构"
          prop="orgName"
          min-width="324"
        ></el-table-column>
        <el-table-column
          label="讲师类型"
          prop="description"
          min-width="110"
        ></el-table-column>
        <el-table-column
          label="受聘时间"
          prop="dateHire"
          min-width="113"
        ></el-table-column>
        <el-table-column min-width="114">
          <template slot="header">
            <gc-tablecolumnfilters
              label="讲师状态"
              ref="statusRef"
              className="table__screen__icon"
              :list="expenseStatus"
              radio
              confirmText="确定"
              popperClass="circular"
              @filter="statusFilter"
              @reset="statusReset"
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column label="讲师星级" min-width="106" prop="rankDesc">
        </el-table-column>
        <el-table-column label="操作" min-width="64">
          <template slot-scope="scope">
            <div class="">
              <span
                class="active"
                @click="openUpdateInstructorInfoDialog(scope.row)"
                >修改</span
              >
            </div>
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getInstructorList)"
        @currentChange="currentChange($event, queryForm, getInstructorList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <!-- 修改讲师信息 dialog -->
    <gc-model
      title="修改讲师信息"
      :visible="updateInstructorInfoVisible"
      :isShowFooter="false"
      width="1100px"
      @close="updateInstructorInfoVisible = false"
      class="
        LecturerManagement__Search__update-instructor-info
        LecturerManagement__common-dialog
      "
    >
      <div
        class="
          LecturerManagement__Search__update-instructor-info__box
          LecturerManagement__common-dialog__box
        "
      >
        <div
          class="LecturerManagement__Search__update-instructor-info__box__info"
        >
          <ul
            class="
              LecturerManagement__Search__update-instructor-info__box__info__user
              userinfo-items
            "
          >
            <li class="userinfo-items__item userinfo-items__item__select">
              <div class="userinfo-items__item__left">
                <span>讲师类型</span>
              </div>
              <div class="userinfo-items__item__right">
                <gc-select
                  class="
                    LecturerManagement__Search__update-instructor-info__box__info__user__select
                  "
                  :options="instructorCateOptions"
                  v-model="instructorInfo.teacherType"
                  @change="instructorCateChange"
                ></gc-select>
              </div>
            </li>
            <li class="userinfo-items__item userinfo-items__item__select">
              <div class="userinfo-items__item__left">
                <span>讲师星级</span>
              </div>
              <div class="userinfo-items__item__right">
                <el-select
                  class="
                    LecturerManagement__Search__update-instructor-info__box__info__user__select
                  "
                  v-model="instructorInfo.rank"
                  :disabled="instructorLevelDisable"
                >
                  <template v-for="item in instructorLevelOptions">
                    <el-option
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      v-show="item.value === '02002001'"
                    ></el-option>
                  </template>
                </el-select>
              </div>
            </li>
            <li class="userinfo-items__item">
              <div class="userinfo-items__item__left">
                <span>姓</span>
                <span>名</span>
              </div>
              <div class="userinfo-items__item__right">
                {{ instructorInfo.teacherName }}
              </div>
            </li>
            <li class="userinfo-items__item">
              <div class="userinfo-items__item__left">
                <span>U</span>
                <span>M</span>
              </div>
              <div class="userinfo-items__item__right">
                {{ instructorInfo.teacherUm }}
              </div>
            </li>
            <li class="userinfo-items__item">
              <div class="userinfo-items__item__left">
                <span>部</span>
                <span>门</span>
              </div>
              <div class="userinfo-items__item__right l22">
                {{ instructorInfo.orgName }}
              </div>
            </li>
            <li class="userinfo-items__item">
              <div class="userinfo-items__item__left">
                <span>受聘时间</span>
              </div>
              <div class="userinfo-items__item__right l22">
                {{ instructorInfo.hireStartTime }}
              </div>
            </li>
            <li class="userinfo-items__item">
              <div class="userinfo-items__item__left t10 necessary">
                <span>擅长课程</span>
              </div>
              <div class="userinfo-items__item__right l22">
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="120"
                  v-model="instructorInfo.courseAdept"
                ></el-input>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="
            LecturerManagement__Search__update-instructor-info__box__content
          "
        >
          <div
            class="
              LecturerManagement__Search__update-instructor-info__box__content__items
            "
          >
            <div
              class="
                LecturerManagement__Search__update-instructor-info__box__content__items__title
              "
            >
              奖惩记录
            </div>
            <div
              class="
                LecturerManagement__Search__update-instructor-info__box__content__items__item
              "
              v-for="(item, index) in rewardPunishmentRecordList"
              :key="index"
            >
              <el-date-picker
                type="date"
                placeholder="选择日期"
                :clearable="false"
                value-format="yyyy-MM-dd"
                v-model="item.rwrdPnshTime"
                class="search-card__date margin-0"
              ></el-date-picker>
              <gc-input v-model="item.rwrdPnshInfo" :maxlength="60"></gc-input>
              <span
                class="active"
                @click="delRewardPunishmentRecordOneItem(item, index)"
                >删除</span
              >
            </div>
          </div>
          <div
            class="
              LecturerManagement__Search__update-instructor-info__box__content__add
            "
            @click="addRewardPunishmentRecordOneItem"
          >
            添加
          </div>
        </div>
      </div>
      <div class="LecturerManagement__common-dialog__btn">
        <el-button type="primary" @click="updateInstructorInfoSubmit"
          >提交</el-button
        >
      </div>
    </gc-model>

    <!-- 新增讲师 dialog -->
    <gc-model
      title="新增讲师"
      :visible="addInstructorInfoVisible"
      :isShowFooter="false"
      width="1100px"
      @close="
        addInstructorInfoVisible = false
        addInstructorInfoButtonText = '检查'
      "
      class="
        LecturerManagement__Search__add-instructor-info
        LecturerManagement__common-dialog
      "
    >
      <div class="LecturerManagement__Search__update-instructor-info__box">
        <div
          class="LecturerManagement__Search__update-instructor-info__box__info"
        >
          <ul
            class="
              LecturerManagement__Search__update-instructor-info__box__info__user
              userinfo-items
            "
          >
            <li class="userinfo-items__item userinfo-items__item__select">
              <div class="userinfo-items__item__left necessary">
                <span>讲师类型</span>
              </div>
              <div class="userinfo-items__item__right">
                <gc-select
                  class="
                    LecturerManagement__Search__update-instructor-info__box__info__user__select
                  "
                  :options="addInstructorCateOptions"
                  v-model="instructorInfo.teacherType"
                  @change="instructorCateChange"
                ></gc-select>
              </div>
            </li>
            <li class="userinfo-items__item userinfo-items__item__select">
              <div class="userinfo-items__item__left">
                <span>讲师星级</span>
              </div>
              <div class="userinfo-items__item__right">
                <gc-select
                  class="
                    LecturerManagement__Search__update-instructor-info__box__info__user__select
                  "
                  :options="instructorLevelOptions"
                  v-model="instructorInfo.rank"
                  :disabled="instructorLevelDisable"
                ></gc-select>
              </div>
            </li>
            <li class="userinfo-items__item userinfo-items__item__um">
              <div class="userinfo-items__item__left necessary">
                <span>U</span>
                <span>M</span>
              </div>
              <div class="userinfo-items__item__right">
                <gc-input
                  placeholder="请输入UM号"
                  v-model="instructorInfo.teacherUm"
                  @input="umChange"
                ></gc-input>
                <el-button
                  @click="inspectionIsInstructor(instructorInfo.teacherUm)"
                  >{{ addInstructorInfoButtonText }}</el-button
                >
              </div>
            </li>
            <li class="userinfo-items__item userinfo-items__item__name">
              <div class="userinfo-items__item__left">
                <span>姓</span>
                <span>名</span>
              </div>
              <div class="userinfo-items__item__right">
                <gc-input
                  disabled
                  v-model="instructorInfo.teacherName"
                ></gc-input>
              </div>
            </li>
            <li class="userinfo-items__item userinfo-items__item__department">
              <div class="userinfo-items__item__left t8">
                <span>部</span>
                <span>门</span>
              </div>
              <div class="userinfo-items__item__right p6">
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  disabled
                  value="平安银行武汉分行网金与财富管理部产品管理室"
                  v-model="instructorInfo.orgName"
                ></el-input>
              </div>
            </li>
            <li class="userinfo-items__item">
              <div class="userinfo-items__item__left">
                <span>受聘时间</span>
              </div>
              <div class="userinfo-items__item__right l22">
                {{ instructorInfo.dateHire || getCurrentTime() }}
              </div>
            </li>
            <li class="userinfo-items__item">
              <div class="userinfo-items__item__left t8 necessary">
                <span>擅长课程</span>
              </div>
              <div class="userinfo-items__item__right l22">
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="120"
                  v-model="instructorInfo.courseAdept"
                ></el-input>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="
            LecturerManagement__Search__update-instructor-info__box__content
          "
        >
          <div
            class="
              LecturerManagement__Search__update-instructor-info__box__content__items
            "
          >
            <div
              class="
                LecturerManagement__Search__update-instructor-info__box__content__items__title
              "
            >
              奖惩记录
            </div>
            <div
              class="
                LecturerManagement__Search__update-instructor-info__box__content__items__item
              "
              v-for="(item, index) in rewardPunishmentRecordList"
              :key="index"
            >
              <el-date-picker
                type="date"
                placeholder="选择日期"
                :clearable="false"
                value-format="yyyy-MM-dd"
                v-model="item.rwrdPnshTime"
                class="search-card__date margin-0"
              ></el-date-picker>
              <gc-input v-model="item.rwrdPnshInfo" :maxlength="60"></gc-input>
              <span
                class="active"
                @click="delRewardPunishmentRecordOneItem(item, index)"
                >删除</span
              >
            </div>
          </div>
          <div
            class="
              LecturerManagement__Search__update-instructor-info__box__content__add
            "
            @click="addRewardPunishmentRecordOneItem"
          >
            添加
          </div>
        </div>
      </div>
      <div
        class="
          LecturerManagement__Search__update-instructor-info__btn
          LecturerManagement__common-dialog__btn
        "
      >
        <el-button type="primary" @click="addInstructorInfoSubmit"
          >提交</el-button
        >
      </div>
    </gc-model>

    <!-- 讲师信息dialog -->
    <InstructorInfo :row="row" />
  </div>
</template>

<script>
import {
  message,
  sizeChange,
  currentChange,
  jsonHeaders,
  getCurrentTime
} from '../../util/utils'
import { CopyObj } from '../../plugins/until'
import { handlePickerOptions } from '../../mixins/component'
import InstructorInfo from './components/InstructorInfo'
export default {
  name: 'InstructorSearch',
  components: { InstructorInfo },
  mixins: [handlePickerOptions],
  data() {
    return {
      // 分页总条数
      total: 0,
      // 查询表单
      queryForm: {
        // 是否零售  LS:零售   ，FL：非零
        busiType: [],
        // 机构id
        orgId: '',
        // 机构名称
        orgName: '',
        // 是否包含下属机构
        isGotSubBranch: '',
        // 讲师类型
        teacherType: '',
        // 讲师状态 Y:可以、N:停用
        status: '',
        // 年份
        year: '',
        // 讲师um号
        teacherUm: '',
        // 讲师名字
        teacherName: '',
        // 开始时间
        applyStart: '',
        // 结束时间
        applyEnd: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      // 限制日期起始选择
      startPickerOptions: {},
      // 限制日期结束选择
      endPickerOptions: {},
      // 讲师表格字段数组
      instructorList: [
        {
          type: 'index',
          width: '64',
          label: '序号'
        }
      ],
      // 讲师表格数据数组
      instructorTableList: [],
      expenseStatus: [
        {
          label: '可用',
          value: 'Y'
        },
        {
          label: '冻结',
          value: 'N'
        }
      ],
      //  修改讲师信息 dialog 状态
      updateInstructorInfoVisible: false,
      // 需要删除的 奖惩记录列表
      needDelRecoedList: [],
      //  新增讲师 dialog 状态
      addInstructorInfoVisible: false,
      // 新增讲师 dialog 检查按钮文字
      addInstructorInfoButtonText: '检查',
      // pagesize 改变的回掉 公共 函数
      sizeChange,
      // 分页 的页码改变 回掉 公共 函数
      currentChange,
      // 讲师信息对象
      instructorInfo: {},
      // 奖惩记录列表
      rewardPunishmentRecordList: [],
      // 新增讲师 讲师类型 下拉框 options
      addInstructorCateOptions: [
        {
          label: '星级培训师',
          value: '02002'
        },
        {
          label: '培训管理师',
          value: '02003'
        },
        {
          label: '特聘培训师',
          value: '02004'
        }
      ],
      // 讲师类型 下拉框 options
      instructorCateOptions: [
        {
          label: '储备培训师',
          value: '02001'
        },
        {
          label: '星级培训师',
          value: '02002'
        },
        {
          label: '培训管理师',
          value: '02003'
        },
        {
          label: '特聘培训师',
          value: '02004'
        }
      ],
      // 讲师星级 下拉框 options
      instructorLevelOptions: [
        {
          label: '一星级培训师',
          value: '02002001'
        },
        {
          label: '二星级培训师',
          value: '02002002'
        },
        {
          label: '三星级培训师',
          value: '02002003'
        },
        {
          label: '四星级培训师',
          value: '02002004'
        },
        {
          label: '五星级培训师',
          value: '02002005'
        },
        {
          label: '六星级培训师',
          value: '02002006'
        }
      ],
      // 讲师星级是否禁用
      instructorLevelDisable: true,
      // 讲师个人信息 组件 传递的 row 对象
      row: {},
      CopyObj,
      getCurrentTime
    }
  },
  methods: {
    // 查询
    query() {
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 重置
    reset() {
      Object.keys(this.queryForm).forEach((key) => {
        this.queryForm[key] = ''
      })
      this.queryForm.busiType = []
      this.queryForm.status = ''
      this.queryForm.isGotSubBranch = false
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getInstructorList()
      this.$refs.statusRef.$set()
    },
    // 获取讲师 数据
    getInstructorList() {
      const data = CopyObj(this.queryForm)
      if (data.busiType.length > 0) {
        if (data.busiType.length > 1) {
          data.orgId = data.busiType.slice(-1)[0]
          data.busiType = data.busiType[0]
        } else {
          data.busiType = data.busiType[0]
          data.orgId = ''
        }
      } else {
        data.busiType = this.$store.state.userInfo.blgStripLine
      }
      data.year && (data.year += '-00-00')
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      data.status = data.status[0] || ''
      if (data.status.length < 1) {
        data.status = null
      }
      this.$axios
        .post('/fn/teacher/info/selectTeacherInfoList', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instructorTableList = data.list
            this.total = parseInt(data.total) || 0
          }
        })
    },
    // 讲师状态 确定事件
    statusFilter(list) {
      this.queryForm.status = list.list
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 讲师状态 重置事件
    statusReset(list) {
      this.queryForm.status = []
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 积分未达到提示
    prompt() {
      this.$alert('您本年度讲师积分未达到35分，请继续努力哦！', '提示', {
        confirmButtonText: '知道了',
        customClass: `loginTimeout`
      })
    },
    // 打开 修改讲师信息 dialog 函数
    openUpdateInstructorInfoDialog(row) {
      const { teacherUm, status } = row
      if (status === '冻结') {
        return message(`该UM【${teacherUm}】号对应讲师状态为冻结不可修改！`)
      }
      this.$axios
        .post('/fn/teacher/info/selectTeacherInfo', { teacherUm }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            if (data.teacherType === '02002') {
              this.instructorLevelDisable = false
              const values = this.instructorLevelOptions.map((v) => v.value)
              if (!values.includes(data.rank)) {
                data.rank = ''
              }
            } else {
              data.rank = ''
              this.instructorLevelDisable = true
            }
            this.instructorInfo = data
          }
        })
      this.$axios
        .post(
          '/fn/teacher/applyStar/selectRewAndPuList',
          { teacherUm },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.rewardPunishmentRecordList = data.list
          }
        })
      this.updateInstructorInfoVisible = true
    },
    // 修改讲师信息 提交事件
    updateInstructorInfoSubmit() {
      const data = CopyObj(this.instructorInfo)
      if (!data.courseAdept || !data.courseAdept.trim()) {
        return this.$message.warning('擅长课程为必填项')
      }
      const punish = CopyObj(this.rewardPunishmentRecordList)
      punish.forEach((v) => {
        v.teacherUm = data.teacherUm
      })
      this.$axios
        .post(
          '/fn/teacher/info/updateDetailInfo',
          { data, punish },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            message('修改成功！')
          }
          this.updateInstructorInfoVisible = false
          this.getInstructorList()
        })
      this.needDelRecoedList.forEach((item) => {
        this.$axios.post('/fn/teacher/info/deleteRePu', item, jsonHeaders)
      })
      this.needDelRecoedList = []
    },
    // 删除一条奖惩记录
    delRewardPunishmentRecordOneItem(item, index) {
      const { teacherUm, id } = item
      if (!id) return this.rewardPunishmentRecordList.splice(index, 1)
      this.needDelRecoedList.push({ teacherUm, id })
      this.rewardPunishmentRecordList.splice(index, 1)
    },
    // 添加一条奖惩记录
    addRewardPunishmentRecordOneItem() {
      this.rewardPunishmentRecordList.push({
        rwrdPnshTime: '',
        rwrdPnshInfo: ''
      })
    },
    // 检查该um号 是否是讲师
    inspectionIsInstructor(teacherUm) {
      if (!teacherUm || !teacherUm.trim()) return
      if (this.addInstructorInfoButtonText === '已检查') return
      this.$axios
        .post(
          '/fn/teacher/impower/selectCheckIsValidTeacher',
          { teacherUm, tip: 'lol' },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const info = CopyObj(this.instructorInfo)
            info.teacherName = data.teacherName
            info.orgName = data.orgName
            info.orgId = data.orgId
            this.instructorInfo = info
            this.addInstructorInfoButtonText = '已检查'
          }
        })
    },
    // 添加讲师信息 提交事件
    addInstructorInfoSubmit() {
      const data = CopyObj(this.instructorInfo)
      if (!data.teacherType) {
        return this.$message.error('讲师类型必选')
      } else if (!data.teacherName) {
        return this.$message.error('um不合法')
      } else if (!data.courseAdept) {
        return this.$message.error('擅长课程必填')
      }
      const reward = CopyObj(this.rewardPunishmentRecordList)
      this.$axios
        .post('/fn/teacher/info/addTeacher', { data, reward }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('新增成功')
            this.addInstructorInfoVisible = false
          }
        })
    },
    // 讲师类型select change事件
    instructorCateChange(data) {
      if (data === '02002') {
        this.instructorLevelDisable = false
        this.instructorInfo.rank = '02002001'
      } else {
        this.instructorLevelDisable = true
        this.instructorInfo.rank = null
      }
    },
    // 等待用户信息加载完成再获取数据
    delayGetData() {
      setTimeout(() => {
        if (this.$store.state.userInfo.blgStripLine) {
          this.getInstructorList()
        } else {
          this.delayGetData()
        }
      }, 100)
    },
    // 新增讲师 um change事件
    umChange() {
      this.addInstructorInfoButtonText = '检查'
    }
  },
  mounted() {
    this.delayGetData()
  }
}
</script>

<style lang="scss">
.LecturerManagement {
  &__Search {
    .LecturerManagement__icons__add__icon {
      background-image: url('../../assets/svg/jiangshi--hui.svg');
    }
    &__update-instructor-info {
      &__box {
        display: flex;
        height: 500px;
        background-color: #fff;
        border-bottom: 1px solid #eaecf1;
        &__info {
          width: 324px;
          padding-right: 20px;
          flex-shrink: 0;
          &__user {
            & &__select {
              padding: 0;
              .el-select {
                width: 100%;
              }
            }
            .userinfo-items__item__select {
              display: flex;
              align-items: center;
            }
            textarea {
              height: 150px;
            }
          }
        }
        &__content {
          flex: 1;
          padding: 20px;
          border-left: 1px solid #eaecf1;
          &__items {
            max-height: 400px;
            overflow: auto;
            border: 1px solid #eaecf1;
            &__title {
              padding-left: 20px;
              height: 40px;
              line-height: 40px;
              background-color: #f7f8fa;
              color: #7d8292;
            }
            &__item {
              display: flex;
              height: 50px;
              padding-left: 20px;
              border-bottom: 1px solid #eaecf1;
              align-items: center;
              &:last-child {
                border-bottom: none;
              }

              .el-date-editor {
                width: 150px;
              }
              .gc-input {
                width: 448px;
                margin-left: 20px;
                .label {
                  display: none;
                }
              }

              span {
                margin-left: 20px;
              }
            }
          }
          &__add {
            margin-top: 20px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px dashed #e2e3e6;
            border-radius: 2px;
            color: #7d8292;
            cursor: pointer;
          }
        }
      }
    }
    &__add-instructor-info {
      .gc-input {
        .label {
          display: none;
        }
      }
      .userinfo-items__item__name,
      .userinfo-items__item__um {
        align-items: center;
      }

      .userinfo-items__item__um {
        .userinfo-items__item__right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .el-button {
            width: 60px;
            height: 26px;
            padding: 6px 0;
            text-align: center;
            border: 1px solid #fd6720;
            span {
              color: #fd6720;
            }
          }
        }
        .gc-input {
          width: 151px;
        }
      }

      .userinfo-items__item__department {
        textarea {
          height: 48px;
        }
      }
    }
  }
}
</style>