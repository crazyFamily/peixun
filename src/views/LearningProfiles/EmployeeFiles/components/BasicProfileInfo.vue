<template>
  <div class="basicProfileInfo">
    <div class="basic-info">
      <div class="user-info-icon">
        <img :src="userInfo.avatar || defaultAvatar" alt="" />
      </div>
      <div class="user-info">
        <div class="user-name"><span class="mr15">{{userInfo.empName}}</span><span class="um">{{userInfo.umId}}</span></div>
        <div class="desc">
          <span class="department">{{userInfo.orgName}}</span>
          <span class="line">|</span>
          <span class="department">{{userInfo.postDesc}}</span>
          <span class="line">|</span>
          <span class="division-age">司龄{{userInfo.hireAge}}年</span>
        </div>
      </div>
    </div>
    <div class="year-range">
      <el-tabs v-model="activeYear" type="card" @tab-click="changeTabs" class="year-tabs">
        <el-tab-pane v-for="item in yearList" :key="item.value" :label="item.label" :name="item.value">
          <div slot="label" class="year" :class="{alone: yearList.length === 1}">{{ item.value }}</div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const activeYear = ref('')
const emits = defineEmits(['change'])
const defaultAvatar = require('@/assets/images/staff-male.png')
const props = defineProps({
  yearList: [],
  currentYear: {
    type: String,
    default: ''
  },
  userInfo: {}
})
watch(
  () => props.currentYear,
  (n) => {
    activeYear.value = n
  },
  {
    immediate: true
  }
)
const changeTabs = (val) => {
  emits('change', val.name)
}
</script>

<script>
export default {
  name: 'BasicProfileInfo'
}
</script>
<style lang="scss" scoped>
.basicProfileInfo {
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0px 2px 5px 0px rgba(188, 188, 188, 0.08);
  border-radius: 2px;
  .basic-info {
    margin: 20px 26px;
    display: flex;
    align-items: center;
    .user-info-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user-info {
      .user-name {
        font-family: 'PingFangSC-Medium', arial;
        font-size: 18px;
        color: #000000;
        font-weight: 500;
        margin-bottom: 4px;
        .um {
          font-family: 'PingFangSC-Regular', arial;
          font-size: 18px;
          color: #000000;
          font-weight: 400;
        }
      }
      .desc {
        font-family: P 'ingFangSC-Regular', arial;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        font-weight: 400;
        .line {
          margin: 0 4px;
        }
      }
    }
  }
  .year-range {
    // width: 344px;
    margin-left: 26px;
    margin-bottom: 14px;
    .year {
      font-family: 'PingFangSC-Regular', arial;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 400;
    }
    :deep(.el-tabs__header) {
      border: 0 none !important;
      padding-left: 0 !important;
      height: 40px !important;
      margin-bottom: 0;
    }
    :deep(.el-tabs__nav) {
      border: 0 none !important;
    }
    :deep(.el-tabs__item) {
      padding: 0 !important;
      height: 40px !important;
      line-height: 40px !important;
      text-align: center;
      border: 0 none !important;
    }
    .year {
      height: 100%;
      width: 96px;
      background: #f7f8fa;
      border-width: 1px 1px 1px 0px;
      border-style: solid solid solid;
      box-sizing: border-box;
      border-color: rgb(220, 223, 230) rgb(220, 223, 230) rgb(220, 223, 230);
    }
    :deep(.el-tabs__item:first-child) .year {
      box-shadow: none !important;
      border-left: 1px solid rgb(220, 223, 230);
      border-radius: 4px 0px 0px 4px;
    }
    :deep(.el-tabs__item:last-child) .year {
      border-radius: 0px 4px 4px 0px;
    }

    :deep(.el-tabs__item:last-child) .year.alone {
      border-radius: 4px;
    }
    :deep(.el-tabs__item.is-active) .year {
      color: #fff;
      background-color: #fd6720;
      box-shadow: #fd6720 -1px 0px 0px 0px;
      border-color: #fd6720;
    }
    :deep(.is-scrollable) {
      padding: 0 28px;
    }
    :deep(.el-tabs__nav-next),
    :deep(.el-tabs__nav-prev) {
      font-size: 16px;
      line-height: 40px;
    }
  }
}
</style>