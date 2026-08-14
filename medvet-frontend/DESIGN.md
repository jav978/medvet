# Sistema de Diseño MedVet: "Cyber Mint & Obsidian Glow"

Inspirado en la estética de vanguardia de **Vercel**, **Vue/Nuxt**, **Dark X** y **Lessa Dashboard**.

---

## 1. Filosofía y Pilares Visuales

1. **Cyber Mint Luminescence**:
   - Resplandores esmeralda/menta (`#00F59B` / `#00E688`) que guían la atención hacia acciones clave y elementos interactivos sin saturar la vista.
2. **Obsidian Carbon Depth (Dark Mode)**:
   - Fondo profundo `#040706` con domos de luz radiales superiores y tarjetas de cristal obsidian (`#0A110E`) con bordes de resplandor sutil (`rgba(0, 245, 155, 0.18)`).
3. **Lessa Crisp Clinic (Light Mode)**:
   - Fondo orgánico limpio `#F4F7F5`, tarjetas de blanco inmaculado `#FFFFFF` con radio generoso (`20px`), sombras difusas de alta gama y acentos Menta Clínico `#00A86B`.
4. **Joy & Urgency Accents**:
   - Toques cálidos de Mandarina / Ámbar (`#FF7A00` / `#F97316`) para reservas, promociones y guardias 24/7.
5. **Tipografía Moderna & Nítida**:
   - `Outfit` / `Plus Jakarta Sans` para titulares con degradados verticales (`linear-gradient(180deg, #FFFFFF 0%, #D0FFED 40%, #00F59B 100%)`).
   - `DM Sans` para lectura clínica confortable y `JetBrains Mono` para datos técnicos/códigos.

---

## 2. Paleta de Tokens Principales

### Modo Oscuro (Obsidian & Cyber Mint)
| Token | Valor | Uso |
|---|---|---|
| `--color-cream-100` | `#040706` | Lienzo / Canvas principal |
| `--color-cream-50` | `#0A110E` | Tarjetas Obsidian Glass |
| `--color-forest-500` | `#00F59B` | Acento Primario Cyber Mint Neón |
| `--color-forest-400` | `#00E688` | Resplandores y enlaces activos |
| `--color-electric-cyan` | `#38BDF8` | Gradientes secundarios y botones hover |
| `--color-ink-900` | `#F1FAF5` | Texto titular |
| `--color-ink-500` | `#8CA395` | Texto secundario y etiquetas |
| `--color-joy-amber` | `#FF7A00` | Botones de agendamiento y llamadas a urgencias |

### Modo Claro (Lessa Clean Clinic)
| Token | Valor | Uso |
|---|---|---|
| `--color-cream-100` | `#F4F7F5` | Fondo general |
| `--color-cream-50` | `#FFFFFF` | Tarjetas blancas elevadas |
| `--color-forest-700` | `#00A86B` | Verde Menta Clínico |
| `--color-forest-600` | `#007A4D` | Botones primarios y estados activos |
| `--color-ink-900` | `#0B130E` | Texto principal de alto contraste |
| `--color-joy-amber` | `#FF7A00` | Acentos cálidos |

---

## 3. Clases de Utilidad y Componentes

- `.btn-primary`: Botón de acción principal con Cyber Mint Neón (`#00F59B`) en Dark Mode y Menta Clínico (`#00A86B`) en Light Mode.
- `.btn-amber`: Botón de agendamiento con degradado de Mandarina Cálida (`#FF7A00` -> `#FF9433`).
- `.btn-ghost`: Botón con fondo translúcido y borde luminoso de resplandor.
- `.hero-glow-mesh`: Domo de luz radial elíptico superior (`radial-gradient(ellipse 950px 520px at 50% 0%, rgba(0, 245, 155, 0.3) 0%, ...)`).
- `.gradient-text-mint`: Titular con degradado vertical de blanco a menta neón.
