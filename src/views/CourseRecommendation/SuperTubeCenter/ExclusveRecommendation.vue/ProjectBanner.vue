<template>
  <div class="SuperTubeCenter__ProjectBanner">
    <el-form
      class="content-form item-mb30 dr-label-ws"
      :model="hotForm"
      label-width="60px"
    >
      <el-form-item label="栏目名称">
        <el-input disabled v-model="hotForm.layoutName"></el-input>
      </el-form-item>
      <el-form-item label="Banner图管理">
        <p class="tintColor">
          推荐比例（670px*168px），支持 jpg、png格式，文件大小不超过1M
        </p>
        <div class="items" v-for="(banner, i) in hotBanners" :key="i">
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
                  class="banner-uploader"
                  :size="1024"
                  :udmpId.sync="banner.bannerUdmp"
                  single
                />
              </el-form-item>
              <el-form-item label="选择课程包" class="mt20" required>
                <gc-select
                  w1
                  k="projectName"
                  v="projectId"
                  class="p0"
                  v-model="banner.projectId"
                  :options="projectOptions"
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
</template>

<script>
import { jsonHeaders, merge, CopyObj } from '@/util/utils'
export default {
  props: {
    layoutData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 热门课程包专区 form
      hotForm: {
        layoutName: ''
      },
      // 热门课程包 banners
      hotBanners: [
        {
          bannerUdmp: '',
          bannerName: '',
          projectId: '',
          projectName: ''
        }
      ],
      projectOptions: []
    }
  },
  methods: {
    // 添加一个空的banner
    addBanner() {
      if (this.hotBanners.length >= 5)
        return this.$message.warning('banner图最多5个')
      this.hotBanners.push({
        bannerUdmp: '',
        bannerName: '',
        linkType: '',
        linkUrl: ''
      })
    },
    // 移除一个banner
    delBanner(i) {
      if (this.hotBanners.length < 2) return
      this.hotBanners.splice(i, 1)
    },
    // 获取所有项目信息
    getProjectOptions() {
      this.$axios
        .post('/fn/privatewealth/project/listAllProject', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.forEach((v) => (v.projectId = +v.projectId))
            this.projectOptions = data
          }
        })
    },
    // 修改按钮事件
    editBanner() {
      const data = CopyObj({ list: this.hotBanners })
      for (let i = 0; i < data.list.length; i++) {
        const v = data.list[i]
        if (!v.bannerUdmp)
          return this.$message.warning(`Banner图${i + 1}封面未选择`)
        if (!v.projectId)
          return this.$message.warning(`Banner图${i + 1}课程包未选择`)
      }

      return this.$axios
        .post(
          '/fn/privatewealth/project/saveProjectBanner',
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
    // 获取banner
    getBanners() {
      this.$axios
        .post('/fn/privatewealth/project/listProjectBanner', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            if (data.length) {
              this.hotBanners = data
            }
          }
        })
    }
  },
  mounted() {
    this.getProjectOptions()
  },
  watch: {
    layoutData: {
      immediate: true,
      handler(n) {
        merge(this.hotForm, n)
        this.getBanners()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.SuperTubeCenter__ProjectBanner {
  :deep(.content-form) {
    .item {
      height: auto;
    }
    .banner-uploader {
      .el-upload-list {
        height: 84px;
      }
      .el-upload-list__item {
        width: 335px;
        height: 84px;
        border-radius: 8px;
      }
      .el-upload {
        width: 84px;
        height: 84px;
        line-height: 82px;
        .box {
          line-height: 82px;
        }
      }
    }
  }
}
</style>