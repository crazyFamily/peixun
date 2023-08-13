<template>
    <div class="establish__trainingCourseManagement">
        <div class="title">
            <div class="title__menu"></div>
            <span>课程表</span>
        </div>
        <div class="menu-right">
            <div class="icons df">
              <span class="icons__upload" @click="courseDown">
                <i class="icons__upload__icon"></i>导出
              </span>
            </div>
        </div>
         <!-- <table-pagination
            tableClass="general__table mt20"
            :stripe="false"
            :queryForm="studentForm"
            :list="studentList"
            :tableList="studentTableList"
            :getList="getDataList"
            :hidePagination="true"
            /> -->
        <gc-table drop row-key="customId" class="general__table mt20" ref="courseTableRef"
            :list="timetableList"
            :tableList="timetableListData"
            >
            <el-table-column label="课程来源" min-width="116" >
                <span slot="header">
                    课程来源
                    <el-tooltip effect="light" popper-class="table-popper" placement="top" >
                        <i class="el-icon-question active"></i>
                        <div class="tips-container" slot="content">
                            <p class="tips-content">
                            内部课程，只可选择内部课程库中的课程，讲师可选择
                            内部（银行）/内部（非银行）
                            </p>
                            <p class="tips-content">
                            外部课程，只可选择外部课程库中的课程，讲师由课程自动带出，且只能为
                            外部讲师
                            </p>
                            <p class="tips-content">
                            通用课程，只可选择通用课程库中的课程，课程无需评估；讲师可选择
                            内部（银行）/内部（非银行）/无讲师
                            </p>
                        </div>
                    </el-tooltip>
                </span>
                <template v-slot="scope">
                    <span>{{ getLabel(scope.row.courseType, teachingMethodOptions ) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="课程名称" min-width="184" prop="courseName"></el-table-column>
            <el-table-column label="讲师类型" min-width="116" prop="teacherType">
                <template v-slot="scope">
                    <span>{{ getLabel(scope.row.teacherType, teacherTypeOptions) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="讲师姓名" width="116" prop="teacherName">
                <template v-slot="scope">
                    <span>{{ scope.row.teacherName || '无讲师' }}</span>
                </template>
            </el-table-column>
        </gc-table>
        <div class="title mt30">
            <div class="title__menu"></div>
            通关评审及带班老师信息
        </div>
        <div class="general__table mt20">
            <el-table :data="teacherTableList">
                <el-table-column align="center" type="index" label="序号" width="50" />
                <el-table-column label="姓名" min-width="148" prop="teacherName" />
                <el-table-column label="类型" min-width="120" prop="teacherType">
                    <template v-slot="scope">
                        <span>{{ getLabel(scope.row.teacherType, teacherCategoryOptions) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="内容" min-width="180" prop="contentDesc" />
                <el-table-column label="日期" min-width="346" prop="tgDate2" >
                    <template v-slot="scope">
                        {{scope.row.tgDate1}}  {{scope.row.tgDate2 ? '至'+ scope.row.tgDate2: ''}}
                    </template>
                </el-table-column>
                <el-table-column label="时间" min-width="260" prop="tgDate2" >
                    <template v-slot="scope">
                        {{scope.row.startTime}} 至 {{scope.row.endTime}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { handleDownload } from '@/util/utils'
import { ESTABLISH_COURSE_MAP } from '@/util/constants'
import { fetchFindCourseManagerInfo, downloadClassCourseByClassId } from '@/fetch/trainingCourseManagement'

export default {
    props: ['parentId'],
    data () {
        return {
            timetableList: [
                { label: '序号', width: '48', type: 'index' },
                { label: '日期', width: '130', prop: 'courseDate' },
                { label: '时间', width: '130', prop: 'startTime', 
                  ctx: (row) => `${row.startTime} 至 ${row.endTime}`
                },
            ],
            timetableListData: [],
            teacherTableList: [],
            teachingMethodOptions: [ // 授课方式 下拉选项
                { label: '内部课程', value: ESTABLISH_COURSE_MAP.bank },
                { label: '外部课程', value: ESTABLISH_COURSE_MAP.interior },
                { label: '通用课程', value: ESTABLISH_COURSE_MAP.commonCourse }
                // { label: '移动', value: ESTABLISH_COURSE_MAP.move }
            ],
            // 讲师类型-下拉
            teacherTypeOptions: [
                { label: '内部(银行)', value: ESTABLISH_COURSE_MAP.interiorBank },
                { label: '内部(非银行)', value: ESTABLISH_COURSE_MAP.interiorNotBank },
                { label: '外部讲师', value: ESTABLISH_COURSE_MAP.sansLecturer },
                { label: '无讲师', value: ESTABLISH_COURSE_MAP.notLecturer }
            ],
            // 通关评审及带班老师信息 讲师类型下拉选项
            teacherCategoryOptions: [
                { label: '带班', value: '02001' },
                { label: '通关评审', value: '02002' },
                { label: '行动学习', value: '02003' }
            ],
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
            return item?.label || (value === '05001' ? '移动' : '')
        },
        // 获取课程表
        async getDataList () {
            const params = { classId: this.parentId }
            const data = await fetchFindCourseManagerInfo(params)
            data.courseList.forEach(v => {
                // v.startTime = v.startDate.substr(v.startDate.indexOf(' ')+1) 
                v.startTime = `${v.startHour || '00'}:${v.startMin || '00'}`
                v.endTime = `${v.endHour || '00'}:${v.endtMin || '00'}`
                // 变更：如有通用课程标识，展示为通用课程
                v.courseType =
                v.isCommonCourse === 'Y'
                    ? ESTABLISH_COURSE_MAP.commonCourse
                    : v.courseType
            })
            data.tgTeacherList.forEach(v => {
                v.startTime = `${v.startHour || '00'}:${v.startMin || '00'}`
                v.endTime = `${v.endHour || '00'}:${v.endtMin || '00'}`
            })
            this.timetableListData = data.courseList
            this.teacherTableList = data.tgTeacherList
        },
        // 导出课表
        courseDown() {
            downloadClassCourseByClassId({classId: this.parentId})
                .then(handleDownload)
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
