<template>
  <div class="User-container">
      <h2>商品管理</h2>

      <!-- 搜索 -->
      <div class="search-area">
          <el-row :gutter="8">
              <el-col :span="4">
                  <el-input v-model="serchForm.username" placeholder="账号" clearable />
              </el-col>
              <el-col :span="2">
                  <el-select
                      v-model="serchForm.role"
                      placeholder="全部角色"
                      clearable>
                      <el-option label="管理员" value="admin"></el-option>
                      <el-option label="普通用户" value="user"></el-option>
                  </el-select>
              </el-col>
              <el-col :span="2">
                  <el-select
                      v-model="serchForm.status"
                      placeholder="全部状态"
                      clearable>
                      <el-option label="启用" value="1"></el-option>
                      <el-option label="禁用" value="0"></el-option>
                  </el-select>
              </el-col>
              <el-col :span="6">
                  <el-space>
                      <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                      <el-button type="warning" @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
                      <el-button type="success" @click="handleAdd" v-permission="['admin']"><el-icon><Plus /></el-icon>新增用户</el-button>
                      <el-button type="danger" @click="handleBatchDelete" v-permission="['admin']"><el-icon><Delete /></el-icon>批量删除</el-button>
                      <el-button type="info" @click="handleExportExcel"><el-icon><Download /></el-icon>导出Excel</el-button>
                  </el-space>
              </el-col>
          </el-row>
      </div>
      <!-- 商品表格 -->
      <div class="User-table">
            <el-card shadow="hover">
                <el-table
                    :data="tableData"
                    border
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="ID" prop="id" width="80">
                        <template #default="scope">
                            {{ scope.row.id }}
                        </template>
                    </el-table-column>
                    <el-table-column label="用户名称" prop="username" width="120">
                        <template #default="scope">
                            {{ scope.row.username }}
                        </template>
                    </el-table-column>
                    <el-table-column label="角色" prop="role" width="120">
                        <template #default="scope">
                            {{ scope.row.roles.includes('admin')?'管理员':'普通用户' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status" width="80">
                        <template #default="scope">
                            <el-tag :type="scope.row.status === 1?'success':'danger'">
                            {{ scope.row.status === 1 ?'启用':'禁用' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="operator" width="160">
                        <template #default="scope">
                            <el-button v-permission="['admin']" type="primary" size="small" @click="handelEdit(scope.row)">编辑</el-button>
                            <el-button v-permission="['admin']" type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
            </el-card>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :total="total"
            background
            layout="prev, pager, next, jumper, ->, total"
            prev-text="上一页"
            next-text="下一页"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
        </div>
        <!-- 新增编辑 -->
        <div class="dialog-container">
            <el-dialog v-model="dialogVisible" :is-edit="isEdit" :title="isEdit ? '编辑用户' : '新增用户'" width="400">
                <el-form :model="form" :rules="rules" ref="ruleFormRef">
                    <el-form-item label="账号 : " :label-width="formLabelWidth" prop="username">
                        <el-input v-model="form.username" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="密码: " :label-width="formLabelWidth" prop="password">
                        <el-input v-model="form.password" type="password" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label=":昵称 " :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name"  autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="角色 : " :label-width="formLabelWidth" prop="role">
                        <el-select v-model="form.role" placeholder="请选择用户角色">
                            <el-option label="管理员" value="admin" />
                            <el-option label="普通用户" value="user" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态 : " :label-width="formLabelWidth" prop="status">
                        <el-select v-model="form.status" placeholder="请选择用户状态">
                            <el-option label="启用" :value="1" />
                            <el-option label="禁用" :value="0" />
                        </el-select>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleCreateOrUpdate(ruleFormRef)">
                          确认
                        </el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
  </div>
</template>

<script setup lang="ts">
  import { ref,onMounted,reactive } from "vue";
  import * as XLSX from "xlsx";
  import { ElMessage ,ElMessageBox} from "element-plus";
  import { Plus,Search,Refresh,Delete,Download } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
//   import { useVirtualList } from "@/hooks/useVirtualList";
 import {
      batchDeleteUserApi,
      createUserApi,
      deleteUserApi,
      getUserListApi,
      updateUserApi,
      type UserItem
  } from "@/api/user"; 
// import {createLog} from '@/api/log'
// import { useUserStore } from "@/store/user";

 //搜索表单
const serchForm = ref({
    username: "",
    role: "" as '' | 'admin' | 'user',
    status: null as number | null,
})
//分页
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

//列表
const tableData = ref<UserItem[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

//弹框
const dialogVisible = ref(false)
const formLabelWidth = '80px'
const isEdit = ref(false)
const ruleFormRef = ref<FormInstance>()
const form = ref<UserItem>({
    id: 0,
    username: "",
    password: "",
    name:"",
    role:'user' as 'admin' | 'user',
    status: 1 as 0 | 1,
    create_time:new Date ().toISOString().slice(0, 10)
})
const rules = reactive<FormRules<UserItem>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
    ],
    role: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ],
})
//新增
const handleAdd = () => {
    isEdit.value = false
    form.value = {
        id: 0,
        username: "",
        name:"",
        role:'user' as 'admin' | 'user',
        password:"",
        status: 1 as 0 | 1,
        create_time: new Date().toISOString().slice(0, 10)
    }
    dialogVisible.value = true
}

//编辑
const handelEdit = (row:UserItem) => {
    isEdit.value = true
    form.value = { ...row }
    form.value.role = form.value.roles?.[0] as 'admin' | 'user'
    form.value.password = ''
    dialogVisible.value = true
}
const handleCreateOrUpdate = async(formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate()
    if (isEdit.value) {
        await updateUserApi(form.value)
    }else{
        await createUserApi(form.value)
    }
    getList()
    dialogVisible.value = false;
}


// const userStore = useUserStore()

//获取商品列表
const getList = async () => {
  try{
    loading.value = true
    const query = {
        username: serchForm.value.username,
        status: serchForm.value.status,
        role: serchForm.value.role as  'admin' | 'user',
        pageNum: pageNum.value,
        pageSize: pageSize.value
    }
    const res = await getUserListApi(query)
    tableData.value = res.list

    total.value = res.total
    loading.value = false
  }catch(e){
    loading.value = false
    ElMessage.error(String(e))
  }
}

//搜索
const handleSearch = () => {
  pageNum.value = 1
  getList()
}

//重置
const handleReset = () => {
  serchForm.value = {
    username: "",
    status: null,
    role: ''
  }
  handleSearch()
}



//删除
const handleDelete = (row:UserItem) => {
    ElMessageBox.confirm(
        '确认删除该用户吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        await deleteUserApi(row.id)
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        await getList()
})
}

