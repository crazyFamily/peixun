<template>
  <div class="information-container">
    <el-tabs v-model="activeName" class="information-nav">
      <template v-for="(item, index) in informationTypes">
        <el-tab-pane
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </template>
    </el-tabs>
    <component :is="activeName" :activate.sync="activate"></component>
  </div>
</template>

<script>
import APPInfo from './CompAPPInfo.vue'
import PCInfo from './CompPCInfo.vue'
import SystemLog from './CompSystemLog.vue'
import Banner from './CompBanner.vue'
export default {
  name: 'InformationManament',

  props: {},

  data() {
    return {
      activeName: 'APPInfo',
      informationTypes: [
        {
          label: 'APP资讯',
          value: 'APPInfo'
        },
        {
          label: '首页资讯',
          value: 'PCInfo'
        },
        {
          label: 'banner管理',
          value: 'Banner'
        },
        {
          label: '系统更新日志',
          value: 'SystemLog'
        }
        // {
        //     label: "常见问题",
        //     value: "questions"
        // },
        // {
        //     label: "首页banner",
        //     value: "banner"
        // }
      ],
      activate: false
    }
  },

  components: {
    APPInfo,
    PCInfo,
    SystemLog,
    Banner
  },

  computed: {},

  mounted() {},

  methods: {},

  activated() {
    this.activate = true
  }
}
</script>
<style lang="scss" scoped>
.information-container {
  height: 100%;
}
.information-nav {
  margin-bottom: 10px;
  background-color: #fff;
  :deep(.el-tabs__header) {
    margin: 0;
  }
}
</style>