# 🩺 Módulo Clínico EHR, Visor de Placas RX, Carnet QR y Guardia 24/7

Este documento detalla la arquitectura, flujos de trabajo clínicos, seguridad y componentes implementados en el subsistema de **Gestión Clínica del Paciente (Electronic Health Records - EHR)** de MedVet.

---

## 1. 🏥 Flujo Clínico General

```
  [ Tutor / Mascota ]
          │
          ▼
  [ Recepción / Box / Guardia ] ───► [ Asignación de Turno / Ingreso de Guardia ]
          │
          ▼
  [ Consulta Médica EHR ] ───────► • Anamnesis y Síntomas
          │                         • Constantes Vitales (Peso, Temp, FC, FR, TLLC)
          │                         • Diagnóstico Presuntivo & Definitivo
          │                         • Plan Terapéutico y Receta Farmacológica
          ├───► [ Estudios Complementarios ] ───► • Placas RX / Rayos X
          │                                        • Ecografías
          │                                        • Hemogramas / Bioquímica
          │                                        • Visor con Inversión de Contraste & Zoom
          │
          ├───► [ Inmunización & Vacunas ] ─────► • Registro de Dosis y Lotes
          │                                        • Cálculo de Próximo Refuerzo
          │                                        • Emisión de Carnet Sanitario QR Dinámico
          │
          ├───► [ Quirófano & Cirugías ] ────────► • Evaluación ASA y Riesgo
          │                                        • Protocolo Anestésico
          │                                        • Técnica Quirúrgica y Postoperatorio
          │
          └───► [ Guardia 24/7 & Relevo ] ───────► • Control de Hospitalizados en Box/UCI
                                                   • Alertas de Pacientes Críticos
                                                   • Acta de Entrega de Turno (Shift Handover)
```

---

## 2. 🩻 Visor Médico de Placas RX (`ClinicalStudyViewer.vue`)

### Capacidades del Visor:
1. **Manipulación Óptica de Imágenes Radiográficas**:
   - **Zoom Infinito**: Escala de `50%` a `400%` con paso dinámico de `25%` y centrado en el viewport.
   - **Inversión de Contraste Negativo / Positivo (`filter: invert(100%)`)**: Permite a los médicos veterinarios conmutar a visualización de placa radiográfica convencional para identificar líneas de fractura, radiopacidades y densidades de tejidos blandos.
   - **Filtro Monocromo (`filter: grayscale(100%)`)**: Normaliza imágenes digitales a estándares radiológicos de escala de grises.
   - **Rotación Axial en 90° (`transform: rotate(Ndeg)`)**: Facilita la orientación de tomas ventrodorsales, laterales y craneocaudales sin alterar el archivo original.
2. **Galería y Tira de Miniaturas (Filmstrip)**:
   - Navegación fluida por teclado o clic entre series de radiografías o ecografías de un mismo estudio.
3. **Cargador Rápido de Estudios**:
   - Soporte para subida directa de archivos en formato de imagen (`JPEG`, `PNG`, `WEBP`) o documentos escaneados (`PDF`).
   - Generación de informe radiológico con hallazgos estructurados y fecha del estudio.

---

## 3. 🪪 Pasaporte Sanitario Digital & Validación QR (`/carnet/:id`)

### Arquitectura de Acceso Público Seguro:
- **Endpoint Backend**: `GET /public-carnet/:id`
  - Responde con la ficha médica certificada de la mascota (`pets`), datos de contacto de su tutor (`users`), historial oficial de vacunas aplicadas (`vaccinations`), últimas atenciones clínicas (`medical_records`) y cirugías (`surgeries`).
  - **No requiere JWT**: Permite la verificación instantánea por parte de autoridades, aerolíneas, guarderías caninas o médicos de emergencia sin fricción.
- **Generador de Código QR en Vivo**:
  - Utiliza la librería estándar `qrcode` para codificar la URL canónica del carnet digital:
    ```
    https://medvet.app/carnet/{pet_uuid}
    ```
- **Formato Imprimible de Alta Fidelidad**:
  - Diseñado para salida en papel A4 / Carta con plegado en 3 cuerpos (Pasaporte Sanitario Internacional), incluyendo marcas de corte, sellos veterinarios y número de microchip ISO 11784.

---

## 4. 🚨 Tablero de Guardia 24/7 & Entrega de Turno (`admin/guardia.vue`)

### Módulo de Relevo y Seguridad del Paciente Hospitalizado:
1. **Monitoreo en Tiempo Real**:
   - Tarjetas individuales por paciente hospitalizado con indicación de Box / UCI, diagnóstico de ingreso, plan de fluidoterapia y medicación programada.
2. **Emisión del Acta de Guardia (`shift_handovers`)**:
   - Tipos de turno: *Guardia 24 Horas*, *Turno Nocturno*, *Turno Mañana*, *Turno Tarde*.
   - Conteos estructurados de pacientes hospitalizados, cirugías realizadas, ingresos de urgencia y altas médicas.
   - **Alertas de Pacientes Críticos**: Bloque de texto de alta prioridad para pacientes en soporte vital o cuidados intensivos.
   - **Tareas Pendientes para el Relevo**: Checklist de dosis de antibióticos de horario estricto, tomas de muestras a primera hora y revisiones postquirúrgicas.
3. **Impresión del Parte de Guardia**:
   - Función `window.print()` optimizada mediante hojas de estilo para generar el acta física firmada por el veterinario saliente y el entrante.

---

## 5. 🔒 Seguridad y Permisos de Acceso

- **Tutor (Rol `client`)**:
  - Puede consultar sus mascotas, citas agendadas, recetas médicas y carnet de vacunas.
- **Veterinario (Rol `veterinarian`) & Administrador (Rol `admin`)**:
  - Acceso total de lectura/escritura a historias clínicas, carga de placas radiográficas, prescripción de fármacos, protocolos de cirugía y emisión de partes de guardia.
