<template>
  <div class="trainingCamp-container" :class="{ operate: isForbid }">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules" :disabled="isDetails || isForbid">
      <el-form-item label="训练营名称" prop="trainingName">
        <el-input v-model="form.trainingName" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="introduce">
        <el-input type="textarea" v-model="form.introduce" maxlength="500" :rows="5" resize="none"></el-input>
      </el-form-item>
      <el-form-item label="背景图" prop="backgroundUdmp">
        <div class="df background-wrapper">
          <gc-upload class="background-upload" single :size="1000" :udmpId.sync="form.backgroundUdmp"></gc-upload>
          <div class="tintColor ml10 upload-tips">
            <p>1.建议图片尺寸为（750*280px），可按比例（16:9）调整尺寸</p>
            <p>2.格式为jpg或png或jpeg</p>
            <p>3.图片不能大于1M</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="配置专区">
        <el-radio v-model="form.ifNotShow" label="N">否</el-radio>
        <el-radio v-model="form.ifNotShow" label="Y">是</el-radio>
        <template v-if="form.ifNotShow === 'Y'">
          <i class="el-icon-warning tips-color"></i>
          <span class="tips-color tips-text">内容将不在前端训练营列表展示</span>
        </template>
      </el-form-item>
      <el-form-item label="所属机构" prop="orgId">
        <gc-select w1 class="padding-0" k="orgName" v="orgId" :options="orgOptions" v-model="form.orgId"></gc-select>
      </el-form-item>
      <el-form-item label="班主任名称" width="100%" prop="classAdviserUms">
        <template v-for="(classAdviserUm, index) in form.classAdviserUms">
          <gc-select
            v-model="form.classAdviserUms[index]"
            filterable
            remote
            :remote-method="umQuerySearch"
            :options="options"
            k="label"
            v="value"
            class="input-width select-style"
            placeholder="请输入UM号/姓名"
            :key="index"
          ></gc-select>
          <span class="icons icons-style">
            <i class="instructor-icons__del__icon" v-if="index !== 0" @click="removeClassAdviserHandle(index)"></i>
          </span>
        </template>
        <p class="control-buttons">
          <span v-show="!isDetails" class="instructor-icons__add active" @click="addClassAdviserHandle">
            <i class="icons__add__icon"></i>
            添加
          </span>
        </p>
        <!-- <el-select v-model="form.classAdviserUms" multiple filterable remote :remote-method="umQuerySearch" placeholder="请输入UM号/姓名">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="培训时间" prop="date">
        <el-date-picker
          class="rms-daterange-picker input-width"
          type="daterange"
          placeholder="选择日期"
          v-model="form.date"
          value-format="yyyy-MM-dd"
          style="width: 100%"
          @input="handlerDateChanged"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="培养能力" prop="trainingAbility">
        <el-input
          type="textarea"
          placeholder="最多支持添加10个关键词，每个关键词限制10个字，关键词用“/”隔开，如：销售能力/沟通能力"
          v-model="form.trainingAbility"
          :rows="5"
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 不能删，会报错 -->
    <p v-show="false">{{ baseInfo }}</p>
  </div>
</template>

<script>
import { fetchUserInfos } from '@/fetch/public'
import { SET_BASE_INFO } from '@/store/trainingCamp'
import store from '@/store'
import { getOrg } from '../utils'
import { mapState } from 'vuex'
const fields = ['trainingName', 'introduce', 'backgroundUdmp', 'ifNotShow', 'orgId', 'classAdviserUms', 'startTime', 'endTime', 'trainingAbility']

