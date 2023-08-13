<template>
    <!-- 关联计划 dialog -->
    <gc-model
      title="关联计划"
      :visible="visible"
      :cancelText="cancelText"
      :comfirmText="comfirmText"
      width="1200px"
      class="correlation-plan"
      @close="correlationClose"
      @comfirm="correlationComfirm"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane v-if="isShowInternalPlan" label="计划内" name="internalPlan" class="internalPlan">
          <gc-table
            class="general__table table-radio"
            ref="internalPlanTableRef"
            :list="internalPlanList"
            :tableList="internalPlanTableList"
            @selection-change="tableSelectionChange($refs, $event, 'internalPlanTableRef')" 
          /> 
          <gc-pagination
            :total="internalPlanForm.total"
            :page-size="internalPlanForm.pageSize"
            :current-page="internalPlanForm.currPage"
            @sizeChange="sizeChange($event, internalPlanForm, getPlanList)"
            @currentChange="currentChange($event, internalPlanForm, getPlanList)"
            class="between"
          />
        </el-tab-pane>
        <el-tab-pane v-else label="计划外" name="externalPlan" class="internalPlan external-plan-wrapper" >
          <div class="between-noc mt5">
            <el-form :model="externalPlanForm"
              :disabled="isDetail"
              inline
              label-width="72px"
              ref="externalPlanFormRef"
              @submit.native.prevent>
              <el-form-item label="计划类型">
                <el-input v-model.trim="planTypeDesc" class="w-200"></el-input>
              </el-form-item>
              <el-form-item label="培训类别">
                <el-input v-model.trim="trainingTypeDesc" class="w-200"></el-input>
              </el-form-item>
              <el-form-item label="计划名称">
                <el-input v-model.trim="annualPlanName" class="w-200"></el-input>
              </el-form-item>
              <template v-if="trainingCourse">
                <el-form-item label="项目名称">
                  <el-input v-model.trim="projectName" class="w-200"></el-input>
                </el-form-item>
                <el-form-item label="业务模块" prop="channelType">
                  <el-input v-model.trim="externalPlanForm.channelTypeDesc"></el-input>
                </el-form-item>
                <el-form-item label="关键岗位" prop="keyJobs">
                  <el-input v-model.trim="externalPlanForm.keyJobsDesc || externalPlanForm.keyJobs"></el-input>
                </el-form-item>
                <el-form-item label="培训系列" prop="trainSeries">
                  <el-input v-model.trim="externalPlanForm.trainSeriesDesc"></el-input>
                </el-form-item>
                <el-form-item label="子系列" prop="childSeries">
                  <el-input v-model.trim="externalPlanForm.childSeriesDesc"></el-input>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </gc-model>
