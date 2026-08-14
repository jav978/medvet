# 3. UI/UX Design Brief — MedVet Design System

**Document Version:** 1.0.0  
**Design Standard:** Nuxt Emerald & Deep Space (Widescreen 1440px)  
**Status:** Approved / Active  
**Author:** MedVet Design & Frontend Team  
**Last Updated:** Agosto 2026  

---

## 1. Filosofía de Diseño

**"Modern, Tech-Forward, Clean & Patient-Centered"**

El sistema de diseño de **MedVet** combina la elegancia estética de la web oficial de [Nuxt.com](https://nuxt.com/) con la calidez, confianza y empatía necesarias en la atención médica veterinaria:

* **Nuxt Emerald Neón**: Acentos vibrantes de salud y vanguardia tecnológica (`#00DC82` / `#00A86B`).
* **Deep Space Dark Mode**: Atmósfera nocturna de alto contraste con fondo `#020420`, tarjetas `#080C1E` y bordes glow sutiles.
* **Crisp Minimal Light Mode**: Fondo ultra pulcro `#F8FAFC`, tarjetas en blanco puro `#FFFFFF` y superficies suaves `#E6FBF2`.
* **Widescreen Canvas (1440px)**: Aprovechamiento panorámico del espacio sin márgenes laterales vacíos ni botones colisionados.
* **Joyful Warmth**: Toques cálidos ámbar y naranja (`#F59E0B` / `#F97316`) que celebran el bienestar y la alegría de las mascotas.

---

## 2. Paleta de Colores y Tokens CSS

La paleta se encuentra centralizada como variables CSS nativas en `medvet-frontend/app/assets/css/main.css`.

### Nuxt Emerald (Salud & Acciones Principales)
| Token | Hex | Uso en la Interfaz |
|---|---|---|
| `forest-50` | `#F0FDF7` | Fondos de alerta y áreas informativas suaves. |
| `forest-100` | `#E6FBF2` | Hover de navegación, pills y badges activos. |
| `forest-200` | `#8CF3C4` | Bordes activos y acentos en modo claro. |
| `forest-400` | `#00DC82` | **Nuxt Signature Green** — Botones CTA primarios y glowing. |
| `forest-600` | `#008244` | Enlaces principales y texto de salud en modo claro. |
| `forest-900` | `#013821` | Paneles y bordes oscuros en modo noche. |

### Joyful Warmth & Destacados (Calidez & Calificaciones)
| Token | Hex | Uso en la Interfaz |
|---|---|---|
| `joy-amber` | `#F59E0B` | Calificaciones (4.9 ★), avisos de vacunas por vencer. |
| `joy-orange` | `#F97316` | Botones de urgencias, alertas de pago y Cashea. |
| `joy-bg` | `#FFFBEB` | Fondo de tarjetas de beneficios y promociones. |

### Semánticos & Estados
| Token | Hex | Estado Asociado |
|---|---|---|
| `success` | `#00DC82` | Cita confirmada, turno disponible, vacuna al día. |
| `warning` | `#F59E0B` | Turno pendiente, dosis de vacuna próxima a vencer. |
| `error` | `#DC2626` | Cita cancelada, pago rechazado, error de validación. |
| `info` | `#36E4DA` | Cita completada, aviso informativo, carnet actualizado. |

---

## 3. Tipografía & Jerarquía Visual

### Pila Tipográfica
```css
font-family: 'DM Sans', 'Public Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Escala de Texto
* **H1 / Display**: `2.25rem - 2.75rem` (800 font-weight, `-0.025em` tracking) — Títulos de sección y héroe.
* **H2 / Subtítulos**: `1.5rem - 1.85rem` (700 font-weight, `-0.02em` tracking) — Encabezados de paneles.
* **H3 / Títulos de Tarjeta**: `1.15rem - 1.25rem` (600 font-weight).
* **Body**: `0.9375rem - 1rem` (400 font-weight, `1.5` line-height).
* **Small / Captions**: `0.75rem - 0.8125rem` (500 font-weight).
* **Monospace Numbers**: Para importes monetarios, relojes y códigos de referencia.

---

## 4. Distribución Espacial & Widescreen Layout (1440px)

Para garantizar que la aplicación aproveche monitores de alta resolución (1080p, 1440p, 4K) y laptops modernas sin dejar franjas vacías excesivas:

```css
/* Contenedor estándar para layouts y páginas */
.container-widescreen {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 2.5vw, 2.5rem);
}
```

### Barra de Navegación Anticolisión
1. **Píldora de Usuario (`.user-chip`)**:
   - Reemplaza el texto largo del correo con un chip ovalado (`border-radius: 999px`), avatar con huellita (`🐾`), truncado con elipsis (`text-overflow: ellipsis`) a un ancho máximo de `180px`.
2. **Enlaces sin Ruptura (`.nav-link`)**:
   - Atributo obligatorio `white-space: nowrap;` para evitar que textos como *"Reservar Cita"* se quiebren o colisionen.
3. **Punto de Quiebre Adaptativo (`1040px`)**:
   - En pantallas intermedias (menores a `1040px`), la barra conmuta limpiamente al menú drawer móvil para prevenir desbordes.

---

## 5. Primitivas de Componentes UI

### A. Tarjetas de Información & Métricas (`.dash-panel` / `.stat-card`)
- **Fondo**: `#FFFFFF` en modo claro / `#080C1E` en modo oscuro.
- **Bordes**: `1px solid #E2E8F0` / `1px solid rgba(0, 245, 155, 0.16)` con efecto glow en hover.
- **Borde Radius**: `20px` - `24px`.
- **Sombra**: `0 10px 30px -8px rgba(0, 80, 50, 0.06)` en claro / `0 16px 40px -12px rgba(0, 0, 0, 0.7)` en oscuro.

### B. Botones de Acción
- **Primary CTA (`.btn-primary`)**:
  - Gradiente esmeralda neón `#00DC82` a `#00A86B`, texto en contraste oscuro `#040706`, padding `0.75rem 1.5rem`, radio `14px`, transición suave de elevación en hover.
- **Secondary Ghost (`.btn-ghost`)**:
  - Fondo transparente, borde sutil, hover con tinte `#E6FBF2` (claro) o `rgba(0, 245, 155, 0.1)` (oscuro).

### C. Carnet de Vacunación & Badges QR
- Tarjeta de estilo credencial médica con encabezado diferenciado por especie (canino/felino), tabla de registros de biológicos con estado (Aplicada / Próxima) y botón flotante de exportación a PDF / impresión directa.

---

## 6. Accesibilidad (WCAG 2.1 AA) & Micro-animaciones

1. **Contraste de Color**: Ratio mínimo de `4.5:1` para texto estándar y `3.0:1` para texto en titulares grandes y componentes interactivos.
2. **Navegación por Teclado**: Estados `:focus-visible` explícitos con anillo esmeralda de `2px` y `outline-offset: 2px`.
3. **Micro-interacciones**:
   - Transiciones de hover a `150ms ease`.
   - Modales y drawers con apertura fluida en `200ms cubic-bezier(0.16, 1, 0.3, 1)`.
   - Indicador de latencia en vivo con animación de pulso sutil (`.pulse-dot`).
