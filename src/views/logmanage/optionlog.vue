<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="logName"
        placeholder="请输入日志名称"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-input
        v-model="requestMethod"
        placeholder="请输入请求方式"
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
      <el-table-column label="请求方式" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.ReqMethod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行结果" width="200px" align="center">
        <template slot-scope="{ row }">
          <el-tag>
            <span>{{ row.Success | successStatusFilter }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求地址" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.OpTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人名称" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人账号" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Account }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getLogs"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getOptionLogs } from "@/api/log";
import waves from "@/directive/waves"; // waves directive

export default {
  name: "ComponentInfo",
  components: { Pagination },
  directives: { waves },
  filters: {
    successStatusFilter(status) {
      const statusMap = {
        false: "否",
        true: "是",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      tableKey: 0,
      logName: "", //日志名称
      requestMethod: "", //请求方式
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
    this.getLogs();
  },
  methods: {
    getLogs() {
      getOptionLogs(
        this.logName,
        this.requestMethod,
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
      this.getLogs();
    },
  },
};
</script>
