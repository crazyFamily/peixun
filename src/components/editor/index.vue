<template>
  <div class="gc-editor">
    <div :class="`editor-container editor-container-${classId}`" :style="`width: ${width || '850px'}`"></div>
    <div class="rule-tips" v-show="maxLen">{{ contentLen }} / {{ maxLen }}</div>
  </div>
</template>

<script>
import wangEditor from 'wangeditor'
import { uploadFile, handleUdmpHref, uuid } from '@/util/utils'
export default {
  name: 'gc-editor',
  props: {
    maxLen: Number,
    contentText: String,
    width: String
  },
  data() {
    return {
      contentLen: 0,
      editor: null,
      editorData: '',
      classId: ''
    }
  },
  mounted() {
    this.classId = uuid()
    this.$nextTick(() => {
      this._initEditor()
    })
  },
  methods: {
    // 初始化富文本
    _initEditor() {
      let editor = new wangEditor(`.editor-container-${this.classId}`)
      // 0: "head"
      // 1: "bold"
      // 2: "fontSize"
      // 3: "fontName"
      // 4: "italic"
      // 5: "underline"
      // 6: "strikeThrough"
      // 7: "indent"
      // 8: "lineHeight"
      // 9: "foreColor"
      // 10: "backColor"
      // 11: "link"
      // 12: "list"
      // 13: "todo"
      // 14: "justify"
      // 15: "quote"
      // 16: "emoticon"
      // 17: "image"
      // 18: "video"
      // 19: "table"
      // 20: "code"
      // 21: "splitLine"
      // 22: "undo"
      // 23: "redo"
      let menus = editor.config.menus
      editor.config.menus = menus.filter(
        (item) =>
          !['code', 'video', 'quote', 'todo', 'redo', 'fullscreen'].includes(
            item
          )
      )
      editor.config.uploadImgMaxLength = 1
      editor.config.customUploadImg = (files, insert) => {
        uploadFile({
          files: files[0],
          busiId: '',
          reimClass: ''
        }).then((res) => {
          const { code, data } = res.data
          if (code !== 0) {
            return this.$message.warning('图片上传失败')
          }
          insert(handleUdmpHref(data[0].udmpId))
        })
      }
      editor.config.onchange = (n) => {
        this.contentLen = n.replace(/<\/?.+?>/g, '').length
        this.$emit('change', { content: n, len: this.contentLen })
      }
      editor.create()
      this.editor = editor
    }
  },
  watch: {
    contentText: {
      handler(n) {
        if (n) {
          this.editor && this.editor.txt.html(n)
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style lang="scss">
.gc-editor {
  position: relative;
}
.editor-container {
  width: 850px;
  position: relative;
  z-index: 1;
  :deep(.w-e-text-container) {
    padding-bottom: 30px;
    box-sizing: border-box;
  }
}
.rule-tips {
  width: calc(100% - 25px);
  text-align: right;
  border: 1px solid #c9d8db;
  border-top: 0;
  background-color: #fff;
  padding: 0 10px;
  position: absolute;
  right: 25px;
  bottom: 0;
  color: #aeb0b8;
  z-index: 2;
}
</style>
<style>
.gc-editor .w-e-toolbar .w-e-menu:last-child {
  display: none;
}
</style>
