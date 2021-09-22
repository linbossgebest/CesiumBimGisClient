<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="componentId"
        placeholder="请输入构件编号"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-input
        v-model="componentName"
        placeholder="请输入构件名称"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="评论编号" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="构件编号" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.ComponentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="构件名称" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ComponentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属模型" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ModelId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评论信息" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Comment }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getComponentCommentList"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  getModelComponentComments,
  deleteComponentComment,
} from "@/api/modelcomponent";
import waves from "@/directive/waves"; // waves directive

export default {
  name: "ComponentCommentInfo",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      componentId: "", //构件编号
      componentName: "", //构件名称
      list: null, //展示列表
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
    };
  },
  created() {
    this.getComponentCommentList();
  },
  methods: {
    getComponentCommentList() {
      getModelComponentComments(
        this.componentId,
        this.componentName,
        this.listQuery.page,
        this.listQuery.limit
      ).then((response) => {
        let data = JSON.parse(response.data);

        this.list = data.items;
        this.total = data.total;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getComponentCommentList();
    },
    handleDelete(row, index) {
      this.$confirm("请确认是否确认删除？").then(() => {
        deleteComponentComment(row.Id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getComponentCommentList();
        });
      });
    },
  },
};
</script>
