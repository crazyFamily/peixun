<template>
  <div class="LaunchSetupManagement__LaunchSetupForm">
    <!-- 内容 -->
    <div class="content-box">
      <el-form ref="formRef" :model="editForm" :rules="editFormRule" :disabled="isDetail" label-width="100px" @submit.native.prevent>
        <!-- <el-form-item label="功能开关ID" class="mr20" prop="functionId">
          <el-input :disabled="isEdit" maxlength="20" v-model.trim="editForm.functionId" placeholder="请输入功能开关ID(20字符)" />
        </el-form-item> -->
        <el-form-item label="功能开关状态" prop="functionStatus">
          <gc-select :options="stateOptions" v-model="editForm.functionStatus" :clearable="false" />
        </el-form-item>
        <el-form-item label="功能开关类型" class="mr20" prop="functionType">
          <!-- <el-input :disabled="isEdit" maxlength="20" v-model.trim="editForm.functionId" placeholder="请输入功能开关ID(20字符)" /> -->
          <gc-select v-model="editForm.functionType" :options="functionTypeList" v="keyCode" k="keyValue"></gc-select>
        </el-form-item>
        <el-form-item label="功能开关名称" class="mr20" prop="functionName">
          <el-input maxlength="100" v-model.trim="editForm.functionName" placeholder="请输入功能开关名称(100字符)" />
        </el-form-item>
        <el-form-item label="架构类型" prop="pilotScope">
          <gc-select :options="pilotScopeOptions" v-model="editForm.pilotScope" :clearable="false" />
        </el-form-item>
        <el-form-item label="架构范围" prop="lineAndOrgNameAll" :rules="lineAndOrgRules()">
          <el-input v-show="!isNeedDept" disabled placeholder="请选择组织" />
          <DeptTreeSelect
            v-show="isNeedDept"
            :disabled="isDetail"
            v-model="editForm.lineAndOrgNameAll"
            :originalValue="editForm.experimentsOrgList"
            :placeholder="!isDetail ? '请选择组织' : ''"
          />
        </el-form-item>
        <el-form-item label="开启时间" prop="daterange">
          <el-date-picker
            class="rms-daterange-picker"
            v-model="editForm.daterange"
            type="daterange"
            placeholder="开启时间"
            :clearable="false"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
            :picker-options="gtNow"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="年度区间" prop="years">
          <div class="year-wrapper">
            <template v-for="(year, index) in editForm.years">
              <div class="year-content-container">
                <el-date-picker
                  class="rms-daterange-picker"
                  v-model="editForm.years[index]"
                  type="year"
                  :clearable="false"
                  placeholder="选择年"
                  value-format="yyyy"
                >
                </el-date-picker>
                <!-- <span class="active controll ml10" @click="handleAddYear" v-if="index === editForm.years.length - 1">新增</span> -->
                <span class="active controll ml10" @click="handleRemoveYear(index)">删除</span>
              </div>
            </template>
          </div>
          <el-button @click="handleAddYear">添加年度区间</el-button>
        </el-form-item>
      </el-form>
      <!-- <div>{{editForm.lineAndOrgNameAll}}</div> 
      <div>{{editForm.experimentsOrgList}}</div>-->
    </div>

    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="handleBack">返回</el-button>
      <el-button v-if="!isDetail" class="button-w80-h30" type="primary" :loading="saveLoading" @click="submit">提交</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { fetchListFunctionName } from '@/fetch/launchSetupManagement'
