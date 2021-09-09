<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="请输入用户名称"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
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
      <el-table-column label="编号" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.Id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.UserName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="角色名称" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ roleInfo(row.RoleId) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="手机号码" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱地址" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.Email }}</span>
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
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="用户名称" prop="UserName">
          <el-input v-model="temp.UserName" />
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="PassWord"
          v-if="textMap[dialogStatus] === '创建用户'"
        >
          <el-input v-model="temp.PassWord" />
        </el-form-item>
        <el-form-item label="用户角色">
          <!-- <el-select
            v-model="temp.RoleId"
            :label="temp.RoleName"
            class="filter-item"
            placeholder="Please select"
            @change="change()"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select> -->
          <el-select
            v-model="roleIdList"
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
        <el-form-item label="手机号码">
          <el-input v-model="temp.Mobile" />
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="temp.Email" />
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
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getUsers, deleteUser, addUser } from "@/api/user";
import { getRoles } from "@/api/auth";
import waves from "@/directive/waves"; // waves directive
import { mapGetters } from "vuex";

export default {
  name: "UserInfo",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      rolesList: [],
      roleIdList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      temp: {
        Id: undefined,
        UserName: "",
        RoleId: undefined,
        RoleName: undefined,
        PassWord: "",
        Mobile: "",
        Email: "",
        RoleIds: [],
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改用户",
        create: "创建用户",
      },
      rules: {
        UserName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        RoleId: [
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
    this.getList();
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      //查询角色
      getRoles().then((response) => {
        let data = JSON.parse(response.data);
        data.items.forEach((item) => {
          this.rolesList.push({ name: item.RoleName, code: item.Id });
        });
      });
    },
    getList() {
      //查询用户
      this.listLoading = true;
      getUsers(this.listQuery.page, this.listQuery.limit).then((response) => {
        let data = JSON.parse(response.data);

        this.list = data.items;
        this.total = data.total;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.roleIdList = [];
      this.temp = {
        Id: undefined,
        UserName: "",
        RoleId: 1,
        RoleName: "admin",
        PassWord: "",
        Mobile: "",
        Email: "",
        RoleIds: [],
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
          console.log(this.temp);
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
      // this.roleIdList = this.$store.state.user.roles;
      // console.log(this.$store.state.user.roles)
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
    ...mapGetters(["name", "avatar", "roles"]),
  },
};
</script>
