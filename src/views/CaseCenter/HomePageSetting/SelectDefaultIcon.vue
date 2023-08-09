<template>
  <gc-model
    title="选择默认图标"
    width="1000px"
    top="5vh"
    :visible="isOpen"
    :show-close="false"
    @cancel="close"
    @comfirm="comfirm"
  >
    <div class="items">
      <el-tooltip v-for="(img, i) in iconArr" :key="i" effect="dark" :content="img.desc" placement="top-start">
        <div class="item" :class="{active: selectItem == img}" @click="clickItem(img)" >
          <img :src="require('@/assets/nineMenuIcon/' + img.fileName)" />
        </div>
      </el-tooltip>
    </div>
  </gc-model>
</template>
<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Message } from 'element-ui'

const imgMapping = {
  AIkb: { id: 0, code: 'AIkb', fileName: 'icon_AIkb.svg', desc: 'AI看板', fileNameO: 'icon_AI看板.svg' },
  KYCgx: { id: 1, code: 'KYCgx', fileName: 'icon_KYCgx.svg', desc: 'KYC更新', fileNameO: 'icon_KYC更新.svg' },
  AUMjy: { id: 2, code: 'AUMjy', fileName: 'icon_AUMjy.svg', desc: 'AUM经营', fileNameO: 'icon_AUM经营.svg' },
  Abkbb: { id: 3, code: 'Abkbb', fileName: 'icon_Abkbb.svg', desc: 'A板块报表', fileNameO: 'icon_A板块报表.svg' },
  yjbl: { id: 4, code: 'yjbl', fileName: 'icon_yjbl.svg', desc: '业绩补录', fileNameO: 'icon_业绩补录.svg' },
  rygl: { id: 5, code: 'rygl', fileName: 'icon_rygl.svg', desc: '人员管理', fileNameO: 'icon_人员管理.svg' },
  dfsj: { id: 6, code: 'dfsj', fileName: 'icon_dfsj.svg', desc: '代发商机', fileNameO: 'icon_代发商机.svg' },
  ccjlb: { id: 7, code: 'ccjlb', fileName: 'icon_ccjlb.svg', desc: '传承俱乐部', fileNameO: 'icon_传承俱乐部.svg' },
  bxxt: { id: 8, code: 'bxxt', fileName: 'icon_bxxt.svg', desc: '保险金信托', fileNameO: 'icon_保险金信托.svg' },
  ttfw: { id: 9, code: 'ttfw', fileName: 'icon_ttfw.svg', desc: '厅堂服务', fileNameO: 'icon_厅堂服务.svg' },
  tthdl: { id: 10, code: 'tthdl', fileName: 'icon_tthdl.svg', desc: '厅堂活动量', fileNameO: 'icon_厅堂活动量.svg' },
  kghycx: { id: 11, code: 'kghycx', fileName: 'icon_kghycx.svg', desc: '可购好友查询', fileNameO: 'icon_可购好友查询.svg' },
  fzihzs: { id: 12, code: 'fzihzs', fileName: 'icon_fzihzs.svg', desc: '复制流花指数', fileNameO: 'icon_复制流花指数.svg' },
  jgxt: { id: 13, code: 'jgxt', fileName: 'icon_jgxt.svg', desc: '家族信托', fileNameO: 'icon_家族信托.svg' },
  gzlcyx: { id: 14, code: 'gzlcyx', fileName: 'icon_gzlcyx.svg', desc: '工资理财意向', fileNameO: 'icon_工资理财意向.svg' },
  dsp: { id: 15, code: 'dsp', fileName: 'icon_dsp.svg', desc: '待审批', fileNameO: 'icon_待审批.svg' },
  thfw: { id: 16, code: 'thfw', fileName: 'icon_thfw.svg', desc: '投后服务', fileNameO: 'icon_投后服务.svg' },
  sjxjy: { id: 17, code: 'sjxjy', fileName: 'icon_sjxjy.svg', desc: '数据化经营', fileNameO: 'icon_数据化经营.svg' },
  znty: { id: 18, code: 'znty', fileName: 'icon_znty.svg', desc: '智能投研', fileNameO: 'icon_智能投研.svg' },
  yuedumubiao: { id: 64, code: 'yuedumubiao', fileName: 'icon_yuedumubiao.svg', desc: '月度目标', fileNameO: 'icon_月度目标.svg' },
  ydmb: { id: 64, code: 'ydmb', fileName: 'icon_ydmb.svg', desc: '月度目标', fileNameO: 'icon_月度目标.svg' },
  ydpf: { id: 20, code: 'ydpf', fileName: 'icon_ydpf.svg', desc: '月度评分', fileNameO: 'icon_月度评分.svg' },
  bzzd: { id: 21, code: 'bzzd', fileName: 'icon_bzzd.svg', desc: '本周主打', fileNameO: 'icon_本周主打.svg' },
  smcppx: { id: 22, code: 'smcppx', fileName: 'icon_smcppx.svg', desc: '私募产品培训', fileNameO: 'icon_私募产品培训.svg' },
  smcpcx: { id: 23, code: 'smcpcx', fileName: 'icon_smcpcx.svg', desc: '私募产品查询', fileNameO: 'icon_私募产品查询.svg' },
  smcpyy: { id: 24, code: 'smcpyy', fileName: 'icon_smcpyy.svg', desc: '私募产品预约', fileNameO: 'icon_私募产品预约.svg' },
  smzs: { id: 25, code: 'smzs', fileName: 'icon_smzs.svg', desc: '私募助手', fileNameO: 'icon_私募助手.svg' },
  smkqhx: { id: 26, code: 'smkqhx', fileName: 'icon_smkqhx.svg', desc: '私募客群画像', fileNameO: 'icon_私募客群画像.svg' },
  jxfd: { id: 27, code: 'jxfd', fileName: 'icon_jxfd.svg', desc: '绩效辅导', fileNameO: 'icon_绩效辅导.svg' },
  wdhdl: { id: 28, code: 'wdhdl', fileName: 'icon_wdhdl.svg', desc: '网点活动量', fileNameO: 'icon_网点活动量.svg' },
  rgjm: { id: 29, code: 'rgjm', fileName: 'icon_rgjm.svg', desc: '认购减免', fileNameO: 'icon_认购减免.svg' },
  ckqy: { id: 30, code: 'ckqy', fileName: 'icon_ckqy.svg', desc: '财客权益', fileNameO: 'icon_财客权益.svg' },
  zjcj: { id: 31, code: 'zjcj', fileName: 'icon_zjcj.svg', desc: '转接承接', fileNameO: 'icon_转接承接.svg' },
  yczj: { id: 32, code: 'yczj', fileName: 'icon_yczj.svg', desc: '远程转介', fileNameO: 'icon_远程转介.svg' },
  jbbjysj: { id: 33, code: 'jbbjysj', fileName: 'icon_jbbjysj.svg', desc: '金宝宝经营数据', fileNameO: 'icon_金宝宝经营数据.svg' },
  wyhts: { id: 34, code: 'wyhts', fileName: 'icon_wyhts.svg', desc: '万元户提升', fileNameO: 'icon_万元户提升.svg' },
  yjmb: { id: 35, code: 'yjmb', fileName: 'icon_yjmb.svg', desc: '业绩目标', fileNameO: 'icon_业绩目标.svg' },
  dfsp: { id: 36, code: 'dfsp', fileName: 'icon_dfsp.svg', desc: '代发审批', fileNameO: 'icon_代发审批.svg' },
  dfcj: { id: 37, code: 'dfcj', fileName: 'icon_dfcj.svg', desc: '代发承接', fileNameO: 'icon_代发承接.svg' },
  dftj: { id: 38, code: 'dftj', fileName: 'icon_dftj.svg', desc: '代发推荐', fileNameO: 'icon_代发推荐.svg' },
  dfcx: { id: 39, code: 'dfcx', fileName: 'icon_dfcx.svg', desc: '代发查询', fileNameO: 'icon_代发查询.svg' },
  hygl: { id: 40, code: 'hygl', fileName: 'icon_hygl.svg', desc: '会员管理', fileNameO: 'icon_会员管理.svg' },
  qhkh: { id: 41, code: 'qhkh', fileName: 'icon_qhkh.svg', desc: '全行客户', fileNameO: 'icon_全行客户.svg' },
  fpkk: { id: 42, code: 'fpkk', fileName: 'icon_fpkk.svg', desc: '分配开卡', fileNameO: 'icon_分配开卡.svg' },
  dqcj: { id: 43, code: 'dqcj', fileName: 'icon_dqcj.svg', desc: '到期承接', fileNameO: 'icon_到期承接.svg' },
  gnzb: { id: 44, code: 'gnzb', fileName: 'icon_gnzb.svg', desc: '功能指标', fileNameO: 'icon_功能指标.svg' },
  ttms: { id: 45, code: 'ttms', fileName: 'icon_ttms.svg', desc: '厅堂模式', fileNameO: 'icon_厅堂模式.svg' },
  ffcx: { id: 46, code: 'ffcx', fileName: 'icon_ffcx.svg', desc: '发放查询', fileNameO: 'icon_发放查询.svg' },
  pphx: { id: 47, code: 'pphx', fileName: 'icon_pphx.svg', desc: '品牌行销', fileNameO: 'icon_品牌行销.svg' },
  zxyj: { id: 48, code: 'zxyj', fileName: 'icon_zxyj.svg', desc: '坐销业绩', fileNameO: 'icon_坐销业绩.svg' },
  jjdy: { id: 49, code: 'jjdy', fileName: 'icon_jjdy.svg', desc: '基金弹药', fileNameO: 'icon_基金弹药.svg' },
  jjjy: { id: 50, code: 'jjjy', fileName: 'icon_jjjy.svg', desc: '基金经营', fileNameO: 'icon_基金经营.svg' },
  jzxt: { id: 50, code: 'jzxt', fileName: 'icon_jzxt.svg', desc: '家族信托', fileNameO: 'icon_家族信托.svg' },
  dphd: { id: 51, code: 'dphd', fileName: 'icon_dphd.svg', desc: '大屏互动', fileNameO: 'icon_大屏互动.svg' },
  debd: { id: 52, code: 'debd', fileName: 'icon_debd.svg', desc: '大额变动', fileNameO: 'icon_大额变动.svg' },
  dqcp: { id: 53, code: 'dqcp', fileName: 'icon_dqcp.svg', desc: '定期产品', fileNameO: 'icon_定期产品.svg' },
  khzx: { id: 54, code: 'khzx', fileName: 'icon_khzx.svg', desc: '客户咨询', fileNameO: 'icon_客户咨询.svg' },
  khgl: { id: 55, code: 'khgl', fileName: 'icon_khgl.svg', desc: '客户管理', fileNameO: 'icon_客户管理.svg' },
  sxhd: { id: 56, code: 'sxhd', fileName: 'icon_sxhd.svg', desc: '寿险活动', fileNameO: 'icon_寿险活动.svg' },
 cjgl: { id: 57, code: 'cjgl', fileName: 'icon_cjgl.svg', desc: '承接管理', fileNameO: 'icon_承接管理.svg' },
  qkh: { id: 58, code: 'qkh', fileName: 'icon_qkh.svg', desc: '抢客户', fileNameO: 'icon_抢客户.svg' },
  xydcx: { id: 59, code: 'xydcx', fileName: 'icon_xydcx.svg', desc: '新一贷查询', fileNameO: 'icon_新一贷查询.svg' },
  cjzy: { id: 60, code: 'cjzy', fileName: 'icon_cjzy.svg', desc: '春季战“役”', fileNameO: 'icon_春季战“役”.svg' },
  cxh: { id: 61, code: 'cxh', fileName: 'icon_cxh.svg', desc: '晨夕会', fileNameO: 'icon_晨夕会.svg' },
  zngh: { id: 62, code: 'zngh', fileName: 'icon_zngh.svg', desc: '智能管户', fileNameO: 'icon_智能管户.svg' },
  gdgn: { id: 63, code: 'gdgn', fileName: 'icon_gdgn.svg', desc: '更多功能', fileNameO: 'icon_更多功能.svg' },
  slhd: { id: 65, code: 'slhd', fileName: 'icon_slhd.svg', desc: '沙龙活动', fileNameO: 'icon_沙龙活动.svg' },
  hd: { id: 66, code: 'hd', fileName: 'icon_hd.svg', desc: '活动', fileNameO: 'icon_活动.svg' },
  jyst: { id: 67, code: 'jyst', fileName: 'icon_jyst.svg', desc: '经营视图', fileNameO: 'icon_经营视图.svg' },
  zhzx: { id: 68, code: 'zhzx', fileName: 'icon_zhzx.svg', desc: '综合资讯', fileNameO: 'icon_综合资讯.svg' },
  yxgg: { id: 69, code: 'yxgg', fileName: 'icon_yxgg.svg', desc: '营销工具', fileNameO: 'icon_营销工具.svg' },
  dy: { id: 70, code: 'dy', fileName: 'icon_dy.svg', desc: '调研', fileNameO: 'icon_调研.svg' },
  ckts: { id: 71, code: 'ckts', fileName: 'icon_ckts.svg', desc: '财客提升', fileNameO: 'icon_财客提升.svg' },
  ckfis: { id: 72, code: 'ckfis', fileName: 'icon_ckfis.svg', desc: '财客防流失', fileNameO: 'icon_财客防流失.svg' },
  zhzd: { id: 73, code: 'zhzd', fileName: 'icon_zhzd.svg', desc: '账户指定', fileNameO: 'icon_账户指定.svg' },
  gjkk: { id: 74, code: 'gjkk', fileName: 'icon_gjkk.svg', desc: '跟进开卡', fileNameO: 'icon_跟进开卡.svg' },
  yykh: { id: 75, code: 'yykh', fileName: 'icon_yykh.svg', desc: '预约客户', fileNameO: 'icon_预约客户.svg' },
  yykk: { id: 76, code: 'yykk', fileName: 'icon_yykk.svg', desc: '预约开卡', fileNameO: 'icon_预约开卡.svg' }
}
const iconArr = ref([])
function loadSvg() {
  // 批量导入
  // const iconFolder = '@/assets/nineMenuIcon/'
  const iconModules = require.context('@/assets/nineMenuIcon/', false, /\.svg$/)
  iconModules.keys().forEach((item, i) => {
    const fileName = item.replace('./', '')
    const i1 = fileName.indexOf('_') + 1
    const i2 = fileName.indexOf('.')
    const code = fileName.substring(i1, i2)
    const desc = imgMapping[code]?.desc || ''
    iconArr.value.push({ code , fileName , desc })
  })
}

const isOpen = ref(false)
function open(data) {
  // 打开弹框
  isOpen.value = true
  loadSvg()
}
function close() {
  // 关闭弹框
  isOpen.value = false
  selectItem.value = {}
}
let selectItem = ref({})
function clickItem(item) {
  selectItem.value = item
}
const emits = defineEmits('comfirm')
function comfirm() {
  if (!selectItem.value?.code) {
    Message.warning('还未选择图标')
  }
  emits('comfirm', selectItem.value)
  close()
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.items {
  display: flex;
  flex-wrap: wrap;
  // max-height: 400px;
  // overflow-y: auto;
  .item {
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 55px;
    margin: 10px 15px;
    border-radius: 30px;
    border: 1px solid #f0f0f0;
    // img {
    //   width: 40px;
    //   height: 40px;
    // }
  }
  .item:hover {
    background: #f0f0f0;
  }
  .active {
    border: 1px solid #d0d0d0 !important;
    box-shadow: 0 0 10px #aaa !important;
  }
}
</style>
