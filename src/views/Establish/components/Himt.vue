<script>
import gcTable from '@/components/table/index'
import { TableColumn } from 'element-ui'
export default {
  props: {
    row: {
      type: Object,
      default: () => ({})
    },
    state: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 杂费字段数组
      incidentalExpenses: [
        {
          label: '内容',
          prop: 'content',
          width: '100'
        },
        // {
        //   label: '标准',
        //   prop: 'standard',
        //   width: '280'
        // }
      ],
      // 杂费数据数组
      incidentalExpensesList: [
        {
          content: '餐杂费（外部）',
          firstTierCity: '250元/人天',
          otherCity: '200元/人天',
        },
        {
          content: '餐杂费（食堂）',
          firstTierCity: '200元/人天',
          otherCity: '160元/人天',
        },
        // {
        //   content: '餐费及杂费',
        //   standard: '250元/人天'
        // }
      ],
      // 厂租字段数组
      factoryRent: [
        {
          label: '内容',
          prop: 'content',
          width: '100',
          type: 'setWidth'
        }
      ],
      // 厂租数据数组
      factoryRentList: [
        {
          content: '场租及会务费费',
          firstTierCity: '220元/人天',
          otherCity: '180元/人天',
          standard: '北上广深杭：200元/人天 其他城市：160元/人天'
        }
      ],
      // 交通费字段数组
      trafficTicket: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '级别',
          prop: 'level',
          width: '280'
        }
      ],
      // 交通费数据数组
      trafficTicketList: [
        {
          level: '总行行级领导',
          aircraft: '头等/公务舱',
          train: '据实报销',
          automobile: '据实报销'
        },
        {
          level: '北上广深南杭分行行长 信用卡、汽融、交易银行事业部总裁',
          aircraft: '公务舱',
          train: '高级动卧/一等座',
          automobile: '据实报销'
        },
        {
          level: '总行总监、其他分行行长 总行行业事业部总裁 其他事业部门总裁、总行部门正职',
          aircraft: '经济舱',
          train: '高级动卧/一等座',
          automobile: '据实报销'
        },
        {
          level: '总行部门、事业部、分行班子副职及其他高级人员',
          aircraft: '经济舱',
          train: '高级动卧/一等座',
          automobile: '据实报销'
        },
        {
          level: '总行室正、副经理，分行/行业事业部部门正、副职，支行行长',
          aircraft: '经济舱',
          train: '高级动卧/二等座',
          automobile: '据实报销'
        },
        {
          level: '其他人员',
          aircraft: '经济舱',
          train: '高级动卧/二等座',
          automobile: '据实报销'
        },
        // {
        //   level: '总行总监、分行行长、行业事业部总裁',
        //   aircraft: '头等舱',
        //   train: '高级动卧/一等座',
        //   automobile: '据实报销'
        // },
        // {
        //   level: '其他事业部门总裁、总行部门正职',
        //   aircraft: '经济舱',
        //   train: '高级动卧/一等座',
        //   automobile: '据实报销'
        // },
      ],
      // 交通补助字段数组
      returnTicket: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '级别',
          prop: 'level',
          width: '280'
        }
      ],
      // 交通补助数据数组
      returnTicketList: [
        {
          level: '总行行级领导',
          aircraft: '据实报销',
          rest: '元'
        },
        // {
        //   level: '总行总监、分行行长、行业事业部总裁',
        //   aircraft: '100元/次',
        //   rest: '60元/次'
        // },
        // {
        //   level: '其他事业部门总裁、总行部门正职',
        //   aircraft: '100元/次',
        //   rest: '60元/次'
        // },
        // {
        //   level: '总行部门、事业部、分行班子副职及其他高级人员',
        //   aircraft: '100元/次',
        //   rest: '60元/次'
        // },
        // {
        //   level: '总行室正、副经理、分行/行业事业部部门正、副职支行行长',
        //   aircraft: '100元/次',
        //   rest: '60元/次'
        // },
        {
          level: '其他人员（除总行行级领导外）',
          aircraft: '100元',
          rest: '60元'
        }
      ],
      // 住宿费字段数组
      stayCost: [
        {
          label: '序号',
          type: 'index',
          width: '50'
        },
        {
          label: '级别',
          prop: 'level',
          width: '380'
        },
        // {
        //   label: '住宿费上限',
        //   prop: 'price',
        //   width: '100'
        // }
      ],
      // 住宿费数据数组
      stayCostList: [
        {
          level: '总行行级领导',
          price: '据实报销',
          firstTierCity: '据实报销',
          otherCity: '据实报销',
        },
        {
          level: '北上广深南杭分行行长 信用卡、汽融、交易银行事业部总裁',
          price: '据实报销',
          firstTierCity: '1000',
          otherCity: '900',
        },
        {
          level: '总行总监、其他分行行长 总行行业事业部总裁 其他事业部门总裁、总行部门正职',
          price: '据实报销',
          firstTierCity: '1000',
          otherCity: '900',
        },
        {
          level: '总行部门、事业部、分行班子副职及其他高级人员',
          price: '700',
          firstTierCity: '800',
          otherCity: '700',
        },
        {
          level: '总行室正、副经理，分行/行业事业部部门正、副职，支行行长',
          price: '550',
          firstTierCity: '650',
          otherCity: '550',
        },
        {
          level: '其他人员',
          price: '500',
          firstTierCity: '600',
          otherCity: '500',
        },
        // {
        //   level: '总行总监、分行行长、行业事业部总裁',
        //   price: '900',
        // },
        // {
        //   level: '其他事业部门总裁、总行部门正职',
        //   price: '900'
        // },
      ],
      // 出差补助字段数组
      trafficSubsidy: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '级别',
          prop: 'level',
          width: '380'
        },
        {
          label: '国内出差补助（元/天）',
          prop: 'subsidy',
          width: '200'
        }
      ],
      // 出差补助数据数组
      trafficSubsidyList: [
        {
          level: '总行行级领导',
          subsidy: '无'
        },
        {
          level: '其他人员（除总行行级领导外）',
          subsidy: '120'
        }
        // {
        //   level: '总行总监、分行行长、行业事业部总裁',
        //   subsidy: '120元人民币/天'
        // },
        // {
        //   level: '其他事业部门总裁、总行部门正职',
        //   subsidy: '120元人民币/天'
        // },
        // {
        //   level: '总行部门、事业部、分行班子副职及其他高级人员',
        //   subsidy: '120元人民币/天'
        // },
        // {
        //   level: '总行室正、副经理、分行/行业事业部部门正、副职支行行长',
        //   subsidy: '120元人民币/天'
        // },
      ],
      TableColumn
    }
  },
  render(createElement) {
    let expenseType
    if (this.state === '1') {
      expenseType = this.row.expenseTypeDesc
    } else {
      expenseType = this.row.childDesc
    }
    switch (expenseType) {
      case '餐杂费':
        return createElement('div', { class: 'table-no-line establish-tooltip-table' }, [
          createElement(
            gcTable,
            {
              props: {
                list: this.incidentalExpenses,
                tableList: this.incidentalExpensesList
              }
            },
            [
              createElement(
                this.TableColumn,
                {
                  props: { label: '标准' }
                },
                [
                  createElement(this.TableColumn, {
                    props: {
                      label: '北上广深南杭',
                      width: '100',
                      prop: 'firstTierCity'
                    }
                  }),
                  createElement(this.TableColumn, {
                    props: {
                      label: '其他城市',
                      width: '200',
                      prop: 'otherCity'
                    }
                  })
                ]
              )
            ]
          ),
          createElement('div', { class: 'text' }, ['备注：包括培训的用餐、茶歇、办公杂费等。'])
        ])
      case '场租及会务费':
        return createElement('div', { class: 'table-no-line establish-tooltip-table' }, [
          createElement(
            gcTable,
            {
              props: {
                list: this.factoryRent,
                tableList: this.factoryRentList
              }
            },
            [
              createElement(
                this.TableColumn,
                {
                  props: { label: '标准' }
                },
                [
                  createElement(this.TableColumn, {
                    props: {
                      label: '北上广深南杭',
                      width: '100',
                      prop: 'firstTierCity'
                    }
                  }),
                  createElement(this.TableColumn, {
                    props: {
                      label: '其他城市',
                      width: '200',
                      prop: 'otherCity'
                    }
                  })
                ]
              )
            ]
          ),
          createElement('div', { class: 'text' }, [
            createElement('p', ['备注：①包括场地租赁费、会务服务、会场布置、租车费等；']),
            createElement('p', ['②原则上50人及以上涉及，50人以下请在项目背景中说明。'])
          ])
        ])
      case '交通费':
        return createElement('div', { class: 'table-no-line establish-tooltip-table' }, [
          createElement(
            gcTable,
            {
              props: {
                list: this.trafficTicket,
                tableList: this.trafficTicketList
              }
            },
            [
              createElement(
                this.TableColumn,
                {
                  props: { label: '交通费（上限）' }
                },
                [
                  createElement(this.TableColumn, {
                    props: {
                      label: '飞机',
                      width: '100',
                      prop: 'aircraft'
                    }
                  }),
                  createElement(this.TableColumn, {
                    props: {
                      label: '火车、轮船',
                      width: '200',
                      prop: 'train'
                    }
                  }),
                  createElement(this.TableColumn, {
                    props: {
                      label: '城际汽车',
                      width: '100',
                      prop: 'automobile'
                    }
                  })
                ]
              )
            ]
          ),
          createElement('div', { class: 'text' }, [
            createElement('p', ['备注：①火车含普通火车、高铁、动车。']),
            createElement('p', ['②深圳、上海员工前往本地平安金融教育培训中心参加培训的，请按子类别“交通费（平安大学）”填写。'])
          ])
        ])
      case '交通补助':
        return createElement('div', { class: 'table-no-line establish-tooltip-table' }, [
          createElement(
            gcTable,
            {
              props: {
                list: this.returnTicket,
                tableList: this.returnTicketList
              }
            },
            [
              createElement(
                this.TableColumn,
                {
                  props: { label: '国内单程交通补助（元/次）' }
                },
                [
                  createElement(this.TableColumn, {
                    props: {
                      label: '机场',
                      width: '100',
                      prop: 'aircraft'
                    }
                  }),
                  createElement(this.TableColumn, {
                    props: {
                      label: '其他',
                      width: '100',
                      prop: 'rest'
                    }
                  })
                ]
              )
            ]
          )
        ])
      case '住宿费':
        return createElement('div', { class: 'table-no-line establish-tooltip-table' }, [
          createElement(
            gcTable,
            {
              props: {
                list: this.stayCost,
                tableList: this.stayCostList
              }
            },
            [
              createElement(
                this.TableColumn,
                {
                  props: { label: '国内住宿费（上限，元/次）' }
                },
                [
                  createElement(this.TableColumn, {
                    props: {
                      label: '北上广深南杭',
                      width: '100',
                      prop: 'firstTierCity'
                    }
                  }),
                  createElement(this.TableColumn, {
                    props: {
                      label: '其他城市',
                      width: '200',
                      prop: 'otherCity'
                    }
                  })
                ]
              )
            ]
          ),
          createElement('div', { class: 'text' }, ['备注：行内主办培训，总行室经理、分行/行业事业部部门长、支行行长（含）及以下人员原则上在标准内安排两人一间。'])
        ])
        // return createElement('div', { class: 'table-no-line establish-tooltip-table' }, [
        //   createElement(gcTable, {
        //     props: {
        //       list: this.stayCost,
        //       tableList: this.stayCostList
        //     }
        //   }),
        //   createElement('div', { class: 'text stay-cost' }, [
        //     createElement(
        //       'p',
        //       '1、行内主办会议，总行室经理、分行/行业事业部部门长、支行长（含）及其以下人员原则上在标准内安排两人一间'
        //     ),
        //     createElement(
        //       'p',
        //       '2、出差北京、上海、广州、深圳、杭州，住宿费可按上述标准上浮100元/日执行。'
        //     )
        //   ])
        // ])
      case '交通费（平安大学）':
        return createElement(
          'div',
          { style: { width: '200px' }, class: 'text' },
          '备注：深圳、上海员工前往本地平安金融教育培训中心参加培训的，原则上应乘坐中心提供的往返班车，未提供班车的，按不高于200元/次往返凭票据据实报销。'
        )
      case '出差补助':
        return createElement('div', { class: 'table-no-line establish-tooltip-table' }, [
          createElement(gcTable, {
            props: {
              list: this.trafficSubsidy,
              tableList: this.trafficSubsidyList
            }
          }),
          createElement('div', { class: 'text', style: { width: '520px' } }, [
            createElement(
              'p',
              { class: 'mr10' },
              '备注：凡食宿由培训统一解决的，不再报销住宿费，不享受出差补助；如只安排其中一项的，补助按50%计算。'
            )
          ])
        ])
      default:
        return createElement('div')
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  line-height: 24px;
  margin-left: 10px;
}
.stay-cost {
  width: 480px;
  margin-right: 10px;
}
.establish-tooltip-table {
  :deep(.el-table__header-wrapper .el-table__cell .cell) {
    text-align: center;
  }
}
</style>
