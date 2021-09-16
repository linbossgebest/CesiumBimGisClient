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
      :data="menuList"
      style="width: 100%"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- <el-table-column align="center" label="菜单编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="菜单名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="对应组件">
        <template slot-scope="scope">
          {{ scope.row.component }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="路由地址">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="图标" width="220">
        <template slot-scope="scope">
          {{ scope.row.meta.icon }}
        </template>
      </el-table-column>

      <el-table-column align="header-center" label="排序">
        <template slot-scope="scope">
          {{ scope.row.orderno }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
        style="width: auto; margin-left: 50px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-cascader
            v-model="selectedOptions"
            :key="cascaderkey"
            :options="menus"
            :props="{ value: 'id', label: 'name', checkStrictly: true }"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="对应组件">
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item label="路由地址">
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="temp.meta.icon" />
        </el-form-item>
        <el-form-item label="重定向地址">
          <el-input v-model="temp.redirect" />
        </el-form-item>
        <el-form-item label="排序编号" prop="orderno">
          <el-input v-model="temp.orderno" />
        </el-form-item>
        <el-form-item label="根菜单显示">
          <el-switch v-model="temp.alwaysShow"></el-switch>
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-switch v-model="temp.hidden"></el-switch>
        </el-form-item>
        <el-form-item label="是否缓存">
          <el-switch v-model="temp.meta.noCache"></el-switch>
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
import { getRoutes, addMenu, deleteMenu } from "@/api/auth";
import waves from "@/directive/waves"; // waves directive

export default {
  name: "MenuInfo",
  directives: { waves },
  filters: {
    isEnableFilter(status) {
      const statusMap = {
        0: "未启用",
        1: "已启用",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      cascaderkey: 1,
      menuList: [],
      menus: [],
      selectedOptions: [],
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      temp: {
        id: undefined,
        name: "",
        parentid: undefined,
        path: "",
        redirect: "",
        hidden: false,
        component: "",
        alwaysShow: false,
        orderno: undefined,
        meta: {
          id: undefined,
          menuid: undefined,
          noCache: false,
          roles: "",
          title: "",
          activeMenu: "",
          affix: false,
          breadcrumb: true,
          icon: "",
        },
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        create: "新增菜单",
        update: "修改菜单",
      },
      rules: {
        name: [{ required: true, message: "请输菜单名称", trigger: "blur" }],
        orderno: [
          { required: true, message: "请输入排序编号", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoutes();
  },
  methods: {
    getRoutes() {
      //查询菜单生成菜单树
      getRoutes().then((response) => {
        let data = JSON.parse(response.data).menuTree;
        this.menuList = data;
        console.log(this.menuList);
        this.menus = [];
        let m = {
          id: 0,
          name: "顶级菜单",
          children: [],
        };
        m.children = data;
        this.menus.push(m);
        this.cascaderkey++;
        //console.log(this.menus);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getRoutes();
    },
    resetTemp() {
      //   this.roleIdList = [];
      this.temp = {
        id: undefined,
        name: "",
        parentid: undefined,
        path: "",
        redirect: "",
        hidden: false,
        component: "",
        alwaysShow: false,
        orderno: undefined,
        meta: {
          id: undefined,
          menuid: undefined,
          noCache: false,
          roles: "",
          title: "",
          activeMenu: "",
          affix: false,
          breadcrumb: true,
          icon: "",
        },
      };
    },
    handleCreate() {
      this.resetTemp();
      this.selectedOptions = [0]; //创建时默认父级菜单选择顶级菜单
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.parentid =
            this.selectedOptions[this.selectedOptions.length - 1];
          console.log(this.temp);
          addMenu(this.temp).then((response) => {
            //console.log(response);
            this.dialogFormVisible = false;
            if (response.isSuccess) {//判断返回值response是否成功
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000,
              });
            }
            this.getRoutes();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      if (this.temp.parentid == 0) {
        //父级菜单为0则是顶级菜单
        this.selectedOptions = [this.temp.parentid];
      } else {
        //不是顶级菜单需要加上0 识别路径
        this.selectedOptions = [0, this.temp.parentid];
      }
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
          tempData.parentid =
            this.selectedOptions[this.selectedOptions.length - 1];
          // console.log(this.selectedOptions);
          console.log(tempData);
          // tempData.RoleIds = [];
          addMenu(tempData).then((response) => {
            this.dialogFormVisible = false;
            if (response.isSuccess) {
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                duration: 2000,
              });
            }
            this.getRoutes();
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("请确认是否确认删除？").then(() => {
        deleteMenu(row.id).then((response) => {
          if (response.isSuccess) {
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
          }
          this.getRoutes();
        });
      });
    },
    change() {
      this.$forceUpdate();
    },
  },
  computed: {},
};
</script>


<style scoped>
</style>