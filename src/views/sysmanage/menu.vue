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
          {{ scope.row.meta.title }}
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
          {{ scope.row.order }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="菜单名称" prop="UserName">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="父级菜单" prop="RoleIds">
          <el-select
            v-model="temp.parentid"
            multiple
            class="filter-item"
            placeholder="请选择"
            @change="change()"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
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
        <el-form-item label="排序编号">
          <el-input v-model="temp.order" />
        </el-form-item>
        <el-form-item label="根菜单显示">
          <el-switch v-model="temp.alwaysShow"></el-switch>
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-switch v-model="temp.hidden"></el-switch>
        </el-form-item>
        <el-form-item label="是否缓存">
          <el-switch v-model="temp.noCache"></el-switch>
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
import { parseTime } from "@/utils";
import {
  getUsers,
  deleteUser,
  addUser,
  getUserRoles,
  getUserRolesByUserId,
} from "@/api/user";
import { getRoutes } from "@/api/auth";
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
      menuList: [],
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
        order: undefined,
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
        UserName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        RoleIds: [
          { required: true, message: "请输入角色信息", trigger: "blur" },
        ],
        PassWord: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
        ],
        Mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
        ],
        Email: [{ required: true, message: "请输入用户邮箱", trigger: "blur" }],
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
        console.log(data);
        // this.serviceRoutes = data;
        // console.log(this.serviceRoutes);
        // this.routes = this.generateRoutes(data);
        // console.log(this.routes);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getRoutes();
    },
    resetTemp() {
    //   this.roleIdList = [];
    //   this.temp = {
    //     Id: undefined,
    //     UserName: "",
    //     RoleId: 1,
    //     RoleName: "admin",
    //     PassWord: "",
    //     Mobile: "",
    //     Email: "",
    //     RoleIds: [],
    //   };
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
          addUser(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      getUserRolesByUserId(row.Id).then((response) => {
        this.temp = Object.assign({}, row); // copy obj
        this.temp.RoleIds = [];

        let data = JSON.parse(response.data);
        data.items.forEach((item) => {
          this.temp.RoleIds.push(item.RoleId);
        });

        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // tempData.RoleIds = [];
          addUser(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("请确认是否确认删除？").then(() => {
        deleteUser(row.Id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        });
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    change() {
      this.$forceUpdate();
    },
  },
  computed: {
    roleInfo() {
      return function (roleId) {
        return this.rolesList.find((f) => f.code === roleId).name;
      };
      // console.log(roleId)
      // console.log(this.rolesList.find((f) => f.code === roleId));
    },
  },
};
</script>


<style scoped>
</style>