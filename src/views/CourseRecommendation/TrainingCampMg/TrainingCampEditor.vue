<template>
  <div class="training-camp_container">
    <section class="training-camp_content">
      <gcSteps :active="active" :list="stepList"></gcSteps>
      <TrainingCampBaseInfo ref="TrainingCampBaseInfo" :isDetails="isDetails" v-show="active === 0"></TrainingCampBaseInfo>
      <TrainingCampScheduleSet
        v-model="scheduleInfo"
        ref="TrainingCampScheduleSet"
        :isDetails="isDetails"
        :disabled="isDetails"
        :ifNotShow="ifNotShow"
        v-show="active === 1"
      ></TrainingCampScheduleSet>
      <TrainingCampApproval ref="TrainingCampApproval" :isDetails="isDetails" v-show="active === 2"></TrainingCampApproval>
    </section>
    <section class="training-camp_footer pb20">
      <el-button class="button-w80-h30" @click="cancel">取消</el-button>
      <el-button class="button-w80-h30" @click="submitSave('Y')" v-show="active === 2 || isModify" v-if="!isDetails">保存草稿</el-button>
      <el-button class="button-w80-h30" @click="preStep" v-if="active !== 0">上一步</el-button>
      <el-button
        class="button-w80-h30"
        type="primary"
        @click="submitSave('N')"
        v-show="active === 2"
        v-if="!isDetails"
        :disabled="isDetails || isSubmit"
        >提交</el-button
      >
      <el-button class="button-w80-h30" type="primary" v-if="active !== 2" @click="nextStep">下一步 </el-button>
    </section>
  </div>
</template>

