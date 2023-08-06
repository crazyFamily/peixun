<template>
  <div class="components__custom-picker el-date-editor">
    <el-dropdown trigger="click" ref="dropdown" @command="handleCommand">
      <div class="el-dropdown-link">
        <el-input>
          <i slot="suffix"></i>
        </el-input>
      </div>
      <el-dropdown-menu slot="dropdown">
        <div
          class="
            el-picker-panel__body-wrapper
            components__custom-picker__dropdown
          "
        >
          <div class="el-picker-panel__body">
            <div
              class="el-date-picker__header el-date-picker__header--bordered"
            >
              <button
                type="button"
                aria-label="前一年"
                @click="currYear--"
                class="
                  el-picker-panel__icon-btn
                  el-date-picker__prev-btn
                  el-icon-d-arrow-left
                "
              ></button
              ><span role="button" class="el-date-picker__header-label"
                >{{ currYear }} 年</span
              ><button
                type="button"
                aria-label="后一年"
                @click="currYear++"
                class="
                  el-picker-panel__icon-btn
                  el-date-picker__next-btn
                  el-icon-d-arrow-right
                "
              ></button>
            </div>
            <div class="el-picker-panel__content">
              <div class="quarter" v-show="type === 'quarter'">
                <el-dropdown-item
                  :command="item"
                  v-for="item in quarterArray"
                  :key="item"
                  >{{ item }}</el-dropdown-item
                >
              </div>
              <div class="half-year" v-show="type === 'half-year'">
                <el-dropdown-item
                  :command="item"
                  v-for="item in halfYearArray"
                  :key="item"
                  >{{ item }}</el-dropdown-item
                >
              </div>
         </div>
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { quarterArray, halfYearArray } from './util'
export default {
  name: 'custom-picker',
  props: {
    type: {
      type: String,
      default: 'quarter'
    }
  },
  data() {
    return {
      currYear: '',
      quarterArray,
      halfYearArray
    }
  },

  methods: {
    show() {
      this.$refs.dropdown.show()
    },
    handleCommand(value) {
      this.$emit('input', `${this.currYear}年${value}`)
      this.$emit('change', `${this.currYear}年${value}`)
    }
  },
  mounted() {
    this.currYear = new Date().getFullYear()
  }
}
</script>

<style lang="scss">
.components__custom-picker {
  &__dropdown {
    width: 200px;
    .quarter,
    .half-year {
      display: flex;
      flex-wrap: wrap;
      margin: 10px 0 -10px;
      .el-dropdown-menu__item {
        display: flex;
        width: 50%;
        height: 40px;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        &:hover {
          color: $themeColor;
          cursor: pointer;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
