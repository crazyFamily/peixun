<template>
  <div class="gc-approval-chain df">
    <el-dropdown
      trigger="click"
      placement="bottom-start"
      class="f1"
      @visible-change="visibleChange"
    >
      <div>
        <div class="gc-approval-chain f1">
          <el-input
            class="gc-approval-chain__input"
            placeholder="请输入审批人姓名或UM号"
            v-model.trim="inputValue"
            @input="input"
            @blur="blur"
          >
            <i
              slot="suffix"
              class="page-input__search"
              @click.stop="searchPerson"
            ></i>
          </el-input>
        </div>
      </div>
      <el-dropdown-menu
        slot="dropdown"
        :style="{ width }"
        class="gc-approval-chain__drop-down"
      >
        <el-dropdown-item
          v-for="item in hintData"
          :key="item.um"
          @click.native="handleDropDownCLick(item)"
        >
          <span class="name">{{ item.empName }}</span>
          <span class="org-name">{{ item.blgOrgName }}</span>
          <span class="um">{{ item.umId }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="buttons no-wrapw">
      <el-button
        v-if="autoApproval"
      class="button-w100-h28 ml10 button-my-primary-plain"
        @click="openAutoApproval"
        >使用自动审批链</el-button
      >
      <el-button
        class="button-w70-h28 ml10 button-my-primary-plain"
        @click="approval('→')"
        >顺序批示 →</el-button
      >
      <el-button
        class="button-w70-h28 ml10 button-my-primary-plain"
        @click="approval('|')"
        >并行批示 |</el-button
      >
      <el-button
        class="button-w70-h28 ml10 button-my-primary-plain"
        @click="approval('§')"
        >传阅 §</el-button
      >
    </div>
    <!-- 检查审批人 dialog -->
    <gc-model
      title="检查审批人"
      :visible="checkApprovalVisible"
      :isAppend="true"
      width="800px"
      @close="checkApprovalVisible = false"
      @cancel="checkApprovalVisible = false"
      @comfirm="checkApprovalConfirm"
    >
      <div>
        <span class="shallow mr10">请选择审批人</span>
        <span
          class="shallow"
          @click="handlePersonClick(i)"
         :class="{
            'active-default': checkApprovalTableIndex === i,
            hover: checkApprovalTableIndex !== i
          }"
          v-for="(item, i) in repetitionApprovalPersonList"
          :key="i"
          >{{ person[item[0].id].umId }}
          <span v-if="i !== repetitionApprovalPersonList.length - 1">→</span>
        </span>
      </div>
      <el-table
        class="general__table mt20"
        ref="checkApprovalTableRef"
        :data="checkApprovalTableList"
        :row-class-name="rowClassName"
        @current-change="handleCurrentChange"
      >
        <el-table-column width="64" label="序号" type="index"></el-table-column>
        <el-table-column
          min-width="135"
          label="姓名"
          prop="empName"
        ></el-table-column>
        <el-table-column
          min-width="127"
          label="UM号"
          prop="umId"
        ></el-table-column>
        <el-table-column
          min-width="391"
          label="部门"
          prop="blgOrgName"
        ></el-table-column>
      </el-table>
      <gc-pagination
       :total="checkApprovalForm.total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[5]"
        :page-size="checkApprovalForm.pageSize"
        :current-page="checkApprovalForm.currPage"
        @sizeChange="checkApprovaListSizeChange"
        @currentChange="checkApprovaListCurrentChange"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </gc-model>

    <!-- 审批链示意图 dialog -->
    <gc-model
      title="审批链示意图"
      :visible="approvalChainVisible"
      :isAppend="true"
      width="1100px"
      @close="approvalChainVisible = false"
      @cancel="approvalChainVisible = false"
      @comfirm="approvalChainComfirm"
    >
      <gc-table
        class="general__table"
        :list="approvalChainList"
        :tableList="approvalChainTableList"
      >
      </gc-table>
      <!-- <gc-pagination
                :total="approvalChainForm.total"
                layout="prev, pager, next,slot, sizes"
                prev-text=""
                next-text=""
                :page-sizes="[5]"
                :page-size="approvalChainForm.pageSize"
                :current-page="approvalChainForm.currPage"
                @sizeChange="approvalChainListSizeChange"
                @currentChange="approvalChainListCurrentChange"
            >
                <span class="text">每页显示</span>
            </gc-pagination> -->
    </gc-model>

    <!-- 设置自动审批链组件 -->
    <SetApprovalPerson
      ref="autoApproval"
      :chainType="chainType"
      :showInput="false"
      v-bind="$attrs"
      v-on="$listeners"
      @confirm="setApprovalPersonconfirm"
    />
  </div>