</template>
<script>
import { CopyObj, jsonHeaders, renderName } from '@/util/utils'
import { fetchListPlanDict } from '@/fetch/public'
import { LADDER_COURSE_TYPE } from '../enum'
import { LINE_LS, LINE_MAP, YES_STATUS } from '@/util/constants'
export default {
    props: {
        pageState: String,
        visible: Boolean,
        tabActiveName: String,
        baseInfoForm: {
          type: Object,
          default: () => {}
        },
        projectCategoryOptions: {
          type: Array,
          default: () => []
        }
    },
    data () {
      return {
        // showClose: true,
        // comfirmText: '确定',
      
        // 关联计划弹窗 dialog 状态
        correlationVisible: false,
        // 显示内部计划还是外部计划
        // activeName: 'internalPlan',
        // 内部计划 form 表单
        internalPlanForm: {
          currPage: 1,
          pageSize: 5
        },
        annualPlanName: '计划外项目',
        // 外部计划 form 表单
        externalPlanForm: {
          channelTypeDesc: ''
        },
        // 内部计划字段数组
        internalPlanList: [
          { label: '序号', width: '54', type: 'index' },
          { label: '年份', width: '80', prop: 'planYear' },
          {
            label: '条线',
            width: '100',
            prop: 'blgStripLine',
            formatter: row => LINE_MAP[row.blgStripLine]
          },
          { label: '计划项目名称', width: '350', prop: 'annualPlanName' },
          {
            label: '培训类型',
            prop: 'trainTypeDesc'
          },
          {
            label: '是否消保培训',
            width: '130',
            prop: 'ifConformance',
            formatter: row => row.ifConformance === YES_STATUS ? '是':'否'
          },
          { label: '业务模块', width: '110', prop: 'channelTypeDesc' },
          { label: '关键岗位', width: '110', prop: 'keyJobsDesc' },
          {
            label: '培训系列及子系列',
            width: '150',
            prop: 'trainSeriesDesc',
            formatter: row => [row.trainSeriesDesc, row.childSeriesDesc].join('/')
          },
          { 
            label: '创建人', 
            width: '200', 
            prop: 'createdBy',
            formatter: row => renderName(row.createdByName, row.createdBy)
          },
          { label: '创建人部门', width: '266', prop: 'blgDeptName' }
        ],
        // 内部计划数据数组
        internalPlanTableList: [],
        
        selectOptions: {}, // channelTypes, trainSeries,
        // isShowInternalPlan: true
      }
    },
    computed: {
      isDetail () {
        return this.pageState === 'detail'
      },
      activeName () {
        return this.isShowInternalPlan ? 'internalPlan' : 'externalPlan'
      },
      cancelText () {
        return this.isDetail ? '' : '取消'
      },
      comfirmText () {
        const meta = {
          'detail': '关闭'
        }
        return meta[this.pageState] || '确定'
      },
      planTypeCode () {
        return (this.baseInfoForm?.classTypes || [])[0] || ''
      },
      planTypeDesc () {
        return this.getProjectCateName(this.planTypeCode, this.projectCategoryOptions )
      },
      projectName () {
        return this.baseInfoForm?.projectName || '-'
      },
      trainingTypeCode () {
        return (this.baseInfoForm?.classTypes || [])[1] || ''
      },
      trainingTypeDesc () {
        return this.getProjectCateName(this.trainingTypeCode, this.projectCategoryOptions )
      },
      // 项目分类是否是培训班
      trainingCourse () {
        if (this.baseInfoForm?.classTypes?.length) {
          return this.baseInfoForm?.classTypes[0] === '01001'
        } else {
          return true
        }
      },
      isShowInternalPlan () {
        return this.baseInfoForm?.annualPlanId !== 'N'
      }
    },
    watch: {
      tabActiveName (n, o) {
        this.setActiveName(n)
      },
      visible (n, o) {
        // this.setCorrelationVisible(n)
        if (n) {
          this._initcaData().then(() => {
            // this.isShowInternalPlan = this.baseInfoForm?.annualPlanId !== 'N'
            if (this.baseInfoForm?.annualPlanId !== 'N') {
              ['channelType', 'keyJobs', 'trainSeries', 'childSeries'].forEach(key => {
                console.log('xf', this.baseInfoForm[key])
              })
              this.searchPlan()
            } else {
              // 需求变理：非零/金服条线下，关键岗位不需要和其他字段耦合
              if(this.baseInfoForm.blgStripLine !== LINE_LS) {
                this.$set(this.externalPlanForm, 'keyJobs', this.baseInfoForm.keyJobs)
              }
              // 回显计划外数据
              ['channelType','trainSeries'].forEach(key => {
                if (this.baseInfoForm[key] !== undefined) {
                  this.externalPlanForm[key] = this.baseInfoForm[key]
                  const selectKey = key === 'channelType' ? 'channelTypes' : key
                  const parentItem = this.selectOptions[selectKey].find(m => m.dataEncode === this.baseInfoForm[key])
                  this.externalPlanForm[key+'Desc'] = parentItem?.dataValue
                  this.$set(this.externalPlanForm, `${key}Desc`, parentItem?.dataValue)
                  if (parentItem?.childPlanDict) {
                    if (key === 'channelType') {
                      this.externalPlanForm.keyJobs = this.baseInfoForm.keyJobs
                      const subItem = parentItem.childPlanDict.find(m => m.dataEncode === this.baseInfoForm.keyJobs)
                      this.externalPlanForm.keyJobsDesc = subItem?.dataValue
                    }
                    if (key === 'trainSeries') {
                      this.externalPlanForm.childSeries = this.baseInfoForm.childSeries
                      const subItem = parentItem.childPlanDict.find(m => m.dataEncode === this.baseInfoForm.childSeries)
                      this.externalPlanForm.childSeriesDesc = subItem?.dataValue
                    }
                  }
                }
              })
            }
          })
        }
      }
    },
    methods: {
      setActiveName (val) {
        this.activeName = val
      },
      // setCorrelationVisible (val) {
      //   this.correlationVisible = val
      // },
      correlationClose () {
        this.close()
      },
      correlationComfirm () {
        if (this.isDetail) {
          this.close()
        }
      },
      close () {
        // this.setCorrelationVisible(false)
        this.$emit('close', false)
      },

      // 根据项目分类编码获取项目分类名字
      getProjectCateName(id, arr) {
        for (let i = 0; i < arr.length; i++) {
          const v = arr[i]
          if (id === v.dataEncode) {
            return v.dataValue
          }
          if (!v.children) continue
          const name = this.getProjectCateName(id, v.children)
          if (name) {
            return name
          }
        }
      },
      // 查询可关联计划
      searchPlan() {
        this.internalPlanForm.currPage = 1
        this.internalPlanForm.pageSize = 5
        this.getPlanList()
      },
      // 获取关联计划数据
      getPlanList() {
        const data = CopyObj(this.internalPlanForm)
        data.planClassType = this.trainingCourse ? 1 : 0
        data.blgDept = this.baseInfoForm.blgOrg
        data.trainType = this.trainingTypeCode
        data.blgStripLine = data.blgStripLine || this.baseInfoForm.blgStripLine || this.$store.state.userInfo.blgStripLine
        // 计划项目名称
        data.annualPlanName = this.baseInfoForm.annualPlanName
        data.annualPlanId = this.baseInfoForm.annualPlanId 
        data.dateStart = this.baseInfoForm.dateStart
        data.page = data.currPage
        data.size = data.pageSize
        data.ifConformance = this.baseInfoForm.ifConformance
        data.isGotSubBranch = 'Y'
        this.$axios
          .post('/fn/plan/manage/listClassAssociatePlan', { data }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              const { list, total } = data
              this.internalPlanForm.total = total
              this.internalPlanTableList = list
            }
          })
      },
      async _initcaData() {
        this.selectOptions = await fetchListPlanDict({
          line: this.baseInfoForm.blgStripLine || 'LS',
          type: this.baseInfoForm.classTypes[0]
        })
      }
    },
    mounted () {
      // this._initcaData()
    }
}
</script>
<style lang="scss" scoped>
.establish__addEstablishProject {
  .gc-select .label {
    width: auto;
  }
  .base-info {
    .form {
      width: 670px;
      margin: 0 auto;

      .gc-select {
        padding: 0;

        .el-select {
          width: 250px;
        }
      }

      .w100 {
        width: 100%;
      }

      .afterExplain {
        .el-form-item__label {
          white-space: nowrap;
          display: flex;
          justify-content: flex-end;
        }
      }

      .search-card__date {
        margin-top: 0;
        .el-form-item__content {
          float: left;
        }
      }
      .textarea {
        textarea {
          height: 180px;
        }
      }

      .line-box {
        display: flex;
        height: 30px;
        justify-content: flex-end;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        i {
          width: 30px;
        }
      }
    }
  }
  .btns {
    display: flex;
    height: 30px;
    margin-top: 20px;
    padding: 0 10px;
    line-height: 30px;
    text-align: center;

    > div {
      flex: 1;
      border: 1px dashed #e2e3e6;
      border-radius: 2px;
      cursor: pointer;
      &:first-child {
        margin-right: 22px;
      }
    }
  }
  .cost-beyond {
    .el-form {
      width: 800px;
      textarea {
        height: 100px;
      }
    }
  }
  .correlation-plan {
    .el-dialog__body {
      padding: 0 0 20px 0 !important;
    }
    .el-tabs__content {
      padding: 0 20px 0;
    }
    .internalPlan {
      .center {
        margin: 0 80px 0 70px;
      }
    }
    .el-input {
      width: 200px;
    }
    .gc-select {
      padding: 0;
    }
  }
  .add-student {
    .selected-table-box {
      padding: 20px;
    }
  }
}

.external-plan-wrapper {
  :deep(.gc-readonlyInput) {
    margin-bottom: 0;
  }
  :deep(.el-form-item) {
    width: 32%;
  }
}

.external-keyjobs-style {
  display: inline-block; 
  :deep(.el-input__inner) {
    padding-right: 50px !important;
  }
}
</style>
