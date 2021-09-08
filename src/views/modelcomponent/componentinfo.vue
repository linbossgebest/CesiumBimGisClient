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

      <el-table-column label="状态" width="200px" align="center">
        <template slot-scope="{ row }">
          <el-tag>
            <span>{{ row.Status | componentStatusFilter }}</span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="构件类型" width="200px" align="center">
        <template slot-scope="{ row }">
          <el-tag>
            <span>{{ typeInfo(row.ComponentTypeId) }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="父节点" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.ParentId }}</span>
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
      @pagination="getComponetList"
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
        style="width: auto; margin-left: 50px"
      >
        <el-form-item label="构件编号" prop="ComponentId">
          <el-input
            v-model="temp.ComponentId"
            :disabled="textMap[dialogStatus] === '修改构件信息'"
          />
        </el-form-item>
        <el-form-item label="构件名称" prop="ComponentName">
          <el-input v-model="temp.ComponentName" />
        </el-form-item>
        <el-form-item label="模型编号" prop="ModelId">
          <el-input v-model="temp.ModelId" />
        </el-form-item>
        <el-form-item label="施工状态">
          <el-select
            v-model="temp.Status"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in componentStatus"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
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
        <el-form-item label="父节点" prop="ParentId">
          <el-input v-model="temp.ParentId" />
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
  getModelComponents,
  getComponentTypes,
  addComponentInfo,
  updateComponentInfo,
  deleteComponentInfo,
} from "@/api/modelcomponent";
import waves from "@/directive/waves"; // waves directive

export default {
  name: "ComponentInfo",
  components: { Pagination },
  directives: { waves },
  filters: {
    componentStatusFilter(status) {
      const statusMap = {
        0: "施工进行中",
        1: "施工已完成",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      tableKey: 0,
      componentId: "", //构件编号
      componentName: "", //构件名称
      list: null, //展示列表
      componentTypeList: [], //构件类型列表
      componentStatus: [
        { code: 0, name: "施工进行中" },
        { code: 1, name: "施工已完成" },
      ],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      temp: {
        ComponentId: "",
        ComponentName: "",
        ModelId: undefined,
        Status: undefined,
        ParentId: "",
        ComponentTypeId: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        create: "创建构件信息",
        update: "修改构件信息",
      },
      rules: {
        ComponentId: [
          { required: true, message: "请输入构件编号", trigger: "blur" },
        ],
        ComponentName: [
          { required: true, message: "请输入构件名称", trigger: "blur" },
        ],
        ModelId: [
          { required: true, message: "请输入模型编号", trigger: "blur" },
        ],
        ParentId: [
          { required: true, message: "请输入父节点", trigger: "blur" },
        ],
        Status: [
          { required: true, message: "Status is required", trigger: "change" },
        ],
        ComponentTypeId: [
          {
            required: true,
            message: "ComponentTypeId is required",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getComponetList();
    this.getTypes();
  },
  methods: {
    getComponetList() {
      //查询构件list
      getModelComponents(
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
    getTypes() {
      //查询构件类型
      getComponentTypes(this.listQuery.page, 10000).then(
        (response) => {
          let data = JSON.parse(response.data);

          this.componentTypeList = data.items;
        }
      );
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getComponetList();
    },
    resetTemp() {
      this.temp = {
        ComponentId: "",
        ComponentName: "",
        ModelId: undefined,
        Status: 0,
        ParentId: "",
        ComponentTypeId: 1,
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
          addComponentInfo(this.temp).then((response) => {
            console.log(response);
            if (response.isSuccess) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000,
              });
              this.getComponetList();
            }
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
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
          updateComponentInfo(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
            this.getComponetList();
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("请确认是否确认删除？").then(() => {
        deleteComponentInfo(row.ComponentId).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getComponetList();
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
        return this.componentTypeList.find((f) => f.Id === typeId).TypeName;
      };
    },
  },
};
</script>
