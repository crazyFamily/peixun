<template>
  <el-card class="accessory-info">
    <div class="title">
      <div class="title__menu"></div>
      附件信息 <span class="sec-title">（签报将自动生成计划明细表，无需重复上传）</span>
    </div>
    <div class="menu-right">
      <gc-fileInput width="auto" @change="accessoryChange">
        <span class="icons__add active">
          <i class="icons__add__icon"></i>
          新增
        </span>
      </gc-fileInput>
      <span class="icons__del last active" @click="delAccessory">
        <i class="icons__del__icon"></i>
        删除
      </span>
    </div>
    <table-pagination class="general__table mt20" @selection-change="handleSelectionChange" :query-form="{}" :list="accessoryList" :tableList="accessoryTableList" hide-pagination ref="accessoryTableRef">
      <el-table-column label="操作" min-width="124">
        <template v-slot="scope">
          <span class="active mr10" @click="delOneAccessory(scope.$index)">
            <el-tooltip content="删除" popper-class="icon-popper">
              <i class="operation__del"></i>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
    </table-pagination>
  </el-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { uploadFile } from '@/util/utils'
import { Message } from 'element-ui'
import store from '@/store'
const accessoryList = [
  {
    type: 'selection',
    width: '54'
  },
  {
    type: 'index',
    label: '序号',
    width: '64'
  },
  {
    label: '附件名称',
    width: '748',
    prop: 'fileName'
  }
]

// 文件上传
const accessoryTableList = ref([])
watch(
 () => store.getters['planManagement/getAccessoryFiles'],
  (n) => {
    accessoryTableList.value = n
  }
)

const updateFileDatas = (files) => {
  store.commit('planManagement/updateAccessoryFiles', files)
}

const accessoryChange = async ($event) => {
  const files = $event.target.files[0]
  if (!files) return
  const { code, data } = (await uploadFile({ files, reimClass: '', busiId: '' }))?.data
  if(code === 0) {
    updateFileDatas(accessoryTableList.value.concat(data))
  }
}

const selectedList = ref([])
// 选择操作
const handleSelectionChange = (list) => {
  selectedList.value = list
}

// 批量删除
const delAccessory = () => {
  if(!selectedList.value.length) return Message.warning('请至少选择一项')
  updateFileDatas(accessoryTableList.value.filter(v => selectedList.value.findIndex(row => row.udmpId === v.udmpId) === -1))
}

// 单个删除
const delOneAccessory = (index) => {
  accessoryTableList.value.splice(index, 1)
}
</script>
<script>
export default {
  name: "AnnualAccessoryFiles"
}
</script>

<style lang='scss' scoped>
  .accessory-info {
    margin-top: -1px;
    border-top: 1px dashed #eaecf1;
    background-color: #fff;
  }
  .required-style {
    &::before {
      content: '*';
      color: #f54e1e;
    }
  }

  .sec-title {
    color: #7d8292;
    font-size: 12px;
  }
</style>
