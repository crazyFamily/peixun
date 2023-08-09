<template>
  <div class="curriculumManagement__externalCurriculum">
    <div class="curriculumManagement__externalCurriculum__data relative" v-show="showIndex === 0">
      <el-card class="search-card">
        <el-form ref="form" :model="queryForm" :inline="true">
          <el-form-item label="条线分类">
            <gc-select class="padding-0" :options="blgStripLineOptions" v-model="queryForm.blgStripLine"></gc-select>
          </el-form-item>
          <el-form-item label="课程名称">
            <gc-input :maxlength="33" v-model="queryForm.courseName"></gc-input>
          </el-form-item>
          <el-form-item label="讲师名称">
            <gc-input v-model="queryForm.teacherName" placeholder="请输入讲师名称"></gc-input>
          </el-form-item>
          <el-form-item label="供应商名称">
            <gc-input v-model="queryForm.supplyName"></gc-input>
          </el-form-item>
          <el-form-item label="课程分类">
            <gc-select
              v-if="$store.state.userInfo.blgStripLine === LINE_LS"
              class="w-200"
              :options="courseClassifyOptions"
              @change="changeCaseClassify($event)"
              v-model="queryForm.courseClassifyId"
            ></gc-select>
            <el-cascader
              v-else
              clearable
              v-model="queryForm.courseClassifyId"
              :options="courseClassifyOptions"
              :props="{ value: 'tagId', label: 'tagName' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="课程标签">
            <el-cascader
              clearable
              v-if="$store.state.userInfo.blgStripLine === LINE_LS"
              :options="tagOptions"
              :props="cascaderProps"
              collapse-tags
              @visible-change="setEmptyContent"
              v-model="queryForm.courseTagIds"
              ref="multipleCascaderRef"
            >
            </el-cascader>
            <el-select v-else multiple v-model="queryForm.courseTagIds" collapse-tags>
              <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <gc-input label="创建人" v-model="queryForm.umOrName" placeholder="请输入创建人姓名/UM号"></gc-input>
          </el-form-item>
          <div class="search-card__button">
            <el-button @click="query" type="primary">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form>
      </el-card>

      <el-card class="mt10">
        <div class="menu-right">
          <span class="instructor-icons__add" @click="handleAdd">
            <i class="instructor-icons__add__icon"></i>
            新增
          </span>
          <span class="instructor-icons__del" @click="delCurriculum">
            <i class="instructor-icons__del__icon"></i>
            删除
          </span>
          <span class="instructor-icons__download" @click="handleExport('/fn/course/external/reportExternalCourseList', getData())">
            <i class="instructor-icons__download__icon"></i>
            导出</span
          >
        </div>

        <gc-table
          class="scroll__table curriculumManagement__externalCurriculum__data__curriculum-table"
          ref="curriculumTableRef"
          :list="curriculumList"
          :tableList="curriculumTableList"
          v-loading="loadingTable"
          @sort-change="tableSortHandle"
        >
          <el-table-column label="课程" min-width="240" prop="courseName"></el-table-column>
          <el-table-column label="供应商" min-width="253" prop="supplyNames"></el-table-column>
          <el-table-column label="讲师" min-width="109" prop="teacherNames"></el-table-column>
          <el-table-column label="此课程授课次数" min-width="120" prop="lecturesNum">
            <template slot-scope="scope">
              <span class="active" @click="openCouseTeachNumber(scope.row)"> {{ scope.row.lecturesNum }} </span>
            </template>
          </el-table-column>
          <el-table-column label="授课评分" min-width="110" prop="courseScore" sortable='custom'></el-table-column>
          <el-table-column show-overflow-tooltip label="课程分类" min-width="226" prop="courseClassifyName"></el-table-column>
          <el-table-column label="课程标签" min-width="212" class-name="coursetagname" prop="courseTagNameList">
            <template slot-scope="scope">
              <div v-if="scope.row.courseTagNameList.length < 3">
                <template v-for="(tag,index) in scope.row.courseTagNameList">
                  <span class="coursetagname__tag" :key="index" v-if="tag">
                    {{ tag }}
                  </span>
                </template>
              </div>
              <span v-else v-for="tagIndex in 2" class="coursetagname__tag" :key="tagIndex">
                {{ scope.row.courseTagNameList[tagIndex] }}
              </span>
              <el-tooltip v-if="scope.row.courseTagNameList.length >= 3" class="coursetagname" placement="bottom" popper-class="coursetagname " effect="light">
                <div slot="content">
                  <template v-for="(tag,tagIndex) in scope.row.courseTagNameList">
                    <span class="coursetagname__tag" :key="tagIndex" v-if="tag">
                      {{ tag }}
                    </span>
                  </template>
                </div>
                <div>
                  <span class="coursetagname__tag circle">
                    +{{ scope.row.courseTagNameList.length - 2 }}
                  </span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="创建人" width="200" prop="createdBy" :formatter="(row) => renderName(row.createdByName, row.createdBy)"> </el-table-column>
          <el-table-column
            label="创建日期"
            min-width="100"
            prop="createdByDate"
            :formatter="(row) => (row.createdByDate ? row.createdByDate.split(' ')[0] : '')"
          >
          </el-table-column>
          <el-table-column width="200" label="更新人" prop="updateBy" :formatter="(row) => renderName(row.updatedByName, row.updatedBy)">
          </el-table-column>
          <el-table-column min-width="100" label="更新日期" prop="updatedByDate"> </el-table-column>
          <el-table-column label="操作" min-width="90" fixed="right">
            <template slot-scope="scope">
              <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
                <div slot="content" class="tooltip__operation">
                  <span class="active mr20" @click="lookInfo(scope.row, true)">查看</span>
                  <span class="active mr20" @click="lookInfo(scope.row, false)">修改</span>
                </div>
                <el-button class="button-48-24">操作</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </gc-table>

        <gc-pagination
          :total="total"
          layout="prev, pager, next,slot, sizes"
          prev-text=""
          next-text=""
          :page-sizes="[10, 20]"
          :page-size="queryForm.pageSize"
          :current-page="queryForm.currPage"
          @sizeChange="sizeChange($event, queryForm, getCurriculumList)"
          @currentChange="currentChange($event, queryForm, getCurriculumList)"
          class="between"
        >
          <span class="text">每页显示</span>
        </gc-pagination>
      </el-card>
    </div>
    <div class="curriculumManagement__externalCurriculum__newAdd" v-show="showIndex === 1">
      <el-card class="curriculumManagement__externalCurriculum__newAdd__title">
        <div class="curriculumManagement__externalCurriculum__newAdd__wrapper" style="width: 820px">
          <template v-for="(item,i) in addInfoList">
            <div v-if="i" class="curriculumManagement__externalCurriculum__newAdd__title__line"></div>
            <div class="curriculumManagement__externalCurriculum__newAdd__title__menu" @click="addInfoIndex = i+1">
              <div class="curriculumManagement__externalCurriculum__newAdd__title__menu__num" :class="{ 'active-state': addInfoIndex === i+1 }">{{i+1}}</div>
              <div class="curriculumManagement__externalCurriculum__newAdd__title__menu__text">{{item}}</div>
            </div>
          </template>
        </div>
      </el-card>
      <el-card ref="newAddContent" class="curriculumManagement__externalCurriculum__newAdd__content mt10" v-show="addInfoIndex === 2">
        <div class="curriculumManagement__externalCurriculum__newAdd__content__tabs">
          <div class="curriculumManagement__externalCurriculum__newAdd__content__tabs__box__wrapper">
            <div class="curriculumManagement__externalCurriculum__newAdd__content__tabs__box">
              <div
                class="curriculumManagement__externalCurriculum__newAdd__content__tabs__tab hover"
                :class="{
                  'active-default': lecturerIndex === index
                }"
                @click="lecturerIndex = index"
                v-for="(item, index) in lecturerList"
                :key="index"
              >
                <span class="teacher-name">
                  <span class="ellipsis-word">{{ item.teacherName || `讲师${numMaping[index]}` }}</span>
                  <i class="icon__close" @click.stop="delLecturer(index)"></i>
                </span>
              </div>
              <el-button class="button-60-blue-primary mb12" @click="addLecturer">添加</el-button>
              <el-button class="button-60-blue-primary mb12" @click="resetLecturer">重置</el-button>
            </div>
          </div>
        </div>
        <div class="curriculumManagement__externalCurriculum__newAdd__wrapper">
          <el-form
            :inline="true"
            :model="item"
            :rules="lecturerFormRules"
            :ref="`lecturerFormRef${index}`"
            :disabled="disabled"
            class="curriculumManagement__externalCurriculum__newAdd__content__form"
            v-for="(item, index) in lecturerList"
            :key="index"
            v-show="lecturerIndex === index"
          >
            <el-form-item class="mr35" prop="teacherName">
              <div class="label necessary-before">
                <div class="between f1">
                  <span>姓</span>
                  <span>名</span>
                </div>
              </div>
              <el-autocomplete
                v-model="item.teacherName"
                :fetch-suggestions="querySearchTeacherName"
                placeholder="请输入姓名"
                @select="handleTeacherNameSelect"
                :disabled="item.teacherNameDisabled || item.teacherPhone.disabled"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item prop="teacherSex">
              <div class="label necessary-before">
                <div class="between f1">
                  <span>性</span>
                  <span>别</span>
                </div>
              </div>
              <div class="curriculumManagement__externalCurriculum__newAdd__content__form__small-box">
                <el-radio v-model="item.teacherSex" :label="1">男</el-radio>
                <el-radio v-model="item.teacherSex" :label="2">女</el-radio>
              </div>
            </el-form-item>
            <el-form-item class="mr35" prop="teacherPhone">
              <div class="label necessary-before">
                <div class="between f1">
                  <span>电</span>
                  <span>话</span>
                </div>
              </div>
              <el-input v-model.trim="item.teacherPhone.teacherPhone" :disabled="item.teacherPhone.disabled"></el-input>
            </el-form-item>
            <el-form-item prop="teacherEmail">
              <div class="label necessary-before">
                <div class="between f1">
                  <span>邮</span>
                  <span>箱</span>
                </div>
              </div>
              <el-input v-model="item.teacherEmail"></el-input>
            </el-form-item>
            <el-form-item class="mr35" prop="teacherOffer">
              <div class="label necessary-before">
                <div class="between f1">
                  <span>报</span>
                  <span>价</span>
                </div>
              </div>
              <el-input v-model.number="item.teacherOffer" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item prop="expertType">
              <div class="label necessary-before">
                <div class="between f1">擅长类型</div>
              </div>
              <el-input v-model="item.expertType" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="label">
                <div>擅长领域</div>
              </div>
              <el-input type="textarea" resize="none" :maxlength="1000" v-model="item.expertField"></el-input>
            </el-form-item>
            <el-form-item prop="supplyName" class="curriculumManagement__externalCurriculum__newAdd__content__form__lang">
              <div class="label necessary-before">供应商名称</div>
              <el-input v-model="item.supplyName" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="label">
                <div>公司介绍</div>
              </div>
              <el-input type="textarea" resize="none" :maxlength="1000" v-model="item.supplyDesc"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="curriculumManagement__externalCurriculum__newAdd__content__buttons">
          <el-button class="button-w80-h30 mr20" @click="addInfoIndex = 1">上一步</el-button>
          <el-button class="button-w80-h30" type="primary" @click="addInfoIndex = 3">下一步</el-button>
        </div>
      </el-card>
      <el-card class="curriculumManagement__externalCurriculum__newAdd__info mt10" v-show="addInfoIndex === 1">
        <div class="curriculumManagement__externalCurriculum__newAdd__wrapper">
          <el-form
            :inline="true"
            :model="addCurriculumInfoForm"
            :rules="addCurriculumInfoFormRules"
            :disabled="disabled"
            ref="addCurriculumInfoFormRef"
            class="curriculumManagement__externalCurriculum__newAdd__content__form"
          >
            <el-form-item class="curriculumManagement__externalCurriculum__newAdd__content__form__lang" prop="courseName">
              <div class="label necessary-before">课程名称</div>
              <el-input v-model="addCurriculumInfoForm.courseName" :disabled="curriculumDisabled" :maxlength="33"></el-input>
            </el-form-item>
            <el-form-item class="mr35" prop="courseApply">
              <div class="label necessary-before">
                <div>适用对象</div>
              </div>
              <el-input v-model="addCurriculumInfoForm.courseApply" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item prop="classHour">
              <div class="label necessary-before fend">
                <div>课时</div>
              </div>
              <el-input v-model.trim="addCurriculumInfoForm.classHour"></el-input>
              <span class="ml10">小时</span>
            </el-form-item>
            <el-form-item class="curriculumManagement__externalCurriculum__newAdd__content__form__lang" prop="courseClassify">
              <div class="label necessary-before">课程分类</div>
              <gc-select
                v-if="$store.state.userInfo.blgStripLine === LINE_LS"
                class="p0 course-classify wfull"
                :disabled="disabled"
                :options="courseClassifyOptions"
                @change="changeCaseClassify($event, 'add')"
                v-model="addCurriculumInfoForm.courseClassify"
              ></gc-select>
              <CurriculumClassification
                v-else
                @change="treeChange('addCurriculumInfoFormRef', 'courseClassify')"
                :disabled="disabled"
                :blgStripLine="blgStripLine"
                v-model="addCurriculumInfoForm.courseClassify"
              />
            </el-form-item>
            <el-form-item class="curriculumManagement__externalCurriculum__newAdd__content__form__lang" prop="courseTag">
              <div class="label necessary-before">课程标签</div>
              <CurriculumLabel
                v-if="$store.state.userInfo.blgStripLine === LINE_LS"
                :disabled="disabled"
                :tree="caseTagOptions"
                :courseTag="addCurriculumInfoForm.courseTag"
                @change="courseTagChange($event, 'addCurriculumInfoForm', 'addCurriculumInfoFormRef')"
                :preced-rules="labelPrecedRules"
              >
              </CurriculumLabel>
              <CurriculumLabel
                v-else
                :disabled="disabled"
                :blgStripLine="blgStripLine"
                :courseTag="addCurriculumInfoForm.courseTag"
                @change="courseTagChange($event, 'addCurriculumInfoForm', 'addCurriculumInfoFormRef')"
                :preced-rules="labelPrecedRules"
              />
            </el-form-item>
            <el-form-item prop="courseDesc">
              <div class="label necessary-before">
                <div>课程简介</div>
              </div>
              <el-input type="textarea" resize="none" :maxlength="1000" v-model="addCurriculumInfoForm.courseDesc"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="curriculumManagement__externalCurriculum__newAdd__content__buttons">
          <el-button class="button-w80-h30 mr20" @click="handleBack">返回</el-button>
          <el-button class="button-w80-h30" type="primary" @click="addInfoIndex = 2">下一步</el-button>
        </div>
      </el-card>
      <el-card class="curriculumManagement__externalCurriculum__newAdd__info mt10" v-if="addInfoIndex === 3">
        <div class="curriculumManagement__externalCurriculum__newAdd__wrapper">
          <UploadData :disabled="disabled" :showDownload="disabled || curriculumDisabled" class="mt30" :row="uploadRow" v-model="addCurriculumInfoForm.files" />
        </div>
        <div class="curriculumManagement__externalCurriculum__newAdd__content__buttons">
          <el-button class="button-w80-h30 mr20" @click="addInfoIndex = 2">上一步</el-button>
          <el-button :disabled="disabled" class="button-w80-h30" type="primary" @click="handleAddSubmit">提交</el-button>
        </div>
      </el-card>
    </div>

    <!-- 授课明细弹窗 -->
    <CouseTeachDetail :show.sync="isShowCourseTeachDetail" :data-info="couseTeachRow" :course-id="selectedCouseId || ''"></CouseTeachDetail>
  </div>
