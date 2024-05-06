<script>
import Vue from 'vue'
import tablecolumnfilters from '@/components/tablecolumnfilters'
import { commonFilter } from '@/util/utils'
export default {
  props: {
    item: {
      type: Object
    },
    scopedSlots: Object
  },
  data() {
    return {
      // 默认的作用域插槽
      default: {
        // 类型为component的 之前写的以后估计用不到 用来处理可点击的列
        component: (item, props) =>
          this.$createElement('component', {
            is: item.ctx(props.row, props.$index)
          }),
        // 处理可点击的列
        click: (item, props) =>
          this.$createElement(
            'span',
            {
              class: 'active underline ellipsis',
              on: {
                click() {
                  item.handleClick(props)
                }
              }
            },
            props[item.label]
          )
      },
      // 具名插槽
      names: {
        // 用来处理可筛选的列
        tablecolumnfilters: (item) =>
          this.$createElement(tablecolumnfilters, {
            // 具名插槽属性
            slot: 'header',
            ref: 'tablecolumnfilters',
            // 组件属性
            props: {
              list: item.list,
              radio: item.radio,
              label: item.label,
              confirmText: '确定',
              className: 'table__screen__icon',
              popperClass: 'circular m183'
            },
            // 事件
            on: {
              /**
               * @param {} $event vue事件参数
               * commonFilter 公共过滤函数
               * tablecolumnfilters组件过滤事件
               */
              filter($event) {
                commonFilter(
                  $event,
                  item.queryForm,
                  item.labelKey,
                  item.getList,
                  'filter',
                  !item.radio
                )
              },
              // 重置事件
              reset($event) {
                commonFilter(
                  $event,
                  item.queryForm,
                  item.labelKey,
                  item.getList,
                  '',
                  !item.radio
                )
              }
            }
          })
      }
    }
  },
  methods: {
    // 处理组件属性
    handleAttr(col) {
      const { type, width, ctx, prop, ...data } = col
      if (col.type) {
        data.type = col.type
        data.width = col.width || 'atuo'
      } else {
        data['min-width'] = col.width
      }
      if (!col.ctx) {
        data.prop = col.prop
      }
      if (data['show-overflow-tooltip'] !== false) {
        data['show-overflow-tooltip'] = true
      }
      return data
    }
  },
  render(h) {
    // 渲染函数
    const item = this.item
    let scopedSlots, fun
    if ((fun = this.default[item.type]) || item.ctx) {
      // 处理默认的作用域插槽
      scopedSlots = {
        default: (props) => {
          if (fun) {
            return fun(item, props)
          } else {
            return h('span', item.ctx(props.row, props.$index))
          }
        }
      }
    }
    return h(
      'ElTableColumn',
      {
        props: this.handleAttr(item),
        scopedSlots
      },
      // 处理具名插槽
      this.names[item.type] && [this.names[item.type](item)]
    )
  }
}
</script>

<style>

.el-tooltip__popper {
  max-width: 800px;
}
</style>