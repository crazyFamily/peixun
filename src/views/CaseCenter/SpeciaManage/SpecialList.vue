<template>
  <div v-if="specialType">
    <div class="between">
      <el-input class="w-250" v-model="queryForm.searchText" @keyup.enter.native="query" placeholder="专题名称/创建人" />
      <div class="buttons">
        <el-button @click="reset" class="button-w80-h30">重置</el-button>
        <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
      </div>
    </div>

    <div class="items">
      <div class="add-item" @click="openAdd">
        <i class="el-icon-plus gc-uploader-icon"></i>
      </div>
      <div class="item" v-for="item in specialList" :key="item.zoneId">
        <div class="img-wrapper">
          <div class="img">
            <img :src="getSpecialImg(item.zoneImgUrl)" alt />
          </div>
          <div class="item-mask">
            <div>
              <el-button class="button-60-h30 button-orange" @click="openEdit(item)">编辑</el-button>
            </div>
            <div>
              <el-button class="button-100-h30 button-green" @click="copyH5UrlHandle(item)">复制H5链接</el-button>
            </div>
            <div>
              <el-button class="button-60-h30 button-pink" @click="delSpecial(item)">删除</el-button>
            </div>
            <div v-if="isScorePage">
              <el-button class="button-100-h30 button-green" @click="openReport(item)">评分报表</el-button>
            </div>
          </div>
        </div>

        <div class="item-content tintColor6">
          <div class="item-title">
            <span class="fz14 fontColor zoneName ellipsis">{{ item.zoneName }}</span>
            <span>{{ item.caseNumber }}个</span>
          </div>
          <p class="mt5">
            <span class="mr20">{{ item.createByName }}</span>
            <span>{{ item.createDate }}</span>
          </p>
        </div>
      </div>
      <div class="item hide" v-if="!specialList.length">
        <div class="img-wrapper"></div>
        <div class="item-content tintColor6">
          <div class="item-title">
            <span class="fz14"></span>
            <span>个</span>
          </div>
          <p class="mt5">
            <span>个</span>
          </p>
        </div>
      </div>
    </div>
    <gc-pagination class="between" :total="queryForm.total" :page-sizes="[5, 8]" :page-size="queryForm.pageSize" :current-page="queryForm.page" @sizeChange="sizeChange($event, queryForm, getList)" @currentChange="currentChange($event, queryForm, getList)" />
  </div>
</template>
<script>
export default {
  name: 'SpecialList'
}
</script>
<script setup>
import { resetObj, sizeChange, currentChange, getSpecialImg, addAllowKeepAlive, hintFrame, copyH5Url } from '@/util/utils'
import { ref, reactive, computed, watch, onActivated, onMounted } from 'vue'
import { fetchListZone, fetchDeleteZone, fetchFindZoneById } from '@/fetch/caseCenter'
import { Message } from 'element-ui'
import { useRouter, useRoute } from '@/router'

const router = useRouter()

const props = defineProps({
  specialType: {
    type: String,
    default: 'general' // general, score
  }
})

const data = reactive({
  general: {
    queryForm: {
      searchText: '',
      zoneType: 'case',
      total: 0,
      page: 1,
      pageSize: 5
    },
    list: [],
    fnList: fetchListZone,
    fnDelete: fetchDeleteZone,
    fnGetById: fetchFindZoneById
  },
  score: {
    queryForm: {
      searchText: '',
      zoneType: 'caseEva',
      total: 0,
      page: 1,
      pageSize: 6
    },
    list: [],
    fnList: fetchListZone,
    fnDelete: fetchDeleteZone,
    fnGetById: fetchFindZoneById
  }
})

let queryForm = ref(data[props.specialType].queryForm)
const _initQueryForm = type => {
  queryForm.value = data[type].queryForm
}
const specialList = computed(() => {
  return data[props.specialType]?.list || []
})
// 获取数据列表接口
const fnList = computed(() => {
  return data[props.specialType]?.fnList
})
// 删除接口
const fnDelete = computed(() => {
  return data[props.specialType]?.fnDelete
})
// 根据Id获取数据
const fnGetById = computed(() => {
  return data[props.specialType]?.fnGetById
})