</template>

<script>
import { CopyObj, sizeChange, jsonHeaders, handleExport, arrToTree, closeCurrPage, currentChange, getCurriculumTree, renderName } from '../../util/utils'
import { fetchListTags } from '@/fetch/caseCenter'
import { busiTypes, NO_STATUS, YES_STATUS, LINE_LS } from '@/util/constants'
import UploadData from './components/UploadData.vue'
import CurriculumLabel from './components/CurriculumLabel.vue'
import { fetchListEngagedCourseTag  } from '@/fetch/curriculumManagement'
import CurriculumClassification from './components/CurriculumClassification.vue'
import CouseTeachDetail from './components/CouseTeachDetail.vue'
import { APIAllTree } from '@/fetch/public'

export default {
  name: 'ExternalCurriculumManagement',
  components: {
    CurriculumClassification,
    CurriculumLabel,
    UploadData,
    CouseTeachDetail
  },
  data() {
    var checkCourseName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入课程名字'))
      }
      if (this.curriculumDisabled) {
        return callback()
      }
      return this.$axios.post('/fn/course/external/checkRepeatCourseName', { data: { courseName: value } }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (!data || data.checkResult !== 'Y') {
          return callback(new Error('课程名不可用'))
        }
        return callback()
      })
    }
    var checkPhone = (rule, value, callback) => {
      if (!value.teacherPhone) {
        return callback(new Error('请输入手机号码'))
      }
      const match = /^1(3([0-35-9]\d|4[1-8])|4[14-9]\d|5([0-35689]\d|7[1-79])|66\d|7[2-35-8]\d|8\d{2}|9[13589]\d)\d{7}$/
      if (!value.teacherPhone.match(match)) {
        return callback(new Error('手机号码格式错误'))
      }
      if ((value.item || {}).teacherName === (value.lecturer || {}).teacherName && (value.item || {}).teacherPhone === value.teacherPhone)
        return callback()
      return callback()
    }
    return {
      addInfoList: ['填写课程信息','填写讲师信息','上传课件'],
      // 显示哪个div
      showIndex: 0,
      // 课程数据总条数
      total: 0,
      // 搜索表单
      queryForm: {
        // 条线
        blgStripLine: '',
        // 机构id
        blgOrg: '',
        // 课程名字
        courseName: '',
        // 供应商名字
        supplyName: '',
        // 课程分类
        courseClassifyId: [],
        // 标签分类集合
        courseTagIds: [],
        // 排序标识
        scoreIsUp: undefined,
        currPage: 1,
        pageSize: 10
      },
      // 课程分类 options
      courseClassifyOptions: [],
      // 选择标签的下拉框数据
      tagOptions: [],
      // 条线 select options
      blgStripLineOptions: [],
      // pagesize 改变处理事件
      sizeChange,
      // 页码改变处理函数
      currentChange,
      // 课程表格字段
      curriculumList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          width: '54',
          label: '序号'
        }
      ],
      // 课程表格 数据数组
      curriculumTableList: [],
      // 填写课程信息 页面显示的 form 对象
      addCurriculumInfoForm: {
        files: []
      },
      // 填写课程信息 页面显示的 默认 form 对象
      addCurriculumInfoFormInit: {
        // 机构条线
        blgStripLine: '',
        // 机构id
        blgOrg: '',
        // 课程name
        courseName: '',
        // 课程适用对象
        courseApply: '',
        // 课程描述
        courseDesc: '',
        // 课程分类id
        courseClassify: '',
        // 课程标签id
        courseTag: '',
        // 讲师集合
        externalTeacherList: [],
        files: []
      },
      // 填写课程信息 form rules 对象
      addCurriculumInfoFormRules: {
        blgStripLine: [{ required: true, message: '请选择机构线条' }],
        blgOrg: [{ required: true, message: '请选择部门' }],
        courseApply: [{ required: true, message: '请填写适用对象' }],
        courseName: [{ trigger: 'blur', validator: checkCourseName }],
        courseDesc: [
          {
            required: true,
            message: '请填写课程描述',
            trigger: 'blur'
          }
        ],
        courseClassify: [
          {
            required: true,
            message: '请选课程分类',
            trigger: 'change'
          }
        ],
        courseTag: [
          {
            required: true,
            message: '请选择课程标签',
            trigger: 'change'
          }
        ],
        classHour: [
          { required: true, message: '请填写课时', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (!/^\d+((\.\d{1,1})?|(\.))$/.test(value)) {
                return callback(new Error())
              }
              return callback()
            },
            trigger: 'blur',
            message: '课时必须是大于等于0，支持填写小数点后一位'
          }
        ]
      },
      // 课程名是否可被修改
      curriculumDisabled: false,
      // 讲师数组 存放所有讲师
      lecturerList: [],
      // 填写讲师信息 讲师tab 索引
      lecturerIndex: 0,
      // 填写讲师信息 页面显示的 form 对象
      lecturerForm: {
        // 讲师name
        teacherName: '',
        // 讲师name是否禁止修改
        teacherNameDisabled: false,
        teacherId: '',
        // 0:新增;其它:原id
        id: '',
        // 性别:1男,2:女
        teacherSex: '',
        // 电话号码
        teacherPhone: { teacherPhone: '' },
        // email
        teacherEmail: '',
        // 课时费
        teacherOffer: '',
        // 擅长类型
        expertType: '',
        // 擅长领域
        expertField: '',
        // 供应商名字
        supplyName: '',
        // 供应商描述
        supplyDesc: ''
      },
      // // 填写讲师信息 页面显示的 form 验证对象
      lecturerFormRules: {
        teacherName: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
        teacherSex: [
          {
            required: true,
            message: '选择性别',
            trigger: 'change'
          }
        ],
        teacherPhone: [{ validator: checkPhone, trigger: 'blur' }],
        teacherEmail: [
          { required: true, message: '请填写email', trigger: 'blur' },
          {
            type: 'email',
            message: '请填写正确email格式',
            trigger: 'blur'
          }
        ],
        teacherOffer: [
          {
            required: true,
            message: '请填写报价费',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '报价必须是数字',
            trigger: 'blur'
          },
          {
            validator(rule, value, callback) {
              if (value >= 0) {
                return callback()
              }
              return callback(new Error())
            },
            message: '报价必须大于0',
            trigger: 'blur'
          }
        ],
        expertType: [
          {
            required: true,
            message: '请填擅长类型',
            trigger: 'blur'
          }
        ],
        supplyName: [
          {
            required: true,
            message: '请填供应商信息',
            trigger: 'blur'
          }
        ]
      },
      // 添加 讲师 课程tab 信息
      addInfoIndex: 1,
      // 课程使用情况 dialog 状态
      curriculumStateVisible: false,
      // 讲师授课信息 dialog table 数据数组
      lecturerTeachInfoTableList: [],
      // 讲师授课信息 dialog table 数据查询 form
      lecturerTeachInfoForm: {
        courseId: '',
        isCourseBased: 'N',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
      // 传递给 下载组件 的数据对象
      row: {},
      // 传递给 上传组件 的数据对象
      uploadRow: {},
      // 深拷贝函数
      CopyObj,
      // 课程标签数组
      curriculumLabelTreeData: [],
      // 课程分类树
      curriculumClassificationTreeData: [],
      // 中文数字数组
      numMaping: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
      // 是否禁用表单
      disabled: false,
      // 课程分类 标签的条线
      blgStripLine: '',
      // 判断是否是 立项页面过来的
      state: '',
      // 标签对象
      tagDict: {},
      // 是否展开授课明细
      isShowCourseTeachDetail: false,
      // 授课内容
      couseTeachRow: {},
      // 选择的课程id
      selectedCouseId: null,
      handleExport,
      APIAllTree,
      renderName,
      loadingTable: false,
      LINE_LS,
      tagsList: [],
      cascaderProps: { value: 'value', label: 'label', multiple: true },
      caseTagOptions: []
    }
  },
  methods: {
    // 课程查询事件
    query() {
      this.queryForm.currPage = 1
      this.getCurriculumList()
    },
    // 课程搜索重置事件
    reset() {
      this.queryForm = this.$options.data.call(this).queryForm
      if (this.$store.state.userInfo.blgStripLine === this.LINE_LS) {
        this.$nextTick(() => {
          this.tagOptions = []
        })
      }
      this.getCurriculumList()
    },
    // 查询条线分类
    getBlgStripLineOptions() {
      // return this.$axios.post('/fn/user/selectTree', { module: 'courseModule' }, jsonHeaders).then((res) => {
      return this.$axios.post(APIAllTree, { module: 'courseModule' }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          data.forEach((v) => {
            v.value = v.busiType
            v.label = busiTypes.find((row) => row.value === v.value)?.label
          })
          this.blgStripLineOptions = data
        }
      })
    },
    getData() {
      const data = CopyObj(this.queryForm)
      if (this.$store.state.userInfo.blgStripLine === this.LINE_LS) {
        data.courseClassifyId = Array.isArray(data.courseClassifyId) ? data.courseClassifyId[0] : data.courseClassifyId
        if(data.courseTagIds && data.courseTagIds.length) {
          // courseTagIds为空，可能getCheckedNodes不为空
          data.courseTagIds = this.$refs.multipleCascaderRef?.getCheckedNodes().map(v => v.value) || []
        }
      } else {
        data.courseClassifyId = data.courseClassifyId.slice(-1)[0] || ''
      }
      return { data }
    },
    // 获取课程数据
    getCurriculumList() {
      const data = this.getData()
      this.loadingTable = true
      this.$axios.post('/fn/course/external/listCourseInfo', data, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.curriculumTableList = data.list
          this.curriculumTableList.forEach(v=>{
            v.courseTagNameList = v.courseTagName?.split(';') || []
          })
          this.total = data.total
        }
      }).finally(()=>{
        this.loadingTable = false
      })
    },
    // 删除课程 提示
    delCurriculum() {
      const selection = this.$refs.curriculumTableRef.$children[0].selection
      if (selection.length < 1) {
        return this.$nextTick(() => {
          this.$message.warning('请勾选课程')
        })
      }
      this.$alert('确定删除此课程？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: `loginTimeout`
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const courseIdList = selection.map((v) => v.courseId)
            this.$axios.post('/fn/course/external/deleteCourseByCourseId', { courseIdList }, jsonHeaders).then((res) => {
              if (res.data.code === 0) {
                this.$message.success('删除成功')
              }
              this.getCurriculumList()
            })
          }
        })
        .catch((err) => err)
    },
    // 获取使用过的标签
    async getAllTag() {
      const tagOptions = await fetchListEngagedCourseTag({
        data: {
          blgStripLine: this.$store.state.userInfo.blgStripLine
        }
      })
      tagOptions.forEach(v => {
        v.label = v.tagName
        v.value = v.tagId
      })
      this.tagOptions = tagOptions
    },
    // 讲师授课信息 dialog 获取table数据 方法
    getLecturerTeachInfoList() {
      const data = CopyObj(this.lecturerTeachInfoForm)
      this.$axios.post('/fn/course/external/listUsedCourseByCourseId', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { list, total } = data
          this.lecturerTeachInfoForm.total = total
          this.lecturerTeachInfoTableList = list
        }
      })
    },
    // 课程评分情况 dialog 获取table数据 方法
    getCurriculumGradeList() {},
    // 重置 课程信息表单 讲师信息表单
    resetForm() {
      this.addCurriculumInfoForm = CopyObj(this.addCurriculumInfoFormInit)
      this.lecturerList = [CopyObj(this.lecturerForm)]
      this.addInfoIndex = 1
      this.curriculumDisabled = false
    },
    // 打开新增页面
    handleAdd() {
      const blgStripLine = this.queryForm.blgStripLine || this.$store.state.userInfo.blgStripLine
      if (!blgStripLine) {
        return this.$message.warning('请先选择条线分类')
      }
      this.showIndex = 1
      this.disabled = false
      this.resetForm()
      this.blgStripLine = blgStripLine
    },
    //  添加一个讲师
    addLecturer() {
      if (this.disabled) return
      if (this.lecturerList.length >= 7) return
      this.lecturerList.push(CopyObj(this.lecturerForm))
      this.lecturerIndex++
    },
    // 重置讲师信息
    resetLecturer() {
      if (this.disabled) return
      this.lecturerList.splice(this.lecturerIndex, 1, CopyObj(this.lecturerForm))
    },
    // 删除一个讲师信息
    delLecturer(index) {
      if (this.disabled) return
      if (this.lecturerList.length <= 1) return
      this.lecturerList.splice(index, 1)
      if (this.lecturerIndex > 0) {
        this.lecturerIndex--
      }
    },
    // 输入讲师姓名时给出建议
    querySearchTeacherName(queryString, cb) {
      if (!queryString.trim()) return cb([])
      const blgStripLine = this.$store.state.userInfo.blgStripLine
      const data = { teacherName: queryString, blgStripLine }
      this.$axios
        .post('/fn/course/external/listTeacherInfoByName', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.forEach((v) => {
              v.value = `${v.teacherName} （${v.supplyName}）`
            })
            cb(data)
          } else {
            cb([])
          }
        })
        .catch((err) => cb([]))
    },
    // 选择给出的讲师建议 后的回掉
    handleTeacherNameSelect(item) {
      const lecturer = this.lecturerList[this.lecturerIndex]
      Object.keys(lecturer).forEach((key) => {
        if (item[key]) {
          if (key === 'teacherPhone') {
            lecturer.teacherPhone = {
              teacherPhone: item[key],
              item,
              lecturer,
              disabled: true
            }
          } else if (key === 'teacherOffer') {
            lecturer[key] = parseInt(item[key]) || 0
          } else {
            lecturer[key] = item[key]
          }
          if (key === 'teacherSex') {
            this.$refs[`lecturerFormRef${this.lecturerIndex}`][0].validateField('teacherSex')
          }
        }
      })
    },
    // 验证课程信息和讲师信息
    checkFormData() {
      return new Promise(async (resolve, reject) => {
        const curriculumValied = await this.$refs.addCurriculumInfoFormRef.validate().catch(() => {})
        if (!curriculumValied) {
          this.$message.error('课程信息验证错误')
          return reject()
        }
        for (let i = 0, len = this.lecturerList.length; i < len; i++) {
          const lecturerValied = await this.$refs[`lecturerFormRef${i}`][0].validate().catch(() => {})
          if (!lecturerValied) {
            this.$message.error(`${this.lecturerList[i].teacherName || '讲师' + this.numMaping[i]} 讲师信息验证错误`)
            return reject()
          }
        }
        resolve()
      })
    },
    // 处理参数
    handleFormData() {
      const data = CopyObj(this.addCurriculumInfoForm)
      const teacherPhoneList = []
      this.lecturerList.forEach((v) => {
        v.isUpdatePhone = 'N'
        if (v.teacherPhone.item) {
          if (v.teacherPhone.item.teacherName !== v.teacherName) {
            v.teacherId = ''
          } else if (v.teacherPhone.item.teacherPhone !== v.teacherPhone.teacherPhone) {
            v.isUpdatePhone = 'Y'
          }
        }
        teacherPhoneList.push(v.teacherPhone)
        v.teacherPhone = v.teacherPhone.teacherPhone
        if (!v.id) {
          delete v.id
        }
      })
      const externalTeacherList = CopyObj(this.lecturerList)
      this.lecturerList.forEach((v, index) => {
        v.teacherPhone = teacherPhoneList[index]
      })
      data.externalTeacherList = externalTeacherList
      return data
    },
    // 新增课程提交事件
    handleAddSubmit() {
      const url = this.curriculumDisabled ? '/fn/course/external/updateCourse' : '/fn/course/external/addCourse'
      this.checkFormData()
        .then(() => {
          const data = this.handleFormData()
          this.$axios.post(url, { data }, jsonHeaders).then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              if (this.state === 'course') {
                this.state = ''
                closeCurrPage(this.$route.name)
              } else {
                this.$message.success('操作成功')
                this.getCurriculumList()
                this.showIndex = 0
                this.getAllTag()
              }
            }
          })
        })
        .catch((err) => {
          if (err) {
            this.$message.error(err)
          }
        })
    },
    // 查询课程信息 并转化为符合本页面的数据格式
    conversion(data) {
      const externalTeacherList = data.externalTeacherList
      delete data.externalTeacherList
      externalTeacherList.forEach((v) => {
        v.teacherPhone = {
          teacherPhone: v.teacherPhone,
          item: CopyObj(v),
          lecturer: v
        }
        v.teacherOffer = parseInt(v.teacherOffer)
      })
      this.lecturerList = externalTeacherList
      data.classHour = data.classHour
      if (this.$store.state.userInfo.blgStripLine === this.LINE_LS) {
        let selectItem = this.courseClassifyOptions.find(item => item.value === data.courseClassify)
        if(!selectItem) {
          data.courseClassify  = ''
        } else {
          let newArr = []
          newArr.push(selectItem)
          arrToTree(newArr, this.tagsList)
          newArr = newArr[0]?.children || []
          this.caseTagOptions = newArr
        }
      }
      this.addCurriculumInfoForm = data
    },
    // 查看课程信息 打开更新页面 公共函数
    lookInfo(row, disabled) {
      const { courseId } = row
      this.$axios.post('/fn/course/external/findCourseInfoByCourseId', { courseId }, jsonHeaders).then((res) => {
        let { code, data } = res.data
        if (code === 0) {
          if (!data) {
            data = { externalTeacherList: [{}] }
          }
          if (!disabled) {
            this.curriculumDisabled = true
            data.externalTeacherList.forEach((v) => {
              v.teacherNameDisabled = true
            })
          }
          this.blgStripLine = data.blgStripLine
          this.showIndex = 1
          this.conversion(data)
          this.disabled = disabled
        }
      })
    },
    // 递归获取可以选择的标签
    getDeepTag(tree, results) {
      tree.forEach((item) => {
        if (!item.children) {
          results.push(item)
        } else {
          this.getDeepTag(item.children, results)
        }
      })
    },
    // 标签树组件的change事件
    treeChange(ref, field) {
      this.$refs[ref].validateField(field)
    },
    // 课程标签组件 change事件
    courseTagChange(value, form, ref) {
      this[form].courseTag = value
      this.$refs[ref].validateField('courseTag')
    },
    // 等待用户信息加载完成再获取数据
    delayGetData() {
      setTimeout(() => {
        if (this.$store.state.userInfo.blgStripLine) {
          this.queryForm.blgStripLine = this.$store.state.userInfo.blgStripLine
          this.getCurriculumList()
          if (this.$store.state.userInfo.blgStripLine !== this.LINE_LS) {
            this.getAllTag()
          }
        } else {
          this.delayGetData()
        }
      }, 100)
    },
    // 返回 事件
    handleBack() {
      if (this.state !== 'course') {
        this.state = ''
        this.showIndex = 0
      } else {
        closeCurrPage(this.$route.name)
      }
    },
    getTagDict() {
      this.$axios
        .post(
          '/fn/course/tag/selectCourseTagsForReview',
          {
            data: {
              tagType: '1',
              blgStripLine: 'LS'
            }
          },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.forEach((v) => {
              this.tagDict[v.tagId] = v.tagName
            })
          }
        })
    },
    // 更新日期显示
    updateDataRanderHandle(row) {
      if (!row.updatedByDate) return ''
      const createdBydate = row.createdByDate?.split(' ')[0]
      const updatedByDate = row.updatedByDate?.split(' ')[0]
      if (createdBydate === updatedByDate) return ''
      return updatedByDate
    },
    // 展开课程授课明细
    openCouseTeachNumber(row) {
      this.couseTeachRow = row
      this.selectedCouseId = row.courseId
      console.log(row, this.selectedCouseId, '===>> row');
      this.isShowCourseTeachDetail = true
    },
    // 监听排序
    tableSortHandle({ order }) {
      switch(order) {
        // 降序
        case 'descending':
          this.queryForm.scoreIsUp = NO_STATUS
          break
        // 升序
        case 'ascending':
          this.queryForm.scoreIsUp = YES_STATUS
          break
        // 不排序
        default:
          this.queryForm.scoreIsUp = undefined
      }
      this.getCurriculumList()
    },
    changeCaseClassify(val, add) {
      let selectItem = this.courseClassifyOptions.find(item => item.value === val)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      if (add) {
        this.addCurriculumInfoForm.courseTag = ''
        this.caseTagOptions = newArr
      } else {
        this.queryForm.courseTagIds = []
        this.$nextTick(() => {
          this.tagOptions = newArr
        })
      }
    },
    labelPrecedRules() {
      if(!this.addCurriculumInfoForm.courseClassify) {
        this.$message.warning('请先选择课程分类')
        return false
      }
      return true
    },
    // 设置数据为空时的方法
    setEmptyContent(n) {
      if (n) {
        this.$nextTick(() => {
          const emptyEle = this.$refs.multipleCascaderRef.popperElm.querySelector('.el-cascader-menu__empty-text')
          if (emptyEle) {
            emptyEle.innerText = '请先选择分类'
          }
        })
      }
    }
  },
  mounted() {
    this.getBlgStripLineOptions().then(async () => {
      this.delayGetData()
      console.log('this.blgStripLine',this.$store.state.userInfo.blgStripLine)
      switch(this.$store.state.userInfo.blgStripLine) {
        // 降序
        case this.LINE_LS:
          // 零售获取课程分类及课程标签
          const data = await fetchListTags({ data: { blgStripLine: this.blgStripLine, tagType: 5 } })
          this.tagsList =
            data?.map(v => ({
              value: v.tagId,
              tagId: v.tagId,
              label: v.tagName,
              tagName: v.tagName,
              tagLevel: v.tagLevel,
              parentTagId: v.parentTagId
            })) || []
          this.courseClassifyOptions = this.tagsList.filter(v => v.tagLevel === '1')
          this.$refs.multipleCascaderRef && (this.$refs.multipleCascaderRef.$el.querySelector('.el-input').style.width = '350px')
          break
        default:
          getCurriculumTree(1, this.queryForm.blgStripLine || this.$store.state.userInfo.blgStripLine).then((data) => {
            this.courseClassifyOptions = data
          })
      }
      
    })
  },
  created() {
    // 初始设置用户的UM进行创建人查询
    this.queryForm.umOrName = this.$store.state.userInfo.umId
    this.getTagDict()
  },
  activated() {
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.handleAdd()
    }
  },
  watch: {
    showIndex(newValue) {
      if (newValue !== 0) {
        this.$nextTick(() => {
          this.$refs.addCurriculumInfoFormRef.clearValidate()
          for (let i = 0, len = this.lecturerList.length; i < len; i++) {
            this.$refs[`lecturerFormRef${i}`][0].clearValidate()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.curriculumManagement__externalCurriculum {
  &__search-card {
    .gc-select .label,
    .gc-input .label {
      width: auto;
    }

    .el-select,
    .el-input {
      width: 170px;
    }

    &__item__label {
      display: flex;
      width: calc(666px + (100% - 894px) / 3 * 2 + 10px / 3);
      .label {
        line-height: 30px;
        margin-right: 10px;
      }
      .el-select {
        flex: 1;
        .el-input,
        input {
          width: 100%;
        }
      }
    }
  }
  &__newAdd {
    &__wrapper {
      display: flex;
      width: 666px;
      margin: auto;
      align-items: center;
    }
    &__title {
      line-height: 36px;
      &__menu {
        display: flex;
        &__num {
          position: relative;
          width: 36px;
          height: 36px;
          margin-right: 15px;
          border-radius: 50%;
          border: 1px solid #e0e1e3;
          text-align: center;
          font-size: 16px;
          color: #7d8292;

          &.active-state {
            position: relative;
            width: 28px;
            height: 28px;
            margin: 4px 19px 0 4px;
            background: #fd6720;
            line-height: 28px;
            color: #ffffff;
            z-index: 2;
            &::after {
              position: absolute;
              display: block;
              content: '';
              width: 36px;
              height: 36px;
              top: calc(50% - 18px);
              left: calc(50% - 18px);
              background: #fd6720;
              opacity: 0.28;
              border-radius: 50%;
              z-index: -1;
            }
          }
        }
      }
      &__line {
        flex: 1;
        margin: 0 20px;
        height: 0;
        border: 1px solid #eaecf1;
      }
    }
    &__content {
      .el-card__body {
        padding: 20px 0;
      }

      &__tabs {
        height: 38px;
        border-bottom: 1px solid #eaecf1;

        &__box {
          display: flex;
          width: 910px;
          height: 38px;
          overflow: hidden;
          align-items: center;
          &__wrapper {
            width: 666px;
            height: 38px;
            margin: auto;
          }
        }

        &__tab {
          display: flex;
          width: 92px;
          height: 38px;
          padding: 6px 0 12px 0;
          line-height: 20px;
          overflow: hidden;
          flex-shrink: 0;
          color: #7d8292;
          &:hover .icon__close {
            display: block;
          }

          .teacher-name {
            position: relative;
            max-width: 8ch;
            font-size: 14px;
            height: 20px;
            color: inherit;
          }
          .ellipsis-word {
            width: 100%;
            display: block;
            overflow: hidden;
            white-space: nowrap;
            word-break: break-all;
            text-overflow: ellipsis;
          }

          .icon__close {
            display: none;
            right: -15px;
          }
        }
        .active-default span::after {
          position: absolute;
          display: inline-block;
          content: '';
          width: 100%;
          height: 2px;
          left: 0;
          bottom: -12px;
          background-color: #fd6720;
        }
      }

      &__form {
        .el-form-item__content {
          display: flex;
          margin-top: 30px;
          .label {
            display: flex;
            width: 55px;
            margin-right: 10px;
            flex-shrink: 0;
          }
          .el-input {
            width: 250px;
          }
        }

        .el-form-item {
          margin-right: 0;
          &.mr35 {
            margin-right: 35px;
          }
        }
        .el-form-item__error {
          margin-left: 65px;
        }

        .el-textarea {
          width: 600px;
          height: 180px;

          textarea {
            height: 100%;
          }
        }

        &__small-box {
          width: 200px;
          height: 30px;
          padding-top: 2px;
          display: flex;
          align-items: center;
        }

        &__lang {
          width: 100%;
          .label {
            white-space: nowrap;
            justify-content: flex-end;
          }

          .el-input {
            flex: 1;
            width: auto;
          }
        }
      }

      &__buttons {
        margin-top: 30px;
        text-align: center;
      }
    }
    &__info {
      .el-card__body {
        padding-top: 0;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__error {
        margin-left: 65px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.coursetagname {
  .coursetagname__tag {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    color: #909399;
    line-height: 22px;
    padding: 0 8px;
    margin: 10px 0px 0 10px;
    background: #f4f4f5;
  }
  .circle {
    border-radius: 11px;
    padding: 0 4px;
  }
}
.curriculumManagement__externalCurriculum :deep(td.coursetagname .cell) {
  margin: -10px 0 0 -10px;
}
.course-classify :deep(.el-select),
.course-classify :deep(.el-input) {
  width: 100% !important;
}
</style>
