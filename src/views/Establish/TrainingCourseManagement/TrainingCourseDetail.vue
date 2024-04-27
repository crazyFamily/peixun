<template>
    <div>
        <el-tabs v-if="routerParams.classId" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="立项信息" name="first">
                <PreviewEstablishProject  v-if="activeName === 'first' && projectApprovalData"  :params="projectApprovalData" :isShowReturn="false" />
            </el-tab-pane>
            <el-tab-pane label="培训通知" name="second">
                <TrainingNotice v-if="commcClassId && activeName === 'second'" :commcClassId="commcClassId" />
            </el-tab-pane>
            <el-tab-pane label="课表管理" name="third">
                <TimetableManagement v-if="activeName === 'third'" :parentId="routerParams.classId" :params="AttendanceManagemenData" />
            </el-tab-pane>
            <el-tab-pane label="学员管理" name="fourth">
                <StudentManagementIndex v-if="activeName === 'fourth'" :classId="routerParams.classId" operationType="view"></StudentManagementIndex>
            </el-tab-pane>
            <el-tab-pane label="考勤管理" name="five">
                <AttendanceManagement v-if="activeName === 'five'" :params="AttendanceManagemenData" />
            </el-tab-pane>
            <el-tab-pane label="评估管理" name="six">
                <TrainingCourseAssessment v-if="activeName === 'six'" :params="TrainingCourseAssessmentData" />
            </el-tab-pane>
            <el-tab-pane label="积分管理" name="seven">
                <PointManagement v-if="activeName === 'seven'" :commcClassId="commcClassId" :params="PointManagementData"/>
            </el-tab-pane>
            <el-tab-pane label="结训管理" name="eight">
                <InputAfterTraning v-if="activeName === 'eight'" :params="InputAfterTraningData"/>
            </el-tab-pane>
            <el-tab-pane label="文件归档" name="nine">
                <TrainingCoursePigeonhole v-if="activeName === 'nine'" :state="'detail'" :params="TrainingCoursePigeonholeData"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import PreviewEstablishProject from '@/views/Establish/EstablishManagement/PreviewEstablishProject.vue'
import AttendanceManagement from './components/details/AttendanceManagement'
import TimetableManagement from './components/details/TimetableManagement'
// import StudentManagement from './components/details/StudentManagement'
import TrainingCourseAssessment from './components/details/TrainingCourseAssessment'
import InputAfterTraning from './components/details/InputAfterTraning'
import PointManagement from './components/details/PointManagement'
import TrainingNotice from './components/details/TrainingNotice'
import TrainingCoursePigeonhole from './TrainingCoursePigeonhole'
import StudentManagementIndex from './components/edits/StudentManagement/index'

import { fetchLiXiangShowClass } from '@/fetch/establish'

export default {
    name: 'TrainingCourseDetail',
    components: {
        PreviewEstablishProject,
        TrainingNotice,
        TimetableManagement,
        // StudentManagement,
        TrainingCourseAssessment,
        AttendanceManagement,
        PointManagement,
        InputAfterTraning,
        TrainingCoursePigeonhole,
        StudentManagementIndex
    },
    data () {
        return {
            commcClassId: '',
            activeName: 'first',
            routerParams: {}, // 路由参数
            projectApprovalData: null,
            AttendanceManagemenData: null,
            TrainingCourseAssessmentData: null,
            PointManagementData: null,
            InputAfterTraningData: null,
            TrainingCoursePigeonholeData: null,
        }
    },
    methods: {
        async handleClick (e) {
            console.log('xf-handleClick', e)
            const { index, label, name } = e
            this.activeName = name
            const { classId, className, dateStart, dateEnd, applyStatus } = this.routerParams
            switch (name) {
                case 'first':
                    const data = await fetchLiXiangShowClass({classId}) 
                    this.projectApprovalData = { ...data }
                    break
                case 'second':
                    this.commcClassId = classId
                    break
                case 'five': 
                    this.AttendanceManagemenData = { 
                        id: classId, 
                        dateStart: dateStart 
                    }
                    break
                case 'six':
                    this.TrainingCourseAssessmentData = {
                        id: classId,
                        dateStart: dateStart,
                        dateEnd: dateEnd,
                        applyStatus: applyStatus,
                    }
                    break
                case 'seven':
                    this.commcClassId = classId
                    this.PointManagementData = { id: classId }
                    break
                case 'eight':
                    this.InputAfterTraningData = { id: classId }
                    break
                case 'nine':
                    this.TrainingCoursePigeonholeData = { id: classId, className}
                    break
            }
        },
        _initData () {
            const params = this.$route.params
            if (params && Object.keys(params).length) {
                this.routerParams = this.$route.params
                this.activeName = this.routerParams.activeName
                this.handleClick({ name: this.activeName })
            }
            console.log('xf-router.params', params)
        }
    },
    watch: {
        // ''
    },
    created () {
        console.log('xf-TrainingCourseDetail:created')
        this._initData()
    },
    activated () {
        this._initData()
        console.log('xf-TrainingCourseDetail:activated')
    }
}
</script>
