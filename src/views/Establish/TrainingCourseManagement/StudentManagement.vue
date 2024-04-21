<template>
    <div>
        <div class="between">
            <div>
                <span>请输入学员（UM号）</span>
                <el-input class="w200 ml10" placeholder="请输入UM号" v-model.trim="studentForm.umId" ref="searchUmidRef" clearable></el-input>
                <el-button type="primary" class="button-60-h30 ml20" @click="handleSearchStudent" >查询</el-button>
            </div>
        </div>
        <div class="menu-right mt20">
            <div class="icons no-line df">
                <span class="icons__upload" @click="handleAddStudent()">
                    <i class="icons__add__icon"></i>新增学员
                </span>
                <span class="icons__upload" @click="handleStudentExport">
                    <i class="icons__upload__icon"></i>导出
                </span>
                <span class="icons__upload" @click="importStudentVisible = true">
                    <i class="icons__upload__icon"></i>批量上传
                </span>
                <span class="icons__del" @click="studentTableClear">
                    <i class="icons__del__icon"></i>清空
                </span>
            </div>
        </div>
        <gc-table class="general__table mt20" ref="studentTableRef" :list="studentList" :stripe="false" :tableList="studentTableList">
            <el-table-column label="操作" min-width="86">
              <template slot-scope="scope">
                <span class="active mr10" @click="delOneStudent(scope)">
                  <el-tooltip content="删除" popper-class="icon-popper">
                    <i class="operation__del"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
        </gc-table>
        <gc-pagination
            :total="studentForm.total"
            :page-size="studentForm.pageSize"
            :current-page="studentForm.currPage"
            @sizeChange="sizeChange($event, studentForm, getStudentList)"
            @currentChange="currentChange($event, studentForm, getStudentList)"
          />
    </div>
</template>
<script>
import {
  random,
  CopyObj,
  resetObj,
  throttle,
  hintFrame,
  customHint,
  formatDate,
  sizeChange,
  jsonHeaders,
  dataHeaders,
  manyLineHint,
  currentChange,
  axiosDownload,
  filterBusiType,
  handleDownload,
  templateDownload,
  addAllowKeepAlive,
  tableSelectionChange,
  handleEndPickerOptions,
  handleStartPickerOptions,
  fetchUdmpCodeToDownload,
  downloadAdapter
} from '@/util/utils'
export default {
    props: ['classId'],
    data () {
        return {
            importStudentVisible: false,
            // 参训学员 查询数据 form
            studentForm: {
                umId: '',
                currPage: 1,
                pageSize: 5,
                total: 0
            },
            // 参训学员 字段数组
            studentList: [
                { label: '序号', width: '64', type: 'index' },
                { label: '姓名', width: '120', prop: 'empName' },
                { label: 'UM号', width: '162', prop: 'umId' },
                { label: '类型', width: '108', prop: 'busiType',
                    ctx: (row) => filterBusiType(row.busiType)
                },
                { label: '部门', width: '282', prop: 'orgName' },
                { label: '岗位', width: '318', prop: 'posts' }
            ],
            // 参训学员 数据数组
            studentTableList: [],
            // 导入学员
            importStudentVisible: false,
            importStudentData: {
                isUpload: false,
                fail: [],
                success: [],
                failLength: 0,
                successLength: 0
            },
        }
    },
    methods: {
        // 搜索学员
        handleSearchStudent() {
            this.studentForm.currPage = 1
            this.studentForm.pageSize = 5
            this.getStudentList()
        },
        // 新增学员
        handleAddStudent() {
            if (!this.studentForm.umId) {
                this.$message.warning('新增学员时，请输入学员UM号(用于模糊查询)')
                this.$refs.searchUmidRef.focus()
                return
            }
            const data = {
                umId: this.studentForm.umId.toUpperCase()
            }
            this.$axios
            .post('/fn/user/listEmployeeInfo', { data }, jsonHeaders)
            .then((res) => {
                const { code, data } = res.data
                if (code === 0) {
                    if (data.length) {
                        this.choiceStudenTableList = data
                        this.choiceStudentVisible = true
                    } else {
                        this.$message.warning('未找到该学员')
                    }
                }
            })
        },
        // 学员导出
        handleStudentExport() {
            const data = { classId: this.classId }
            axiosDownload(
            '/fn/classes/manager/exportClassStudent',
            data,
            '培训班学员导出.xls'
            )
        },
        // 批量导入Change事件
        async studentImportChange($event) {
            this.batchChannelStudentFile = $event.target.files[0]
            $event.target.value = ''
            this.$nextTick(() => {
            if (!this.batchChannelStudentFile.name) {
                this.setImportStudentData()
            }
            })
        },
        // 批量导入积分提交
        async studentImportComfirm() {
            if (!this.batchChannelStudentFile.name) {
            return this.$message.warning('请选择文件后再提交')
            }
            if (this.batchChannelStudentFile) {
            const data = new FormData()
            data.append('file', this.batchChannelStudentFile)
            data.append('classId', this.commcClassId)
            fetchBatchClassStudent(data).then((resData) => {
                this.setImportStudentData(resData)
                this.handleSearchStudent()
                if (resData.fail?.length) {
                // manyLineHint(resData.fail)
                } else {
                this.importStudentVisible = false
                this.$message.success('批量导入成功')
                }
            })
            }
        },
        // 批量导入 关闭事件
        studentImportClose() {
            this.importStudentVisible = false
            this.batchChannelStudentFile = {}
            this.setImportStudentData()
        },
        setImportStudentData (data) {
            if (data && data.success && data.fail) {
            this.importStudentData.isUpload = data.success.length || data.fail.length
            this.importStudentData.successLength = data.success.length
            this.importStudentData.failLength = data.fail.length
            this.importStudentData.success = data.success
            this.importStudentData.fail = data.fail
            } else {
            this.importStudentData = {
                isUpload: false,
                fail: [],
                success: [],
                failLength: 0,
                successLength: 0
            }
            }
        },
        studentTableClear () {

        },
        // 查询学员
        getStudentList(flag) {
            const data = CopyObj(this.studentForm)
            flag && (data.umId = '')
            if (!data.umId) {
                Reflect.deleteProperty(data, 'umId')
            } else {
                data.umId = data.umId.toUpperCase()
            }
            data.classId = this.classId
            this.$axios
            .post('/fn/classes/manager/listStudentAdjust', data, jsonHeaders)
            .then((res) => {
                const { code, data } = res.data
                if (code === 0) {
                const { list, total } = data
                this.studentTableList = list
                this.studentForm.total = total
                this.adjustStudentVisible = true
                }
            })
        },
        // 删除一个学员
        delOneStudent(scope) {
            let index, umId
            if (scope) {
            index = scope.$index
            ;({ umId } = scope.row)
            hintFrame('确定要删除该学员').then(() => {
                this.delStudent(umId)
            })
            } else {
            umId = -1
            this.delStudent(umId)
            }
        },
        // 删除学员 共用方法
        delStudent(umId) {
            const data = { classId: this.classId, umId }
            this.$axios
            .post('/fn/classes/manager/deleteStudent', data, jsonHeaders)
            .then((res) => {
                const { code } = res.data
                if (code === 0) {
                this.getStudentList()
                }
            })
        },
    }
}
</script>