<script>
export const SET_APPROVAL_LIST = 'SET_APPROVAL_LIST'
import { closeCurrPage, setPageTitle } from '@/util/utils'
import { mapMutations, mapActions, mapState } from 'vuex'
import {
  SET_TRAINING_LIST,
  SET_APPROVAL_INFO,
  SET_TRAINEE_INFO,
  UPDATE_DETAIL,
  SAVE_DRAFT,
  CLEAN_ERR,
  SET_ERR,
  SUBMIT,
  CLEAR,
  defaultData
} from '@/store/trainingCamp'
import store from '@/store'
import gcSteps from './../../CourseRecommendation/components/gc-steps.vue'
import TrainingCampBaseInfo from './TrainingCampBaseInfo.vue'
import TrainingCampScheduleSet from './TrainingCampScheduleSet.vue'
import TrainingCampApproval from './TrainingCampApproval.vue'
export default {
  name: 'CRTrainingCampEditor',
  components: {
    gcSteps,
    TrainingCampBaseInfo,
    TrainingCampScheduleSet,
    TrainingCampApproval
  },
  data() {
    return {
      params: {},
      active: 0,
      stepList: ['基本信息', '课表设置', '提交审批'],
      basicForm: {
        trainCampName: '',
        description: '',
        backgroundImg: '',
        classTeacher: '',
        trainTime: '',
        trainPower: ''
      },
      isDetails: false,
      isCopy: false,
      isModify: false,
      isSubmit: false,
      scheduleInfo: [],
      ifNotShow: 'N'
    }
  },
  activated() {
    const { params } = this.$route
    const { name, id, operate } = params
    console.log('params', params)
    if (operate && id) {
      if (operate === 'modify') {
        this.isModify = true
        setPageTitle(`编辑：${name}`)
      } else if (operate === 'details') {
        this.isDetails = true
        setPageTitle(`详情：${name}`)
      } else if (operate === 'copy') {
        this.isCopy = true
        setPageTitle(`复制：${name}`)
      }
      this.getDetailData({ id, copy: this.isCopy })
    }
    console.log(operate, '===>>>');
    if (operate === 'add') {
      setPageTitle(`新增训练营`)
    }
    this.$wenEvent.$emit('getTiele')
    this.params = params
  },
  methods: {
    // 可删除
    ...mapMutations([SET_TRAINING_LIST, SET_APPROVAL_INFO, SET_TRAINEE_INFO, UPDATE_DETAIL]),
    ...mapActions({
      submit: SUBMIT // 将 `this.submit()` 映射为 `this.$store.dispatch('SUBMIT')`
    }),
    ...mapActions(['getDetailData']),
    cancel() {
      store.commit(CLEAR, defaultData())
      closeCurrPage()
    },

    async submitSave(type) {
      if (this.isSubmit) return
      // console.log(this.$refs.TrainingCampScheduleSet.exportSecheduleInfo(), this.$refs.TrainingCampBaseInfo, 'TrainingCampScheduleSet ===>')
      const trainingResultDatas = (await this.$refs.TrainingCampScheduleSet.exportSecheduleInfo()).datas
      // return
      // TODO: 把数据存到vuex上去
      this.isSubmit = true
      // const trainingResultDatas = this.$refs.TrainingCampScheduleSet.exportSecheduleInfo().datas
      console.log(trainingResultDatas, '====> trainingResultDatas')
      store.commit(SET_APPROVAL_LIST, trainingResultDatas)
      store.commit(SET_TRAINING_LIST, trainingResultDatas)

      const { trainingCampId, operateStatus } = this
      const id = operateStatus === 'add' ? null : trainingCampId
      console.log('trainingCampId', trainingCampId)
      const refs = ['TrainingCampBaseInfo', 'TrainingCampScheduleSet', 'TrainingCampApproval']
      const data = refs.map((key) => {
        // TODO: 要做训练营的表单数据校验
        if (key === 'TrainingCampScheduleSet') return true
        // TODO: end
        const { result } = this.$refs[key].validator()
        return result
      })
      if (!data.every((item) => item)) {
        this.isSubmit = false
        return
      }
      // bugfix: 这里如果是复制状态的话，需要手动把id给去除，否则会受id影响变成了编辑
      this.submit({ type, id: this.isCopy ? null : id })
        .then((res) => {
          this.$message.success('新增成功！')
          store.commit(CLEAR, defaultData())
          closeCurrPage()
        })
        .catch((error) => {})
        .finally(() => {
          this.isSubmit = false
        })
    },
    async validatorSonData(active) {
      let result = []
      switch (active) {
        case 0:
          result[0] = this.$refs['TrainingCampBaseInfo'].validator()
          break
        case 1:
          await this.$refs.TrainingCampScheduleSet.exportSecheduleInfo()
          result[1] = { result: true }
          break
        case 2:
          result[2] = this.$refs['TrainingCampApproval'].validator()
          break
        default:
          break
      }
      return result
    },
    preStep() {
      this.active--
    },
    async nextStep() {
      try {
        const { active, stepList, isDetails } = this
        if (active === 0) {
          this.ifNotShow = this.$refs.TrainingCampBaseInfo._data.form.ifNotShow
          console.log(this.ifNotShow)
        }
        if (isDetails) {
          this.active++
          return
        }
        const formResult = await this.validatorSonData(active)
        console.log('formResult[active]', formResult[active], active)
        if (formResult[active].result) {
          this.active++
          console.log(this.active)
          // store.commit(CLEAN_ERR, { active })
          store.commit(SET_ERR, null)
        } else {
          active !== 1 && this.$message.warning(`${stepList[active]}校验错误`)
          // store.commit(SET_ERR, { [active]: `${stepList[active]}校验错误` })
          store.commit(SET_ERR, `${stepList[active]}校验错误`)
          console.log(stepList, active, '=====> ')
        }
      } catch (e) {
        console.log('secheduleInfoValidator error')
      }
    }
  },
  computed: {
    ...mapState({
      trainingCampId: (state) => state.trainingCamp.id,
      operateStatus: (state) => state.trainingCamp.operateStatus
    })
  }
}
</script>

<style lang="scss" scoped>
.training-camp_container {
  background: #fff;
  & .training-camp_content {
    padding-top: 20px;
  }
  & .training-camp_footer {
    text-align: center;
  }
}
</style>