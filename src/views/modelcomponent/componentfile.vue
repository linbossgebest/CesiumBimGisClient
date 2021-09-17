<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="modelId"
        placeholder="请输入模型编号"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
      />
      <el-input
        v-model="componentId"
        placeholder="请输入构件编号"
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

      <div>
        <el-upload
          class="filter-item"
          action="string"
          :file-list="fileList"
          :on-change="handleUploadChange"
          :on-success="handleUploadSuccess"
          :http-request="uploadFile"
        >
          <el-button type="primary" icon="el-icon-upload2">上传文件</el-button>
        </el-upload>
      </div>
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
      <el-table-column label="模型编号" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.ModelId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="构件编号" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.ComponentId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.MenuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名称" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.FileName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="文件资源" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.FileSrc }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="文件路径" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.FilePath }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="文件类型" align="center" width="auto">
        <template slot-scope="{ row }">
          <span>{{ row.FileType }}</span>
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
      @pagination="getComponentFileList"
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
        <el-form-item label="模型编号" prop="ModelId">
          <el-input v-model="temp.ModelId" />
        </el-form-item>
        <el-form-item label="构件编号" prop="ComponentId">
          <el-input v-model="temp.ComponentId" />
        </el-form-item>
        <el-form-item label="文件名称" prop="FileName">
          <el-input v-model="temp.FileName" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="MenuName">
          <el-input v-model="temp.MenuName" />
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
  getComponentFiles,
  deleteComponentFile,
  uploadComponentFile,
} from "@/api/modelcomponent";
import waves from "@/directive/waves"; // waves directive
// import fileUrl from "@/assets/template/component.xlsx"

export default {
  name: "ComponentFileInfo",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      fileList: [],
      tableKey: 0,
      componentId: "", //构件编号
      modelId: undefined,
      list: null, //展示列表
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      temp: {
        Id: undefined,
        ModelId: undefined,
        ComponentId: "",
        FileName: "",
        MenuName: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        create: "创建构件信息",
        update: "修改构件信息",
      },
      rules: {
        ModelId: [
          { required: true, message: "请输入模型编号", trigger: "blur" },
        ],
        ComponentId: [
          { required: true, message: "请输入构件编号", trigger: "blur" },
        ],
        FileName: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
        MenuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getComponentFileList();
  },
  methods: {
    getComponentFileList() {
      getComponentFiles(
        this.listQuery.page,
        this.listQuery.limit,
        this.componentId
      ).then((response) => {
        let data = JSON.parse(response.data);

        this.list = data.items;
        this.total = data.total;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getComponentFileList();
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
        deleteComponentFile(row.Id).then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getComponentFileList();
        });
      });
    },
    change() {
      this.$forceUpdate();
    },
    uploadFile(param) {
      if (this.componentId === "") {
        this.$confirm("上传文件，构件编号不能为空").then();
      } else {
        let formData = new FormData();

        formData.append("file", param.file);
        uploadComponentFile(formData, this.modelId, this.componentId).then(
          (response) => {
            this.$notify({
              title: "成功",
              message: "上传文件成功",
              type: "success",
              duration: 2000,
            });
            this.getComponentFileList();
          }
        );
      }
    },
    // 限制文件上传的个数只有一个，获取上传列表的最后一个
    handleUploadChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]; // 这一步，是 展示最后一次选择的文件
      }
    },
    handleUploadSuccess() {
      this.$notify({
        title: "成功",
        message: "上传文件成功",
        type: "success",
        duration: 2000,
      });
      this.getComponentFileList();
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
