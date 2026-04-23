<script setup lang="ts">
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
import { onMounted ,ref} from "vue";
import {getDashboardApi,type Overview} from '@/api/dashboard'
interface Stats {
  title:string,
  num:number
}
const stats = ref<Stats[]>([])
const exportExcel = () => {
    //1. 获取data
    const data = [
      ['条目','人数'],
      ...stats.value.map(item=>[
        item.title,
        item.num
      ])
    ]
    // 2. 创建一个工作簿
    const worksheet = XLSX.utils.aoa_to_sheet(data)

    // 3. 创建一个新的工作簿对象
    const workbook = XLSX.utils.book_new()

    // 4. 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook,worksheet,'商品数据')

    // 5. 写入文件并下载
    XLSX.writeFile(workbook,`商品报表_${new Date ().toLocaleString()}.xlsx`)
    ElMessage.success('Excel 导出成功')
}

const overview = ref<Overview>({
    totalUser:0,
    totalProduct:0,
    adminCount:0,
    normalProduct:0
})
onMounted(async () => {
  overview.value = await getDashboardApi() 
  for(let key in overview.value){
    stats.value.push({
      title:key,
      num:overview.value[key]
    })
  }
})
</script>

<style scoped lang="scss">
.data-view{
   h2{
     margin-bottom: 20px;
   }
   .data-view-content{
      display: grid;
      grid-template-columns: repeat(4,1fr);
      gap: 16px;
      .data-view-content-item{
          padding: 20px;
          border-radius: 8px;
          background: var(--bg-light);
          border: 1px solid var(--bg-light);
          div:fist-child{
              font-size: 14px;
              color: var(--text-regular);
          }
          div:last-child{
              font-size: 26px;
              font-weight: bold;
              margin-top: 8px;
              color: var(--text-primary);
          }
      }
   }
}
</style>

<template>
  <div class="data-view">
     <h2>数据概览</h2>
     <div class="data-view-content">
         <div class="data-view-content-item" v-for="(item,index) in stats" :key="index">
              <div v-if ="item.title ==='totalUser'">总用户</div>
              <div v-if ="item.title ==='totalProduct'">总商品</div>
              <div v-if ="item.title ==='adminCount'">管理员</div>
              <div v-if ="item.title ==='normalProduct'">正常状态</div>
              <div>{{ item.num }}</div>
         </div>
     </div>
     <el-button @click="exportExcel" type="success" style="margin-top: 20px;">导出数据 Excel</el-button>
  </div>
</template>