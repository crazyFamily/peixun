<template>
  <div class="plan-management__plan">
    <div class="detail-wrapper">
      <div class="live-info-container">
        <div class="container" v-for="(info, i) in baseInfo" :key="i">
            <p class="topbar">
              <span class="topbar-icon-wrapper">
                <img :src="info.icon" alt="" class="topbar-icon" />
              </span>
              {{info.label}}
            </p>
            <p class="info">{{info.value}}</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { onMounted,reactive, ref, watch } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { fetchReportCommunicateComment } from '@/fetch/establish'
import { CopyObj } from '@/plugins/until'

const props = defineProps({
  subjectInfo: {
    type: Object,
    required: true
  }
})
onMounted(async () => {
  getCommnicateBaseInfo()
})
// 获取计划数据
const getCommnicateBaseInfo = async () => {
  const data = formatParams(props.subjectInfo)
  const  res  = await fetchReportCommunicateComment({ data })
  Object.keys(res).forEach(key => {
    baseInfo.value.find(row => row.prop === key) && (baseInfo.value.find(row => row.prop === key).value = res[key])
  })
}
// 拉取明细数据
const baseInfo = ref([
  {
    label: '总条数',
    prop: 'commentCount',
    icon: require('@/assets/svg/mixins-training/web_sum_green_icon.svg'),
    value: 0
  },
  {
    label: '一级评论条数',
    prop: 'lvlOnoCommentCount',
    icon: require('@/assets/svg/mixins-training/web_comment_red_icon.svg'),
    value: 0
  },
  {
    label: '回复条数',
    prop: 'lvlTwoCommentCount',
    icon: require('@/assets/svg/mixins-training/web_reply_yellow_icon.svg'),
    value: 0
  },
  {
    label: '点赞数',
    prop: 'likeCount',
    icon: require('@/assets/svg/mixins-training/web_praise_blue_icon.svg'),
    value: 0
  },
  {
    label: '评论人数（去重）',
    prop: 'commentNum',
    icon: require('@/assets/svg/mixins-training/web_headcount_blue_icon.svg'),
    value: 0
  },
  {
    label: '一级评论人数（去重）',
    prop: 'lvlOnoCommentNum',
    icon: require('@/assets/svg/mixins-training/web_people_red_icon.svg'),
    value: 0
  },
  {
    label: '回复人数（去重）',
    prop: 'lvlTwoCommentNum',
    icon: require('@/assets/svg/mixins-training/web_people_blue_icon.svg'),
    value: 0
  },
  {
    label: '点赞人数（去重）',
    prop: 'likeNum',
    icon: require('@/assets/svg/mixins-training/web_people_yellow_icon.svg'),
    value: 0
  }
])
const formatParams = (params) => {
  const data = {}
  data.businessId = params.businessId
  data.subjectId = params.subjectId
  data.subjectType='class'
  return data
}
</script>
<script>
export default {
  name: 'CommunicateBaseInfo'
}
</script>

<style lang='scss' scoped>
.info-wrapper {
  display: flex;
  margin: 20px;

  .container {
    flex: 1;
    padding-right: 2%;
  }

  .info-title {
    width: 100%;
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin-bottom: 15px;

    .label {
      position: relative;
      background-color: unset;
      z-index: 1;
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 40%;
        background: $themeColor;
        opacity: 30%;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: -1;
      }
    }
  }

  .container:last-child {
    padding-right: 0;
    padding-left: 3%;

    .items::after{
      display: none;
    }
  }

  .items {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;
    color: #333;
    &::after {
      content: '';
      display: block;
      width: 1px;
      height: 70px;
      background-color: #EAECF1;
      position: absolute;
      right: -5%;
      top: 50%;
      transform: translateY(-50%);
    }

    .item {
      position: relative;
      width: 254px;
      height: 130px;
      background: #F8F8F8;
      border-radius: 4px;
    }

    .item.line::after {
      content: '';
      display: block;
      width: 1px;
      height: 30px;
      background-color: #EAECF1;
      position: absolute;
      right: -40%;
      top: 50%;
      transform: translateY(-50%);
    }

    .value {
      font-size: 20px;
      display: block;
      margin: 5px 0;
      font-weight: 400;
      &.bigger {
        font-size: 30px;
        font-weight: 500;
      }
    }

    .label {
      display: block;
      margin: 5px 0;
    }
  }
}
.plan-package-state {
  margin-top: -1px;
  .wrap {
    border: 1px solid #eaecf1;
    .title-box {
      display: flex;
      height: 40px;
      padding: 0 20px;
      background-color: #f7f8fa;
      color: #7d8292;
      line-height: 40px;
      justify-content: space-between;
    }
  }
}

.live-info-container {
  width: 1100px;
  height: 300px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  // grid-template-columns: ;

  .container {
    margin: 5px;
    background: #F8F8F8;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // width:254px;
    // height:130px;
    border-radius: 4px;
    .topbar {
      width:140px;    
      text-align: left;
      font-size: 14px;
      color: rgba(0,0,0,0.40);
      position: relative;
    }

    .topbar-icon-wrapper {
      width: 40px;
      height: 40px;
      background: #fff;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -10px;
      left: -50px;

      .topbar-icon {
        width: 20px;
        height: 20px;
      }
    }

    .info {
      margin-top: 15px;
      font-size: 28px;
      color: rgba(0,0,0,0.80);
    }
  }
}
</style>
