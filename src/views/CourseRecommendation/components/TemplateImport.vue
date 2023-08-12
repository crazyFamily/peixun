<template>
  <!-- 模版导入 dialog -->
  <gc-model
    title="模版导入"
    width="500px"
    customClass="course-recommendation__topic-template-import"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div class="df">
      <div class="left mr20 l26">上传文件</div>
      <div class="right">
        <div class="df">
          <gc-fileInput btn-text="选择文件" />
          <div class="b926 ml20">
            <span class="instructor-icons__download margin-0 gary-color">
              <i class="instructor-icons__download__icon"></i>
              模版下载
            </span>
          </div>
        </div>
        <p class="mt10 aic tintColor">
          <i class="icons-wraning mr10"></i>
          需先下载模版，添加数据后再上传文件，请勿修改模版格式。
        </p>
        <div class="doc-box mt20">
          <span>
            <i class="operation__doc mr10"></i>
            aaa
            <i class="operation__close ml15"></i>
          </span>
        </div>
      </div>
    </div>
  </gc-model>
</template>

<script>
export default {}
</script>

<style lang="scss">
.course-recommendation__new-course,
.course-recommendation__new-project,
.course-recommendation__topic-template-import {
  .doc-box {
    display: flex;
    height: 30px;
    span {
      display: flex;
      padding: 0 12px 0 10px;
      background: #f7f8fa;
      border-radius: 2px;
      align-items: center;
    }
  }
}
</style>
