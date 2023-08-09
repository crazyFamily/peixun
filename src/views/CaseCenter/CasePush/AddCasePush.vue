<template>
  <div class="add-case-push" v-loading="getLoadingStatus('LOADING_CASE_PUSH_SAVE')">
    <div class="main-container">
      <div class="form-container">
        <el-form :model="queryForm" :rules="formRules" ref="formRef">
          <el-form-item label="案例推送名称：" :label-width="formLabelWidth" prop="casePushName">
            <el-input v-model="queryForm.casePushName" :maxlength="maxNameLen" show-word-limit :disabled="isDetail"></el-input>
          </el-form-item>
          <el-form-item label="所属机构：" :label-width="formLabelWidth" prop="belongOrg">
            <gc-institution
              :orgUrl="fetchListCasePushBelongOrgs"
              :leftShow="false"
              v-model="orgIds"
              busiType="LS"
              @change="orgChangeHandle"
              :disabled="isDetail"
              ref="institutionRef"
              @setDataFinish="orgSetDataFinishHandle"
              :isbranch="true"
              width="400px"
              :allow-invented="false"
            >
            </gc-institution>
          </el-form-item>
          <el-form-item label="推送案例：" :label-width="formLabelWidth" prop="caseIds">
            <el-button class="button-w80-h30" type="primary" @click="isAddCaseShow = true" :disabled="isDetail">
              +添加案例
            </el-button>
            <span class="tips">最多可以加20个</span>
            <table-pagination
              class="case-table"
              :list="caseColumns"
              :tableList="caseTableList"
              :queryForm="caseTableQuery"
              :getList="caseGetList"
              :hidePagination="true"
              ref="caseTablePagination"
            >
              <el-table-column label="操作" min-width="90" fixed="right">
                <template slot-scope="scope">
                  <span class="active" @click="removeCaseHandle(scope.row)" v-if="!isDetail">移除</span>
                </template>
              </el-table-column>
            </table-pagination>
          </el-form-item>
          <el-form-item label="是否必修：" :label-width="formLabelWidth" prop="isRequired" class="flex-vertical-center">
            <el-radio-group class="is-required-container" v-model="queryForm.isRequired" :disabled="isDetail" @change="isRequiredChangeHandle">
              <el-radio label="Y">必修</el-radio>
              <el-radio label="N">选修</el-radio>
            </el-radio-group>
            <div class="finish-data-container" v-if="queryForm.isRequired === 'Y'">
              <span>必修完成期限：</span>
              <el-date-picker
                class="w-120"
                v-model="queryForm.finishDate"
                type="date"
                placeholder="请选择"
                :clearable="false"
                value-format="yyyy-MM-dd"
                @change="handleFinishDate"
                :disabled="isDetail"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="推送规则：" :label-width="formLabelWidth" prop="pushRule">
            <el-button class="button-w80-h30" type="primary" @click="openRuleHandle">设置</el-button>
          </el-form-item>
          <el-form-item label="推送提醒：" :label-width="formLabelWidth" prop="isRemindType" class="flex-vertical-center">
            <el-checkbox-group @change="changeIsRemindType" v-model="queryForm.isRemindType" :disabled="isDetail" class="w-100">
              <el-checkbox label="app">推送时提醒</el-checkbox>
            </el-checkbox-group>
            <el-link type="primary" class="edit-email" @click="showEmailTempHandle('push')">编辑提醒内容</el-link>
          </el-form-item>
          <el-form-item label="临期提醒：" v-if="queryForm.isRequired === 'Y'" :label-width="formLabelWidth">
            <el-form-item label-width="0" prop="impendRemindDateOne" class="mb20">
              <el-checkbox v-model="queryForm.impendRemindDateOne" :disabled="isDetail" class="w-100">临期1天</el-checkbox>
              <el-link type="primary" class="edit-email" @click="showEmailTempHandle('advent')">编辑提醒内容</el-link>
            </el-form-item>
            <el-form-item label-width="0" prop="impendRemindDateTwo" class="mb20">
              <el-checkbox v-model="queryForm.impendRemindDateTwo" :disabled="isDetail">临期3天</el-checkbox>
            </el-form-item>
            <el-form-item label-width="0" prop="impendRemindDateThi" class="mb20">
              <el-checkbox v-model="queryForm.impendRemindDateThi" :disabled="isDetail">临期7天</el-checkbox>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button class="button-w80-h30" @click="saveHandle('S')" :disabled="isDetail">保存</el-button>
      <el-button class="button-w80-h30" type="primary" @click="pushHandle" :disabled="isDetail">推送</el-button>
    </div>
    <comp-select-case-dailog :show.sync="isAddCaseShow" title="选择案例" @save="selectCaseSaveHandle" :selected-list="caseTableList">
    </comp-select-case-dailog>
  </div>
