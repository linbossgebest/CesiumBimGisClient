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
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
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
      <el-table-column label="编号" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="构件类型" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ typeInfo(row.ComponentTypeId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ menuInfo(row.AppMenuId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义菜单名称" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.CustomMenuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自定义菜单资源" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.CustomMenuSrc }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="auto"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
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
      @pagination="getMenus"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="构件类型">
          <el-select
            v-model="temp.ComponentTypeId"
            class="filter-item"
            placeholder="Please select"
            @change="change()"
          >
            <el-option
              v-for="item in componentTypeList"
              :key="item.Id"
              :label="item.TypeName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="对应菜单">
          <el-select
            v-model="temp.AppMenuId"
            class="filter-item"
            placeholder="Please select"
            @change="change()"
          >
            <el-option
              v-for="item in appMenuList"
              :key="item.Id"
              :label="item.MenuName"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义菜单名称" prop="CustomMenuName">
          <el-input v-model="temp.CustomMenuName" />
        </el-form-item>
        <el-form-item label="自定义菜单资源" prop="CustomMenuSrc">
          <el-input v-model="temp.CustomMenuSrc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  getComponentMenus,
  getComponentTypes,
  addComponentMenu,
  deleteComponentMenu,
} from "@/api/modelcomponent";
import { getAppMenusByType } from "@/api/auth";
import waves from "@/directive/waves"; // waves directive

export default {
  name: "ComponentMenu",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      componentId: "",
      componentName: "",
      list: null,
      componentTypeList: [],
      ComponentTypeDefaultId: undefined,
      appMenuList: [],
      AppMenuDefaultId: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      temp: {
        Id: undefined,
        ComponentTypeId: undefined,
        AppMenuId: undefined,
        CustomMenuName: "",
        CustomMenuSrc: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        create: "创建模型构件菜单",
        update: "修改模型构件菜单",
      },
      rules: {
        ComponentTypeId: [
          {
            required: true,
            message: "ComponentTypeId is required",
            trigger: "change",
          },
        ],
        AppMenuId: [
          {
            required: true,
            message: "AppMenuId is required",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getMenus();
    this.getTypes();
    this.getAppMenus();
  },
  methods: {
    getMenus() {
      this.listLoading = true;
      getComponentMenus(this.listQuery.page, this.listQuery.limit).then(
        (response) => {
          let data = JSON.parse(response.data);

          this.list = data.items;
          this.total = data.total;

          this.listLoading = false;
        }
      );
    },
    getTypes() {
      //查询构件类型
      getComponentTypes(this.listQuery.page, 10000).then((response) => {
        let data = JSON.parse(response.data);

        this.componentTypeList = data.items;
        this.ComponentTypeDefaultId = this.componentTypeList[0].Id;
      });
    },
    getAppMenus() {
      //获取类型为操作菜单的appmenus
      getAppMenusByType(2).then((response) => {
        let data = JSON.parse(response.data);

        this.appMenuList = data.menu;
        this.AppMenuDefaultId = this.appMenuList[0].Id;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getMenus();
    },
    resetTemp() {
      this.temp = {
        Id: undefined,
        ComponentTypeId: this.ComponentTypeDefaultId,
        AppMenuId: this.AppMenuDefaultId,
        CustomMenuName: "",
        CustomMenuSrc: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          addComponentMenu(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
            this.getMenus();
          });
        }
      });
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
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          addComponentMenu(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
            this.getMenus();
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("请确认是否确认删除？").then(() => {
        deleteComponentMenu(row.Id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getMenus();
        });
      });
    },
    change() {
      this.$forceUpdate();
    },
  },
  computed: {
    typeInfo() {
      return function (typeId) {
        let typeItem = this.componentTypeList.find((f) => f.Id === typeId);
        let typeName = typeItem == null ? "" : typeItem.TypeName;
        return typeName;
      };
    },
    menuInfo() {
      return function (appMenuId) {
        let menuItem = this.appMenuList.find((f) => f.Id === appMenuId);
        let menuName = menuItem == null ? "" : menuItem.MenuName;
        return menuName;
      };
    },
  },
};
</script>
