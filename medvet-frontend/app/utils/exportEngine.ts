import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  ShadingType
} from 'docx'
import { saveAs } from 'file-saver'

export interface InvoiceItem {
  code?: string
  description: string
  quantity: number
  unitPrice: number
  discount?: number
  subtotal: number
}

export interface InvoiceData {
  id?: string | number
  code: string
  date: string
  time?: string
  clientName: string
  clientDoc?: string
  clientPhone?: string
  clientEmail?: string
  clientAddress?: string
  petName: string
  petSpecies?: string
  petBreed?: string
  petChip?: string
  paymentMethod: string
  paymentStatus: 'paid' | 'pending' | 'cancelled'
  items: InvoiceItem[]
  subtotal: number
  taxPercent: number
  taxAmount: number
  exemptAmount?: number
  discountAmount?: number
  total: number
  currency?: string
  notes?: string
}

const CLINIC_INFO = {
  name: 'CENTRO VETERINARIO INTEGRAL MEDVET 24/7 C.A.',
  taxId: 'RIF: J-40892145-0 · CUIT: 30-71234567-9',
  address: 'Av. Las Delicias, Edificio MedVet, Piso 1, Maracay / Caracas',
  phone: 'Tel: +58 (243) 246-7890 · Emergencias 24h: +58 (412) 123-4567',
  email: 'facturacion@medvet.app · soporte@medvet.app',
  web: 'www.medvet.app',
  resolution: 'Providencia Administrativa SENIAT / AFIP Nº 2026-REG-004921'
}

/**
 * Generates and downloads an official Microsoft Word (.docx) Invoice
 */
export async function exportInvoiceToDocx(inv: InvoiceData) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: [
          // Header / Membrete
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: CLINIC_INFO.name,
                bold: true,
                size: 24,
                color: '059669' // Emerald
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: CLINIC_INFO.taxId + ' · ' + CLINIC_INFO.resolution, size: 16, color: '64748B' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: CLINIC_INFO.address, size: 16, color: '64748B' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: CLINIC_INFO.phone + ' · ' + CLINIC_INFO.email, size: 16, color: '64748B' })
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 200, after: 200 } }),

          // Title & Invoice Number Strip
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'FACTURA ELECTRÓNICA DE VENTA', bold: true, size: 20, color: '0F172A' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Fecha de Emisión: ', bold: true, size: 18 }),
                          new TextRun({ text: `${inv.date} ${inv.time || '10:00 hs'}`, size: 18 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'E6FCF5' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'COMPROBANTE Nº: ', bold: true, size: 18, color: '059669' }),
                          new TextRun({ text: inv.code, bold: true, size: 22, color: '059669' })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: inv.paymentStatus === 'paid' ? '✔ PAGADA / ABONADA' : '⏳ PENDIENTE DE PAGO',
                            bold: true,
                            size: 16,
                            color: inv.paymentStatus === 'paid' ? '059669' : 'D97706'
                          })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 150, after: 150 } }),

          // Customer & Patient Details Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'DATOS DEL TUTOR / CLIENTE', bold: true, size: 16, color: '059669' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Nombre / Razón Social: ', bold: true, size: 16 }),
                          new TextRun({ text: inv.clientName, size: 16 })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Doc / RIF / Cédula: ', bold: true, size: 16 }),
                          new TextRun({ text: inv.clientDoc || 'V-19.824.551', size: 16 })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Teléfono / Móvil: ', bold: true, size: 16 }),
                          new TextRun({ text: inv.clientPhone || '+58 (412) 345-6789', size: 16 })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Dirección: ', bold: true, size: 16 }),
                          new TextRun({ text: inv.clientAddress || 'Sede Local Maracay', size: 16 })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'DATOS DEL PACIENTE VETERINARIO', bold: true, size: 16, color: '059669' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Mascota: ', bold: true, size: 16 }),
                          new TextRun({ text: `🐾 ${inv.petName}`, bold: true, size: 16 })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Especie / Raza: ', bold: true, size: 16 }),
                          new TextRun({ text: `${inv.petSpecies || 'Canino'} · ${inv.petBreed || 'Mestizo'}`, size: 16 })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Microchip ISO: ', bold: true, size: 16 }),
                          new TextRun({ text: inv.petChip || 'ISO-11784-98214', size: 16 })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Método de Pago: ', bold: true, size: 16 }),
                          new TextRun({ text: inv.paymentMethod, size: 16 })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 200, after: 100 } }),

          // Items Table Header
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: '059669' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'CÓDIGO', bold: true, size: 16, color: 'FFFFFF' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: '059669' },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: 'DESCRIPCIÓN DEL SERVICIO / FÁRMACO', bold: true, size: 16, color: 'FFFFFF' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: '059669' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: 'CANT.', bold: true, size: 16, color: 'FFFFFF' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: '059669' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: 'P. UNIT.', bold: true, size: 16, color: 'FFFFFF' })]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: '059669' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun({ text: 'SUBTOTAL', bold: true, size: 16, color: 'FFFFFF' })]
                      })
                    ]
                  })
                ]
              }),

              // Items Rows
              ...inv.items.map(
                item =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: item.code || 'SRV-01', size: 16 })] })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: item.description, size: 16 })] })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.quantity), size: 16 })] })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `$${item.unitPrice.toLocaleString()}`, size: 16 })] })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `$${item.subtotal.toLocaleString()}`, bold: true, size: 16 })] })]
                      })
                    ]
                  })
              )
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 150, after: 150 } }),

          // Totals Section
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 55, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'NOTAS & POLÍTICAS:', bold: true, size: 16, color: '64748B' })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Comprobante emitido electrónicamente según normativa tributaria vigente. Documento con validez legal.',
                            size: 14,
                            color: '64748B'
                          })
                        ]
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Firma Digital y Sello Oficial MedVet 24/7 registrado.',
                            size: 14,
                            bold: true,
                            color: '059669'
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'Subtotal Gravado: ', size: 16 }),
                          new TextRun({ text: `$${inv.subtotal.toLocaleString()}`, bold: true, size: 16 })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: `IVA (${inv.taxPercent}%): `, size: 16 }),
                          new TextRun({ text: `$${inv.taxAmount.toLocaleString()}`, size: 16 })
                        ]
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: 'TOTAL A PAGAR: ', bold: true, size: 20, color: '059669' }),
                          new TextRun({ text: `$${inv.total.toLocaleString()} ${inv.currency || 'USD'}`, bold: true, size: 22, color: '059669' })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 200, after: 100 } }),

          // Footer
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Gracias por confiar la salud de su mascota a Centro Veterinario MedVet.',
                italic: true,
                size: 16,
                color: '64748B'
              })
            ]
          })
        ]
      }
    ]
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `Factura_${inv.code}.docx`)
}

