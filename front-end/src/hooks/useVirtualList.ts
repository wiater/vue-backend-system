import { ref, computed } from 'vue'

/**
 * 固定高度虚拟列表通用Hook
 * @param originData 原始全量数据
 * @param options 配置项（行高、窗口高度、缓冲区）
 */
export function useVirtualList<T>(
  originData: T[],
  options: {
    rowHeight?: number // 单行固定高度
    viewportHeight?: number // 可视容器高度
    overscan?: number // 上下缓冲区行数
  } = {}
) {
  // 默认配置
  const {
    rowHeight = 52,
    viewportHeight = 416,
    overscan = 4
  } = options

  // 滚动偏移量
  const scrollTop = ref(0)

  // ========== 连环计算属性 ==========
  // 可视区域需要渲染的总行数（含缓冲区）
  const visibleCount = computed(() => {
    // 纯可视行数 + 上下双倍缓冲区
    return Math.ceil(viewportHeight / rowHeight) + overscan * 2
  })

  // 数据起始索引
  const startIndex = computed(() => {
    const index = Math.floor(scrollTop.value / rowHeight) - overscan
    return Math.max(0, index) // 保底不小于0
  })

  // 数据结束索引
  const endIndex = computed(() => {
    const index = startIndex.value + visibleCount.value
    return Math.min(originData.length, index) // 保底不超过数据总长度
  })

  // 内容垂直偏移量（transform用）
  const offsetY = computed(() => startIndex.value * rowHeight)

  // 最终渲染的虚拟行数据（只截取可视区间）
  const virtualRows = computed(() => {
    return originData
      .slice(startIndex.value, endIndex.value)
      .map((item, index) => ({
        item,
        // 还原全局真实索引，不会因为截取导致序号错乱
        realIndex: startIndex.value + index
      }))
  })

  // 列表总占位高度（撑开滚动条）
  const totalHeight = computed(() => originData.length * rowHeight)

  // ========== 滚动监听事件 ==========
  const onScroll = (e: Event) => {
    const target = e.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  // 向外抛出所有需要用的变量&方法
  return {
    scrollTop,
    rowHeight,
    viewportHeight,
    totalHeight,
    offsetY,
    virtualRows,
    onScroll
  }
}