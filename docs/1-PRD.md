# 1. Product Requirements Document (PRD) — MedVet v1.0

**Document Version:** 1.0.0  
**Status:** Approved / Active  
**Author:** MedVet Engineering Team  
**Last Updated:** Agosto 2026  

---

## 1. Visión General del Producto

**MedVet** es una plataforma integral SaaS y Cloud-Native diseñada para modernizar y digitalizar al 100% la operación clínica, administrativa y financiera de centros veterinarios y hospitales de animales. El ecosistema conecta en tiempo real a los tutores de mascotas con el equipo médico veterinario, recepcionistas y administradores.

El sistema resuelve la fragmentación operativa tradicional (agendas en papel, historiales dispersos, falta de seguimiento en vacunas y cobros manuales) proporcionando un flujo unificado que abarca desde la reserva en línea y recordatorios automatizados hasta la Historia Clínica Electrónica, Carnet Digital de Vacunación con validación QR y una pasarela de facturación multimoneda (USD / Bs. VES) con opciones de financiamiento BNPL (Cashea).

---

## 2. Objetivos Principales del Sistema

1. **Optimización del Agendamiento & Cero Solapamientos**:
   - Algoritmo de cálculo de turnos libres (`available-slots`) basado en la duración de cada servicio y la disponibilidad semanal del profesional.
   - Sincronización en tiempo real vía WebSockets para evitar dobles reservas.

2. **Historia Clínica Digital Unificada & Carnet Portable**:
   - Registro cronológico de consultas, diagnósticos, constantes vitales (peso, temperatura, FC, FR), planes terapéuticos y recetas médicas.
   - Carnet de vacunación y desparasitación interactivo con exportación para impresión física y acceso móvil para el tutor.

3. **Flexibilidad Financiera & Gestión de Cobros**:
   - Soporte multimoneda con conversión automática a tasa oficial del día (BCV).
   - Métodos de pago adaptados al mercado: Efectivo (USD/Bs), Zelle, Transferencia Bancaria, Pago Móvil y cuotas fraccionadas Cashea (3 cuotas sin interés).

4. **Experiencia de Usuario Premium & Accesible**:
   - Diseño Widescreen (1440px) responsivo, accesible bajo estándares WCAG 2.1 AA, con soporte nativo de modo oscuro (*Nuxt Deep Space*) y modo claro (*Crisp Minimal*).

5. **Reportería Clínica y Control Gerencial**:
   - Panel de métricas e indicadores clave de rendimiento (KPIs), reportes de ocupación y exportación de datos en formatos universales (Excel `.xlsx` y PDF para impresión).

---

## 3. Perfiles de Usuario (User Personas)

### A. Tutor / Dueño de Mascota (`client`)
* **Objetivo**: Gestionar la salud preventiva y médica de sus mascotas con comodidad y transparencia.
* **Funciones Clave**:
  - Registro de múltiples mascotas con fotos, especie, raza, peso y edad.
  - Reserva de citas médicas según servicio, fecha y veterinario de preferencia.
  - Consulta del historial de consultas, diagnósticos y recetas previas.
  - Visualización del Carnet Digital de Vacunación con alertas de vencimiento.
  - Consulta de estados de cuenta, facturas y pagos realizados.

### B. Médico Veterinario (`veterinarian`)
* **Objetivo**: Atender a los pacientes con acceso instantáneo a antecedentes médicos y agilizar la redacción clínica.
* **Funciones Clave**:
  - Visualización de la agenda médica diaria y semanal.
  - Registro de evolución clínica, constantes vitales y tratamientos en cada consulta.
  - Emisión de recetas y prescripciones de medicamentos.
  - Actualización del esquema de vacunas y desparasitación con un solo clic.

### C. Recepcionista / Asistente de Caja (`receptionist`)
* **Objetivo**: Atender la recepción física y telefónica, confirmar citas y procesar cobros de manera eficiente.
* **Funciones Clave**:
  - Recepción de pacientes y confirmación de asistencia.
  - Creación de citas presenciales o telefónicas.
  - Registro de pagos en caja (Efectivo, Zelle, Pago Móvil) y validación de comprobantes.
  - Asignación rápida de pacientes a salas de atención.

