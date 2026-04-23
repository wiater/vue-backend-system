<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const htmlContent = ref(`
<p>欢迎使用富文本编辑器</p>
<p>这是一个前端富文本演示区域</p>
<p>可用于公告、内容管理、商品详情编辑</p>
`)

function saveContent() {
  ElMessage.success('富文本内容保存成功')
}
</script>

<template>
  <div>
    <h2 style="margin-bottom: 20px;">内容编辑（富文本）</h2>

    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 8px;">编辑内容</label>
      <textarea
        v-model="htmlContent"
        style="
          width: 100%;
          height: 220px;
          padding: 12px;
          font-size: 14px;
        "
      ></textarea>
    </div>

    <div style="margin-top: 20px;">
      <label style="display: block; margin-bottom: 8px;">预览效果</label>
      <div
        style="
          padding: 16px;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          background: var(--bg-light);
          min-height: 120px;
        "
        v-html="htmlContent"
      ></div>
    </div>

    <el-button
      @click="saveContent"
      type="primary"
      style="margin-top: 20px;"
    >
      保存内容
    </el-button>
  </div>
</template>