</template>

<script>
import { fetchSelectOrgTagList, fetchInsertPushCaseForSave, fetchPushCaseDetail, fetchListCasePushBelongOrgs } from '@/fetch/caseCenter'
import CompSelectCaseDailog from '@/components/case/CompSelectCaseDailog.vue'
import { CopyObj, uuid, secondToHour, numerationTimeFateDifference, getCurrentTime, numerationBeforewardsDays, getLoadingStatus } from '@/util/utils'
export default {
  name: 'AddCasePush',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    let handleAdventTime = (value, callback, adventDay) => {
      if (!value || this.queryForm.isRequired === 'N') {
        return callback()
      } else if (!this.queryForm.finishDate) {
        return callback(new Error('请选择完成期限'))
      } else if (numerationTimeFateDifference(this.queryForm.finishDate, getCurrentTime()) < adventDay) {
        return callback(new Error(`距离完成期限已不足${adventDay}天`))
      }
      return callback()
    }
    return {
      queryForm: {
        casePushName: '',
        belongOrg: '',
        orgName: '',
        isRequired: 'Y',
        finishDate: '',
        remindType: 'ae',
        isRemindType: true,
        emailContent: '您有新推送的案例学习任务，请查收！',
        pushType: '',
        pushTime: '',
        pushOrg: '',
        caseIds: [],
        batchIds: [uuid()],
        pushRule: false,
        impendRemindDateOne: false,
        impendRemindDateTwo: false,
        impendRemindDateThi: false,
        impendRemindType: 'ae',
        impendEmailContent: '您还有案例未完成学习，快去完成吧！'
      },
      orgIds: [],
      formRules: {
        casePushName: [requiredHandle('请输入案例推送名称')],
        belongOrg: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.orgIds.length) {
                return callback(new Error('请选择所属机构'))
              }
              return callback()
            }
          }
        ],
        caseIds: [
          {
            validator: (rule, value, callback) => {
              if (!this.caseTableList.length) {
                return callback(new Error('请选择推送案例'))
              }
              return callback()
            }
          }
        ],
        pushRule: [
          {
            validator: (rule, value, callback) => {
              if (!this.queryForm.pushType) {
                return callback(new Error('请设置推送规则'))
              }
              return callback()
            }
          }
        ],
        isRemindType: [
          {
            validator: (rule, value, callback) => {
              if (value && !this.queryForm.remindType) {
                return callback(new Error('至少选择一种提醒方式'))
              }
              return callback()
            }
          }
        ],
        impendRemindDateOne: [
          {
            validator: (rule, value, callback) => {
              handleAdventTime(value, callback, 1)
            }
          }
        ],
        impendRemindDateTwo: [
          {
            validator: (rule, value, callback) => {
              handleAdventTime(value, callback, 3)
            }
          }
        ],
        impendRemindDateThi: [
          {
            validator: (rule, value, callback) => {
              handleAdventTime(value, callback, 7)
            }
          }
        ]
      },
      maxNameLen: 50,
      formLabelWidth: '140px',
      caseColumns: [
        { label: '类型', prop: 'caseTypeStr' },
        { label: '案例ID', prop: 'caseId' },
        { label: '案例名称', prop: 'caseName' },
        {
          label: '案例时长',
          prop: 'caseDuration',
          formatter: row => secondToHour(row.caseDuration)
        }
      ],
      caseTableList: [],
      caseTableQuery: {},
      isAddCaseShow: false,
      isEmailTempShow: false,
      isDetail: false,
      institutionKey: 0,
      fetchSelectOrgTagList,
      fetchListCasePushBelongOrgs,
      getLoadingStatus
    }
  },

  components: {
    CompSelectCaseDailog
  },

  computed: {},

  mounted() {},

  methods: {
    _formatParams(params) {
      let data = CopyObj(params)
      if (Array.isArray(this.orgIds)) {
        data.belongOrg = this.orgIds[this.orgIds.length - 1]
      }

      if (Number(data.pushType) === 0) {
        Reflect.deleteProperty(data, 'pushTime')
      }

      if (data.isRequired === 'N') {
        // 选修删除完成时间、临期提醒impend对应字段
        Reflect.deleteProperty(data, 'finishDate')
        Reflect.deleteProperty(data, 'impendRemindType')
        Reflect.deleteProperty(data, 'impendEmailContent')
      }

      data.caseIds = this.caseTableList.map(item => item.id)
      this.pushRemindDateRender(data, 'impendRemindDateOne', 0)
      this.pushRemindDateRender(data, 'impendRemindDateTwo', 2)
      this.pushRemindDateRender(data, 'impendRemindDateThi', 6)
      Reflect.deleteProperty(data, 'isRemindType')
      if (data.finishDate === '') Reflect.deleteProperty(data, 'finishDate')
      if (data.pushTime === '') Reflect.deleteProperty(data, 'pushTime')
      return data
    },
    pushRemindDateRender(data, dateType, days) {
      if (data.finishDate && data[dateType]) {
        data[dateType] = numerationBeforewardsDays(data.finishDate, days)
      } else {
        Reflect.deleteProperty(data, dateType)
      }
    },
    async saveHandle(operateType = 'S') {
      this.$refs.formRef.validate(async v => {
        if (!v) return false
        let data = {
          ...this._formatParams(this.queryForm),
          operateType: operateType
        }
        await fetchInsertPushCaseForSave({ data })
        if (operateType === 'T') {
          this.$message.success('已提交推送，待后台任务执行')
        } else {
          this.$message.success('保存成功')
        }
        // this.$router.push({ name: '案例推送列表' })
        this.closeHandle()
      })
    },
    async pushHandle() {
      try {
        await this.dialogTips('是否确认信息并发起推送')
        this.saveHandle('T')
      } catch {}
    },
    // 删除操作的二次提示
    dialogTips(msg = '是否确定删除选中项') {
      return new Promise((resolve, reject) => {
        this.$confirm(msg, '提示', {
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
    resetData() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.$refs.institutionRef.setContentValue([])
      this.$refs.institutionRef.createTreeData()
    },
    closeHandle() {
      this.$router.push({ name: '案例推送列表' })
    },
    showEmailTempHandle(caseRemindType) {
      const params = {
        baseInfo: {
          orgName: this.queryForm.orgName,
          finishDate: this.queryForm.finishDate,
          isRequired: this.queryForm.isRequired,
          caseRemindType
        },
        caseList: this.caseTableList,
        isDetail: this.isDetail
      }
      switch (caseRemindType) {
        case 'push':
          params.baseInfo.appContent = '您有新的案例学习任务送达，快去学习吧>>'
          params.baseInfo.emailContent = this.queryForm.emailContent
          params.baseInfo.impendRemindType = this.queryForm.remindType
          break
        case 'advent':
          params.baseInfo.appContent = '您还有案例未完成学习，加油完成哦！'
          params.baseInfo.emailContent = this.queryForm.impendEmailContent
          params.baseInfo.impendRemindType = this.queryForm.impendRemindType
      }
      this.$store.commit('caseCenter/updateRemindInfo', params)
      this.$router.push({
        name: '案例推送邮件模板'
      })
    },
    openRuleHandle() {
      this.$router.push({
        name: '案例推送规则',
        params: {
          uuid: this.queryForm.batchIds[0],
          isDetail: this.isDetail,
          ruleInfo: this.queryForm
        }
      })
    },
    caseGetList() {},
    selectCaseSaveHandle(caseList) {
      this.caseTableList = caseList
      this.queryForm.caseIds = this.caseTableList.map(item => item.id)
    },
    orgChangeHandle(orgName) {
      console.log(orgName, '---')
      this.queryForm.orgName = orgName
    },
    async _getDetailInfo() {
      if (!this.$route.params.id) return
      let res = await fetchPushCaseDetail({ id: this.$route.params.id })

      if (this.$route.params.isCopy) {
        res.batchIds = [uuid()]
        Reflect.deleteProperty(res, 'id')
        let removeKeys = ['id', 'pushType', 'pushTime', 'pushTimeStr', 'pushOrg']
        removeKeys.forEach(item => {
          Reflect.deleteProperty(res, item)
        })
      }
      res.isRemindType = res.remindType ? true : false
      this.queryForm = res
      this.queryForm.finishDate = res.finishDateStr
      this.orgIds = [res.belongOrg]
      this.queryForm.orgName = res.belongOrgStr || this.queryForm.orgName
      if (this.queryForm.impendRemindDateOne) {
        this.queryForm.impendRemindDateOne = true
      }
      if (this.queryForm.impendRemindDateTwo) {
        this.queryForm.impendRemindDateTwo = true
      }
      if (this.queryForm.impendRemindDateThi) {
        this.queryForm.impendRemindDateThi = true
      }
      // 复制推送时，所属机构不能直接复制，需根据用户的权限重新填充此字段
      // 此时清空“所属机构”，需要重新选择
      if (this.$route.params.isCopy) {
        this.$refs.institutionRef.setContentValue([])
        this.orgIds = []
      } else {
        this.$refs.institutionRef.setContentValue([this.queryForm.orgName])
      }
      this.caseTableList = res.caseInfos || []
    },
    isRequiredChangeHandle() {
      this.handleFinishDate()
    },
    _initData() {
      console.log(this.$route.params, '===>> params');
      if (this.$route.params.isReset) {
        this.resetData()
        this.$nextTick(() => {
          this.$refs.formRef.clearValidate()
        })
      }

      if (this.$route.params.ruleInfo) {
        this.queryForm = { ...this.queryForm, ...this.$route.params.ruleInfo }
      }
      // 复制记录时，处理记录详情
      this.$route.params && this._getDetailInfo()
      this.$route.params.isDetail !== undefined && (this.isDetail = this.$route.params.isDetail)

      switch (this.$route.params.caseRemindType) {
        case 'push':
          this.queryForm.remindType = this.$route.params.impendRemindType
          this.queryForm.emailContent = this.$route.params.emailContent
          this.$refs.formRef.validateField('isRemindType')
          break
        case 'advent':
          this.queryForm.impendRemindType = this.$route.params.impendRemindType
          this.queryForm.impendEmailContent = this.$route.params.emailContent
      }
      this.$refs.institutionRef.createTreeData()
      this.cacheOrgIds = CopyObj(this.orgIds)
    },
    removeCaseHandle(row) {
      this.caseTableList = this.caseTableList.filter(item => item.caseId !== row.caseId)
    },
    orgSetDataFinishHandle() {},
    handleFinishDate() {
      this.$refs.formRef.validateField('impendRemindDateOne')
      this.$refs.formRef.validateField('impendRemindDateTwo')
      this.$refs.formRef.validateField('impendRemindDateThi')
    },
    changeIsRemindType(val) {
      if (!val) {
        this.queryForm.remindType = ''
      }
    }
  },
  activated() {
    this._initData()
    this.institutionKey = Math.random()
  }
}
</script>
<style lang="scss" scoped>
.add-case-push {
  position: relative;
}
.main-container {
  background-color: #fff;
  padding: 20px 0;
}

.form-container {
  width: 90%;
  margin: 0 auto;
}

.tips {
  padding-left: 15px;
  color: $color9;
}

.case-table {
  margin-top: 20px;
}

.flex-vertical-center {
  .is-required-container {
    margin-right: 20px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
  }
}

.edit-email {
  margin-left: 20px;
  font-size: 12px;
}

.finish-data-container {
  display: inline-block;
}
.w-100 {
  width: 100px !important;
}
</style>
