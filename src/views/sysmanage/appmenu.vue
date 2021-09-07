<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column label="编号" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.MenuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单类型" width="200px" align="center">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.MenuType }}</span> -->
          <el-tag :type="row.MenuType | statusFilter">
            {{ row.MenuType | menuTypeFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Icon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对应操作" width="auto" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Action }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序编号" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.OrderNo }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getAppMenuList"
    />

  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getAppMenus } from "@/api/auth";
import waves from "@/directive/waves"; // waves directive

export default {
  name: "AppMenu",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "success",
        1: "info",
        2: "danger",
      };
      return statusMap[status];
    },
    menuTypeFilter(status) {
      const statusMap = {
        0: "主菜单",
        1: "功能菜单",
        2: "操作菜单",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
    };
  },
  created() {
    // this.getList();
    this.getAppMenuList();
  },
  methods: {
    getAppMenuList() {
      //查询菜单
      this.listLoading = true;
      getAppMenus(this.listQuery.page, this.listQuery.limit).then(
        (response) => {
          let data = JSON.parse(response.data);

          this.list = data.items;
          this.total = data.total;

          console.log(this.list);

          this.listLoading = false;
        }
      );
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getAppMenuList();
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      console.log(this.rolesList);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
  },
  computed: {},
};
</script>
