<template>
  <div class="course-recommendation__field-management">
    <!-- banner 图显示 -->
    <div v-if="layoutId === 3">
      <el-form
        class="content-form item-mb30 dr-label-ws"
        :model="form"
        label-width="60px"
      >
        <el-form-item label="栏目名称">
          <el-input disabled v-model="form.layoutName"></el-input>
        </el-form-item>
        <el-form-item label="上级栏目">
          <el-cascader
            class="w-full"
            disabled
            v-model="form.prnLayoutId"
            :options="prnLayoutIdOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="Banner图管理">
          <p class="tintColor">
            推荐比例16：4，支持 jpg、png格式，文件大小不超过1M
          </p>
          <div class="items" v-for="(banner, i) in banners" :key="i">
            <div class="item">
              <div class="between">
                <span>Banner图{{ i + 1 }}</span>
                <div class="buttons">
                  <el-button
                    class="button-50-28 button-my-primary-plain"
                    @click="delBanner(i)"
                    >移除</el-button
                  >
                  <el-button
                    class="button-50-28 button-my-primary-plain"
                    @click="addBanner"
                    >添加</el-button
                  >
                </div>
              </div>
              <el-form label-width="67px">
                <el-form-item class="mt15" required>
                  <gc-upload
                    :size="1024"
                    :udmpId.sync="banner.bannerUdmp"
                    single
                  />
                </el-form-item>
                <el-form-item label="链接到" class="mt30" required>
                  <gc-select
                    w1
                    class="p0"
                    v-model="banner.linkType"
                    :options="linkTypeOptions"
                    @change="linkTypeChange(banner)"
                  ></gc-select>
                </el-form-item>
                <el-form-item
                  :label="`选择${getItem(banner.linkType).text}`"
                  class="mt20"
                  v-show="banner.linkType"
                  required
                >
                  <el-autocomplete
                    v-if="banner.linkType === 'course'"
                    class="w-full"
                    :trigger-on-focus="false"
                    value-key="courseName"
                    v-model="banner.linkUrl"
                    :fetch-suggestions="queryCourse"
                    placeholder="请输入内容"
                    @select="handleSelect($event, banner)"
                    @change="handleChange(banner)"
                  ></el-autocomplete>
                  <gc-select
                    w1
                    v-else
                    :k="getItem(banner.linkType).k"
                    :v="getItem(banner.linkType).v"
                    class="p0"
                    v-model="banner.linkUrl"
                    :options="getItem(banner.linkType).options"
                  ></gc-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" type="primary" @click="editBanner"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 课程包 banner 图显示 -->
    <div v-else-if="layoutId === 204">
      <ProjectBanner :layoutData="columnInfo" />
    </div>
    <!-- 非banner显示 -->
    <div v-else>
      <NewExclusiveRecommendation
        :columnInfo="columnInfo"
        ref="NewExclusiveRecommendation"
      />
    </div>
  </div>
</template>

