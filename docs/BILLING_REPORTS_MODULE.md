# Sistema de Facturación Digital Profesional & Exportación Multiformato (MedVet 24/7)

## 1. Resumen Ejecutivo
El módulo de **Facturación Electrónica Oficial y Exportación Multiformato** de MedVet permite la emisión, visualización y descarga de comprobantes fiscales electrónicos y reportes administrativos y clínicos con membrete oficial institucional homologado.

A diferencia de capturas de pantalla de la interfaz, el sistema genera documentos electrónicos estructurados de alta fidelidad editorial listos para impresión y descarga en los 4 formatos estándar de la industria:
- 🖨️ **PDF / Impresión Vectorial A4**: Diseño editorial limpio optimizado con estilos `@media print`, eliminando elementos de navegación web y aplicando saltos de página precisos.
- 📝 **Microsoft Word (.docx)**: Archivo generado en formato OpenXML nativo con membrete institucional, tablas con bordes sombreados, encabezados coloreados y totales contables.
- 📊 **Microsoft Excel (.xlsx / XML Spreadsheet)**: Planilla estructurada de cálculo financiero con tipos de datos nativos, formato de moneda `$#,##0.00` y membrete.
- 📑 **CSV**: Archivo delimitado por comas con codificación UTF-8 BOM para conciliación contable y carga en sistemas ERP / AFIP / SENIAT.

---

## 2. Estructura Oficial del Membrete y Comprobante

### Membrete Institucional
- **Razón Social**: `CENTRO VETERINARIO INTEGRAL MEDVET 24/7 C.A.`
- **Identificación Fiscal**: RIF `J-40892145-0` · CUIT `30-71234567-9` · NIT `900.412.890-1`
- **Dirección Fiscal**: Av. Las Delicias, Edificio MedVet, Piso 1, Maracay / Caracas
- **Contacto y Urgencias 24h**: `+58 (243) 246-7890` · Emergencias: `+58 (412) 123-4567` · `facturacion@medvet.app`
- **Providencia Legal**: Providencia Administrativa SENIAT / AFIP Nº `2026-REG-004921`

### Bloques de Información de la Factura
1. **Identificador del Documento**:
   - Tipo de comprobante (`FACTURA ELECTRÓNICA DE VENTA TIPO B`).
   - Número correlativo fiscal (ej. `FAC-B-0001-0004821`).
   - Fecha y hora exacta de emisión.
   - Código de control y hash de validación tributaria (`0F8A-98C1-E24D`).
   - Estado del pago (`✔ ABONADA / PAGADA` o `⏳ PENDIENTE`).
2. **Receptor / Tutor del Paciente**:
   - Nombre / Razón Social.
   - Documento de identidad / RIF / C.I.
   - Teléfono / Móvil.
   - Correo electrónico.
   - Dirección física.
3. **Paciente Veterinario**:
   - Nombre de la mascota.
   - Especie y raza.
   - Código de Microchip ISO 11784.
   - Condición de pago (Contado, Tarjeta, Débito, Transferencia, Cashea 0% interés).
4. **Tabla de Consumo y Servicios**:
   - Código del servicio/fármaco.
   - Descripción detallada del procedimiento o medicamento.
   - Cantidad prestada.
   - Precio unitario.
   - Descuento aplicado.
   - Subtotal por ítem.
5. **Desglose Contable y Resumen Fiscal**:
   - Subtotal gravado.
   - Subtotal exento.
   - Base imponible.
   - IVA desglosado (alícuota del 16% o 21%).
   - Descuentos promocionales.
   - **TOTAL GENERAL** en USD y conversión oficial en moneda local.
6. **Validación Digital & QR**:
   - Código QR dinámico con URL y firma criptográfica de consulta pública.
   - Sello oficial de caja autorizada.
   - Leyendas legales de validez tributaria.

---

## 3. Arquitectura de Exportación Multiformato

El motor de exportación reside en `app/utils/exportEngine.ts` y expone las siguientes funciones universales:

| Función | Formato de Salida | Propósito |
| :--- | :--- | :--- |
| `exportInvoiceToDocx(inv)` | `.docx` (Microsoft Word) | Factura individual formal con membrete y tablas |
| `exportInvoiceToExcel(inv)` | `.xls / .xlsx` (Excel) | Factura individual estructurada con celdas de moneda |
| `exportInvoiceToCsv(inv)` | `.csv` (CSV Delimitado) | Factura individual en texto delimitado por punto y coma |
| `exportReportToDocx(title, sub, headers, rows, summary)` | `.docx` | Reportes administrativos, clínicos y actas de guardia |
| `exportReportToExcel(title, headers, rows)` | `.xls / .xlsx` | Reportes tabulares con encabezados institucionales |
| `exportReportToCsv(title, headers, rows)` | `.csv` | Reportes tabulares exportables a hojas de cálculo |

---

## 4. Componentes y Vistas Integradas

1. **`InvoiceViewerModal.vue` (`app/components/InvoiceViewerModal.vue`)**:
   - Componente modal interactivo para visualizar cualquier factura en formato A4.
   - Incluye barra de herramientas superior con botones de exportación directa a Word, Excel, CSV y PDF.
   - Renderiza código QR en vivo con la librería `qrcode`.
2. **`payments.vue` (`app/pages/dashboard/payments.vue`)**:
   - Portal del tutor con historial de comprobantes, botón "📄 Ver Factura" y exportación del historial completo a Word, Excel y CSV.
3. **`admin/payments/index.vue` (`app/pages/admin/payments/index.vue`)**:
   - Punto de venta y arqueo diario de caja con emisión de facturas y exportación multiformato del libro de ingresos.
4. **`admin/reports/index.vue` (`app/pages/admin/reports/index.vue`)**:
   - Centro de auditoría con reportes de Facturación, Pacientes Atendidos y Financiamiento Cashea exportables a Word, Excel, CSV y PDF.
5. **`admin/guardia.vue` (`app/pages/admin/guardia.vue`)**:
   - Tablero de guardia 24/7 con exportación de actas de relevo médico a Word, Excel, CSV y PDF.
