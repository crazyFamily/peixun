<template>
  <div class="case-push-report">
    <el-card class="mb10">
      <p class="title">推送名称：{{ casePushName }}</p>
      <div class="report-info-container">
        <div class="info-item" v-for="(item, index) in reportInfo" :key="index">
          <p v-if="item.key === 'finishUserNum'" slot="label" class=" label">{{ item.label }}
            <el-tooltip placement="bottom" popper-class="table-popper" effect="light">
              <div slot="content" style="width: 280px">
                <p class="mt5">此次被推送的案例都完成的用户，统计为已完成</p>
              </div>
              <i class="el-icon-question active"></i>
            </el-tooltip>
          </p>
          <p v-else class="label">{{ item.label }}</p>
          <p class="value" :class="{ light: item.light }">{{ item.value }}</p>
        </div>
      </div>
    </el-card>
    <div class="main-container">
      <el-tabs v-model="activeName" class="nav-tab">
        <el-tab-pane label="按案例" name="case">
          <report-by-case
            :id="`${casePushId}-${new Date().getTime()}`"
            @toDetail="caseToDetailHandle"
            ref="reportByCaseRef"
          ></report-by-case>
        </el-tab-pane>
        <el-tab-pane label="按人" name="user">
          <report-by-user
            :id="`${casePushId}-${new Date().getTime()}`"
            ref="reportByUserRef"
          ></report-by-user>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
    </div>
  </div>
</template>

<script>
import CompReportByCase from './CompReportByCase'
import CompReportByUser from './CompReportByUser'
import { fetchQryCasePushReportData } from '@/fetch/caseCenter'
export default {
  name: 'CasePushIndex',

  props: {},

  data() {
    return {
      activeName: '',
      isShowDetail: false,
      detailData: {},
      reportInfo: [
        { label: '推送方式', key: 'pushType', value: '', light: true },
        { label: '推送人数', key: 'pushUserNum', value: '' },
        { label: '学习人数', key: 'learnedUserNum', value: '' },
        { label: '完成人数', key: 'finishUserNum', value: '' },
        { label: '学习率', key: 'learnedRate', value: '' },
        {
          label: '完成率',
          key: 'finishRate',
          value: ''
        }
      ],
      casePushId: null,
      casePushName: '',
      randomKey: Math.random()
    }
  },

  components: {
    'report-by-case': CompReportByCase,
    'report-by-user': CompReportByUser
  },

  computed: {},

  mounted() {
    this.activeName = 'case'
  },

  methods: {
    async _getInfoData(id) {
      let res = await fetchQryCasePushReportData({ id })
      this.reportInfo.forEach((item) => {
        item.value = res[item.key]
      })
    },
    reset() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.$refs.reportByCaseRef.reset()
      this.$refs.reportByUserRef.reset()

      // this.$nextTick(() => {
      //   this.$refs.formRef.clearValidate()
      // })
    },
    closeHandle() {
      this.reset()
      this.randomKey = Math.random()
      this.$router.push({ name: '案例推送列表' })
    },
    caseToDetailHandle(row) {
      this.$emit('change', 'detail', row)
    }
  },
  activated() {
    if (this.$route.params.isNew) {
      this.reset()
    }
    this.casePushId = this.$route.params.id || this.casePushId
    this.casePushName = this.$route.params.casePushName || this.casePushName
    if (!this.casePushId) {
      this.closeHandle()
      return
    }

    !this.activeName && (this.activeName = 'case')
    this._getInfoData(this.casePushId)
  }
}
</script>
<style lang='scss' scoped>
.main-container {
  background-color: #fff;
}

.report-info-container {
  margin-top: 20px;
  display: flex;

  .info-item {
    position: relative;
    flex: 1;
    text-align: center;
    box-sizing: border-box;
    padding: 0 10px;
    &::after {
      content: '';
      display: block;
      width: 1px;
      height: 30px;
      background-color: $line-color;
      position: absolute;
      top: 15px;
      right: 0;
    }
    &:last-child {
      &::after {
        display: none;
      }
    }

    .label {
      font-size: 14px;
    }

    .value {
      margin: 10px 0;
      font-size: 25px;
    }

    &:first-child {
      .value {
        font-size: 22px;
      }
    }

    .value.light {
      color: $themeColor;
    }
  }
}

.nav-tab {
  :deep(.el-tabs__header) {
    margin: 0;
  }
}
</style>
