<template>
  <div class="app-container">
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="handleFilter"
    >
      查询
    </el-button>
    <el-button type="primary" @click="handleAddRole"> 添加角色 </el-button>

    <el-table :data="rolesList" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="角色编号" width="220">
        <template slot-scope="scope">
          {{ scope.row.Id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.RoleName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="角色类型描述">
        <template slot-scope="scope">
          {{ scope.row.RoleType }}
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

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '修改角色' : '新增角色'"
    >
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="role.RoleName" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色类型">
          <el-input
            v-model="role.RoleType"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="角色类型描述"
          />
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmRole"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import {
  getRoutes,
  getRoles,
  getRoutesByRole,
  addRole,
  deleteRole,
} from "@/api/auth";
import waves from "@/directive/waves"; // waves directive

const defaultRole = {
  Id: undefined,
  RoleName: "",
  RoleType: "",
  routes: [],
};

export default {
  directives: { waves },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title",
      },
      SysRoleMenus: [],
    };
  },
  computed: {
    routesData() {
      return this.routes;
    },
  },
  created() {
    this.getRoutes();
    this.getRoles();
  },
  methods: {
    handleFilter() {
      this.getRoles();
    },
    async getRoutes() {
      //查询菜单生成菜单树
      getRoutes().then((response) => {
        let data = JSON.parse(response.data).menuTree;
        this.serviceRoutes = data;
        console.log(this.serviceRoutes);
        this.routes = this.generateRoutes(data);
        console.log(this.routes);
      });
    },
    async getRoles() {
      //查询所有角色信息
      getRoles().then((response) => {
        let data = JSON.parse(response.data);
        this.rolesList = data.items;
      });
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = "/") {
      const res = [];

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue;
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        );

        if (
          route.children &&
          route.children.length != 0 &&
          onlyOneShowingChild &&
          !route.alwaysShow
        ) {
          route = onlyOneShowingChild;
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
        };

        console.log(data);

        // recursive child routes
        if (route.children && route.children.length != 0) {
          data.children = this.generateRoutes(route.children, data.path);
        }
        res.push(data);
      }
      console.log(res);
      return res;
    },
    generateArr(routes) {
      let data = [];
      routes.forEach((route) => {
        data.push(route);
        if (route.children) {
          const temp = this.generateArr(route.children);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
      });
      console.log(data);
      return data;
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
      }
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      console.log(scope.row);
      this.role = deepClone(scope.row);
      console.log(this.role);

      getRoutesByRole(this.role.Id).then((response) => {
        let data = JSON.parse(response.data).menuTree;
        this.role.routes = data;
        this.$nextTick(() => {
          console.log(routes);
          const routes = this.generateRoutes(this.role.routes);
          console.log(routes);
          this.$refs.tree.setCheckedNodes(this.generateArr(routes));
          this.checkStrictly = false;
        });
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm("请确认是否确认删除？").then(() => {
        deleteRole(row.Id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getRoles();
        });
      });
    },
    generateTree(routes, basePath = "/", checkedKeys) {
      const res = [];

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path);

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          );
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route);
        }
      }
      return res;
    },
    async confirmRole() {
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      this.role.routes = this.generateTree(
        deepClone(this.serviceRoutes),
        "/",
        checkedKeys
      );

      console.log(this.role.routes);
      // let res = this.generateRoleMenus(this.role.Id, this.role.routes);
      // console.log(res);
      this.role.SysRoleMenus = this.generateRoleMenus(
        this.role.Id,
        this.role.routes
      );

      console.log(this.role);

      addRole(this.role).then(() => {
        this.dialogVisible = false;
        this.$notify({
          title: "成功",
          message: "创建修改成功",
          type: "success",
          duration: 2000,
        });
        this.getRoles();
      });
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null;
      const showingChildren = children.filter((item) => !item.hidden);

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0];
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path);
        return onlyOneChild;
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return onlyOneChild;
      }

      return false;
    },
    generateRoleMenus(roleId, routes) {
      for (let index = 0; index < routes.length; index++) {
        this.SysRoleMenus.push({ RoleId: roleId, MenuId: routes[index].id });
        if (routes[index].children && routes[index].children.length != 0) {
          this.generateRoleMenus(roleId, routes[index].children);
        }
      }

      return this.SysRoleMenus;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
