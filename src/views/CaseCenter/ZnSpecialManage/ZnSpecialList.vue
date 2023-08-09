<template>
  <div class="CaseCenter__ZnSpecialManage">
    <el-card>
      <div class="between">
        <div>
          <label>专题名称：</label>
          <el-input class="w-250" v-model="queryForm.zoneName" placeholder="专题名称" />
          <label style="margin-left: 50px;">创建人：</label>
          <el-input class="w-250" v-model="queryForm.umOrName" placeholder="创建人姓名/UM号" />
        </div>
        <div class="buttons">
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
          <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
        </div>
      </div>
      <div class="items">
        <div class="add-item" @click="openAdd">
          <i class="el-icon-plus gc-uploader-icon"></i>
        </div>
        <div class="item" v-for="item in znSpecialList" :key="item.zoneId">
          <div class="img-wrapper">
            <div class="img">
              <img v-if="item.zoneImgUrl" :src="item.zoneImgUrl"  alt />
              <img v-else src="@/assets/images/default-special.png" alt />
            </div>
            <div class="item-mask">
              <el-button class="button-60-h30 button-orange mr20" @click="openEdit(item)">编辑</el-button>
              <el-button class="button-100-h30 button-green mr20" @click="copyH5UrlHandle(item)">复制H5链接</el-button>
              <el-button class="button-60-h30 button-pink" @click="delSpecial(item)">删除</el-button>
            </div>
          </div>

          <div class="item-content tintColor6">
            <div class="item-title">
              <span class="fz14 fontColor zoneName ellipsis">
                {{ item.zoneName }}
              </span>
              <span>{{ item.znCourseNumber }}个</span>
            </div>
            <p class="mt5">
              <span class="mr20">{{ item.createByName }}</span>
              <span>{{ item.createDate }}</span>
            </p>
          </div>
        </div>
      </div>
			<gc-pagination
        class="between"
        :total="queryForm.total"
        :page-sizes="[5, 8]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.page"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
      />
    </el-card>
		
  </div>
</template>
<script>
export default {
  name: 'ZnSpecialList'
}
</script>
<script setup>
import { Message } from 'element-ui'
import { resetObj, sizeChange, currentChange, hintFrame, copyH5Url } from '@/util/utils'
// import { fetchListZone, fetchDeleteZone, fetchFindZoneById } from '@/fetch/caseCenter'
import { fetchListZnZone, fetchDeleteZnZone, fetchFindZnZoneById } from '@/fetch/caseCenter'
import { ref, reactive, computed, watch, onMounted, onActivated } from 'vue'

const queryForm = reactive({
  zoneName: '',
  umOrName: '',
  total: 0,
  page: 1,
  pageSize: 5
})
const znSpecialList = ref([])
function reset() {
	resetObj(queryForm, { total: 0, page: 1, pageSize: 5 })
  getList()
}
function query() {
	queryForm.page = 1
  queryForm.pageSize = 5
  getList()
}
// 获取列表
function getList() {
  const data = {
    request: {
      zoneName: queryForm.zoneName, // 专题名称
      umOrName: queryForm.umOrName  // 创建人um或姓名
    },
    page: queryForm.page,
    pageSize: queryForm.pageSize
  }
	fetchListZnZone(data).then(data => {
		const { list, total } = data
		znSpecialList.value = list
		queryForm.total = total
	})
}

// 注册事件
const emits = defineEmits(['changeComp'])
// 打开新增页面
function openAdd() {
  emits('changeComp', { flag: 'add', data: {} })
}
// 打开编辑页面
function openEdit (row) {
  fetchFindZnZoneById({ zoneId: row.zoneId }).then(res => {
    emits('changeComp', { flag: 'edit', data: res })
  })
}
// 复制H5链接
function copyH5UrlHandle (row) {
  try {
    // httts://test-b-dev.pingan.com.cn/bsd/brmsd-ac-training-study-h5/aladdin/index.html#/CourseZone?id=11
    console.log('行记录', row, row.zoneId)
    const subUrlPath = `/bsd/brmsd-ac-training-study-h5/aladdin/index.html#/CourseZone?id=${row.zoneId}`
    copyH5Url(subUrlPath)
    Message.success('复制H5链接成功')

  } catch (e) {
    console.log('复制H5链接失败', e)
    Message.error(`复制H5链接失败: ${e}`)
  }
}
// 删除专题
function delSpecial (row) {
  hintFrame('确认在删除此记录吗？').then(() => {
    const { zoneId } = row
    fetchDeleteZnZone({ zoneId }).then(res => {
      Message.success('删除成功')
      query()
    })
  })
	
}
// onMounted(() => {
//   console.log('onMounted')
// 	query()
// })
onActivated(() => {
  console.log('onActivated')
	query()
})



</script>

<style lang="scss" scoped>
.CaseCenter__ZnSpecialManage {
  .filter-wrapper {
    
  }
  .items {
    display: flex;
    flex-wrap: wrap;
    .item,
    .add-item {
    	min-height: 150px;
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
        &:hover {
          display: flex;
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
}
</style>