import { gtNow } from '@/util/utils'
// 获取开关类型
const functionTypeList = ref([])
const getFunctionNameList = async () => {
  functionTypeList.value = await fetchListFunctionName()
}
getFunctionNameList()
</script>
<script>
import { allowKeepAlive } from '@/router'
import { addAllowKeepAlive, closeCurrPageAndGoPath } from '@/util/utils'
import { fetchFindFunctionSwitchById, fetchSaveFunctionSwitch, fetchCheckFunctionId, fetchCheckFunctionName } from '@/fetch/launchSetupManagement'
import DeptTreeSelect from './components/DeptTreeSelect'
export default {
  name: 'LaunchSetupForm',
  components: {
    DeptTreeSelect
  },
  data(vm) {
    // 验证唯一性
    const checkUnique = async (rule, value, cb) => {
      const { field } = rule
      const meta = {
        functionId: { text: '功能开关ID', fn: fetchCheckFunctionId },
        functionName: { text: '功能开关名称', fn: fetchCheckFunctionName }
      }
      const params = { [field]: value }
      try {
        // if (this.pageState === 'add') {
        //   await meta[field].fn({ request: params })
        // }
        if (this.pageState === 'add') {
          await meta[field].fn({ request: params })
        }
        if (this.pageState === 'edit') {
          this.editForm.functionName !== this.cacheFunction && await meta[field].fn({ request: params })
        }
        cb()
      } catch (e) {
        cb(new Error(`${meta[field].text}已存在，请重新输入`))
      }
    }

    return {
      pageState: '',
      pageStateMaping: {
        add: '新增-功能开关',
        edit: '编辑-功能开关',
        view: '查看-功能开关'
      },
      routerParams: {},
      stateOptions: [
        { label: '启用', value: '01' },
        { label: '不启用', value: '02' }
        // { label: '不启用', value: '03' },
      ],
      pilotScopeOptions: [
        { label: '全行', value: '01' },
        { label: '指定架构', value: '02' }
        // { label: '不启用', value: '03' },
      ],
      editForm: {
        functionId: '',
        functionName: '',
        functionStatus: '',
        pilotScope: '',
        daterange: [],
        lineAndOrgNameAll: [], // 试点架构, 用于显示在树组件中,如：['','','']
        experimentsOrgList: [], // 试点架构, 用于提交给后端
        years: [] // 年份的集合
      },
      editFormRule: {
        functionType: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        functionName: [
          { required: true, message: '请输入功能开关名称', trigger: 'blur' },
          { max: 100, message: '长度最多100个字符', trigger: 'input' },
          { validator: checkUnique, trigger: 'blur' }
        ],
        functionStatus: [{ required: true, message: '请选择功能开关状态', trigger: 'change' }],
        pilotScope: [{ required: true, message: '请选择架构类型', trigger: 'change' }],
        daterange: [{ required: true, message: '请选择开启时间', trigger: 'change' }],
        years: [{
          required: true,
          validator: (rule, value, callback) => {
            if(!this.editForm.years.length) return callback(new Error('请选择年度区间'))
            if(this.editForm.years.includes('')) return callback(new Error('请选择年度区间'))
            if(Array.from(new Set(this.editForm.years)).length !== this.editForm.years.length) return callback(new Error('含有重复年度'))
            return callback()
          }
        }]
      },
      saveLoading: false,
      // 缓存名称
      cacheFunction: ''
    }
  },
  computed: {
    // 试点架构 是否被禁用
    // lineAndOrgNameAllDisable() {
    //   return this.editForm?.functionStatus !== '02'
    // },
    // 是否是查看
    isDetail() {
      return this.pageState === 'view'
    },
    // 是否是编辑页面
    isEdit() {
      return this.pageState === 'edit'
    },
    // 判断是否是需要填写“试点架构”
    isNeedDept() {
      return ['02'].includes(this.editForm.pilotScope)
    }
  },
  methods: {
    async _getOneData(functionId) {
      const res = await fetchFindFunctionSwitchById(functionId)
      const data = {
        id: res.id,
        functionType: res.functionType,
        functionId: res.functionId,
        functionName: res.functionName,
        pilotScope: res.pilotScope,
        functionStatus: res.functionStatus,
        daterange: [res.startDate, res.endDate],
        experimentsOrgList: res.experimentsOrgList || [],
        years: res.yearList
      }
      // 设置初始名称
      this.cacheFunction = res.functionName
      if (res?.experimentsOrgList?.length) {
        // 设置树节点值数组
        data.lineAndOrgNameAll = res.experimentsOrgList.map((m) => `${m.blgStripLine}/${m.orgId}`)
      } else {
        data.lineAndOrgNameAll = []
      }
      return data
    },
    async _initData() {
      const { pageState } = this.$route.params
      this.pageState = pageState
      if (['edit', 'view'].includes(this.pageState)) {
        const id = this.$route.params?.id
        const functionId = this.$route.params?.functionId
        const data = await this._getOneData({ functionId })
        this.editForm = data
        !this.editForm.years && (this.$set(this.editForm, 'years', []))
      } else {
        this.editForm = {
          functionId: '',
          functionType: '',
          functionName: '',
          pilotScope: '',
          functionStatus: '',
          lineAndOrgNameAll: [],
          experimentsOrgList: [],
          years: []
        }
        this.$nextTick(() => {
          this.$refs.formRef.clearValidate()
        })
      }
    },
    handleBack() {
      closeCurrPageAndGoPath({ path: '/LaunchSetupManagement' })
      // addAllowKeepAlive('/LaunchSetupList')
      // this.$router.push({
      //   name: '功能开关',
      // })
    },
    handleDeptData() {
      let data = this.editForm?.lineAndOrgNameAll
      if (data?.length) {
        data = data.map((m) => {
          const blgStripLine = m.substr(0, m.indexOf('/'))
          const orgId = m.substr(m.indexOf('/') + 1)
          return { blgStripLine, orgId }
        })
      }
      return data
    },
    submit() {
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          this.saveLoading = true
          const data = {
            functionId: this.editForm.functionId,
            functionType: this.editForm.functionType,
            functionName: this.editForm.functionName,
            functionStatus: this.editForm.functionStatus,
            pilotScope: this.editForm.pilotScope,
            startDate: this.editForm.daterange[0],
            endDate: this.editForm.daterange[1],
            yearList: this.editForm.years
          }
          if (this.editForm.id) {
            data.id = this.editForm.id
          }
          if (this.isNeedDept && this.editForm?.lineAndOrgNameAll?.length) {
            data.experimentsOrgList = this.handleDeptData()
          } else {
            data.experimentsOrgList = []
          }
          // await fetchSaveFunctionSwitch({ request: data })
          fetchSaveFunctionSwitch({ request: data })
            .then((res) => {
              this.$message.success('操作成功！')
              this.handleBack()
            })
            .finally((res) => {
              this.saveLoading = false
            })
        }
      })
    },
    lineAndOrgRules() {
      return {
        required: this.isNeedDept,
        validator: (rule, value, cb) => {
          if (this.isNeedDept && (!this.editForm.lineAndOrgNameAll || !this.editForm.lineAndOrgNameAll.length)) {
            return cb(new Error('请选择架构范围'))
          }
          cb()
        },
        trigger: 'blur'
      }
    },
    handleAddYear() {
      this.editForm.years.push('')
    },
    handleRemoveYear(index) {
      this.editForm.years.splice(index, 1)
    }
  },
  // created () {
  //     console.log('xf-LaunchSetupForm:created')
  //     // this._initData()
  // },
  activated() {
    console.log('xf-LaunchSetupForm:activated')
    const params = this.$route.params
    if (params && Object.keys(params).length) {
      this._initData()
      this.$nextTick(() => {
        allowKeepAlive['/LaunchSetupForm'].routerName = this.pageStateMaping[this.pageState]
        this.$wenEvent.$emit('getTiele')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.LaunchSetupManagement__LaunchSetupForm {
  padding-top: 40px;
  background-color: #fff;
  .content-box {
    width: 800px;
    min-height: calc(100vh - 310px);

    margin: 50px auto 60px;
    .case-item .active {
      position: unset;
    }
  }
  :deep(.gc-select) {
    padding: 0;
    .el-select {
      width: 100%;
    }
  }
}

.year-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.year-content-container {
  width: 50%;
  margin-bottom: 10px;
}
</style>