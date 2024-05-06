<template>
  <div
    class="demo-block"
    :class="[blockClass, { 'hover': hovering }]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <div class="meta" ref="meta" :style="{'height':initHeight+'px'}">
      <div class="description" v-if="$slots.default">
        <slot></slot>
      </div>
      <div class="highlight">
        <slot name="highlight"></slot>
      </div>
    </div>
    <div
      v-if="needScroll"
      class="demo-block-control"
      style="top: 10px"
      ref="control"
      :class="{ 'is-fixed': fixedControl }"
      @click="isExpanded = !isExpanded">
      <transition name="text-slide">
        <span>{{ controlText }}</span>
      </transition>
      <transition name="arrow-slide">
        <i :class="[iconClass, { 'hovering': hovering }]"></i>
      </transition>
    </div>
  </div>
</template>

<script type="text/babel">
  export default {
    name:'section-block',
    props: {
      initHeight:{
        type:Number,
        default:0
      }
    },
    data() {
      return {
        needScroll:true,
        codepen: {
          script: '',
          html: '',
          style: ''
        },
        hovering: false,
        isExpanded: false,
        fixedControl: false,
        scrollParent: null
      };
    },
    computed: {
      blockClass() {
        return `demo-zh-CN demo-${ this.$router.currentRoute.path.split('/').pop() }`;
      },
      iconClass() {
        return this.isExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down';
      },
      controlText() {
        return this.isExpanded ? '收起' : '查看全部';
      },
      codeArea() {
        return this.$el.getElementsByClassName('meta')[0];
      },
      codeAreaHeight() {
        if (this.$el.getElementsByClassName('description').length > 0) {
          return this.$el.getElementsByClassName('description')[0].clientHeight +
            this.$el.getElementsByClassName('highlight')[0].clientHeight + 10;
        }
        return this.$el.getElementsByClassName('highlight')[0].clientHeight;
      }
    },

    watch: {
      isExpanded(val) {
        this.codeArea.style.height = val ? `${ this.codeAreaHeight + 1 }px` : `${this.initHeight}px`;
        if (!val) {
          this.fixedControl = false;
          this.$refs.control.style.left = '0';
        }
      }
    },

    created() {
      const highlight = this.$slots.highlight;
      if (highlight && highlight[0]) {
        let code = '';
        let cur = highlight[0];
        if (cur.tag === 'pre' && (cur.children && cur.children[0])) {
          cur = cur.children[0];
          if (cur.tag === 'code') {
            code = cur.children[0].text;
          }
        }
      }
    },

    mounted() {
      this.$nextTick(() => {
        let highlight = this.$el.getElementsByClassName('highlight')[0];
        if (this.$el.getElementsByClassName('description').length === 0) {
          highlight.style.width = '100%';
          highlight.borderRight = 'none';
        }
      });
      setTimeout(_=>{//判断是否需要滚动
        if(this.codeAreaHeight<this.initHeight) this.needScroll = false
      },1300)
    },
  };
</script>

<style lang="scss" scoped>
  .demo-block {
    margin:20px;
    border-radius: 3px;
    transition: .2s;
    border-style:none!important;

    &.hover {
      // box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
    }

    code {
      font-family: Menlo, Monaco, Consolas, Courier, monospace;
    }

    .demo-button {
      float: right;
    }

    .meta {
      overflow: hidden;
      height: 0;
      transition: height .2s;
    }

    .description {
      box-sizing: border-box;
      border-radius: 3px;
      font-size: 14px;
      line-height: 22px;
      // color: #666;
      word-break: break-word;
      margin: 0 5px;
      background-color: #fff;

      p {
        margin: 0;
        line-height: 26px;
      }

      code {
        color: #5e6d82;
        background-color: #e6effb;
        margin: 0 4px;
        display: inline-block;
        padding: 1px 5px;
        font-size: 12px;
        border-radius: 3px;
        height: 18px;
        line-height: 18px;
      }
    }

    .highlight {
      pre {
        margin: 0;
      }

      code.hljs {
        margin: 0;
        border: none;
        max-height: none;
        border-radius: 0;

        &::before {
          content: none;
        }
      }
    }

    .demo-block-control {
      // height: 44px;
      box-sizing: border-box;
      background-color: #fff;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: left;
      margin-top: -1px;
      margin-left: 5px;
      // color: #d3dce6;
      color: #4994EC;
      cursor: pointer;
      position: relative;
      &.is-fixed {
        // position: fixed;
        bottom: 0;
        // width: 868px;
      }

      i {
        font-size: 14px;
        // line-height: 44px;
        color: #4994EC;
        transition: .3s;
        &.hovering {
          // transform: translateX(-40px);
          color: #409EFF;
        }
      }

      > span {
        // position: absolute;
        // transform: translateX(-30px);
        font-size: 12px;
        // line-height: 44px;
        transition: .3s;
        display: inline-block;
      }

      &:hover {
        color: #409EFF;
        // background-color: #f9fafc;
      }

      & .text-slide-enter,
      & .text-slide-leave-active {
        opacity: 0;
        transform: translateX(10px);
      }
     
      .control-button {
        line-height: 26px;
        position: absolute;
        top: 0;
        right: 0;
        font-size: 14px;
        padding-left: 5px;
        padding-right: 25px;
      }
    }
  }

    :deep(.el-icon-arrow-down::before) {
      content: '\e6df'!important;
    }
</style>