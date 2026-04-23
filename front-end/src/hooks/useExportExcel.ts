import * as XLSX from 'xlsx'

/**
 * 通用表格导出Excel Hook
 * @returns 导出方法 exportExcel
 */
export function useExportExcel() {
  /**
   * 通用导出函数
   * @param tableData 原始表格数组数据
   * @param schema 表头映射配置：[{ 表头名, 字段取值/格式化函数 }]
   * @param fileNamePrefix 导出文件前缀名
   */
  const exportExcel = async <T>(
    tableData: T[],
    // 表头配置数组：每一项对应一列，label是表头文字，getValue自定义取值&格式化
    schema: Array<{
      label: string
      getValue: (item: T) => string | number | null | undefined
    }>,
    fileNamePrefix: string
  ) => {
    // 1. 自动拼接Excel二维数组：第一行表头 + 后续数据行
    const excelData = [
      // 表头行：提取所有label
      schema.map(col => col.label),
      // 数据行：遍历表格数据，按schema配置依次取值格式化
      ...tableData.map(item => schema.map(col => col.getValue(item)))
    ]

    // 2. 创建工作簿、工作表
    const worksheet = XLSX.utils.aoa_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '数据列表')

    // 3. 生成带当日日期的文件名
    const dateStr = new Date().toLocaleString().slice(0, 10)
    const fileName = `${fileNamePrefix}-${dateStr}.xlsx`

    // 4. 触发浏览器下载
    XLSX.writeFile(workbook, fileName)
  }

  return { exportExcel }
}