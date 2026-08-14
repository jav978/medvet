# 4. Application Flow & User Journeys — MedVet v1.0

**Document Version:** 1.0.0  
**Status:** Approved / Active  
**Author:** MedVet Architecture Team  
**Last Updated:** Agosto 2026  

---

## 1. Visión General de los Flujos de la Aplicación

MedVet organiza sus procesos en torno a cinco flujos de trabajo principales:
1. **Flujo 1: Registro, Autenticación y Alta de Mascotas**.
2. **Flujo 2: Agendamiento y Reserva de Citas en Tiempo Real**.
3. **Flujo 3: Atención Clínica, Historia Médica y Carnet de Vacunación**.
4. **Flujo 4: Facturación, Caja y Pasarela Multimoneda (Cashea / Divisas)**.
5. **Flujo 5: Gestión Administrativa y Reportería Gerencial**.

---

## 2. Diagramas de Flujo Detallados (Mermaid)

### Flujo 1: Registro de Tutor y Alta de Paciente
```mermaid
sequenceDiagram
    autonumber
    actor Tutor as Tutor de Mascota
    participant Front as Nuxt 3 Frontend
    participant API as FeathersJS API
    participant DB as PostgreSQL DB

    Tutor->>Front: Ingresa a /register (Email, Contraseña, Nombre, Teléfono)
    Front->>API: POST /users (role: 'client')
    API->>DB: INSERT INTO users (bcrypt hash)
    DB-->>API: User Record Created (id: UUID)
    API-->>Front: JWT Token + User Object
    Front->>Front: Guarda JWT en LocalStorage / Pinia Store
    Front-->>Tutor: Redirige a /dashboard
    
    Tutor->>Front: Clic en "Registrar Nueva Mascota"
    Tutor->>Front: Ingresa (Nombre, Especie, Raza, Edad, Peso, Foto)
    Front->>API: POST /pets (user_id del JWT)
    API->>DB: INSERT INTO pets (user_id, name, species, ...)
    DB-->>API: Pet Record Created
    API-->>Front: Objeto Mascota Creado
    Front-->>Tutor: Muestra tarjeta de paciente en "Mis Mascotas"
```

---

### Flujo 2: Agendamiento Inteligente y Reserva de Cita
```mermaid
sequenceDiagram
    autonumber
    actor Tutor as Tutor de Mascota
    participant Front as Nuxt 3 (Booking Wizard)
    participant Redis as Redis Cache
    participant API as FeathersJS Backend
    participant DB as PostgreSQL DB
    participant WS as Socket.io Channel

    Tutor->>Front: Selecciona Mascota y Servicio Médico
    Tutor->>Front: Elige Fecha deseada en el Calendario
    Front->>API: GET /available-slots?professionalId=...&serviceId=...&date=...
    
    API->>Redis: Consulta Caché de Slots
    alt Slot Cache Hit
        Redis-->>API: Retorna Slots Disponibles
    else Slot Cache Miss
        API->>DB: Consulta Schedules del Profesional y Appointments del día
        DB-->>API: Turnos Laborales y Citas Existentes
        API->>API: Calcula Bloques Libres (Filtrando Solapamientos)
        API->>Redis: Almacena en Caché (TTL: 60s)
    end
    API-->>Front: Array de Horas Libres ['09:00', '09:30', '11:00', ...]
    
    Tutor->>Front: Selecciona Hora ('09:30') y Confirma
    Front->>API: POST /appointments { pet_id, service_id, professional_id, date, start_time }
    API->>DB: INSERT INTO appointments (status: 'pending')
    DB-->>API: Appointment Creada (UUID)
    API->>Redis: Invalida Caché de Slots para esa fecha
    API->>WS: Emite 'appointments created' al canal 'admin-clinic'
    API-->>Front: Cita Registrada Exitosamente
    Front-->>Tutor: Muestra Pantalla de Éxito con Código de Cita
```

---

### Flujo 3: Atención Clínica y Carnet de Vacunación
```mermaid
flowchart TD
    A[Inicio: Mascota llega a la Clínica] --> B[Recepción marca cita como 'confirmed']
    B --> C[Veterinario abre Ficha de Paciente /pets/id]
    C --> D[Visualiza Historial Previo y Alergias]
    D --> E[Registra Constantes: Peso, Temp, FC, FR]
    E --> F[Ingresa Diagnóstico y Plan Terapéutico]
    
    F --> G{¿Aplica Vacuna o Desparasitación?}
    G -- Sí --> H[Registra Dosis de Biológico y Fecha de Próximo Refuerzo]
    H --> I[Actualiza Carnet Digital de Vacunación]
    G -- No --> J[Genera Receta Médica]
    
    I --> J
    J --> K[Veterinario marca Cita como 'completed']
    K --> L[Sistema emite Notificación en Vivo al Tutor]
    L --> M[Tutor puede descargar/imprimir Carnet Digital actualizado]
```

---

### Flujo 4: Facturación y Pasarela de Pagos Multimoneda
```mermaid
sequenceDiagram
    autonumber
    actor Cliente as Tutor / Paciente
    participant Front as Nuxt 3 (Caja / Checkout)
    participant API as FeathersJS API
    participant BCV as Tasa de Cambio Oficial
    participant DB as PostgreSQL DB

    Cliente->>Front: Visualiza Total del Servicio (Ej: $45.00 USD)
    Front->>API: GET /exchange-rate
    API-->>Front: Tasa Oficial (Ej: 36.50 Bs/USD)
    Front-->>Cliente: Muestra equivalente: $45.00 USD / 1,642.50 Bs.
    
    Cliente->>Front: Selecciona Método de Pago
    alt Pago Móvil / Transferencia
        Cliente->>Front: Ingresa Banco, Referencia y Monto en Bs.
    else Zelle / Efectivo USD
        Cliente->>Front: Registra Correo Zelle o Billete USD
    else Financiamiento Cashea
        Cliente->>Front: Selecciona 3 Cuotas Cashea
        Front->>Front: Calcula Inicial (40%: $18.00) + 3 Cuotas de $9.00 c/u
        Cliente->>Front: Ingresa Referencia de Cuota Inicial
    end
    
    Front->>API: POST /payments (monto, moneda, metodo, referencia)
    API->>DB: INSERT INTO payments (status: 'verified')
    DB-->>API: Payment Record Guardado
    API-->>Front: Factura / Recibo Generado
    Front-->>Cliente: Muestra Comprobante Digital con opción de Impresión
```

---

### Flujo 5: Reportería y Exportación Administrativa
```mermaid
flowchart LR
    A[Admin ingresa a /admin/reports] --> B[Aplica Filtros: Rango Fechas, Veterinario, Estado]
    B --> C[Visualiza Gráficos de Ocupación y Facturación]
    
    C --> D{Acción de Exportación}
    D -- Exportar Excel --> E[Ejecuta handleExportExcel]
    E --> F[Genera archivo .xlsx con datos estructurados]
    
    D -- Imprimir Agenda --> G[Ejecuta handlePrintAgenda]
    G --> H[Renderiza Plantilla Limpia y dispara window.print]
```
