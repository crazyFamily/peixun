<template>
  <div class="config">
    <el-card>
      <div class="page-nav mb20">
        <el-radio-group v-model="activeTab" size="small">
          <el-radio-button v-for="item in orgConfigTabList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="mb20">
        <el-button @click="editConfig">编辑</el-button>
      </div>
      <div class="page-list">
        <el-table :data="tableList" class="config-table">
          <el-table-column :label="orgConfigTabList.find(v => v.value === activeTab).label + '子机构'">
            <template slot-scope="scope">
              <span>{{ scope.row.orgName }}</span>
            </template>
          </el-table-column>
          <el-table-column class="max100" width="140" label="配置对应分行">
            <template slot="header">
              <div></div>
            </template>
            <template>
              <div class="arrow">
                <div class="left"></div>
                <div class="center"></div>
                <div class="right"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="配置对应分行">
            <template slot-scope="scope">
              <div v-show="!isEditStatus">{{ scope.row.configOrgName }}</div>
              <div v-show="isEditStatus" class="edit-cont">
                <el-cascader
                  style="max-width: 400px;min-width: 300px;"
                  :show-all-levels="false"
                  clearable
                  v-model="scope.row.editConfigOrgId"
                  :options="branchList"
                  :props="{
                    label: 'orgName',
                    value: 'orgId'
                  }"
                >
                </el-cascader>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div v-show="isEditStatus" class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="saveHandle">确定</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, reactive, onMounted } from 'vue'
import { Message } from 'element-ui'
import { fetchListOrgConfig, fetchListOrgZone, fetchEditOrgConfig } from '@/fetch/statementCentre'
const activeTab = ref('S000003999')
const orgConfigTabList = [
  {
    label: '汽融中心',
    value: 'S000003999'
  },
  {
    label: '信用卡中心',
    value: 'S000000271'
  }
]
const tableList = ref([])
const branchList = ref([
  {
    orgId: '直辖区',
    orgName: '直辖区',
    orgDesc: 'directOrg',
    children: []
  },
  {
    orgId: '南区分行',
    orgName: '南区分行',
    orgDesc: 'sourthOrg',
    children: []
  },
  {
    orgId: '北区分行',
    orgName: '北区分行',
    orgDesc: 'northOrg',
    children: []
  },
  {
    orgId: '东区分行',
    orgName: '东区分行',
    orgDesc: 'eastOrg',
    children: []
  }
])
const isEditStatus = ref(false)
const editConfig = () => {
  isEditStatus.value = true
  tableList.value.forEach(v => {
    if (v.configOrgId) {
      branchList.value.forEach(m => {
        m.children.forEach(s => {
          if (v.configOrgId === s.orgId) v.editConfigOrgId = [m.orgId, v.configOrgId]
        })
      })
    } else {
      v.editConfigOrgId = []
    }
  })
}
const getList = async () => {
  const { list } = await fetchListOrgConfig({ orgId: activeTab.value })
  list?.forEach(v => {
    v.editConfigOrgId = []
  })
  tableList.value = list
}
const tablePaginationRef = ref(null)
const closeHandle = () => {
  isEditStatus.value = false
}
const saveHandle = async () => {
  const submitOrgList = tableList.value.map(v => ({
    orgId: v.orgId,
    configOrgId: v.editConfigOrgId?.[1]
  }))
  const res = await fetchEditOrgConfig({
    orgId: activeTab.value,
    data: submitOrgList
  })
  if (res) {
    Message.success('操作成功')
    isEditStatus.value = false
    getList()
  }
}
const getListOrgZone = async () => {
  const res = await fetchListOrgZone()
  branchList.value.forEach(v => {
    v.children = res[v.orgDesc]
  })
}
watch(activeTab, n => {
  isEditStatus.value = false
  getList()
})
onMounted(() => {
  getList()
  getListOrgZone()
})
</script>
<script>
export default {
  name: 'NewStaffTrainConfig'
}
</script>
<style lang="scss" scoped>
.config {
  :deep(.el-table th:first-of-type .cell) {
    padding-left: 15px;
    display: initial;
  }
  :deep(.el-table th:not(:first-child):before) {
    position: initial;
  }
  :deep(.el-table td:first-of-type .cell) {
    padding-left: 15px;
    display: initial;
  }
  &-table :deep(th.el-table__cell.is-leaf:nth-child(2)) {
    background-color: #fff !important;
  }
  .max100 {
    max-width: 100px;
  }
  .arrow {
    display: flex;
    justify-items: center;
    align-items: center;
    .left,
    .right {
      border: 5px solid transparent;
      width: 0;
      height: 0;
    }
    .left {
      border-right-color: #ddd;
    }
    .right {
      border-left-color: #ddd;
    }
    .center {
      flex: 1;
      height: 2px;
      background-color: #ddd;
    }
  }
  .edit-cont {
    position: relative;
  }
}
</style>