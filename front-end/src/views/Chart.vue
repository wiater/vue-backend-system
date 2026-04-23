<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

// 1. 正确声明类型 + 初始值
const chartRef = ref<HTMLElement | null>(null)
let myChart: ECharts | null = null
const handleResize = () => {
  if (myChart) myChart.resize()
}

onMounted(() => {
  // 2. 加 {} 包裹，彻底解决语法报错
  if (!chartRef.value) return

  // 3. 防止重复创建实例
  if (!myChart) {
    myChart = echarts.init(chartRef.value)
  }

  // 4. 非空断言，TS 类型安全
  myChart!.setOption({
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 80, 200],
      type: 'bar',
      name: '销量'
    }],
    title: { text: '商品销量统计' }
  })

  // 5. 窗口 resize 重绘，加类型保护
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 6. 彻底销毁实例 + 移除监听，根治警告
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>