<script>
import { merge, throttle, jsonHeaders, fromValueGetLabel } from '@/util/utils'
import gcUpload from '@/components/upload'
import ProjectBanner from './ProjectBanner.vue'
import NewExclusiveRecommendation from './NewExclusiveRecommendation'
import { CopyObj } from '../../../../util/utils'
export default {
  name: 'CRExclusiveRecommendation',
  components: {
    gcUpload,
    ProjectBanner,
    NewExclusiveRecommendation
  },
  inject: ['parentParams', 'refreshTree'],
  data(vm) {
    return {
      // 栏目id
      layoutId: '',
      // 表单数据
      form: {
        layoutName: '',
        prnLayoutId: 1,
        lowerType: 'course'
      },
      // 父级栏目下拉选项
      prnLayoutIdOptions: [
        {
          label: '专属推荐',
          value: 1
        }
      ],
      // 栏目数据
      columnInfo: {},
      banners: [
        {
          bannerUdmp: '',
          bannerName: '',
          linkType: '',
          linkUrl: ''
        }
      ],
      // banner类型 下拉选项
      linkTypeOptions: [
        {
          label: '栏目',
          value: 'layout'
        },
        {
          label: '课程详情',
          value: 'course'
        },
        {
          label: '组合课程项目',
          value: 'project'
        }
        // {
        //     label: "直播",
        //     value: "live"
        // },
        // {
        //     label: "考试详情",
        //     value: "test"
        // }
      ],
      linkTypeDict: {
        layout: {
          k: 'layoutName',
          v: 'layoutId',
          text: '栏目',
          options: [],
          getBannerName: vm.getBannerName
        },
        course: {
          text: '课程',
          getBannerName(banner) {
            return banner.linkUrl
          }
        },
        project: {
          k: 'projectName',
          v: 'projectId',
          text: '课程',
          options: [],
          getBannerName: vm.getBannerName
        }
        // live: {
        //     text: "直播"
        // },
        // test: {
        //     text: "考试"
        // }
      }
    }
  },
  methods: {
    // 后台数据转化为本页合适的数据
    serveDataToWebData(data) {
      merge(this.form, data)
    },
    // 获取 banner 信息
    getBanners() {
      this.$axios
        .post('/fn/privatewealth/layout/listLayoutBannerBatch', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            if (data.list.length) {
              data.list.forEach((v) => {
                if (v.linkType === 'course') {
                  v.courseId = v.linkUrl
                  v.linkUrl = v.bannerName
                }
              })
              this.banners = data.list
            }
          }
        })
    },
    // 修改按钮事件
    editBanner() {
      const data = CopyObj({ list: this.banners })
      for (let i = 0; i < data.list.length; i++) {
        const v = data.list[i]
        if (!v.bannerUdmp)
          return this.$message.warning(`Banner图${i + 1}封面未选择`)
        if (!v.linkType)
          return this.$message.warning(`Banner图${i + 1}链接类型未选择`)
        const state = this.linkTypeDict[v.linkType]
        if (!state) return this.$message.warning(`Banner图${i + 1}链接类型错误`)
        if (!v.linkUrl)
          return this.$message.warning(`Banner图${i + 1}链接详情未选择`)
        v.bannerName = state.getBannerName(v, v.linkUrl, state.options)
        if (v.linkType === 'course') {
          if (!v.courseId)
            return this.$message.warning(`Banner图${i + 1}课程未选择`)
          v.linkUrl = v.courseId
        }
      }

      return this.$axios
        .post(
          '/fn/privatewealth/layout/addLayoutBannerBatch',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('修改成功')
          }
        })
    },
    // 确认添加课程事件
    acknowledgement(selectedList, num) {
      console.log(266, 'ExclusiveRecommendation', selectedList, num)
      this.$refs.NewExclusiveRecommendation.acknowledgement(selectedList, num)
    },
    // 添加一个空的banner
    addBanner() {
      if (this.banners.length >= 5)
        return this.$message.warning('banner图最多5个')
      this.banners.push({
        bannerUdmp: '',
        bannerName: '',
        linkType: '',
        linkUrl: ''
      })
    },
    // 移除一个banner
    delBanner(i) {
      if (this.banners.length < 2) return
      this.banners.splice(i, 1)
    },
    getItem(type) {
      return (
        this.linkTypeDict[type] || {
          text: '',
          options: [],
          query: (_) => _
        }
      )
    },
    // 获取所有栏目
    getColumnOptions() {
      this.$axios
        .post('/fn/privatewealth/layout/findDiscoveryCourse')
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.forEach((v) => {
              v.layoutId += ''
            })
            this.linkTypeDict.layout.options = data
          }
        })
    },
    // 获取所有项目信息
    getProjectOptions() {
      this.$axios
        .post(
          'fn/privatewealth/project/listToProject',
          { data: {} },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.linkTypeDict.project.options = list
          }
        })
    },
    // 查询课程
    queryCourse(queryString, cb) {
      const data = { courseName: queryString }
      this.$axios
        .post('/fn/privatewealth/course/listTkCourses', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list } = data
            cb(list)
          }
        })
    },
    // 课程确认事件
    handleSelect(item, banner) {
      banner.courseId = item.courseId
    },
    // 连接到的类型变化事件
    linkTypeChange(banner) {
      banner.linkUrl = ''
      banner.bannerName = ''
    },
    getBannerName(banner, value, options) {
      return fromValueGetLabel(options, value, {
        k: this.k,
        v: this.v
      })
    },
    // 远程搜索变化事件
    handleChange(banner) {
      banner.courseId = ''
    }
  },
  beforeMount() {
    this.getColumnOptions()
    this.getProjectOptions()
  },
  mounted() {
    const params = this.$route.params
    this.rootType = params.rootType
    this.layoutId = params.layoutId
    if (this.layoutId === 3) {
      this.serveDataToWebData(params)
      this.getBanners()
    } else {
      this.columnInfo = { ...params }
    }
  },
  watch: {
    parentParams: {
      deep: true,
      handler(params) {
        this.rootType = params.rootType
        this.layoutId = params.layoutId
        if (this.layoutId === 3) {
          this.serveDataToWebData(params)
          this.getBanners()
        } else {
          this.columnInfo = { ...params }
        }
      }
    }
  },
  created() {
    this.editBanner = throttle(this.editBanner)
  }
}
</script>

<style lang="scss">
.course-recommendation__field-management {
  background-color: #fff;
  .content-form {
    width: 660px;
    margin: auto;
    .items {
      margin-top: -6px;
    }
    .item {
      height: 333px;
      margin-top: 20px;
      padding: 20px;
      background: rgba(#d8d8d8, 0.1);
      border-radius: 4px;
    }
  }
  .box-2 {
    padding: 30px 80px 0 45px;
    .right {
      width: 600px;
      .item {
        height: 140px;
        padding: 20px;
        margin-bottom: 20px;
        background: rgba(#d8d8d8, 0.1);
        border-radius: 4px;
      }
    }
  }
}
</style>