export default {
  props: {
    isDetails: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    baseInfo() {
      const data = [...fields, 'classAdviserUmsArr'].reduce((obj, key) => ((obj[key] = store.state.trainingCamp[key]), obj), {})
      this.form = data
      this.options = (data['classAdviserUmsArr'] || []).map(({ um, name }) => ({
        value: um,
        label: `${name}(${um})`
      }))
      this.form.date = data.startTime && data.endTime ? [data['startTime'], data['endTime']] : ''
      return data
    },
    isForbid() {
      const { isDetails, operateStatus, eoaStatus } = this
      return isDetails || (operateStatus === 'modify' && eoaStatus === '02002')
    },
    ...mapState({
      operateStatus: (state) => state.trainingCamp.operateStatus,
      eoaStatus: (state) => state.trainingCamp.eoaStatus
    })
  },
  data() {
    return {
      orgOptions: [],
      form: {
        trainingName: '',
        introduce: '',
        backgroundUdmp: '',
        ifNotShow: 'N',
        orgId: '',
        classAdviserUms: [''],
        startTime: '',
        endTime: '',
        date: ''
      },
      rules: {
        trainingName: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 0, max: 20, message: '长度在 0 到 20个字符', trigger: 'blur' }
        ],
        orgId: [{ required: true, message: '机构不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
        date: [{ required: true, message: '培训时间不能为空', trigger: 'blur' }],
        classAdviserUms: [
          { required: true, message: '班主任不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.length > 10) return callback(new Error('班主任最多添加10个'))
              if (value.some((item) => !item)) return callback(new Error('存在未选择班主任'))
              // 校验重复数据
              if (new Set(value).size !== value.length) return callback(new Error('存在重复班主任'))
              return callback()
            },
            trigger: 'blur'
          }
        ],
        trainingAbility: [
          // { required: true, message: '培养能力不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) return callback()
              value = value.split('/')
              if (value.length > 10) return callback(new Error('课程关键词最多10个'))
              if (value.some((v) => v.length > 10)) {
                return callback(new Error('每个关键词长度不能大于10'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      options: []
    }
  },
  mounted() {
    getOrg().then((res) => {
      this.orgOptions = res
    })
  },
  watch: {
    form: {
      handler(newForm, oldForm) {
        store.commit(
          SET_BASE_INFO,
          fields.reduce((obj, key) => ((obj[key] = newForm[key]), obj), {})
        )
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handlerDateChanged(data) {
      !data && (data = ['', ''])
      const [startTime, endTime] = data
      this.form.startTime = startTime
      this.form.endTime = endTime
    },
    onSubmit() {
      console.log('submit!')
    },
    handleUmSelect(e) {
      console.log('handleUmSelect', e)
    },
    async umQuerySearch(queryString, cb) {
      if (!queryString) {
        this.ums = []
        return
      }
      const data = { empName: queryString, pageSize: '20' }
      let res = await fetchUserInfos({
        data
      })

      this.options = res.list.map(({ umId, empName }) => ({
        value: umId,
        address: empName,
        label: `${empName}(${umId})`
      }))
    },
    validator() {
      let result = false
      this.$refs['form'].validate((valid) => {
        result = valid
      })
      return { result }
    },
    addClassAdviserHandle() {
      this.form.classAdviserUms.push('')
    },
    removeClassAdviserHandle(index) {
      this.form.classAdviserUms.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.trainingCamp-container {
  padding: 4% 0;
  margin: 0 auto;
  width: 670px;
  :deep(.el-select) {
    width: 100%;
  }
  &.operate {
    pointer-events: none;
  }
}

:deep(.background-wrapper) {
  $base-bg-width: 375px;
  $base-bg-height: 140px;
  flex-wrap: wrap;
  .background-upload {
    width: $base-bg-width;
  }
  .el-upload {
    width: $base-bg-width;
    height: $base-bg-height;
    line-height: initial;
  }

  .el-upload .box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-icon-plus {
    display: inline-block;
    margin-bottom: 20px;
  }

  .text {
    top: 60%;
  }

  .el-upload-list--picture-card {
    margin-bottom: 10px;
    height: $base-bg-height;
  }

  .el-upload-list__item {
    width: $base-bg-width;
    height: $base-bg-height;
    line-height: initial;
  }
}

.upload-tips {
  min-width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 30px;
}

.select-style {
  padding: 0;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 15px;
  width: 50%;
}

.icons-style {
  width: 15px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
}

.control-buttons {
  .instructor-icons__add {
    margin-left: 0;
  }
}

.tips-color {
  color: #fd6720;
}

.tips-text {
  margin-left: 8px;
}
</style>