/**
 * Generates and downloads an Excel XML / Spreadsheet (.xlsx / .xml) Invoice
 */
export function exportInvoiceToExcel(inv: InvoiceData) {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="HeaderStyle">
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Font ss:Bold="1" ss:Color="#059669" ss:Size="14"/>
  </Style>
  <Style ss:ID="Bold">
   <Font ss:Bold="1"/>
  </Style>
  <Style ss:ID="Currency">
   <NumberFormat ss:Format="$#,##0.00"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Factura">
  <Table>
   <Column ss:Width="100"/>
   <Column ss:Width="250"/>
   <Column ss:Width="60"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>

   <Row>
    <Cell ss:MergeAcross="4" ss:StyleID="TitleStyle"><Data ss:Type="String">${CLINIC_INFO.name}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">${CLINIC_INFO.taxId} - ${CLINIC_INFO.address}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="4"><Data ss:Type="String">FACTURA ELECTRÓNICA Nº ${inv.code} - Fecha: ${inv.date}</Data></Cell>
   </Row>
   <Row></Row>

   <Row>
    <Cell ss:StyleID="Bold"><Data ss:Type="String">Cliente / Tutor:</Data></Cell>
    <Cell><Data ss:Type="String">${inv.clientName}</Data></Cell>
    <Cell ss:StyleID="Bold"><Data ss:Type="String">Paciente:</Data></Cell>
    <Cell ss:MergeAcross="1"><Data ss:Type="String">${inv.petName} (${inv.petSpecies || 'Canino'} - ${inv.petBreed || 'Mestizo'})</Data></Cell>
   </Row>
   <Row>
    <Cell ss:StyleID="Bold"><Data ss:Type="String">Doc / RIF:</Data></Cell>
    <Cell><Data ss:Type="String">${inv.clientDoc || 'V-19824551'}</Data></Cell>
    <Cell ss:StyleID="Bold"><Data ss:Type="String">Método Pago:</Data></Cell>
    <Cell ss:MergeAcross="1"><Data ss:Type="String">${inv.paymentMethod}</Data></Cell>
   </Row>
   <Row></Row>

   <Row ss:StyleID="HeaderStyle">
    <Cell><Data ss:Type="String">Código</Data></Cell>
    <Cell><Data ss:Type="String">Descripción del Servicio / Fármaco</Data></Cell>
    <Cell><Data ss:Type="String">Cant.</Data></Cell>
    <Cell><Data ss:Type="String">P. Unitario</Data></Cell>
    <Cell><Data ss:Type="String">Subtotal</Data></Cell>
   </Row>

   ${inv.items
     .map(
       item => `
   <Row>
    <Cell><Data ss:Type="String">${item.code || 'SRV-01'}</Data></Cell>
    <Cell><Data ss:Type="String">${item.description}</Data></Cell>
    <Cell><Data ss:Type="Number">${item.quantity}</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${item.unitPrice}</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${item.subtotal}</Data></Cell>
   </Row>`
     )
     .join('')}

   <Row></Row>
   <Row>
    <Cell ss:Index="4" ss:StyleID="Bold"><Data ss:Type="String">Subtotal:</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${inv.subtotal}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="4" ss:StyleID="Bold"><Data ss:Type="String">IVA (${inv.taxPercent}%):</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${inv.taxAmount}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:Index="4" ss:StyleID="Bold"><Data ss:Type="String">TOTAL (${inv.currency || 'USD'}):</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${inv.total}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' })
  saveAs(blob, `Factura_${inv.code}.xls`)
}

