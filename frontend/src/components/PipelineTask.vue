<template>
  <div class="pipeline-task-container">
    <el-card title="流水线任务管理" class="card-container">
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="已绑定" value="10"></el-option>
              <el-option label="开始卸车" value="20"></el-option>
              <el-option label="卸车完成" value="30"></el-option>
              <el-option label="已解绑" value="40"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构编号">
            <el-input v-model="searchForm.org_code" placeholder="请输入机构编号"></el-input>
          </el-form-item>
          <el-form-item label="流水线ID">
            <el-input v-model="searchForm.pipeline_id" type="number" placeholder="请输入流水线ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="action-bar">
        <el-button type="primary" @click="openAddModal">新增</el-button>
      </div>

      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="org_code" label="机构编号" width="120"></el-table-column>
        <el-table-column prop="pipeline_id" label="流水线ID" width="120"></el-table-column>
        <el-table-column prop="dispatch_no" label="调度单号" width="150"></el-table-column>
        <el-table-column prop="dispatch_task_no" label="调度任务号" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="line_name" label="班线名称" width="150"></el-table-column>
        <el-table-column prop="creator" label="创建人" width="100"></el-table-column>
        <el-table-column prop="gmt_create" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="openEditModal(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog :title="isEdit ? '编辑任务' : '新增任务'" :visible.sync="dialogVisible" width="600px">
      <el-form :model="formData" label-width="120px" class="dialog-form">
        <el-form-item label="机构编号" prop="org_code" required>
          <el-input v-model="formData.org_code" placeholder="请输入机构编号"></el-input>
        </el-form-item>
        <el-form-item label="流水线ID" prop="pipeline_id" required>
          <el-input v-model.number="formData.pipeline_id" type="number" placeholder="请输入流水线ID"></el-input>
        </el-form-item>
        <el-form-item label="调度单号" prop="dispatch_no" required>
          <el-input v-model="formData.dispatch_no" placeholder="请输入调度单号"></el-input>
        </el-form-item>
        <el-form-item label="调度任务号" prop="dispatch_task_no" required>
          <el-input v-model="formData.dispatch_task_no" placeholder="请输入调度任务号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="已绑定" value="10"></el-option>
            <el-option label="开始卸车" value="20"></el-option>
            <el-option label="卸车完成" value="30"></el-option>
            <el-option label="已解绑" value="40"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班线名称">
          <el-input v-model="formData.line_name" placeholder="请输入班线名称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item label="创建人" prop="creator" required>
          <el-input v-model="formData.creator" placeholder="请输入创建人姓名"></el-input>
        </el-form-item>
        <el-form-item label="创建人手机号" prop="creator_login_mobile" required>
          <el-input v-model="formData.creator_login_mobile" placeholder="请输入创建人手机号"></el-input>
        </el-form-item>
        <el-form-item label="租户ID" prop="tenant_id" required>
          <el-input v-model.number="formData.tenant_id" type="number" placeholder="请输入租户ID"></el-input>
        </el-form-item>
        <template v-if="isEdit">
          <el-form-item label="修改人">
            <el-input v-model="formData.modifier" placeholder="请输入修改人姓名"></el-input>
          </el-form-item>
          <el-form-item label="修改人手机号">
            <el-input v-model="formData.modifier_login_mobile" placeholder="请输入修改人手机号"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getPipelineTasks, createPipelineTask, updatePipelineTask, deletePipelineTask } from '../api/pipelineTask'

const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const searchForm = reactive({
  status: '',
  org_code: '',
  pipeline_id: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const formData = reactive({
  org_code: '',
  pipeline_id: '',
  dispatch_no: '',
  dispatch_task_no: '',
  status: '10',
  line_name: '',
  remark: '',
  creator: '',
  creator_login_mobile: '',
  tenant_id: '',
  modifier: '',
  modifier_login_mobile: ''
})

const statusMap = {
  '10': '已绑定',
  '20': '开始卸车',
  '30': '卸车完成',
  '40': '已解绑'
}

const statusTagType = {
  '10': 'success',
  '20': 'warning',
  '30': 'info',
  '40': 'danger'
}

const getStatusText = (status) => {
  return statusMap[status] || status
}

const getStatusTagType = (status) => {
  return statusTagType[status] || 'default'
}

const fetchData = async () => {
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      ...searchForm
    }
    const response = await getPipelineTasks(params)
    if (response.data.code === 200) {
      tableData.value = response.data.data.list
      pagination.total = response.data.data.total
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.status = ''
  searchForm.org_code = ''
  searchForm.pipeline_id = ''
  pagination.page = 1
  fetchData()
}

const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  fetchData()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchData()
}

const openAddModal = () => {
  isEdit.value = false
  dialogVisible.value = true
  resetFormData()
}

const openEditModal = (row) => {
  isEdit.value = true
  dialogVisible.value = true
  Object.assign(formData, row)
}

const resetFormData = () => {
  formData.org_code = ''
  formData.pipeline_id = ''
  formData.dispatch_no = ''
  formData.dispatch_task_no = ''
  formData.status = '10'
  formData.line_name = ''
  formData.remark = ''
  formData.creator = ''
  formData.creator_login_mobile = ''
  formData.tenant_id = ''
  formData.modifier = ''
  formData.modifier_login_mobile = ''
}

const handleSubmit = async () => {
  try {
    let response
    if (isEdit.value) {
      response = await updatePipelineTask(formData.id, formData)
    } else {
      response = await createPipelineTask(formData)
    }
    if (response.data.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '新增成功')
      dialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
  }
}

const handleDelete = async (id) => {
  try {
    const response = await deletePipelineTask(id)
    if (response.data.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    } else {
      ElMessage.error(response.data.message)
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

fetchData()
</script>

<style scoped>
.pipeline-task-container {
  max-width: 1400px;
  margin: 0 auto;
}

.card-container {
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-form {
  max-height: 500px;
  overflow-y: auto;
}

.dialog-footer {
  text-align: right;
}
</style>