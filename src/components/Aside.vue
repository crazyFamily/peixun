<template>
  <div class="wrapper" :style="{ width: collapse ? '64px' : '178px' }">
    <div class="global-aside">
      <div class="hrx-home-logo" @click="gopath('/')">
        <img class="small" v-show="collapse" src="../assets/images/home/logo.png" />
        <img class="big" v-show="!collapse" src="../assets/svg/head-pa-bank-logo.png" />
      </div>
      <div class="menu-wrapper">
        <el-menu
          :unique-opened="true"
          :collapse="collapse"
          :collapse-transition="false"
          background-color="#233545"
          text-color="#d3d7da"
          active-text-color="#fd6720"
        >
          <el-submenu
            v-for="(item, index) in menuList"
            :key="item.menuName"
            :index="index + 2 + ''"
            :popper-class="item.childMenus.length === 0 ? 'vanish' : ''"
            :class="{ 'no-arrow': !item.childMenus.length }"
          >
            <template slot="title">
              <div
                :class="{
                  'active-route': $route.meta === item.menuName
                }"
                @click="handleClick(item)"
              >
                <i :class="iconMaping[item.menuName]"></i><span :class="{ hrxHomeHide: collapse }">{{ item.menuName }}</span>
              </div>
            </template>
            <template>
              <div v-for="(itemChildren, indexChildren) in item.childMenus" :key="indexChildren">
                <el-menu-item @click="gopath(itemChildren.menuLink)" :index="`${index + 2}-${indexChildren + 1}`">
                  <span class="menu-zero">.</span>
                  {{ itemChildren.menuName }}
               </el-menu-item>
              </div>
            </template>
          </el-submenu>
        </el-menu>
      </div>
      <div class="fold-btn" @click="changeCollapse" :class="{ collapse: !collapse }">
        <img src="../assets/svg/zhedie.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { addAllowKeepAlive } from '../util/utils'
