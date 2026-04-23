<template>
  <div class="product-container">
      <h2>商品管理</h2>

      <!-- 搜索 -->
      <div class="search-area">
          <el-row :gutter="8">
              <el-col :span="4">
                  <el-input v-model="serchForm.name" placeholder="商品名称" clearable />
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
              <el-col :span="2">
                  <el-input
                      v-model="serchForm.minPrice"
                      placeholder="最低价"
                      type="number"/>
              </el-col>
              <el-col :span="2">
                  <el-input
                      v-model="serchForm.maxPrice"
                      placeholder="最高价"
                      type="number"/>
              </el-col>
              <el-col :span="5">
                  <el-space style="display: unset;">
                      <el-date-picker
                          v-model="serchForm.dateRange"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          format="YYYY-MM-DD"
                          value-format="YYYY-MM-DD"></el-date-picker>
                  </el-space>
              </el-col>
          </el-row>
          <el-row :gutter="8" style="margin-top: 10px;">
                <el-col>
                  <el-space>
                      <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
                      <el-button type="warning" @click="handleReset"><el-icon><Refresh /></el-icon>重置</el-button>
                      <el-button type="success" @click="handleAdd"><el-icon><Plus /></el-icon>新增商品</el-button>
                      <el-button type="danger" @click="handleBatchDelete"><el-icon><Delete /></el-icon>批量删除</el-button>
                      <el-button type="success" @click="handleExportExcel"><el-icon><Download /></el-icon>导出Excel</el-button>
                      <!-- 导入EXcel -->
                      <el-upload 
                        action=""
                        :auto-upload="false"
                        :on-change="handleUploadExcel"
                        accept=".xlsx,.xls">
                        <el-button type="warning"><el-icon><Upload /></el-icon>导入Excel</el-button>
                    </el-upload>
                  </el-space>
              </el-col>
          </el-row>
      </div>
      <!-- 商品表格 -->
      <div class="product-table">
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
                    <el-table-column label="商品名称" prop="name" min-width="80">
                        <template #default="scope">
                            {{ scope.row.name }}
                        </template>
                    </el-table-column>
                    <el-table-column label="价格" prop="price">
                        <template #default="scope">
                            {{ scope.row.price }}
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time">
                        <template #default="scope">
                            {{ new Date(scope.row.create_time).toLocaleString()}}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status">
                        <template #default="scope">
                            <el-tag style="cursor: pointer;" :type="scope.row.status === 1?'success':'danger'" @click="handleChangeStatus(scope.row)">
                            {{ scope.row.status === 1 ?'启用':'禁用' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="operator" width="160">
                        <template #default="scope">
                            <el-button type="primary" size="small" @click="handelEdit(scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
            <el-dialog v-model="dialogVisible" :is-edit="isEdit" :title="isEdit ? '编辑商品' : '新增商品'" width="400">
                <el-form :model="form" :rules="rules" ref="ruleFormRef">
                    <el-form-item label="商品名 : " :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="价格 : " :label-width="formLabelWidth" prop="price">
                        <el-input v-model="form.price" type="number" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="状态 : " :label-width="formLabelWidth" prop="status">
                        <el-select v-model="form.status" placeholder="请选择商品状态">
                            <el-option label="启用" :value="1" />
                            <el-option label="禁用" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建日期 : " :label-width="formLabelWidth" prop="create_time">
                        <el-date-picker
                            v-model="form.create_time"
                            type="date"
                            placeholder="Pick a date"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD"
                        />
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
  import { ElMessage ,ElMessageBox} from "element-plus";
  import { Plus,Search,Refresh,Delete,Download,Upload } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useExportExcel } from "@/hooks/useExportExcel";
  import {useWriteLog} from '@/hooks/useWriteLog';
  import { useDebounce } from "@/hooks/useDebounce";
  const {exportExcel} = useExportExcel()
//   import { useVirtualList } from "@/hooks/useVirtualList";
 import {
      batchDeleteProductApi,
      createProductApi,
      deleteProductApi,
      getProductListApi,
      updateProductApi,
      importProductApi,
      type ProductItem
  } from "@/api/product";
// import {createLog} from '@/api/log'
// import { useUserStore } from "@/store/user";

 //搜索表单
const serchForm = ref({
    name: "",
    status: null as number | null,
    minPrice: null as number | null,
    maxPrice: null as number | null,
    dateRange: [] as string[],
    startDate: "",
    endDate: "",
})
//分页
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

//列表
const tableData = ref<ProductItem[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])
// const {
//   totalHeight,
//   offsetY,
//   virtualRows,
//   onScroll
// } = useVirtualList(tableData.value, {
//   rowHeight: 52, // 单行高度，和你css行高统一
//   viewportHeight: 416, // 容器可视高度
//   overscan: 4
// })
//虚拟列表
// const scrollTop = ref(0)
// const rowHeight = ref(0)
// const viewportHeight = ref(0)
// const overscan = ref(4)

