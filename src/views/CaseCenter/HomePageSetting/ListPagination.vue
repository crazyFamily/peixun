<template>
  <div class="list-wrapper">
    <div class="list-content">
      <div class="item" :class="{active: selectItemIndex == index}" v-for="(item, index) in data" :key="index" @click="selectItemHandle(item, index)">
				<slot :item="item">
          <img class="item-img" :class="{ current: item.caseId === selectItemId }" :src="item.thumbnailUrl" alt />
        	<p class="title">{{ item.caseName }}</p>
				</slot>
      </div>
    </div>
		<gc-pagination v-if="isShowPage"
			:total="total || queryForm.total"
			:page-sizes="pageSizes"
			:page-size="queryForm.pageSize"
			:current-page="queryForm.currPage"
			@sizeChange="sizeChange($event, queryForm, getList)"
			@currentChange="currentChange($event, queryForm, getList)"
		>
			<span class="text">每页显示</span>
		</gc-pagination>
  </div>
</template>
<script>
export default {
	name: 'list-pagination'
}
</script>
<script setup>
import { sizeChange, currentChange } from '@/util/utils.js'
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
	queryForm: {
		type: Object,
    default: () => {}
	},
	total: {
		type: Number,
		default: 0
	},
	pageSizes: {
		type: Array,
		default: () => [10, 20]
	},
  data: {
    type: Array,
    default: () => []
	},
	getList: {
		type: Function
  },
  selectItem: {
    type: Object,
    default: () => {}
  },
  selectItemId: {
    type: String,
    default: ''
  },
  selectItemIndex: {
    type: Number,
    default: -1
  },
  isShowPage: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['selectItem'])
function selectItemHandle (row, index) {
  emits('selectItem', { index, row })
}
</script>

<style lang="scss" scoped>
.list-content {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 128px;
    margin: 10px;
    border: 3px solid transparent;
    cursor: pointer;
  }
  
  .active {
    border: 1px solid #d0d0d0 !important;
    box-shadow:0 0 10px #aaa !important;
  }

  .item-img {
    // width: 120px;
    width: 100%;
    height: 120px;
    border: 4px solid #fff;
    box-shadow: rgb(#000, 0.2) 0 4px 8px;

    &.current {
      border: 3px solid $themeColor;
    }
  }

  .title {
    margin-top: 10px;
    margin-left: 2px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