export default {
  data() {
    return {
      collapse: true,
      iconMaping: {
        数据大屏: 'el-icon-menu el-icon-menu-16',
        首页运营: 'el-icon-message el-icon-menu',
        讲师管理: 'el-icon-menu el-icon-menu-3',
        培训师管理: 'el-icon-menu el-icon-menu-2',
        报销中心: 'el-icon-menu',
        课程管理: 'el-icon-menu el-icon-menu-4',
        阶梯培训管理: 'el-icon-menu el-icon-menu-14',
        培训计划管理: 'el-icon-menu el-icon-menu-5',
        星火计划: 'el-icon-menu el-icon-menu-6',
        报表中心: 'el-icon-menu el-icon-menu-7',
        培训项目管理: 'el-icon-menu el-icon-menu-8',
        系统管理: 'el-icon-menu el-icon-menu-9',
        私行财富学习管理: 'el-icon-menu el-icon-menu-10',
        案例中心: 'el-icon-menu el-icon-menu-11',
        AI陪练: 'el-icon-menu el-icon-menu-12',
        潜才培养管理: 'el-icon-menu el-icon-menu-13',
        新人培养管理: 'el-icon-menu el-icon-menu-15',
        // 资讯管理: "el-icon-menu el-icon-menu-12",
      },
     localdata: {
        blgStripLine: 'Y',
        deptno: 'S000000342',
        empName: '罗冠人',
        menuInfoList: [
          {
            childMenus: [
              {
                menuId: '1120200000001',
                menuLink: '/DataDashboard',
                menuLvl: 2,
                menuName: '培训指标',
                pageSort: null,
                prnMenuId: '1120200000000'
              }
            ],
            menuId: '1120200000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '数据大屏',
            pageSort: 4
          },
          {
            childMenus: [
              {
                menuId: '202000000001',
                menuLink: '/HomePageSetting',
                menuLvl: 2,
                menuName: '首页设置',
                pageSort: null,
                prnMenuId: '20200000000'
              },
              //  {
              //   menuId: '202000000011',
              //   menuLink: '/HomePageSetting2',
              //   menuLvl: 2,
              //   menuName: '首页设置2',
              //   pageSort: null,
              //   prnMenuId: '20200000000'
              // },
              // {
              //   menuId: '202000000021',
              //   menuLink: '/HomePageSetting3',
              //   menuLvl: 2,
              //   menuName: '首页设置3',
              //   pageSort: null,
              //   prnMenuId: '20200000000'
              // },
            {
                menuId: '2020000000031',
                menuLink: '/SpecialManage',
                menuLvl: 2,
                menuName: '案例专题',
                pageSort: 2,
                prnMenuId: '20200000000'
              },
              {
                menuId: '2020000000041',
                menuLink: '/ZnSpecialManage',
                menuLvl: 2,
                menuName: '知鸟课程专题',
                pageSort: 2,
                prnMenuId: '20200000000'
              },
              {
                menuId: '20200000001',
                menuLink: '/InformationManament',
                menuLvl: 2,
                menuName: '资讯管理',
                prnMenuId: '20200000000',
                pageSort: 4
              }
            ],
            menuId: '20200000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '首页运营',
            pageSort: 4
          },
          {
            childMenus: [
              {
                menuId: '20301000000',
                menuLink: '/InstructorApplication',
                menuLvl: 2,
                menuName: '星级讲师申请',
                pageSort: 1,
                prnMenuId: '20300000000'
              },
              {
                menuId: '20302000000',
                menuLink: '/InstructorSearch',
                menuLvl: 2,
                menuName: '讲师查询',
                pageSort: 2,
                prnMenuId: '20300000000'
              },
              {
                menuId: '20303000000',
                menuLink: '/InstructorAuthorization',
                menuLvl: 2,
                menuName: '讲师授权',
                pageSort: 3,
                prnMenuId: '20300000000'
              },
           {
                menuId: '20304000000',
                menuLink: '/InstructorEvaluation',
                menuLvl: 2,
                menuName: '讲师评聘',
                pageSort: 4,
                prnMenuId: '20300000000'
              }
            ],
            menuId: '20300000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '讲师管理',
            pageSort: 4
          },
          {
            childMenus: [
              {
                menuId: '20304000000',
                menuLink: '/TrainerEvaluation',
                menuLvl: 2,
                menuName: '培训师评聘',
                pageSort: 4,
                prnMenuId: '20310000000'
              },
              {
                menuId: '20304000000',
                menuLink: '/EvaluationYearManagement',
                menuLvl: 2,
                menuName: '评聘年度配置',
                pageSort: 4,
                prnMenuId: '20310000000'
              },
              {
                menuId: '21200000002',
                menuLink: '/TrainerManagement',
                menuLvl: 2,
                menuName: '培训师管理',
                pageSort: 4,
                prnMenuId: '20310000000'
              },
              {
                menuId: '212000000021',
                menuLink: '/IntegrationConfiguration',
                menuLvl: 2,
                menuName: '积分规则',
                pageSort: 5,
                prnMenuId: '20310000000'
              },
            {
                menuId: '21200000008',
                menuLink: '/PointManagement',
                menuLvl: 2,
                menuName: '积分管理',
                pageSort: 5,
                prnMenuId: '20310000000'
              },
              {
                menuId: '21200000010',
                menuLink: '/YBLecturerManagement',
                menuLvl: 2,
                menuName: '银保培训管理',
                pageSort: 4,
                prnMenuId: '20310000000'
              }
            ],
            menuId: '20310000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '培训师管理',
            pageSort: 4
          },
          {
            childMenus: [
              {
                menuId: '20620000000',
                menuLink: '/TrainingCourse',
                menuLvl: 2,
                menuName: '培训班费用报销',
                pageSort: 1,
                prnMenuId: '20600000000'
              },
              {
                menuId: '20630000000',
                menuLink: '/NonTrainingCourse',
                menuLvl: 2,
                menuName: '非培训班费用报销',
                pageSort: 2,
                prnMenuId: '20600000000'
              },
            {
                menuId: '20640000000',
                menuLink: '/MyReimbursement',
                menuLvl: 2,
                menuName: '我的报销',
                pageSort: 3,
                prnMenuId: '20600000000'
              },
              {
                menuId: '20650000000',
                menuLink: '/ReimburseExpenses',
                menuLvl: 2,
                menuName: '机构报销费用查询',
                pageSort: 3,
                prnMenuId: '20600000000'
              }
            ],
            menuId: '20600000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '报销中心',
            pageSort: 7
          },
          {
            childMenus: [
              {
                menuId: '20920000000',
                menuLink: '/InternalCurriculumManagement',
                menuLvl: 2,
                menuName: '内部课程管理',
                pageSort: 1,
                prnMenuId: '20900000000'
              },
              {
                menuId: '20930000000',
                menuLink: '/ExternalCurriculumManagement',
                menuLvl: 2,
                menuName: '外部课程管理',
                pageSort: 2,
                prnMenuId: '20900000000'
              },
              {
                menuId: '20940000000',
                menuLink: '/CurriculuLabelManagement',
                menuLvl: 2,
                menuName: '课程标签管理',
                pageSort: 3,
                prnMenuId: '20900000000'
              },
        {
                menuId: '20950000000',
                menuLink: '/CurriculumStorageManagement',
                menuLvl: 2,
                menuName: '课程入库管理',
                pageSort: 3,
                prnMenuId: '20900000000'
              },
              {
                menuId: '20950000001',
                menuLink: '/ZnCourseStorageManagement',
                menuLvl: 2,
                menuName: '知鸟课程存档',
                pageSort: 3,
                prnMenuId: '20900000000'
              },
              {
                menuId: '20960000000',
                menuLink: '/LadderManagenebt',
                menuLvl: 2,
                menuName: '阶梯培训管理',
                pageSort: 4,
                prnMenuId: '20900000000'
              }
            ],
            menuId: '20900000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '课程管理',
            pageSort: 10
          },
          {
            childMenus: [
              {
                menuId: '21142000000',
                menuLink: '/LadderCourses',
                menuLvl: 2,
                menuName: '阶梯课程',
                pageSort: 1,
                prnMenuId: '20520000000'
              },
              {
                menuId: '21140000000',
                menuLink: '/LadderInstructorAuthorization',
                menuLvl: 2,
                menuName: '讲师授权',
                pageSort: 1,
                prnMenuId: '20520000000'
              },
         {
                menuId: '21141000000',
                menuLink: '/ScheduleManagmnet',
                menuLvl: 2,
                menuName: '课表管理',
                pageSort: 1,
                prnMenuId: '20520000000'
              }
            ],
            menuId: '20520000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '阶梯培训管理',
            pageSort: 17
          },
          {
            childMenus: [
              {
                menuId: '21110000000',
                menuLink: '/AnnualPlan',
                menuLvl: 2,
                menuName: '年度计划',
                pageSort: 1,
                prnMenuId: '21000000000'
              },
              {
                menuId: '21110000001',
                menuLink: '/MonthlyPlan',
                menuLvl: 2,
                menuName: '月度计划',
                pageSort: 1,
                prnMenuId: '21000000000'
              },
              {
                menuId: '21110000002',
                menuLink: '/MonthlyPlanDashboard',
                menuLvl: 2,
                menuName: '月度计划看板',
                pageSort: 1,
                prnMenuId: '21000000000'
              },
              {
                menuId: '21120000000',
                menuLink: '/PlanManagement',
                menuLvl: 2,
                menuName: '计划管理',
                pageSort: 1,
                prnMenuId: '21000000000'
              }
            ],
           menuId: '21100000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '培训计划管理',
            pageSort: 13
          },
          {
            childMenus: [],
            menuId: '20800000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: 'AI陪练',
            pageSort: 14,
            thirdPartyUrl: 'http://training.pab.com.cn/training-web/index.html'
          },
          {
            childMenus: [
              {
                menuId: '21041000000',
                menuLvl: 2,
                menuLink: '/ExampDelayApplication',
                menuName: '豁免/延期申请',
                pageSort: 2,
                prnMenuId: '21040000000'
              },
              {
                menuId: '21042000000',
                menuLvl: 2,
                menuLink: '/StudentManagement',
                menuName: '申请管理',
                pageSort: 2,
                prnMenuId: '21040000000'
              }
            ],
            menuId: '21040000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '星火计划',
            pageSort: 14
          },
          {
            childMenus: [
              {
                menuId: '20711000000',
                menuLvl: 2,
                menuLink: '/StatementCentre',
                menuName: '报表中心',
                pageSort: 2,
                prnMenuId: '21050000000'
              }
            ],
            menuId: '20700000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '报表中心',
            pageSort: 15
          },
          {
            childMenus: [
              {
                menuId: '21061000000',
                menuLvl: 2,
                menuLink: '/EstablishProject',
                menuName: '培训项目立项',
                pageSort: 1,
                prnMenuId: '21060000000'
              },
              {
                menuId: '21062000000',
                menuLvl: 2,
                menuLink: '/TrainingCourseManagement',
                menuName: '培训班管理',
                pageSort: 2,
                prnMenuId: '21060000000'
              },
              {
                menuId: '21063000000',
                menuLvl: 2,
                menuLink: '/NotTrainingCourseManagement',
                menuName: '非培训班管理',
                pageSort: 3,
                prnMenuId: '21060000000'
              }
            ],
            menuId: '21060000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '培训项目管理',
            pageSort: 15
          },
          {
            childMenus: [
              {
                menuId: '21071000000',
                menuLvl: 2,
                menuLink: '/CRCurriculumManagement',
                menuName: '课程管理',
                pageSort: 1,
                prnMenuId: '21070000000'
              },
              {
                menuId: '20305000000',
                menuLink: '/CRLecturerManagement',
                menuLvl: 2,
                menuName: '讲师管理',
                pageSort: 4,
                prnMenuId: '21070000000'
              },
              {
                menuId: '20306000000',
                menuLink: '/CRProjectManagement',
                menuLvl: 2,
                menuName: '课程包管理',
                pageSort: 4,
                prnMenuId: '21070000000'
              },
           {
                menuId: '20307000000',
                menuLink: '/CRSuperTubeCenter',
                menuLvl: 2,
                menuName: '超管中心',
                pageSort: 5,
                prnMenuId: '21070000000'
              },
              {
                menuId: '20307000000',
                menuLink: '/CRLiveBroadcast',
                menuLvl: 2,
                menuName: '直播管理',
                pageSort: 5,
                prnMenuId: '21070000000'
              },
              {
                menuId: '20307000000',
                menuLink: '/CRExercisesBookMg',
                menuLvl: 2,
                menuName: '习题库管理',
                pageSort: 6,
                prnMenuId: '21070000000'
              },
              {
                menuId: '20307000000',
                menuLink: '/CRExercisePackageMg',
                menuLvl: 2,
                menuName: '习题包管理',
                pageSort: 7,
                prnMenuId: '21070000000'
              },
              {
                menuId: '20307000000',
                menuLink: '/CRExaminationMg',
                menuLvl: 2,
                menuName: '考试管理',
                pageSort: 8,
                prnMenuId: '21070000000'
              },
              {
                menuId: '20307000000',
                menuLink: '/CRTrainingCampMg',
                menuLvl: 2,
                menuName: '训练营管理',
                pageSort: 9,
                prnMenuId: '21070000000'
              },
            {
                menuId: '20307000000',
                menuLink: '/CRNoteManagement',
                menuLvl: 2,
                menuName: '笔记管理',
                pageSort: 10,
                prnMenuId: '21070000000'
              }
            ],
            menuId: '21070000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '私行财富学习管理',
            pageSort: 15
          },
          {
            childMenus: [
              {
                menuId: '205100000002',
                menuLink: '/CaseManagement',
                menuLvl: 2,
                menuName: '案例管理',
                pageSort: 1,
                prnMenuId: '20510000000'
              },
              {
                menuId: '205100000003',
                menuLink: '/CaseLabelManage',
                menuLvl: 2,
                menuName: '标签管理',
                pageSort: 1,
                prnMenuId: '20510000000'
              },
              {
                menuId: '205100000004',
                menuLink: '/CasePush',
                menuLvl: 2,
                menuName: '案例推送',
                pageSort: 1,
                prnMenuId: '20510000000'
              },
              {
                menuId: '205100000005',
                menuLink: '/CaseEvent',
                menuLvl: 2,
                menuName: '案例活动',
                pageSort: 1,
                prnMenuId: '20510000000'
              },
              {
                menuId: '2051000000051',
                menuLink: '/ActivityData',
                menuLvl: 2,
                menuName: '活动数据',
                pageSort: 2,
                prnMenuId: '20510000000'
              }
           ],
            menuId: '20510000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '案例中心',
            pageSort: 16
          },
          {
            childMenus: [
              {
                menuId: '21010000000',
                menuLink: '/AuthorityAssignment',
                menuLvl: 2,
                menuName: '权限分配',
                pageSort: 1,
                prnMenuId: '21000000000'
              },
              {
                menuId: '21020000000',
                menuLink: '/SystemManagementApplication',
                menuLvl: 2,
                menuName: '角色申请',
                pageSort: 1,
                prnMenuId: '21000000000'
              },
              {
                menuId: '21011000000',
                menuLink: '/ApprovalStudentManagement',
                menuLvl: 2,
                menuName: '审批链人员管理',
                pageSort: 3,
                prnMenuId: '21000000000'
              },
              {
                menuId: '2051200000',
                menuLink: '/RoleJurisdiction',
                menuLvl: 2,
                menuName: '角色权限管理',
                pageSort: 4,
                prnMenuId: '21000000000'
              },
              {
                menuId: '20599000000',
                menuLink: '/MoreManagementSetings',
                menuLvl: 2,
                menuName: '更多系统配置',
                pageSort: 3,
                prnMenuId: '21000000000'
              }
            ],
          menuId: '20500000000',
            menuLink: '#',
            menuLvl: 1,
            menuName: '系统管理',
            pageSort: 12
          },
          {
            childMenus: [
              {
                menuId: '210100000005',
                menuLink: '/TanlentsRepository',
                menuLvl: 2,
                menuName: '潜才库查询',
                pageSort: 1,
                prnMenuId: '20500000005'
              },
              {
                menuId: '210100000006',
                menuLink: '/TanlentsPermission',
                menuLvl: 2,
                menuName: '潜才权限管理',
                pageSort: 1,
                prnMenuId: '20500000005'
              },
              {
                menuId: '210100000007',
                menuLink: '/TalentsCultivationPlan',
                menuLvl: 2,
                menuName: '潜才方案管理',
                pageSort: 1,
                prnMenuId: '20500000005'
              },
              {
                menuId: '210100000008',
                menuLink: '/TanlentsTopicManagement',
                menuLvl: 2,
                menuName: '潜才议题创建',
                pageSort: 1,
                prnMenuId: '20500000005'
              },
              {
                menuId: '210100000009',
                menuLink: '/TalentsTopicCheck',
                menuLvl: 2,
                menuName: '潜才议题终审',
                pageSort: 1,
                prnMenuId: '20500000005'
              },
           {
                menuId: '210100000015',
                menuLink: '/TalentsProgress',
                menuLvl: 2,
                menuName: '培养进展管理',
                pageSort: 1,
                prnMenuId: '20500000005'
              },
              {
                menuId: '210100000010',
                menuLink: '/TanlentsEvaluation',
                menuLvl: 2,
                menuName: '潜才学员评价',
                pageSort: 1,
                prnMenuId: '20500000005'
              },
              {
                menuId: '210100000011',
                menuLink: '/TalentsProgressReport',
                menuLvl: 2,
                menuName: '潜才培养追踪',
                pageSort: 1,
                prnMenuId: '20500000005'
              },
            ],
            menuId: '20500000005',
            menuLink: '#',
            menuLvl: 1,
            menuName: '潜才培养管理',
            pageSort: 12
          },
          {
            childMenus: [
              {
                menuId: '210100000014',
                menuLink: '/StudentDataDashboard',
                menuLvl: 2,
                menuName: '学员数据看板',
                pageSort: 1,
                prnMenuId: '20500000006'
              },
              {
                menuId: '210100000011',
                menuLink: '/StudentRecruitment',
                menuLvl: 2,
                menuName: '学员招募',
                pageSort: 1,
                prnMenuId: '20500000006'
              },
              {
                menuId: '210100000012',
                menuLink: '/StudentRegistration',
                menuLvl: 2,
                menuName: '学员报名',
                pageSort: 2,
                prnMenuId: '20500000006'
              },
            {
                menuId: '210100000013',
                menuLink: '/OfflineOperation',
                menuLvl: 2,
                menuName: '培养管理',
                pageSort: 3,
                prnMenuId: '20500000006'
              }
            ],
            menuId: '20500000006',
            menuLink: '#',
            menuLvl: 1,
            menuName: '新人培养管理',
            pageSort: 18
          }
        ],
        thirdLvlMenuList: [
          {
            menuId: '20509000001',
            menuLink: '#',
            menuName: '角色菜单类',
            menuLvl: 3,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20599000000'
          },
          {
            menuId: '20509000005',
            menuLink: '#',
            menuName: '人员管理类',
            menuLvl: 3,
            pageSort: 5,
            childMenus: null,
            prnMenuId: '20599000000'
          },
          {
            menuId: '20509000010',
            menuLink: '#',
            menuName: '审批链类',
            menuLvl: 3,
            pageSort: 10,
            childMenus: null,
            prnMenuId: '20599000000'
          },
          {
            menuId: '20509000015',
            menuLink: '#',
            menuName: 'IT管理员类',
            menuLvl: 3,
            pageSort: 15,
            childMenus: null,
            prnMenuId: '20599000000'
          },
          {
            menuId: '20509000020',
            menuLink: '#',
            menuName: '功能开关类',
            menuLvl: 3,
          pageSort: 20,
            childMenus: null,
            prnMenuId: '20599000000'
          },
          {
            menuId: '20700000012',
            menuLink: '#',
            menuName: '培训计划类报表',
            menuLvl: 3,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '20700000002',
            menuLink: '#',
            menuName: '讲师类报表',
            menuLvl: 3,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '20700000003',
            menuLink: '#',
            menuName: '培训班类报表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '20700000009',
            menuLink: '#',
            menuName: '潜才培养管理报表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '20700000010',
            menuLink: '#',
            menuName: '新人培养管理报表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '20700000004',
            menuLink: '#',
            menuName: '指标过程明细表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
           prnMenuId: '20710000000'
          },
          {
            menuId: '20700000005',
            menuLink: '#',
            menuName: '课程类报表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '20700000006',
            menuLink: '#',
            menuName: '综合指标类报表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '20700000007',
            menuLink: '#',
            menuName: '费用类报表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '20700000008',
            menuLink: '#',
            menuName: '案例中心类报表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20710000000'
          },
          {
            menuId: '21202000001',
            menuLink: '#',
            menuName: '授课管理',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000002'
          },
          {
            menuId: '21203000001',
            menuLink: '#',
            menuName: '培训师查询',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000002'
          },
         {
            menuId: '2070530000012',
            menuLink: '/PointCalculate',
            menuName: '积分计算',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000008'
          },
          {
            menuId: '2070530000013',
            menuLink: '/PointRecord',
            menuName: '积分补录',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000008'
          },
          {
            menuId: '2070530000014',
            menuLink: '/PointSummaryReport',
            menuName: '积分汇总表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000008'
          },
          {
            menuId: '2070530000020',
            menuLink: '/LegalHoliday',
            menuName: '法定节假日',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000008'
          },
          {
            menuId: '2070530000015',
            menuLink: '/PointDetailReport',
            menuName: '积分明细表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000008'
          },
          {
            menuId: '2070530000016',
            menuLink: '#',
            menuName: '消保培训类报表',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20710000000'
          },
         {
            menuId: '2023180000001',
            menuLink: '#',
            menuName: '培训班与讲师',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000010'
          },
          {
            menuId: '2023180000002',
            menuLink: '#',
            menuName: '荣誉信息',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000010'
          },
          {
            menuId: '2023180000003',
            menuLink: '#',
            menuName: '报表基础信息',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000010'
          },
          {
            menuId: '2023180000004',
            menuLink: '#',
            menuName: '行员A基础信息管理',
            menuLvl: 3,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21200000010'
          }
        ],
        fourLvlMenuList: [
          {
            menuId: '20521000000',
            menuLink: '/RoleMenuManagement',
            menuName: '角色菜单管理',
            menuLvl: 4,
            pageSort: 5,
            childMenus: null,
            prnMenuId: '20509000001'
          },
     {
            menuId: '20522000000',
            menuLink: '/RoleFunctionManagement',
            menuName: '角色功能管理',
            menuLvl: 4,
            pageSort: 5,
            childMenus: null,
            prnMenuId: '20509000001'
          },
          {
            menuId: '20523000000',
            menuLink: '/EmailManagement',
            menuName: '邮件发送记录',
            menuLvl: 4,
            pageSort: 5,
            childMenus: null,
            prnMenuId: '20509000001'
          },
          {
            menuId: '20701000010',
            menuLink: '/TrainingPlanReport',
            menuName: '培训计划明细表',
            menuLvl: 4,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20700000012'
          },
          {
            menuId: '20701000011',
            menuLink: '/ExternalPlanReport',
            menuName: '计划外培训项目明细表',
            menuLvl: 4,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20700000012'
          },
          {
            menuId: '20701000012',
            menuLink: '/TrainingPlanExecuteReport',
            menuName: '培训计划执行明细表',
            menuLvl: 4,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20700000012'
          },
          {
            menuId: '20701000013',
            menuLink: '/DeptDispensePlan',
            menuName: '阶梯培训计划分配报表',
            menuLvl: 4,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20700000012'
         },
          {
            menuId: '20701000000',
            menuLink: '/TutorAllowance',
            menuName: '网点孵化导师津贴明细表',
            menuLvl: 4,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20700000002'
          },
          {
            menuId: '20702000000',
            menuLink: '/TutorAllowanceStatistics',
            menuName: '网点孵化导师津贴统计表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000002'
          },
          {
            menuId: '20704000000',
            menuLink: '/LadderCourseRecord',
            menuName: '讲师授课记录',
            menuLvl: 3,
            pageSort: 1,
            childMenus: null,
            prnMenuId: '20700000002'
          },
          {
            menuId: '20703000000',
            menuLink: '/EstablishProjectInventory',
            menuName: '培训立项清单',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000003'
          },
          {
            menuId: '20704000000',
            menuLink: '/ProjectStatistics',
            menuName: '机构培训项目统计报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000003'
          },
          {
            menuId: '20705000000',
            menuLink: '/StaffPresentTeach',
            menuName: '员工面授培训明细表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000003'
          },
        {
            menuId: '20705000000',
            menuLink: '/KpiTable',
            menuName: '机构培训KPI报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000003'
          },
          {
            menuId: '20705000000',
            menuLink: '/LiveBroadcastBaseInfo',
            menuName: '机构直播基本资料报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000004'
          },
          {
            menuId: '20705000000',
            menuLink: '/newEmployeeStudy',
            menuName: '机构新员工星火计划各阶段学习任务完成明细表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000004'
          },
          {
            menuId: '20705000000',
            menuLink: '/CompletionRate',
            menuName: '各阶段任务完成率统计表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000004'
          },
          {
            menuId: '20707000000',
            menuLink: '/StudyRecord',
            menuName: '个人学习记录清单明细报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000004'
          },
          {
            menuId: '20705000000',
            menuLink: '/NewStaffTrain',
            menuName: '新员工面授培训报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000005'
          },
       {
            menuId: '20706000000',
            menuLink: '/PerCapitaHour',
            menuName: '机构人均课时报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000006'
          },
          {
            menuId: '20706000000',
            menuLink: '/OnlineRate',
            menuName: '线上化率报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000006'
          },
          {
            menuId: '20706000000',
            menuLink: '/TrainingCourseLineUsage',
            menuName: '机构培训班线上使用情况明细表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000006'
          },
          {
            menuId: '20706000000',
            menuLink: '/OrganizationCost',
            menuName: '机构纬度费用明细表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000007'
          },
          {
            menuId: '20706000000',
            menuLink: '/PersonCost',
            menuName: '人员纬度费用明细表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000007'
          },
          {
            menuId: '20706000000',
            menuLink: '/ProjectCost',
            menuName: '项目纬度费用明细表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000007'
          },
         {
            menuId: '20706000000',
            menuLink: '/OnlineStatistic',
            menuName: '案例学习统计报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000008'
          },
          {
            menuId: '20705000000',
            menuLink: '/SystemManagementDict',
            menuName: '字典表管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20509000015'
          },
          {
            menuId: '20705000000',
            menuLink: '/TemplateManagement',
            menuName: '模板管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20509000015'
          },
          {
            menuId: '20705000000',
            menuLink: '/LaunchSetupManagement',
            menuName: '功能开关',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20509000020'
          },
          {
            menuId: '20705100000',
            menuLink: '/FaceTeachingRecord',
            menuName: '面授记录',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21202000001'
          },
          {
            menuId: '20705200000',
            menuLink: '/MicroClassRecord',
            menuName: '微课记录',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21202000001'
          },
  {
            menuId: '20705300000',
            menuLink: '/LiveRecord',
            menuName: '直播记录',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21202000001'
          },
          {
            menuId: '20705400000',
            menuLink: '/FaceTeachingRecordS',
            menuName: '培训师面授记录',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21203000001'
          },
          {
            menuId: '20705500000',
            menuLink: '/MicroClassRecordS',
            menuName: '培训师微课记录',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21203000001'
          },
          {
            menuId: '20705600000',
            menuLink: '/LiveRecordS',
            menuName: '培训师直播记录',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '21203000001'
          },
          {
            menuId: '2070530000017',
            menuLink: '/YBLecturerInfo',
            menuName: '银保讲师信息管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000001'
          },
          {
            menuId: '2070530000018',
            menuLink: '/YBLecturerLecturesShare',
            menuName: '银保讲师授课/分享管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000001'
          },
        {
            menuId: '2070530000019',
            menuLink: '/YBLecturerCurricularRD',
            menuName: '银保讲师课程研发管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000001'
          },
          {
            menuId: '2070530000025',
            menuLink: '/BranchOfCourse',
            menuName: '分行培训班管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000001'
          },
          {
            menuId: '2070530000026',
            menuLink: '/YBLecturerEmpowerManagement',
            menuName: '讲师授权管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000001'
          },
          {
            menuId: '2070530000020',
            menuLink: '/YBTrainHonorCategory',
            menuName: '银保培训荣誉类别管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000002'
          },
          {
            menuId: '2070530000021',
            menuLink: '/YBTrainHonor',
            menuName: '银保培训荣誉管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000002'
          },
         {
            menuId: '2070530000023',
            menuLink: '/ZNBusinessZone',
            menuName: '知鸟业务专区',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000003'
          },
          {
            menuId: '2070530000022',
            menuLink: '/ZNCourseCatalogue',
            menuName: '知鸟课程目录',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000003'
          },
          {
            menuId: '2070530000024',
            menuLink: '/OfficeStaffHR',
            menuName: '内勤人力清单',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000003'
          },
          {
            menuId: '2070530000027',
            menuLink: '/GoodCourseSuggest',
            menuName: '好课推荐管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000004'
          },
          {
            menuId: '2070530000028',
            menuLink: '/TrainExpressManagement',
            menuName: '培训速递内容管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2023180000004'
          },

          {
            menuId: '207053000001',
            menuLink: '/OrganizationStaff',
            menuName: '机构员工学时清单明细',
           menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000004'
          },
          {
            menuId: '207053000002',
            menuLink: '/EndAndReimbusementReport',
            menuName: '项目结训与报销及时性统计表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000004'
          },
          {
            menuId: '2070530000011',
            menuLink: '/UserFeedback',
            menuName: '用户反馈',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20509000015'
          },
          {
            menuId: '2070530000012',
            menuLink: '/ConsumerProtectionTrain',
            menuName: '平安银行消费者权益保护培训台账',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '2070530000016'
          },
          {
            menuId: '20705300000121',
            menuLink: '/JudgesList',
            menuName: '评委名单管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000008'
          },
          {
            menuId: '207053000001211',
            menuLink: '/CaseScoreDetail',
            menuName: '案例评价明细报表',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20700000008'
          },
         {
            menuId: '20730000006',
            menuLink: '/LadderCoverage',
            menuName: '岗位阶梯覆盖率报表',
            menuLvl: 4,
            pageSort: 6,
            childMenus: null,
            prnMenuId: '20700000006'
          },
          {
            menuId: '207300000091',
            menuLink: '/TalentsProgressReport',
            menuName: '潜才培养进度统计表',
            menuLvl: 4,
            pageSort: 6,
            childMenus: null,
            prnMenuId: '20700000009'
          },
          {
            menuId: '207300000092',
            menuLink: '/TrainingManageReport',
            menuName: '新人培养管理统计表',
            menuLvl: 4,
            pageSort: 6,
            childMenus: null,
            prnMenuId: '20700000010'
          },
          {
            menuId: '20519000001',
            menuLink: '/ManageCompany',
            menuName: '管理单位管理',
            menuLvl: 4,
            pageSort: 2,
            childMenus: null,
            prnMenuId: '20509000005'
          },
          {
            menuId: '20730000007',
            menuLink: '/SubBranchManager',
            menuName: '支行长培养报表',
            menuLvl: 4,
            pageSort: 7,
            childMenus: null,
            prnMenuId: '20700000006'
          },
        ],
        umId: 'LUOGUANREN063'
      }
    }
  },
  methods: {
    changeCollapse() {
      this.collapse = !this.collapse
      this.$store.commit('app/updateAsideCollapse', this.collapse)
    },
    gopath(path, parm) {
      if (parm != undefined) {
        this.$router.push({
          path,
         query: {
            postId: parm
          }
        })
      } else {
        addAllowKeepAlive(path)
        this.$router.push({
          path
        })
      }
    },
    /**
     * 逻辑变更：
     * 分离数据处理与业务处理
     * 通过item对像下有无子菜单进行判断，如无则认为是一级菜单，点击即加载路由
     * 如果需要跳转第三方，应当于数据入口处对数据进行组装，对对应id的菜单添加属性：
     * thirdPartyUrl: url
     *
     */
    handleClick(item) {
      if (!item.childMenus.length) {
        this.gopath(item.menuLink)
      }
      if (item.thirdPartyUrl) {
        window.open(item.thirdPartyUrl)
      }
    }
  },
  computed: {
    menuList() {
      // return this.$store.state.userInfo.menuInfoList;
      if (process.env.VUE_APP_LOCAL === '1') {
        this.$store.state.userInfo.menuInfoList = this.localdata.menuInfoList
        this.$store.state.userInfo.thirdLvlMenuList = this.localdata.thirdLvlMenuList
        this.$store.state.userInfo.fourLvlMenuList = this.localdata.fourLvlMenuList
        return this.localdata.menuInfoList
      } else {
        return this.$store.state.userInfo.menuInfoList
      }
    }
  }
}
</script>