### D. Administrador de la Clínica / Gerente (`admin`)
* **Objetivo**: Supervisar la rentabilidad del negocio, el desempeño del equipo médico y la configuración operativa.
* **Funciones Clave**:
  - Gestión del catálogo de servicios (precios, duraciones, categorías).
  - Configuración de horarios y turnos de los profesionales veterinarios.
  - Auditoría global de citas, ingresos monetarios y reportes de facturación.
  - Exportación de listados a hojas de cálculo y control de acceso de usuarios.

---

## 4. Requerimientos Funcionales (RF)

| ID | Módulo | Descripción del Requerimiento | Prioridad |
|---|---|---|---|
| **RF-01** | Auth | Registro e inicio de sesión seguro con JWT y persistencia de sesión. | Alta |
| **RF-02** | Auth | Control de Acceso Basado en Roles (RBAC: `admin`, `veterinarian`, `receptionist`, `client`). | Alta |
| **RF-03** | Mascotas | CRUD de mascotas vinculadas al tutor autenticado con cálculo automático de edad y peso. | Alta |
| **RF-04** | Catálogo | Visualización pública de servicios clasificados por categorías y cotizador dinámico de presupuestos. | Media |
| **RF-05** | Agendamiento | Motor de cálculo de turnos disponibles en memoria/Redis evitando solapamientos horarios. | Alta |
| **RF-06** | Agendamiento | Reserva de citas con selección de mascota, servicio, veterinario, fecha y hora. | Alta |
| **RF-07** | Agendamiento | Actualización en tiempo real de estados de cita (`pending`, `confirmed`, `completed`, `cancelled`) vía WebSockets. | Alta |
| **RF-08** | Historia Clínica | Registro cronológico de notas médicas, síntomas, diagnóstico y tratamiento por cita. | Alta |
| **RF-09** | Carnet Digital | Visualización estructurada de vacunas aplicadas, próximas dosis y desparasitaciones con vista imprimible. | Alta |
| **RF-10** | Pagos | Registro de transacciones multimoneda (USD / Bs. VES) y cálculo de financiamiento Cashea (inicial + 3 cuotas). | Alta |
| **RF-11** | Reportería | Generación y exportación de reportes de citas y pacientes en formato Excel e impresión de agenda física. | Media |
| **RF-12** | UI/UX | Soporte dual de temas (Dark/Light mode) con persistencia local y diseño widescreen 1440px. | Media |

---

## 5. Requerimientos No Funcionales (RNF)

1. **Rendimiento & Latencia**:
   - Tiempo de respuesta de endpoints de consulta de slots y servicios `< 150ms`.
   - Carga inicial del frontend (LCP) `< 1.8s` gracias al renderizado híbrido SSR/Nitro de Nuxt 3.
2. **Disponibilidad & Escalabilidad**:
   - Arquitectura stateless en backend facilitando el escalado horizontal tras balanceador de carga.
   - Contenerización con Docker y Docker Compose para despliegues reproducibles.
3. **Seguridad**:
   - Almacenamiento de contraseñas con algoritmo bcrypt (mínimo 10 rondas de salt).
   - Tokens JWT firmados con expiración configurable.
   - Protección contra inyecciones SQL mediante consultas parametrizadas con Knex.js.
   - Sanitización de entradas y validación de tipos con TypeScript en frontend y backend.
4. **Usabilidad y Accesibilidad**:
   - Cumplimiento de contraste y estándares de legibilidad WCAG 2.1 Nivel AA.
   - Interfaz totalmente adaptable a dispositivos móviles, tablets y escritorios hasta 4K.

---

## 6. Reglas de Negocio Clave

1. **Regla de Duración y Solapamiento**: Una cita reserva un bloque continuo equivalente a `duration` (minutos) del servicio seleccionado. Ningún veterinario puede tener dos citas superpuestas en el mismo intervalo.
2. **Regla de Cancelación**: Un tutor puede cancelar una cita hasta 2 horas antes de la hora programada; cancelaciones posteriores requieren validación de recepción.
3. **Regla de Vacunación**: La fecha de la próxima dosis de una vacuna se calcula automáticamente según el protocolo del biológico (ej. antirrábica anual, séxtuple canina 21 días para refuerzo).
4. **Regla de Facturación**: Todas las tarifas base están fijadas en USD y convertibles a Bs. según la tasa del día. Las transacciones vía Cashea aplican una cuota inicial del 40%-50% y 3 cuotas quincenales iguales del saldo restante.
