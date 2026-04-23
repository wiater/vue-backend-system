<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
</script>

<template>
  <div style="max-width: 600px; margin: 0 auto;">
    <h2 style="margin-bottom: 20px;">个人中心</h2>

    <div
      style="
        padding: 24px;
        background: var(--bg-light);
        border-radius: 8px;
        border: 1px solid var(--border-light);
        line-height: 2.2;
        font-size: 15px;
      "
    >
      <p><strong>用户名：</strong>{{ userStore.userInfo?.username }}</p>
      <p><strong>角色：</strong>{{ userStore.userInfo?.roles?.includes('admin') ? '管理员' : '普通用户' }}</p>
      <p><strong>状态：</strong>正常使用中</p>
    </div>
  </div>
</template>