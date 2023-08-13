<template>
    <div>
        <div class="between">
            <div>
                <span>所属机构</span>
                <gc-institution class="ml10" style="top:10px;background-color:#fff;" orgUrl="/fn/user/selectAllTree" v-model="blgOrgIds" />
                <span class="ml20">学员信息</span>
                <el-input class="w200 ml10" placeholder="请输入姓名/UM号" v-model.trim="studentForm.umId" clearable />
                <el-button type="primary" class="button-60-h30 ml20" @click="handleSearchStudent">查询</el-button>
                <el-button class="button-60-h30 ml20" @click="reset">重置</el-button>
            </div>
        </div>
        <div class="menu-right mt20">
            <!-- <div class="icons no-line df">
                <span class="icons__upload" @click="handleStudentExport">
                    <i class="icons__upload__icon"></i>
                    导出
                </span>
            </div> -->
        </div>
        <table-pagination
            tableClass="general__table mt20"
            :stripe="false"
            :queryForm="studentForm"
            :list="studentList"
            :tableList="studentTableList"
            :getList="getDataList"
            :page-sizes="[5,10,20,50]"
            />
    </div>
</template>
<script>
import { filterBusiType } from '@/util/utils'
import { ESTABLISH_COURSE_MAP } from '@/util/constants'
import { fetchListStudentAdjust } from '@/fetch/trainingCourseManagement'

export default {
    props: ['parentId'],
    data () {
        return {
            blgOrgIds: [],
            // 参训学员 查询数据 form
            studentForm: {
                umId: '',
                currPage: 1,
                pageSize: 5,
                total: 0
            },
            // 参训学员 字段数组
            studentList: [
                { label: '序号', width: '64', type: 'index',
                    ctx: (row, index) => (this.studentForm.currPage -1) * this.studentForm.pageSize + index + 1
                },
                { label: '姓名', width: '120', prop: 'empName' },
                { label: 'UM号', width: '162', prop: 'umId' },
                { label: '条线', width: '108', prop: 'busiType',
                    ctx: (row) => filterBusiType(row.busiType)
                },
                { label: '机构', width: '282', prop: 'orgName' },
                { label: '岗位', width: '318', prop: 'posts' }
            ],
            // 参训学员 数据数组
            studentTableList: [],
        }
    },
    watch: {
        parentId () {
            this._initData()
        }
    },
    methods: {
        getLabel (value, list) {
            const item = list.find(m => m.value === value)
            return item?.label || ''
        },
        // 获取课程表
        async getDataList () {
            const params = { classId: this.parentId, ... this.studentForm }
            if (!params.umId) {
                Reflect.deleteProperty(params, 'umId')
            } else {
                params.umId = params.umId.toUpperCase()
            }
            const data = await fetchListStudentAdjust(params)
            this.studentTableList = data.list
            this.studentForm.total = data.total
        },
        // 搜索学员
        handleSearchStudent() {
            this.studentForm.busiType =  this.blgOrgIds?.[0]
            this.studentForm.orgId =  this.blgOrgIds?.[1]
            this.studentForm.currPage = 1
            this.studentForm.pageSize = 5
            this.getDataList()
        },
        // 重置
        reset() {
        this.blgOrgIds = []
        this.studentForm.umId = ''
        this.studentForm.pageSize = 5
        this.studentForm.currPage = 1
        this.handleSearchStudent()
        },
        _initData () {
            this.getDataList()
        }
    },
    created () {
        this._initData()
    }
}
</script>
