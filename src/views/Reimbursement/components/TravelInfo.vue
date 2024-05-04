<template>
  <div class="TravelInfo">
     <div class="
          LaunchTrainingCourse__info-card__reimbursement__travel__title
          LaunchTrainingCourse__title
          vice-title ">
        <div class="LaunchTrainingCourse__title__left-small">
          <div>.</div>
          出差信息
        </div>
        <div v-show="!disabled"  class="icons">
          <span class="icons__upload" @click="travelInfoImport = true">
            <i class="icons__upload__icon"></i>
            批量导入
          </span>
          <span class="icons__add" @click="travelInfoSelectStaffVisible = true" >
            <i class="icons__add__icon"></i>
            新增
          </span>
          <span class="icons__del" @click="delTravelInfoOneItem">
            <i class="icons__del__icon"></i>
            删除
          </span>
        </div>
      </div>
      <div class="LaunchTrainingCourse__info-card__reimbursement__travel__content table__wrapper " >
        <div class="width-fit">
          <el-table :span-method="arraySpanMethod" show-summary :summary-method="getSummaries" :data="travelInfoTable" ref="travelInfoTableRef">
            <el-table-column type="selection" width="54" />
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column label="出差人" min-width="70" prop="tripPersonName" />
            <el-table-column label="人数" min-width="70" prop="tripPersonNum" />
            <el-table-column label="机票张数" min-width="70">
              <template slot-scope="scope">
                <gc-input :disabled="disabled" placeholder="" v-model.trim="scope.row.planTicketNum" />
              </template>
            </el-table-column>
            <el-table-column label="其他交通票数" min-width="70">
              <template slot-scope="scope">
                <gc-input :disabled="disabled" placeholder="" v-model.trim="scope.row.otherTrafficNum" />
              </template>
            </el-table-column>
            <el-table-column label="出差开始日期" min-width="100">
              <template slot-scope="scope">
                <el-date-picker :disabled="disabled"
                  class="LaunchTrainingCourse__date"
                  v-model="scope.row.tripStartDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :picker-options="{ disabledDate: startDisabledDate.bind(this, scope.row) }"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="出差结束日期" min-width="100">
              <template slot-scope="scope">
                <el-date-picker :disabled="disabled"
                  class="LaunchTrainingCourse__date"
                  v-model="scope.row.tripEndDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :picker-options="{ disabledDate: endDisabledDate.bind(this, scope.row) }"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="出差天数" min-width="70">
              <template slot-scope="scope">
                {{ daysApart( scope.row.tripEndDate, scope.row.tripStartDate ) + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="出差地点" min-width="185">
              <template slot-scope="scope">
                <gc-input v-if="disabled" disabled v-model="scope.row.tripPlace"></gc-input>
                <el-cascader v-else clearable 
                  v-model="scope.row.tripPlace"
                  :options="cityOptions"
                  :props="{ label: 'siteName', value: 'siteNo' }"
                  @change="handleCityChange"
                ></el-cascader>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    <!-- 差旅信息-选择人员 dialog状态 -->
    <gc-model
      class="LaunchTrainingCourse__common-dialog"
      cancelText=""
      confirmText="选择"
      title="选择人员"
      :visible="travelInfoSelectStaffVisible"
      width="800px"
      @close="travelInfoSelectStaffClose()"
      @comfirm="travelInfoSelectStaffComfirm">
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left" >
          <gc-input class="left" label="出差人" placeholder="请输入姓名/UM号" v-model="travelInfoForm.name" />
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button class="button-60-blue-primary" @click="travelInfoFormClickQuery">查询</el-button>
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content tabpane">
        <table-pagination
          :list="travelInfoSelectStaffList"
          :tableList="travelInfoSelectStaffTable"
          :queryForm="travelInfoForm"
          :getList="travelInfoFormQuery"
          :page-sizes="pageSizes"
          :vLoading="travelInfoSelectStaffDialogTableVLoading"
          ref="travelInfoSelectStaffTableRef">
        </table-pagination>
      </div>
    </gc-model>
    <!-- 差旅信息批量导入dialog -->
    <InstructorBatchImport title="差旅信息批量导入" :visible.sync="travelInfoImport"
      @change="travelInfoImportChange"
      @templateDownload="templateDownload('/common/file/downloadModule', { fileCode: 'reimTripInfoModule' })"
      @comfirm="travelInfoImportComfirm"
      @close="travelInfoImportClose">
      <div v-if="travelInfoImportData.importInfo">
        <p>{{ travelInfoImportData.importInfo }}</p>
        <p v-for="error in travelInfoImportData.errorList" :key="error" class="error-color">
          {{ error }}
        </p>
      </div>
    </InstructorBatchImport>
  </div>
</template>

<script>
import summary from './summary'
import { templateDownload, customHint } from '@/util/utils'
import { CopyObj, formatDate, daysApart, myRound } from '@/plugins/until'
import { fetchSelectReimTripPerson, fetchSelectFastReimTripPerson, uploadTripInfoList } from '@/fetch/reimbursement'
export default {
  name: 'TravelInfo',
  components: {},
  mixins: [summary],
  props: {
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    },
    baseId: {
      type:String,
      // required: true
    },
    baseInfo: {
      type: Object,
      required: true,
    },
    tableData: {
      type: Array,
      default: () => []
    },
    // travelInfoTable: {
    //   type: Array,
    //   default: () => []
    // },
    cityOptions: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    tableData: {
      deep: true,
      immediate: true,
      handler (newVal, oldVal) {
        this.travelInfoTable = CopyObj(this.tableData)
      },
    },
    travelInfoTable: {
      deep: true,
      handler (newVal, oldVal) {
        this.$emit('save', this.travelInfoTable)
      },
    }
  },
  data() {
    return {
      daysApart,
      templateDownload,
      // 差旅信息批量导入
      travelInfoImport: false,
      // 差旅信息批量导入数据对象
      travelInfoImportData: {},
      // 差旅信息-选择人员 dialog状态
      travelInfoSelectStaffVisible: false,
       // 差旅信息 table数据数组
      travelInfoTable: [],
       // 差旅信息 出差人 input 绑定变量
      pageSizes: [5, 10],
      travelInfoForm: {
        classId: '',
        name: '',
        page: 1,
        size: 5,
        total: 0
      },
      // 差旅信息-选择人员 table 字段数组
      travelInfoSelectStaffList: [
        { width: '54', type: 'selection' },
        { label: '序号', width: '60', type: 'index', value: '序号' },
        { prop: 'tripPersonName', label: '姓名', value: '姓名' },
        { prop: 'tripPersonUm', label: 'UM号', value: 'UM号' },
        { prop: 'idvPosPostName', label: '岗位', value: '岗位' }
      ],
      // 差旅信息-选择人员 table 数据数组
      travelInfoSelectStaffTable: [],
      // 差旅信息-选择人员 table loading 状态
      travelInfoSelectStaffDialogTableVLoading: false,
      // 差旅信息 出差信息 出差地点 级联选择框 options
      // cityOptions: [],
    }
  },
  methods: {
    // 出差信息 删除事件
    async delTravelInfoOneItem() {
      const selection = this.$refs.travelInfoTableRef.selection
      if (!selection.length) {
        customHint('请选择要删除的记录')
        return
      }
      await customHint('确定要删除选中记录吗？', '提示', '取消')


      // selection.forEach(sm => {
      //   const selectionIndex = this.travelInfoTable.findIndex(m => m.tripPersonUm === sm.tripPersonUm)
      //   this.travelInfoTable.splice(selectionIndex, 1)
      // })
      // this.$refs.travelInfoTableRef.clearSelection()

      this.travelInfoTable = this.travelInfoTable.filter(
        (v) => !selection.includes(v)
      )
    },
    // 差旅信息复制事件
    handleTravelInfoTableCopy(row) {
      this.travelInfoTable.push(CopyObj(row))
    },
    // 出差信息 出差地点 级联选择框 change事件
    handleCityChange() {},
    // 限制开始日期不能小于结束日期
    startDisabledDate(row, time) {
      if (row.tripEndDate) {
        return !(formatDate(time) <= row.tripEndDate)
      }
      return false
    },
    // 限制结束日期不能小于开始日期
    endDisabledDate(row, time) {
      if (row.tripStartDate) {
        return !(formatDate(time) >= row.tripStartDate)
      }
      return false
    },
    // 选择人员查询事件
    travelInfoFormClickQuery() {
      this.travelInfoForm.page = 1
      this.travelInfoSelectStaffDialogTableVLoading = true
      this.travelInfoFormQuery()
    },
    // 选择人员查询函数
    async travelInfoFormQuery(flag) {
      this.travelInfoForm.classId = this.baseId || this.baseInfo.classId
      const param = CopyObj(this.travelInfoForm)
      param.name = param.name.toUpperCase()
      try {
        // const data = await fetchSelectReimTripPerson(param)
        const data = await fetchSelectFastReimTripPerson(param)
        this.travelInfoSelectStaffDialogTableVLoading = false
        this.travelInfoSelectStaffTable = data.list
        this.travelInfoForm.size = data.size
        this.travelInfoForm.total = data.total
      } catch (e) {
        this.travelInfoSelectStaffDialogTableVLoading = false
      }
      
    },
    // 选择人员 SizeChange事件
    travelInfoTableSizeChange(size) {
      this.travelInfoForm.size = size.pageSize
      this.travelInfoForm.page = 1
      this.travelInfoFormQuery()
    },
    // 选择人员 pageChange事件
    travelInfoTableCurrentChange(page) {
      this.travelInfoForm.page = page.pageNum
      this.travelInfoFormQuery()
    },
    // 选择人员 dialog comfirm事件
    travelInfoSelectStaffComfirm() {
      const selection = this.$refs.travelInfoSelectStaffTableRef.$children[0].getSelection()
      selection.forEach(item => {
        item.tripType = '0' // 0: 行内，1：行外
        const data = {
          planTicketNum: '',
          tripEndDate: '',
          tripPlace: '',
          tripPlaceCode: '',
          tripStartDate: '',
          tripPersonName: item.tripPersonName,
          tripPersonUm: item.tripPersonUm,
          tripPersons: [item],
          tripPersonNum: 1
        }
        this.travelInfoTable.push(data)
      })
      this.$refs.travelInfoSelectStaffTableRef.$children[0].clearSelection()
      this.travelInfoSelectStaffVisible = false
    },
    // 选择人员弹框关闭
    travelInfoSelectStaffClose () {
      this.travelInfoSelectStaffVisible = false
      this.travelInfoForm.name = ''
      this.travelInfoForm.total = 0
      this.travelInfoSelectStaffTable = []
    },

    // 差旅订单文件change事件
    travelInfoImportChange($event) {
      const file = $event.target.files[0]
      // 删除文件
      if (!file?.name) {
        this.travelInfoImportData = {}
      } else {
        //新增文件
        const data = new FormData()
        data.append('file', file)
        uploadTripInfoList(data)
          .then(resData => {
            this.travelInfoImportData = resData
          })
      }
    },
    // 差旅批量导入确认事件
    travelInfoImportComfirm() {
      const sucessList = this.travelInfoImportData.sucessList || []
      if (sucessList.length) {
        sucessList.forEach((v) => {
          const { blgDept, blgStripLine, tripPersonName, tripPersonUm } = v
          v.tripPersons = [
            { blgDept, blgStripLine, tripPersonName, tripPersonUm }
          ]
          v.tripPlace = this.getCitySiteNo(v.tripPlace)
          v.tripPersonNum = 1
        })
        this.travelInfoTable.push(...sucessList)
      }
      this.travelInfoImport = false
    },
    // 根据城市 查找编号
    getCitySiteNo(name) {
      let data = []
      this.cityOptions.forEach((province) => {
        province.children.forEach((city) => {
          if (city.siteName === name && data.length === 0) {
            data.push(province.siteNo)
            data.push(city.siteNo)
          }
        })
      })
      return data
    },
    // 差旅批量导入关闭事件
    travelInfoImportClose() {
      this.travelInfoImportData = {}
      this.travelInfoImport = false
    },
    // 合计金额合并列
    arraySpanMethod() {
      this.objectSpanMethod('travelInfoTableRef')
    },
    // 合计金额计算
    getSummaries(param) {
      return this.getNodeSummaries(param, '合 计', ['tripPersonNum'])
    },
  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.TravelInfo {
  padding: 0 20px;
}
:deep(.el-table__footer-wrapper td.el-table__cell) {
  border-top: 0 none;
}
:deep(.el-table__footer-wrapper tbody td) {
  background-color: #fff !important;
}
:deep(.el-table__footer-wrapper tbody .cell) {
  color: #7d8292;
}
:deep(.el-table__footer-wrapper tbody td[colspan='2']) {
  background-color: #f9fafc !important;
}
.LaunchTrainingCourse__common-dialog__title__left {
  :deep(.gc-input .label) {
    width: 40px !important;
  }
}

</style>