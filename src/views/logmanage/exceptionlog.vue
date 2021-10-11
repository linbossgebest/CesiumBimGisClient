<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="className"
        placeholder="请输入类名称"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-input
        v-model="methodName"
        placeholder="请输入方法名称"
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
      <el-table-column label="类名" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.ClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="方法名" width="200px" align="center">
        <template slot-scope="{ row }">
          <el-tag>
            <span>{{ row.MethodName }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="异常名称" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ExceptionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常信息" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ExceptionMsg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常源" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ExceptionSource }}</span>
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
import { getExceptionLogs } from "@/api/log";
import waves from "@/directive/waves"; // waves directive

export default {
  name: "ComponentInfo",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      className: "", //类名称
      methodName: "", //方法名称
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
      getExceptionLogs(
        this.className,
        this.methodName,
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