<style lang="scss">
.wrapper {
  position: relative;
  height: 100%;
  min-height: 100vh;
}
.global-aside {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #233545;
  .menu-wrapper {
    flex: 1;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  .hrx-home-logo {
    position: sticky;
    top: 0;
    height: 60px;
    padding: 15px;
    cursor: pointer;
    z-index: 10;
    background-color: #233545;
    text-align: center;
    .small {
      width: 20px;
      margin: 6px 0 0 8px;
    }
    .big {
      width: 90px;
      // height: 24px;
    }
  }
  .el-menu {
    border-right: #233545;
    .home-submenu {
      pointer-events: none;
    }
    .active-route {
      .el-icon-message:before {
        background-image: url('../assets/images/home/home2.png');
      }
      .el-icon-menu:before {
        background-image: url('../assets/svg/gangweipandianbai.svg');
      }
      .el-icon-menu-2:before {
        background-image: url('../assets/svg/peixunshi2-bai.svg');
      }
      .el-icon-menu-3:before {
        background-image: url('../assets/svg/jiangshiguanli-bai.svg');
      }
      .el-icon-menu-4:before {
        background-image: url('../assets/svg/kechengguanli.svg');
      }
      .el-icon-menu-5:before {
        background-image: url('../assets/svg/peixunjihuaguanli.svg');
      }
      .el-icon-menu-6:before {
        background-image: url('../assets/svg/xinghuojihua.svg');
      }
      .el-icon-menu-7:before {
        background-image: url('../assets/svg/baobiaozhongxin.svg');
      }
   .el-icon-menu-8:before {
        background-image: url('../assets/svg/lixiang.svg');
      }
      .el-icon-menu-9:before {
        background-image: url('../assets/svg/xitongguanli1.svg');
      }
      .el-icon-menu-10:before {
        background-image: url('../assets/svg/sicai1.svg');
      }
      .el-icon-menu-11:before {
        background-image: url('../assets/svg/anlizhongxin1.svg');
      }
      .el-icon-menu-12:before {
        background-image: url('../assets/svg/ai.svg');
      }
      .el-icon-menu-13:before {
        background-image: url('../assets/svg/qiancai.svg');
      }
      .el-icon-menu-14:before {
        background-image: url('../assets/svg/jietipeixunguanli.svg');
      }
      .el-icon-menu-15:before {
        background-image: url('../assets/svg/xinrenpeiyang.svg');
      }
      .el-icon-menu-16:before {
        background-image: url('../assets/svg/data-dashboard.svg');
      }
      span {
        color: #ffffff;
      }
      & + i {
        &::before {
          background-image: url('../assets/svg/jiantoubai.svg');
        }
        color: #ffffff;
      }
    }

    .el-menu-item {
      font-size: 12px;
      min-width: 177px;
      padding-right: 0 !important;
    }
    .el-icon-message:before {
      background-image: url('../assets/images/home/home.png') !important;
    }
    .el-icon-menu {
      &:before {
        content: '';
        display: block;
        width: 30px;
        height: 40px;
        background: url('../assets/images/home/gangweipandian 2.png') center center no-repeat;
        background-size: 70%;
      }

      &-2:before {
        background-image: url('../assets/svg/peixunshi2.svg');
      }
      &-3:before {
        background-image: url('../assets/svg/jiangshi--hui.svg');
      }
  &-4:before {
        background-image: url('../assets/svg/kechengguanlihui.svg');
      }
      &-5:before {
        background-image: url('../assets/svg/peixunjihuaguanlihui.svg');
      }
      &-6:before {
        background-image: url('../assets/svg/xinghuojihua2.svg');
      }
      &-7:before {
        background-image: url('../assets/svg/baobiaozhongxin2.svg');
      }
      &-8:before {
        background-image: url('../assets/svg/lixiang2.svg');
      }
      &-9:before {
        background-image: url('../assets/svg/xitongguanli2.svg');
      }
      &-10:before {
        background-image: url('../assets/svg/sicai2.svg');
      }
      &-11:before {
        background-image: url('../assets/svg/anlizhongxin2.svg');
      }
      &-12:before {
        background-image: url('../assets/svg/ai-back.svg');
      }
      &-13:before {
        background-image: url('../assets/svg/qiancai.svg');
      }
      &-14:before {
        background-image: url('../assets/svg/jietipeixunguanlihui.svg');
      }
      &-15:before {
        background-image: url('../assets/svg/xinrenpeiyang.svg');
      }
      &-16:before {
        background-image: url('../assets/svg/data-dashboard.svg');
      }
    }

    .el-icon-message:before {
      width: 14px;
      height: 14px;
      background-size: 100%;
    }
    .el-submenu__title {
      font-size: 12px;
      & [class^='el-icon-'] {
        &::before {
          width: 16px;
          height: 16px;
          background-size: 100%;
        }
      }
    }
    &:not(.el-menu--collapse) {
      .el-submenu__title {
        padding-left: 10px !important;
      }
    }
  }
 .el-menu--collapse .el-submenu {
    .el-submenu__title {
      text-align: center;
    }
    .el-icon-menu {
      width: 16px !important;
    }
  }
  .no-arrow .el-submenu__icon-arrow.el-icon-arrow-down {
    display: none;
  }
  .fold-btn {
    position: sticky;
    display: flex;
    height: 56px;
    bottom: 0;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transform: rotate(180deg);
    background-color: #233545;
    z-index: 10;

    &.collapse {
      padding-right: 20px;
      justify-content: flex-end;
      transform: rotate(0deg);
    }
  }
}
.el-menu-item {
  font-size: 12px !important;
}
</style>