</template>

<script>
import {
  jsonHeaders,
  differenceSet,
  CopyObj,
  ApprovalChainTransitionStr
} from '../util/utils'
import SetApprovalPerson from './SetApprovalPerson'
export default {
  name: 'ApprovalChain',
  inheritAttrs: false,
  components: {
    SetApprovalPerson
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    autoApproval: {
      type: Boolean,
      default: false
    },
   chainType: {
      type: String,
      default: '2'
    }
  },
  data() {
    return {
      // 输入框内容
      inputValue: '',
      // 检查审批人 dialog 状态
      checkApprovalVisible: false,
      // 检查审批人 table 数据数组
      checkApprovalTableList: [],
      // 当前检查审批人所有数据
      allCheckApproval: [],
      // 检查审批人 form表单
      checkApprovalForm: {
        currPage: 1,
        pageSize: 5,
        total: 0,
        person: ''
      },
      // 审批链示意图 dialog 状态
      approvalChainVisible: false,
      // 审批链示意图 table 字段数组
      approvalChainList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '处理人',
          value: '处理人',
          prop: 'empName',
          width: '200'
        },
        {
          label: '处理说明',
          value: '处理说明',
          prop: 'explain',
          width: '200'
        },
        {
          label: 'UM号',
          value: 'UM号',
          prop: 'umId',
          width: '200'
        },
        {
          label: '部门',
          value: '部门',
          prop: 'blgOrgName',
          width: '200'
        }
      ],
      // 审批链示意图 table 数据数组
      approvalChainTableList: [],
      // 审批链示意图 form表单
      approvalChainForm: {
        currPage: 1,
        pageSize: 5,
        total: 0
      },
     // 是否加入了传阅
      isCirculalize: false,
      // 查询到的审批人数组
      approvalPersonList: [],
      // 重复的审批人数组
      repetitionApprovalPersonList: [],
      // 选择重复审批人 存储数组
      selectRepetitionApproval: [],
      // 处理后的输入
      person: [],
      // 选中的行数
      currentRow: null,
      // 选择 重复 审批人索引
      checkApprovalTableIndex: 0,
      // 区分手动设置选中行， 点击选中中行 的变量
      isManual: false,
      // 存放 返回审批人的 对象
      approvalData: {},
      // 提示数据
      hintData: {},
      // 下拉框是否显示
      dropDownIsShow: false,
      // 所有符号列表
      symbolicList: ['→', '|', '§'],
      // 下拉提示防抖 定时器对象
      timer: null,
      // 下拉获取的数据数组 可以用来跳过验证
      personObjList: [],
      // 是否需要自动检查审批链
      isAutoCheck: true,
      width: ''
    }
  },
  methods: {
    // 审批人不存在提示
    noApproval(inexistent, msg) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('div', null, [
          h('span', null, `以下审批人${msg}，请重新确认！`),
          h('br', null),
          h(
            'p',
            {
              style: 'color: #7D8292; text-indent: -6px; margin-top: 10px;'
            },
            inexistent
          )
        ]),
        confirmButtonText: '确定',
        customClass: 'loginTimeout approval'
      }).catch((err) => err)
    },
    // 未输入审批人提示
    emptyHint(message) {
      this.$alert(message, '提示', {
        confirmButtonText: '确定',
        customClass: `loginTimeout`
      }).catch((err) => err)
    },
    // 验证符号
    checkValue(symbolic) {
      if (this.inputValue === '') {
        this.emptyHint('请输入审批人后再选择审批方式')
        return
      } else if (this.inputValue.slice(-1) === symbolic) {
        return
      } else if (this.symbolicList.includes(this.inputValue.slice(-1))) {
        const len = this.inputValue.length
        this.inputValue = this.inputValue.slice(0, -1)
        if (this.inputValue.indexOf('§') === -1) {
          this.isCirculalize = false
        }
        return true
      }
      return true
    },
    // 顺序批示  并行批示  传阅
    approval(symbolic) {
      const input = document.querySelector('.gc-approval-chain__input input')
      let pos = this.getSelectionStart(input)
      if (!this.checkValue(symbolic)) {
        this.setSelectionPosition(input, pos)
        input.focus()
        return
      } else {
        if (this.isCirculalize && symbolic !== '§') {
          return this.$message.warning('传阅后面只能是传阅')
        } else if (symbolic === '§') {
          this.isCirculalize = true
        }
        this.inputValue += symbolic
        if (pos >= this.inputValue.length - 1) {
          pos = this.inputValue.length
        }
        this.$nextTick(() => {
          this.setSelectionPosition(input, pos)
          input.focus()
        })
     }
    },
    getMaxSymbolic(obj1, obj2) {
      if (!obj1) return obj2.explain
      if (!obj2) return obj1.explain
      return obj1.level > obj2.level ? obj1.explain : obj2.explain
    },
    // 正则分割输入数据
    reSplit(flag) {
      const re = new RegExp(/[^→|§]+|[→|§]/g)
      const value = this.inputValue
      const list = []
      let cur = re.exec(value)
      while (cur) {
        list.push(cur[0])
        cur = re.exec(value)
      }
      if (flag) return list
      const data = list.map((v) => {
        if (v.match(/\((\w+)\)/)) {
          v = v.match(/\((\w+)\)/)[1]
        }
        return v
      })
      return data
    },
    // 处理输入数据
    handleSendData() {
      const list = this.reSplit()
      const person = []
      const symbolicList = [
        { key: '→', level: 2, explain: '顺序批示' },
        { key: '|', level: 3, explain: '并行批示' },
        { key: '§', level: 1, explain: '传阅' }
      ]

      list.forEach((v, i) => {
        list[i] = symbolicList.find((key) => v === key.key) || v
      })
      if (list.length === 0) return person
      person.push({ id: 0, umId: list[0], explain: '顺序批示' })
      if (list.length === 1) return person
      if (list[1].key === '|') person[0].explain = '并行批示'
      for (let i = 2; i < list.length; i++) {
        if (typeof list[i] === 'string') {
          person.push({
            id: person.length,
            umId: list[i],
            explain: this.getMaxSymbolic(list[i - 1], list[i + 1])
          })
        }
      }
      return person
    },
  // 返回的审批人数据 转换为 审批链示意图能用的数组
    handleApprovalChainTableList(data) {
      this.approvalChainTableList = Object.keys(data).map((v) => {
        v = data[v][0]
        v.explain = this.person[v.id].explain
        return v
      })
      this.approvalChainForm.total = this.approvalChainTableList.length
    },
    // 将重复的审批人转换成 检查审批人dialog 适用的数据
    handleCheckApprovalTableList(data) {
      this.allCheckApproval = data
      this.checkApprovalForm.total = data.length
      this.checkApprovalForm.pageSize = 5
      this.checkApprovalForm.currPage = 1
      this.checkApprovalForm.person = this.person[data[0].id].umId
      this.checkApprovalTableList = this.allCheckApproval.slice(
        0,
        Math.min(4, this.checkApprovalForm.total)
      )
    },
    // 检查审批人 SizeChange 事件
    checkApprovaListSizeChange() {},
    // 检查审批人 CurrentChange 事件
    checkApprovaListCurrentChange({ pageNum }) {
      this.checkApprovalForm.currPage = pageNum
      this.checkApprovalTableList = this.allCheckApproval.slice(
        (pageNum - 1) * 5,
        Math.min(pageNum * 5, this.checkApprovalForm.total)
      )
      const id =
        this.repetitionApprovalPersonList[this.checkApprovalTableIndex][0].id
      const currentPerson = this.selectRepetitionApproval.find(
        (v) => v.id === id
      )
      currentPerson && this.setCurrent(currentPerson.selectedRow)
    },
    // 审批链示意图 SizeChange 事件
    approvalChainListSizeChange() {},
    // 审批链示意图 CurrentChange 事件
    approvalChainListCurrentChange() {},
    // 查询审批人
    searchPerson() {
     if (this.inputValue === '') {
        return this.emptyHint('请输入审批人后再进行验证')
      }
      this.person = this.handleSendData()
      this.$axios
        .post(
          '/fn/commons/eoa/checkChainUms',
          { data: this.person },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.approvalPersonList = data
            const diffSet = differenceSet(this.person, data, (v) => v.id + '')
            if (diffSet.length > 0) {
              return this.noApproval(
                diffSet.map((v) => `【${this.person[v].umId}】`).join('、'),
                '不存在'
              )
            }
            const repetitionPerson = Object.keys(data)
              .filter((v) => data[v].length > 1)
              .map((v) => data[v])
            if (!repetitionPerson.length) {
              this.handleApprovalChainTableList(data)
              this.approvalChainVisible = true
            } else {
              this.handleCheckApprovalTableList(repetitionPerson[0])
              this.approvalData = data
              this.checkApprovalTableIndex = 0
              this.repetitionApprovalPersonList = repetitionPerson
              this.checkApprovalVisible = true
            }
          }
        })
    },
    // 选中行变化的事件
    handleCurrentChange(val) {
      if (!val) return
      this.currentRow = val
      this.checkApprovalTableList.forEach((v) => {
        v.className = ''
      })
      this.$set(val, 'className', 'table-hit-height')
      const id = val.id
      let currentPerson = this.selectRepetitionApproval.find((v) => v.id === id)
      if (!currentPerson) {
        currentPerson = { id }
        this.selectRepetitionApproval.push(currentPerson)
      }
      currentPerson.selectedRow = val

      if (!this.isManual) {
        this.checkApprovalTableIndex = Math.min(
          this.checkApprovalTableIndex + 1,
          this.repetitionApprovalPersonList.length - 1
        )
        this.handlePersonClick(this.checkApprovalTableIndex)
      }
      this.isManual = false
    },
    // 高亮某一行
    setCurrent(row) {
      this.isManual = true
      this.$refs.checkApprovalTableRef.setCurrentRow(row)
    },
    // 选择审批人的点击事件
    handlePersonClick(index) {
      this.checkApprovalTableIndex = index
      const id =
        this.repetitionApprovalPersonList[this.checkApprovalTableIndex][0].id
      const currentPerson = this.selectRepetitionApproval.find(
        (v) => v.id === id
      )
      this.handleCheckApprovalTableList(
        this.repetitionApprovalPersonList[index]
      )
      this.setCurrent(currentPerson && currentPerson.selectedRow)
    },
    // 选择审批人的确定事件
    checkApprovalConfirm() {
      const diffSet = []
      this.repetitionApprovalPersonList.forEach((v) => {
        const current = this.selectRepetitionApproval.find(
          (item) => item.id === v[0].id
        )
        if (current) {
          this.approvalData[current.id] = [current.selectedRow]
        } else {
          diffSet.push(this.person[v[0].id].umId)
        }
      })
      if (diffSet.length) {
        this.noApproval(diffSet.map((v) => `【${v}】`).join('、'), '未选择')
      } else {
        this.handleApprovalChainTableList(this.approvalData)
        this.checkApprovalVisible = false
        this.approvalChainVisible = true
      }
    },
    // 审批链示意图 comfirm事件
    approvalChainComfirm() {
      const data = this.handleApprovalChainData(this.approvalChainTableList)
      this.approvalChainVisible = false
      this.toggleCkeck(data)
      this.inputValue = data.auditUsersUm
    },
    // 审批链数组 数据转换为 符合发送条件的数据
    handleApprovalChainData(data) {
      const list = this.reSplit()
      const auditUsers = data.map((v) => v.umId).join(';')
      let auditUsersUm = [],
        auditUsersName = []
      list.map((v, i) => {
        if (i & 1) {
          auditUsersUm.push(v)
          auditUsersName.push(v)
        } else {
          const item = data.shift()
          auditUsersUm.push(`${item.empName}(${item.umId})`)
          auditUsersName.push(item.empName)
        }
      })
      auditUsersUm = auditUsersUm.join('')
      auditUsersName = auditUsersName.join('')
      return { auditUsers, auditUsersUm, auditUsersName }
    },
    input($event) {
      this.$emit('input', $event)
      if (!$event) {
        this.dropDownIsShow = false
        this.personObjList = []
        return
    } else if (!this.symbolicList.includes($event.slice(-1))) {
        const list = this.reSplit()
        this.fromUmGetPerson(list.splice(-1)[0])
      } else {
        this.dropDownIsShow = false
      }
    },
    clearInput() {
      this.inputValue = ''
    },
    // 获取光标位置
    getSelectionStart(ele) {
      return ele.selectionStart
    },
    // 设置光标位置
    setSelectionPosition(ele, pos) {
      ele.setSelectionRange(pos, pos)
    },
    // 获取单个 um 号 数据
    fromUmGetPerson(umId) {
      clearTimeout(this.timer)
      this.timer = null
      this.timer = setTimeout(() => {
        this.$axios
          .post('/fn/commons/eoa/findEoaApproverByUmId', { umId }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              if (data.length < 1) return
              this.dropDownIsShow = true
              this.hintData = data
            }
          })
      }, 500)
    },
    // 下拉框 点击事件
    handleDropDownCLick(item) {
      const list = this.reSplit(true)
      list[list.length - 1] = `${item.empName}(${item.umId})`
      this.personObjList[list.length - 1] = item
      this.inputValue = list.join('')
      this.dropDownIsShow = false
      this.checkLegitimacy()
      this.$emit('input', this.inputValue)
    },
   // 输入框失焦事件
    blur() {
      setTimeout(() => {
        this.dropDownIsShow = false
      }, 500)
    },
    // 检查 是否需要验证
    checkLegitimacy() {
      const list = this.reSplit()
      let flag1, flag2
      flag1 = list.length === this.personObjList.length
      if (flag1) {
        flag2 = list.every((v, i) => {
          if (!this.symbolicList.includes(v)) {
            return v === this.personObjList[i].umId
          }
          return true
        })
      }
      let data = { auditUsers: '', auditUsersUm: '', auditUsersName: '' }
      if (flag1 && flag2) {
        data = this.handleApprovalChainData(this.personObjList.filter((v) => v))
      }
      this.$emit('confirm', data)
    },
    // 打开自动审批
    openAutoApproval() {
      this.$refs.autoApproval.openDialog()
      this.$emit('openApproval')
    },
    // 自动审批链确认事件
    setApprovalPersonconfirm(data) {
      const { auditUsersUm } = data
      if (auditUsersUm) {
        this.inputValue = auditUsersUm
        this.isAutoCheck = false
        this.$emit('confirm', data)
        this.$nextTick(() => {
          this.isAutoCheck = true
        })
      }
    },
    toggleCkeck(data) {
      this.isAutoCheck = false
      this.$emit('confirm', data)
      this.$nextTick(() => {
        this.isAutoCheck = true
      })
    },
    rowClassName({ row }) {
      return row.className
    },
    visibleChange(flag) {
      if (flag) {
        this.width =
          this.$el.querySelector('.gc-approval-chain__input').offsetWidth + 'px'
      }
    }
  },
 watch: {
    inputValue(newValue) {
      if (newValue.indexOf('§') === -1) {
        this.isCirculalize = false
      }
      if (newValue === '') {
        this.dropDownIsShow = false
      }
      this.isAutoCheck && this.checkLegitimacy()
    },
    value(n) {
      this.inputValue = n
      let data = n.split(/[→|§]/g).map((v) => {
        const [empName, umId] = v.split(/[\(\)]/g)
        return {
          empName,
          umId
        }
      })
      data = this.handleApprovalChainData(data)
      this.$nextTick(() => {
        this.$emit('confirm', data)
      })
    }
  }
}
</script>

<style lang="scss">
.gc-approval-chain {
  &__input {
    input {
      padding-right: 30px !important;
    }
    .el-input__suffix {
      line-height: 30px;
    }
  }
  &__drop-down {
    height: 200px;
    overflow: auto;
  }
}
</style>
