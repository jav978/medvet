/**
 * MedVet Clinical Systems - Export Utilities
 * Handles formatted CSV/Excel and print/PDF exports for medical records and billing.
 */

export interface ExportColumn {
  key: string
  label: string
  formatter?: (value: any, row: any) => string
}

/**
 * Exports data to a standard Excel-compatible CSV file with UTF-8 BOM.
 */
export function exportToExcel(
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename: string
) {
  if (!data || !data.length) return

  // Header row
  const headers = columns.map(c => `"${c.label.replace(/"/g, '""')}"`).join(';')

  // Data rows
  const rows = data.map(row => {
    return columns.map(col => {
      let val = row[col.key]
      if (col.formatter) {
        val = col.formatter(val, row)
      }
      if (val === null || val === undefined) {
        val = ''
      }
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(';')
  })

  // UTF-8 BOM for Microsoft Excel compatibility
  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Triggers standard browser printing for PDF saving or physical print.
 */
export function printDocument() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
