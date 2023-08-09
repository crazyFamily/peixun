<template>
  <!-- 下载资料 dialog -->
  <gc-model
    title="下载资料"
    :visible="downloadDataVisible"
    width="648px"
    @close="downloadDataVisible = false"
    @cancel="downloadDataVisible = false"
    @comfirm="downloadDataVisible = false"
    :isShowFooter="false"
    class="curriculumManagement__downloadData"
  >
    <div class="curriculumManagement__uploadData__box">
      <div class="curriculumManagement__uploadData__box__title">
        <div
          class="curriculumManagement__uploadData__box__title__menu"
          :class="{
            'active-default': downloadDataMenuIndex === 0,
            hover: downloadDataMenuIndex !== 0
          }"
          @click="downloadDataMenuIndex = 0"
        >
          课件 {{ courseNum }}
        </div>
        <div
          class="curriculumManagement__uploadData__box__title__menu"
          :class="{
            'active-default': downloadDataMenuIndex === 1,
            hover: downloadDataMenuIndex !== 1
          }"
          @click="downloadDataMenuIndex = 1"
        >
          讲师手册 {{ teacherNum }}
        </div>
        <div
          class="curriculumManagement__uploadData__box__title__menu"
          :class="{
            'active-default': downloadDataMenuIndex === 2,
            hover: downloadDataMenuIndex !== 2
          }"
          @click="downloadDataMenuIndex = 2"
        >
          学员手册 {{ studentNum }}
        </div>
        <div
          class="curriculumManagement__uploadData__box__title__menu"
          :class="{
            'active-default': downloadDataMenuIndex === 3,
            hover: downloadDataMenuIndex !== 3
          }"
          @click="downloadDataMenuIndex = 3"
        >
          其他 {{ otherNum }}
        </div>
      </div>
      <div
        class="curriculumManagement__uploadData__box__items ml20"
        v-if="filesItem.length > 0"
      >
        <div
          class="curriculumManagement__uploadData__box__items__item between"
          v-for="item in filesItem"
          :key="item.udmpId"
        >
          <div class="df">
            <i
              class="curriculumManagement__uploadData__box__items__item__icon"
            ></i>
            <div
              class="
                curriculumManagement__uploadData__box__items__item__filename
              "
              :class="{
                'width-auto': item.status !== 'exception'
              }"
            >
              <gc-tooltip :length="1">
                {{ item.fileName }}
              </gc-tooltip>
            </div>
          </div>

          <div
            class="curriculumManagement__downloadData__icon"
            @click="download(item)"
          >
            <span class="icons__download active r0">
              <i class="icons__download__icon"></i>
              下载
            </span>
          </div>
        </div>
      </div>
      <div class="curriculumManagement__uploadData__box__empty shallow" v-else>
        还未上传文件
      </div>
    </div>
  </gc-model>
</template>

<script>
import { downloadFile, jsonHeaders } from '../../../util/utils'
export default {
  props: ['row', 'state', 'isIntroduction', 'customRequest'],
  data() {
    return {
      // 下载资料 dialog 状态
      downloadDataVisible: false,
      // 下载资料 dialog 选项索引
      downloadDataMenuIndex: 0,
      // 接口api
      url: '',
      // 文件数组
      files: [],
      // 文件类型映射
      submoduleMaping: {
        0: 'course_file',
        1: 'teacher_file',
        2: 'student_file',
        3: 'other_file'
      }
    }
  },
  methods: {
    getFileList() {
      if (typeof this.customRequest === 'function') {
        this.customRequest().then((res) => {
          this.files = res
        })
        return
      }
      const { courseId } = this.row
      this.$axios.post(this.url, { courseId }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.files = data
        }
      })
    },
    // 下载文件
    download(item) {
      const { udmpId, fileName } = item
      downloadFile(udmpId, fileName).catch((err) => {
        this.$message.error(err)
      })
    }
  },
  mounted() {
    if (this.state === '1') {
      this.url = '/fn/course/internal/listUploadCourseFiles'
    } else if (this.state === '2') {
      this.url = '/fn/course/external/listUploadCourseFiles'
    }
  },
  watch: {
    row(newValue) {
      this.downloadDataVisible = true
      if (this.isIntroduction) {
        this.files = newValue.files || []
      } else if (this.url || this.customRequest) {
        this.getFileList()
      }
    }
  },
  computed: {
    courseNum() {
      return this.files.filter((v) => v.submodule === 'course_file').length
    },
    teacherNum() {
      return this.files.filter((v) => v.submodule === 'teacher_file').length
    },
    studentNum() {
      return this.files.filter((v) => v.submodule === 'student_file').length
    },
    otherNum() {
      return this.files.filter((v) => v.submodule === 'other_file').length
    },
    filesItem() {
      return this.files.filter(
        (v) => v.submodule === this.submoduleMaping[this.downloadDataMenuIndex]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.curriculumManagement {
  &__downloadData {
    .curriculumManagement__uploadData__box__items {
      padding-right: 53px;
    }
  }
  &__uploadData {
    &__box {
      padding-bottom: 20px;
      border: 1px solid #eaecf1;
      &__title {
        display: flex;
        height: 40px;
        background: #f7f8fa;
        color: #7d8292;
        &__menu {
          flex: 1;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
          &:nth-child(n + 2) {
            position: relative;
            &::after {
              display: block;
              content: '';
              position: absolute;
              width: 1px;
              height: 14px;
              left: 0;
              top: 13px;
              background-color: #eaecf1;
            }
          }
        }
      }
      &__items {
        &__item {
          display: flex;
          height: 20px;
          margin-top: 20px;
          align-items: center;
          line-height: 18px;

          &__icon {
            margin-right: 13px;
            width: 17px;
            height: 20px;
            vertical-align: middle;
            background: url('../../../assets/svg/putongwendang.svg') no-repeat
              center;
          }
          &__filename {
            width: 60px;
            height: 18px;
            margin-right: 10px;
          }
          &__progress {
            flex: 1;
            margin-top: 2px;
          }
        }
      }
      :deep(.el-progress-bar__outer) {
        height: 3px !important;
      }
      :deep(.el-icon-circle-close) {
        color: #7d8292;
      }
      :deep(.el-progress-bar__inner) {
        background-color: #fd6720;
      }
      &__empty {
        height: 120px;
        text-align: center;
        line-height: 140px;
      }
    }
  }
}
</style>
