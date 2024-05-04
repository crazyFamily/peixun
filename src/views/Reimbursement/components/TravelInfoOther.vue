<template>
  <!-- 酒店， 机票， 火车， 用车订单信息 -->
  <div class="LaunchTrainingCourse__info-card__travel-orders">
    <!-- 酒店订单 -->
    <div class="LaunchTrainingCourse__info-card__travel-orders__hotel">
      <div class="LaunchTrainingCourse__title">
        <div class="LaunchTrainingCourse__title__left">
          <span class="LaunchTrainingCourse__title__left__menu"></span>
          酒店订单
        </div>
      </div>
      <div class="
          LaunchTrainingCourse__info-card__item-content
          LaunchTrainingCourse__info-card__travel-orders__hotel__content
        ">
        <gc-table
          :list="hotelOrderList"
          :tableList="hotelOrderTable"
          :stripe="false"
          class="general__table" />
      </div>
    </div>
    <!-- 机票订单 -->
    <div class="LaunchTrainingCourse__info-card__travel-orders__airfare">
      <div class="LaunchTrainingCourse__title">
        <div class="LaunchTrainingCourse__title__left">
          <span class="LaunchTrainingCourse__title__left__menu"></span>
          机票订单
        </div>
      </div>
      <div class="
          LaunchTrainingCourse__info-card__item-content
          LaunchTrainingCourse__info-card__travel-orders__airfare__content
          LaunchTrainingCourse__content
        ">
        <gc-table
          :list="airfareOrderList"
          :tableList="airfareOrderTable"
          :stripe="false"
          class="general__table" />
      </div>
    </div>
    <!-- 火车订单 -->
    <div class="LaunchTrainingCourse__info-card__travel-orders__train">
      <div class="LaunchTrainingCourse__title">
        <div class="LaunchTrainingCourse__title__left">
          <span class="LaunchTrainingCourse__title__left__menu"></span>
          火车订单
        </div>
      </div>
      <div class="
          LaunchTrainingCourse__info-card__item-content
          LaunchTrainingCourse__info-card__travel-orders__train__content
        ">
        <gc-table
          :list="trainOrderList"
          :tableList="trainOrderTable"
          :stripe="false"
          class="general__table" />
      </div>
    </div>
    <!-- 用车订单 -->
    <div class="LaunchTrainingCourse__info-card__travel-orders__car">
      <div class="LaunchTrainingCourse__title">
        <div class="LaunchTrainingCourse__title__left">
          <span class="LaunchTrainingCourse__title__left__menu"></span>
          用车订单
        </div>
      </div>
      <div class="
          LaunchTrainingCourse__info-card__item-content
          LaunchTrainingCourse__info-card__travel-orders__car__content
        ">
        <gc-table
          :list="carOrderList"
          :tableList="carOrderTable"
          :stripe="false"
          class="general__table" />
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '../../../plugins/until'
export default {
  name: 'TravelInfo',
  components: {},
  // setup(){},
  props: {
    hotelOrderTable: { // 酒店订单 数据数组
      type: Array,
      default: () => []
    },
    airfareOrderTable: { // 机票订单 数据数组
      type: Array,
      default: () => []
    },
    trainOrderTable: { // 火车订单 数据数组
      type: Array,
      default: () => []
    },
    carOrderTable: { // 用车订单 数据数组
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      // 酒店订单 字段数组
      hotelOrderList: [
        { width: '54', type: 'selection' },
        { label: '序号', type: 'index', value: '序号', width: '64' },
        { prop: 'tripName', label: '入住人', value: '入住人' },
        { prop: 'amt', label: '金额', value: '金额' },
        { prop: 'startTime', label: '入住时间', value: '入住时间' },
        { prop: 'endTime', label: '离店时间', value: '离店时间' },
        { prop: 'caikuOrderId', label: '订单号', value: '订单号' }
      ],
      // 酒店订单 数据数组
      // hotelOrderTable: [],
      // 机票订单 字段数组
      airfareOrderList: [
        { width: '54', type: 'selection' },
        { label: '序号', type: 'index', value: '序号', width: '79' },
        { prop: 'tripName', label: '乘车人', value: '乘车人', width: '91' },
        { prop: 'amt', label: '金额', value: '金额', width: '79' },
        { prop: 'startTime', label: '起飞时间', value: '起飞时间', width: '103' },
        { prop: 'cabinLevel', label: '仓等', value: '仓等', width: '79' },
        { prop: 'caikuOrderId', label: '订单号', value: '订单号', width: '91' }
      ],
      // 机票订单 数据数组
      // airfareOrderTable: [],
      // 火车订单 字段数组
      trainOrderList: [
        { width: '54', type: 'selection' },
        { label: '序号', type: 'index', value: '序号', width: '79' },
        { prop: 'tripName', label: '乘客姓名', value: '乘客姓名', width: '103' },
        { prop: 'amt', label: '金额', value: '金额', width: '79' },
        // { prop: "name", label: "出发站名", value: "出发站名", width: "103" },
        // { prop: "name", label: "到达站名", value: "到达站名", width: "103" },
        { prop: 'startTime', label: '开始出发时间', value: '开始出发时间', width: '127',
          ctx: (row) => formatDate(row.startTime, true)
        },
        { prop: 'caikuOrderId', label: '订单号', value: '订单号', width: '200' }
      ],
      // 火车订单 数据数组
      // trainOrderTable: [],
      // 用车订单 字段数组
      carOrderList: [
        { width: '54', type: 'selection' },
        { label: '序号', type: 'index', value: '序号', width: '64' },
        { prop: 'tripName', label: '用车人姓名', value: '用车人姓名', width: '115' },
        { prop: 'amt', label: '金额', value: '金额', width: '79' },
        // { prop: "name", label: "起始地", value: "起始地", width: "91" },
        // { prop: "name", label: "目的地", value: "目的地", width: "91" },
        { prop: 'startTime', label: '开始用车时间', value: '开始用车时间', width: '127' },
        { prop: 'caikuOrderId', label: '订单号', value: '订单号', width: '91' }
      ],
      // 用车订单 数据数组
      // carOrderTable: [],
    }
  },
  methods: {},
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.TravelInfo {
}
</style>