/**
 * Generates and downloads a CSV of the Invoice
 */
export function exportInvoiceToCsv(inv: InvoiceData) {
  const headers = ['Nº Factura', 'Fecha', 'Cliente', 'Paciente', 'Código Ítem', 'Descripción', 'Cantidad', 'Precio Unitario', 'Subtotal', 'IVA', 'Total']
  const rows = inv.items.map(i => [
    inv.code,
    inv.date,
    `"${inv.clientName}"`,
    `"${inv.petName}"`,
    i.code || 'SRV-01',
    `"${i.description}"`,
    i.quantity,
    i.unitPrice,
    i.subtotal,
    inv.taxAmount,
    inv.total
  ])

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `Factura_${inv.code}.csv`)
}

/**
 * Exports any tabular administrative report to Word (.docx)
 */
export async function exportReportToDocx(title: string, subtitle: string, headers: string[], rows: any[][], summaryText?: string) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 }
          }
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: CLINIC_INFO.name, bold: true, size: 22, color: '059669' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: CLINIC_INFO.address + ' · ' + CLINIC_INFO.phone, size: 16, color: '64748B' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `REPORTE: ${title.toUpperCase()}`, bold: true, size: 20, color: '0F172A' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: subtitle, italic: true, size: 16, color: '64748B' })
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 200, after: 100 } }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: headers.map(
                  h =>
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: '059669' },
                      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 16, color: 'FFFFFF' })] })]
                    })
                )
              }),
              ...rows.map(
                r =>
                  new TableRow({
                    children: r.map(
                      cell =>
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: String(cell), size: 15 })] })]
                        })
                    )
                  })
              )
            ]
          }),

          new Paragraph({ text: '', spacing: { before: 150, after: 100 } }),

          ...(summaryText
            ? [
                new Paragraph({
                  children: [new TextRun({ text: `Resumen / Conclusiones: ${summaryText}`, bold: true, size: 16, color: '059669' })]
                })
              ]
            : []),

          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: `Generado el ${new Date().toLocaleString('es-ES')}`, size: 14, color: '94A3B8' })
            ]
          })
        ]
      }
    ]
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `Reporte_${title.replace(/\s+/g, '_')}.docx`)
}

/**
 * Exports any tabular report to Excel XML
 */
export function exportReportToExcel(title: string, headers: string[], rows: any[][]) {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="HeaderStyle">
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Font ss:Bold="1" ss:Color="#059669" ss:Size="14"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${title.slice(0, 30)}">
  <Table>
   <Row>
    <Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="TitleStyle"><Data ss:Type="String">${CLINIC_INFO.name} - ${title}</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="${headers.length - 1}"><Data ss:Type="String">Fecha de Emisión: ${new Date().toLocaleString('es-ES')}</Data></Cell>
   </Row>
   <Row></Row>
   <Row ss:StyleID="HeaderStyle">
    ${headers.map(h => `<Cell><Data ss:Type="String">${h}</Data></Cell>`).join('')}
   </Row>
   ${rows
     .map(
       r => `
   <Row>
    ${r.map(cell => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join('')}
   </Row>`
     )
     .join('')}
  </Table>
 </Worksheet>
</Workbook>`

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' })
  saveAs(blob, `Reporte_${title.replace(/\s+/g, '_')}.xls`)
}

/**
 * Exports any tabular report to CSV
 */
export function exportReportToCsv(title: string, headers: string[], rows: any[][]) {
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.map(c => `"${c}"`).join(';'))].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `Reporte_${title.replace(/\s+/g, '_')}.csv`)
}
