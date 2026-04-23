<template>
  <div class="logs">
      <h2>操作日志</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="!logList.length"  class="null-data">暂无操作日志</div>
      <div v-else class="list">
          <div class="list-item" v-for="item in logList" :key="item.id">
              <span class="user">{{ item.user }}</span>
              <span class="content">{{ item.content }}</span>
              <span class="time">{{ item.time }}</span>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import {getLogs, type ActionLog } from '@/api/log';
import {ElMessage} from 'element-plus'
const loading = ref(false)
const logList = ref<ActionLog[]>([])

async function fetchLogs(){
    loading.value = true
    try{
      logList.value = await getLogs()
    }catch{
      ElMessage('获取日志失败，请检查后端接口')
    }finally{
      loading.value = false
    }
}
onMounted(fetchLogs)
</script>

<style scoped lang="scss">
.logs{
   h2{
     margin-bottom: 20px;
   }
   .loading{
      padding: 24px;
      color: var(--text-regular);
   }
   .null-data{
      padding: 24px;
      color: var(--text-regular);
      border: 1px dashed var(--border-light);
      border-radius: 8px;
   }
   .list{
      border: 1px solid var(--border-light);
      border-radius: 8px;
      overflow: hidden;
      .list-item{
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-light);
          background: var(--bg-light);
          display: flex;
          align-items: center;
          .user{
              width: 80px;
              font-weight: 500;
          }
          .content{
              flex: 1;
          }
          .time{
              color: var(--text-regular);
              font-size: 13px;
          }
      } 
   }
}
</style>