function reset() {
  const zoneType = queryForm.value.zoneType
  resetObj(data[props.specialType].queryForm, {
    zoneType,
    total: 0,
    page: 1,
    pageSize: 5
  })
  getList()
}

function query() {
  queryForm.value.page = 1
  queryForm.value.pageSize = 5
  getList()
}

function openAdd() {
  const zoneType = queryForm.value.zoneType
  const params = { state: 'add', zoneType }
  addAllowKeepAlive('/AddSpecial')
  router.push({ name: '新增专题', params })
}

// 删除专题
function delSpecial(special) {
  hintFrame('确认要删除此记录吗？').then(() => {
    const { zoneId } = special
    fnDelete.value({ zoneId }).then(resData => {
      Message.success('删除成功')
      query()
    })
  })
}

// 复制H5链接
function copyH5UrlHandle(row) {
  try {
    console.log('行记录', row, row.zoneId)
    const subUrlPath = `/bsd/ams-rlm-tms-case-center/index.html#/special?zoneId=${row.zoneId}`
    copyH5Url(subUrlPath)
    Message.success('复制H5链接成功')
  } catch (e) {
    console.log('复制H5链接失败', e)
    Message.error(`复制H5链接失败: ${e}`)
  }
}

// 打开编辑页面
function openEdit(special) {
  const { zoneId } = special
  fnGetById.value({ zoneId }).then(resData => {
    resData.state = 'edit'
    addAllowKeepAlive('/AddSpecial')
    router.push({ name: '新增专题', params: resData })
  })
}
// 注册事件
const emits = defineEmits(['changeComp'])
// 打开评分报表
function openReport(item) {
  emits('changeComp', { flag: 'report', data: { zoneId: item.zoneId } })
}

function getList() {
  const params = queryForm.value
  fnList.value(params).then(resData => {
    const { list, total } = resData
    data[props.specialType].list = list
    data[props.specialType].queryForm.total = total
  })
}

const isScorePage = computed(() => {
  return props.specialType === 'score'
})

watch(
  () => props.specialType,
  n => {
    _initQueryForm(props.specialType)
    query()
  },
  { immediate: true }
)

onActivated(() => {
  const route = useRoute()
  const routeParams = route.params
  if (routeParams?.fromPage === 'AddSpecial' && routeParams?.operation === 'loadList') {
    query()
  }
})
</script>

<style lang="scss" scoped>
.items {
  display: flex;
  flex-wrap: wrap;
  .item,
  .add-item {
    width: calc((100% - 60px) / 3);
    margin-top: 30px;
    flex-wrap: wrap;
    margin-left: 30px;
    border: 4px solid #ffffff;
    box-shadow: 0 4px 8px rgba($color: #000000, $alpha: 0.18);
  }
  .add-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f6f7f7;
    cursor: pointer;
    i {
      font-size: 60px;
      font-weight: 100;
      color: #d2d2d2;
    }
  }
  .item {
    .img-wrapper {
      position: relative;
      width: 100%;
      height: 0px;
      overflow: hidden;
      padding-bottom: calc(100% * 133 / 390 + 0px);
      &:hover .item-mask {
        display: flex;
        flex-wrap: wrap;
      }
    }
    .img,
    .item-mask {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      justify-content: center;
      align-items: center;
      background-color: rgba($color: #000000, $alpha: 0.31);
      & > div {
        width: 100px;
        @media screen and (max-width: 320px) {
          width: calc(100% / 2);
        }
        text-align: center;
      }
    }
    .img {
      display: block;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .item-content {
      padding: 8px 15px 0;
      .zoneName {
        width: calc(100% - 30px);
      }
    }
    .item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  & > div:nth-child(3n + 1) {
    margin-left: 0 !important;
  }
}
</style>