//弹框
const dialogVisible = ref(false)
const formLabelWidth = '80px'
const isEdit = ref(false)
interface RuleForm {
  id: number
  name: string
  price: number
  status: 0 | 1
  create_time: string
}
const ruleFormRef = ref<FormInstance>()
const form = ref({
    id: 0,
    name: "",
    price: '' as unknown as number,
    status: 1 as 0 | 1,
    create_time: new Date().toISOString().slice(0, 10)
})
const rules = reactive<FormRules<RuleForm>>({
    name: [
        { required: true, message: '请输入商品名', trigger: 'blur' }
    ],
    price: [
        { required: true, message: '请输入价格', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ],
    create_time: [
        { required: true, message: '请选择创建时间', trigger: 'blur' }
    ],
})
//新增
const handleAdd = () => {
    isEdit.value = false
    form.value = {
        id: 0,
        name: "",
        price: '' as unknown as number,
        status: 1 as 0 | 1,
        create_time: new Date().toISOString().slice(0, 10)
    }
    dialogVisible.value = true
}

//编辑
const handelEdit = (row:ProductItem) => {
    isEdit.value = true
    form.value = { ...row }
    dialogVisible.value = true
}
const handleCreateOrUpdate = async(formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate()
    if (isEdit.value) {
        await updateProductApi(form.value)
        await useWriteLog(`修改商品:${form.value.name}`)
    }else{
        await createProductApi(form.value)
        await useWriteLog(`新增商品:${form.value.name}`)
    }
    getList()
    dialogVisible.value = false;
}


// const userStore = useUserStore()

//获取商品列表
const getList = async () => {
  try{
    loading.value = true
    const res = await getProductListApi({
        name: serchForm.value.name,
        status: serchForm.value.status,
        minPrice: serchForm.value.minPrice,
        maxPrice: serchForm.value.maxPrice,
        startDate: serchForm.value.startDate,
        endDate: serchForm.value.endDate,
        pageNum: pageNum.value,
        pageSize: pageSize.value
    })
    tableData.value = res.list
    total.value = res.total
    loading.value = false
  }catch(e){
    loading.value = false
    ElMessage.error(String(e))
  }
}

//搜索
const handleSearch = useDebounce(() => {
  pageNum.value = 1
  serchForm.value.startDate = serchForm.value.dateRange[0]
  serchForm.value.endDate = serchForm.value.dateRange[1]
  getList()
})

//重置
const handleReset = () => {
  serchForm.value = {
    name: "",
    status: null,
    minPrice: null,
    maxPrice: null,
    dateRange: [],
    startDate: "",
    endDate: "",
  }
  handleSearch()
}

const handleChangeStatus = useDebounce((row: ProductItem) => {
  changeStatus(row)
}, 300)
const changeStatus = async (row:ProductItem) =>{
    try{
        const nextStatus = (row.status === 1 ? 0:1)
        await updateProductApi({...row,status:nextStatus})
        ElMessage.success(nextStatus ? '已启用' : '已禁用')
        await useWriteLog(`${nextStatus ? '启用' : '禁用'}商品：${row.name}`)
        getList()
    }catch{
        ElMessage.error('状态更新失败')
    }
    
    
}


//删除
const handleDelete = (row:ProductItem) => {
    const target = tableData.value.find(item=>item.id==row.id)
    ElMessageBox.confirm(
        '确认删除该商品吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        await deleteProductApi(row.id)
        if(target) await useWriteLog(`删除商品:${row.name}`)
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        await getList()
})
}

//批量删除
const handleBatchDelete = () => {
    if (!selectedIds.value.length) return ElMessage.error('请先勾选商品')
    const selectedNames =  selectedIds.value.map(id=>tableData.value.find(item=>item.id===id)?.name).join(',')
    ElMessageBox.confirm(
        `确认删除 ${selectedIds.value.length} 个商品吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        await batchDeleteProductApi(selectedIds.value)
        await useWriteLog('批量删除商品'+selectedNames)
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        selectedIds.value = []
        await getList()
})
}



//导出Excel

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
         await exportExcel<ProductItem>(
            tableData.value,
            [
                { label: '商品ID', getValue: (item:ProductItem) => item.id },
                { label: '商品名称', getValue: (item:ProductItem) => item.name },
                { label: '价格', getValue: (item:ProductItem) => item.price },
                { label: '状态', getValue: (item:ProductItem) => item.status ? '启用' : '禁用' },
                { label: '创建时间', getValue: (item:ProductItem) => item.create_time?.toString().slice(0, 10) }
            ],
            
            '商品列表'
        )
        await useWriteLog(`导出商品数据：${tableData.value.length}条`)
        setTimeout(()=>{
            ElMessage({
                type: 'success',
                message: '导出成功!',
            })
        })
})
}

//导入Excel
import { type UploadFile } from "element-plus";
const handleUploadExcel = async (file:UploadFile) => {
    const rawFile = file.raw
    //构造formData 上传文件
    const formData = new FormData()
    formData.append('file',rawFile!)
    try{
        await importProductApi(formData)
        ElMessage.success('导入成功！')
        getList()
    }catch(err){
        ElMessage.error('导入失败,请检查Excel格式')
    }
}
//表格多选事件
const handleSelectionChange = (rows: ProductItem[]) => {
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
.product-container{
    .search-area{
        margin: 10px 0;
        :deep(.el-upload-list)
            {
                margin: 0;
            }
    }
    .product-table{
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