<template>
    <div class="{{moduleName}}__{{fileName}}">
        <!-- 搜索 card -->
        <el-card class="search-form-card">
            <el-form :model="queryForm" inline>
                <el-form-item></el-form-item>
                <div class="buttons">
                    <el-button
                        @click="query"
                        class="button-w80-h30"
                        type="primary"
                        >查询</el-button
                    >
                    <el-button @click="reset" class="button-w80-h30"
                        >重置</el-button
                    >
                </div>
            </el-form>
        </el-card>

        <!-- 内容card -->
        <el-card class="mt10">
            <table-pagination
                :list="list"
                :tableList="tableList"
                :queryForm="queryForm"
                :getList="getList"
                ref="tablePagination"
            >
            </table-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "{{fileName}}",
    data() {
        return {
            queryForm: {},
            list: [],
            tableList: [],
        };
    },
  methods: {
        query() {},
        reset() {},
        getList() {},
    },
};
</script>
<style lang="scss">
.{{moduleName}}__{{fileName}} {
}
</style>