//批量删除
const handleBatchDelete = () => {
    if (!selectedIds.value.length) return ElMessage.error('请先勾选用户')
    ElMessageBox.confirm(
        `确认删除 ${selectedIds.value.length} 个用户吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        await batchDeleteUserApi(selectedIds.value)
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        selectedIds.value = []
        await getList()
})
}



//导出Excel

const exportExcel = async () => {
    const data = [
        ['用户ID', '用户名', '角色', '状态', '创建时间'],
        ...tableData.value.map(item => [
            item.id,
            item.username,
            item.role,
            item.status ? '启用' : '禁用',
            item.create_time?.toString().slice(0, 10),
        ])
    ]
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '用户列表')
    XLSX.writeFile(wb, `用户列表-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
const handleExportExcel = () => {
    ElMessageBox.confirm(
        '确认导出Excel吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        await exportExcel()
        ElMessage({
          type: 'success',
          message: '导出成功!',
        })
})
}

//表格多选事件
const handleSelectionChange = (rows: UserItem[]) => {
    selectedIds.value = rows.map(item => item.id)
}

//分页页码改变
const handleCurrentChange = (page: number) => {
    pageNum.value = page
    getList()
}
//分页大小改变
const handleSizeChange = (size: number) => {
    pageSize.value = size
    getList()
}
onMounted(() => {
    getList()
})
</script>

<style scoped lang="scss">
.User-container{
    .search-area{
        margin: 10px 0;
    }
    .User-table{
        margin-bottom: 10px;
    }
    .pagination{
        display: flex;
        justify-content: start;
        padding: 16px 0;
        :deep(.el-pagination__rightwrapper){
            flex: none;
        }
    }
    .dialog-container{
        :deep(.el-dialog){
            padding: 0;
            .el-dialog__header{
                padding: var(--el-dialog-padding-primary);
            }
            .el-dialog__footer{
                padding: var(--el-dialog-padding-primary);
            }
            .el-dialog__body{
                padding:var(--el-dialog-padding-primary);
                border-top:1px solid var(--border-light);
                border-bottom:1px solid var(--border-light);
                .el-form-item__content{
                    flex: 0.8;
                    .el-date-editor.el-input, .el-date-editor.el-input__wrapper{
                        display: flex;
                        flex: 1;
                    }
                }
            }
        }
        
    }
}
</style>