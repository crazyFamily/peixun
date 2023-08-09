<template>
  <div class="add-case-event">
    <div class="main-container">
      <div class="form-container">
        <el-form :model="addForm" :rules="formRules" ref="formRef">
          <p class="title">基本信息</p>
          <el-form-item
            label="UM号: "
            :label-width="formLabelWidth"
            prop="umId"
          >
            <gc-select
              v-model="addForm.umId"
              filterable
              remote
              :remote-method="getUmList"
              :loading="umListLoading"
              :options="umList"
              k="umNameRender"
              v="umId"
              :disabled="Boolean(addForm.id)"
              @change="selectUMHandle"
              class="um-style"
              style="width: 200px"
            ></gc-select>
          </el-form-item>
          <el-form-item
            label="姓名: "
            :label-width="formLabelWidth"
            prop="umName"
          >
            <el-input
              v-model="addForm.umName"
              style="width: 200px"
              disabled
            ></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="分享人编制: "
            :label-width="formLabelWidth"
            prop="institution"
          >
            <el-radio-group v-model="addForm.institution" disabled>
              <el-radio label="HB">行编</el-radio>
              <el-radio label="EX">外包</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item
            label="头像: "
            :label-width="formLabelWidth"
            prop="image"
            class="head-img-container"
          >
            <gc-upload
                         ref="uploadRef"
              :size="200"
              :list="fileList"
              v-model="addForm.headImgList"
              :disabled="isView"
            ></gc-upload>
            <div class="tips-container">
              <p class="tintColor mt10">
                1. 建议图片尺寸为(200*200), 可按比例调整尺寸
              </p>
              <p class="tintColor mt10">2. 格式为jpg, png, 或jpeg</p>
              <p class="tintColor mt10">3. 图片不能大于200kb</p>
            </div>
          </el-form-item>
          <el-form-item
            label="所属片区: "
            :label-width="formLabelWidth"
            style="width: 400px"
            prop="areaName"
          >
            <el-input v-model="addForm.areaName" disabled></el-input>
          </el-form-item>
          <el-form-item
            label="所属一级分行/分中心: "
            :label-width="formLabelWidth"
            style="width: 400px"
            prop="subBranchName"
          >
            <el-input v-model="addForm.subBranchName" disabled></el-input>
          </el-form-item>
          <el-form-item
            label="岗位: "
            :label-width="formLabelWidth"
            prop="position"
            style="width: 600px"
          >
            <el-input v-model="addForm.position" disabled></el-input>
          </el-form-item>
          <el-form-item
            label="预获英雄荟奖项: "
            :label-width="formLabelWidth"
            prop="heroPrize"
          >
            <el-input
              v-model="addForm.heroPrize"
              type="textarea"
              :rows="5"
              maxlength="100"
              show-word-limit
              placeholder="列出个人或团队所获主要荣誉"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="近三年个人/团队所获荣誉: "
            :label-width="formLabelWidth"
            prop="belongHonour"
          >
            <el-input
              v-model="addForm.belongHonour"
              type="textarea"
              :rows="5"
              maxlength="100"
              show-word-limit
              placeholder="列出个人或团队所获主要荣誉"
              :disabled="isView"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="技能优势: "
            :label-width="formLabelWidth"
            prop="superiority"
          >
            <el-input
              v-model="addForm.superiority"
              type="textarea"
              :rows="5"
              maxlength="100"
              show-word-limit
              placeholder="列举1-3项个人优势方向及理由(注: 与所获成绩荣誉等相关)"
              :disabled="isView"
            ></el-input>
          </el-form-item>
          <p class="title">案例信息</p>
          <el-form-item
            label="案例名称: "
            :label-width="formLabelWidth"
            prop="trailName"
          >
            <el-input
              v-model="addForm.trailName"
              placeholder="案例名称"
              maxlength="20"
              show-word-limit
              :disabled="isView"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="案例背景: "
            :label-width="formLabelWidth"
            prop="trailBack"
          >
            <el-input
              v-model="addForm.trailBack"
              type="textarea"
              :rows="8"
              maxlength="200"
              show-word-limit
              :placeholder="`背景, 起因, 起点时间\n你的角色任务和目标`"
              :disabled="isView"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="困难挑战: "
            :label-width="formLabelWidth"
            prop="challenge"
          >
            <el-input
              v-model="addForm.challenge"
              type="textarea"
              :rows="8"
              maxlength="200"
              show-word-limit
              placeholder="完成任务/解决问题的难点和挑战点"
              :disabled="isView"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="关键举措: "
            :label-width="formLabelWidth"
            prop="measure"
          >
           <el-input
              v-model="addForm.measure"
              type="textarea"
              :rows="8"
              maxlength="200"
              show-word-limit
              placeholder="你主要采取的措施(关键举措和行动)"
              :disabled="isView"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="所获结果: "
            :label-width="formLabelWidth"
            prop="result"
          >
            <el-input
              v-model="addForm.result"
              type="textarea"
              :rows="8"
              maxlength="200"
              show-word-limit
              placeholder="截止时间, 短期成效, 长期影响, 意外收获"
              :disabled="isView"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">取消</el-button>
      <el-button
        class="button-w80-h30"
        type="primary"
        @click="saveHandle"
        :disabled="isView"
        >上架</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  fetchSelectOrgTagList,
  fetchListBaseHeroUsers,
  fetchSaveHeroTrail,
  fetchHeroTrailDetail
} from '@/fetch/caseCenter'
import { CopyObj, handleUdmpHref } from '@/util/utils'
export default {
  name: 'AddCaseEvent',

  props: {
    isView: {
      type: Boolean,
      default: false
    },
    isCreate: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object
    }
  },

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      addForm: {
        belongHonour: '',
        // belongOrg: "",
        challenge: '',
        headImgList: [],
        image: '',
        institution: '',
        measure: '',
        position: '',
        result: '',
        superiority: '',
        trailBack: '',
        trailName: '',
        umId: '',
        umName: '',
        heroPrize: '',
        areaName: '',
        subBranchName: ''
      },
      formRules: {
        umId: [requiredHandle('请选择英雄')],
        umName: [requiredHandle('没有姓名信息')],
        institution: [requiredHandle('没有编制信息')],
        // image: [requiredHandle('')],
        // belongOrg: [requiredHandle("没有机构信息")],
        position: [requiredHandle('没有岗位信息')],
        areaName: [requiredHandle('没有所属片区信息')],
        subBranchName: [requiredHandle('没有所属分行信息')],
        // belongHonour: [requiredHandle("请输入所属荣誉")],
        superiority: [requiredHandle('请输入技能优势')],
        trailName: [requiredHandle('请输入案例名称')],
        trailBack: [
          requiredHandle('请输入案例背景'),
          {
            validator: (rule, value, callback) => {
              if (value.length < 10) {
                return callback(new Error('案例背景需要大于10个字符'))
              }
              return callback()
            }
          }
        ],
        challenge: [
          requiredHandle('请输入困难挑战'),
          {
            validator: (rule, value, callback) => {
              if (value.length < 10) {
                return callback(new Error('困难挑战需要大于10个字符'))
              }
              return callback()
            }
          }
        ],
        measure: [
          requiredHandle('请输入关键措施'),
          {
            validator: (rule, value, callback) => {
              if (value.length < 10) {
                return callback(new Error('关键措施需要大于10个字符'))
              }
              return callback()
            }
          }
        ],
        result: [
          requiredHandle('请输入所获结果'),
          {
            validator: (rule, value, callback) => {
              if (value.length < 10) {
                return callback(new Error('所获结果需要大于10个字符'))
              }
              return callback()
            }
          }
        ]
      },
      formLabelWidth: '160px',
      fileList: [],
      blgOrgIds: [],
      umListLoading: false,
      umList: [],
      isDataLoaded: false,
      fetchSelectOrgTagList
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    async _getDataDetail() {
      console.log(this.isDataLoaded, '111')
      if (this.isDataLoaded) return
      if (!this.rowData.id) return
      let detailData = await fetchHeroTrailDetail({ id: this.rowData.id })
      this.isDataLoaded = true
      this._initDetailData(detailData)
    },
    _initDetailData(detailData) {
      console.log('object')
      this.addForm = { ...this.addForm, ...CopyObj(detailData) }
      // this.addForm.areaName &&
      //   this.addForm.subBranchName &&
      //   (this.addForm.belongOrg = `${this.addForm.areaName}/${this.addForm.subBranchName}`);
      if (this.addForm.image) {
        this._setHeadImgData()
      }
    },
   _setHeadImgData() {
      this.addForm.headImgList = [
        {
          fileName: '图片',
          udmpId: this.addForm.image
        }
      ]
      this.fileList = [
        {
          name: '图片',
          url: this._mappingStaticImage(this.addForm.image)
        }
      ]
    },
    _mappingStaticImage(img) {
      let list = [
        'headI1.png',
        'headI2.png',
        'headI3.png',
        'headI4.png',
        'headI5.png',
        'headI6.png',
        'headI7.png',
        'headI8.png'
      ]

      if (list.includes(img)) {
        return require(`@/assets/images/${img}`)
      } else {
        return handleUdmpHref(img)
      }
    },
    async getUmList(query) {
      this.umListLoading = true
      try {
        let { list } = await fetchListBaseHeroUsers({
          condition: { umOrName: query, pageSize: 15, ifValid: 'Y' }
        })
        this.umList = list.map((item) => ({
          ...item,
          umNameRender: `${item.umId}(${item.umName})`
        }))
      } finally {
        this.umListLoading = false
      }
    },
    reset() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.$nextTick(() => {
        this.$refs.uploadRef.clear()
        this.$refs.formRef.clearValidate()
      })
    },
    closeHandle() {
      this.reset()
      this.$nextTick(() => {
        this.$emit('change', 'CaseEventManage')
      })
    },
    saveHandle() {
      this.$refs.formRef.validate(async (v) => {
        if (!v) return false
        this.addForm.image = this.addForm.headImgList[0]?.udmpId
        await fetchSaveHeroTrail({
          data: { ...this.addForm, type: this.addForm.id ? 'update' : 'add' }
        })
        this.$message.success('保存成功')
        this.closeHandle()
      })
    },
    selectUMHandle(value) {
      let selectedItem
      if (!value) {
        selectedItem = {}
      } else {
        selectedItem = this.umList.find((item) => item.umId === value)
      }
      console.log(selectedItem)
      this.addForm.umName = selectedItem.umName
      this.addForm.institution = selectedItem.institution
      this.addForm.position = selectedItem.position
      this.addForm.image = selectedItem.image
      this.addForm.areaName = selectedItem.areaName
      this.addForm.subBranchName = selectedItem.subBranchName
      this.addForm.heroPrize = selectedItem.heroPrize
      if (this.addForm.image) {
        this._setHeadImgData()
      }
    }
  },

  activated() {
    // if (!this.isCreate) this.reset()
    this._getDataDetail()
  }
}
</script>
<style lang='scss' scoped>
.main-container {
  background-color: #fff;
  padding: 20px 0;
}
.form-container {
  width: 90%;
  margin: 0 auto;

  :deep(.gc-select) {
    padding: 0;
  }

  .title {
    position: relative;
    padding-left: 15px;

    &::before {
      content: '';
      width: 5px;
      height: 100%;
      background-color: $themeColor;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
.head-img-container {
  :deep(.el-form-item__content) {
    display: flex;
  }

  .tips-container {
    margin-left: 20px;
  }
}

.default-profile {
  $base-width: 130px;
  width: $base-width;
  height: $base-width;
  margin-right: 10px;
  overflow: hidden;
  background-color: #fff;
  // border: 1px solid #c0ccda;
  border-radius: 6px;

  .item {
    width: 100%;
    height: 100%;
  }
}

.um-style {
  :deep(.el-select) {
    width: 200px;
  }
}
</style>

