# MedVet Design System — "Nuxt Emerald & Deep Space"

## Design Philosophy

**"Modern, Tech-Forward, Clean & Patient-Centered"**

Inspirado en la estética visual de la web oficial de [Nuxt.com](https://nuxt.com/):
- **Clarity & Legibility**: Tipografía geométrica y nítida (**DM Sans** + **Public Sans**) para una experiencia de lectura ultra moderna.
- **Nuxt Signature Emerald**: Acentos en verde esmeralda neón (`#00DC82` / `#00C16A` / `#36E4DA`) que combinan salud, vanguardia tecnológica y bienestar veterinario.
- **Deep Space Dark Mode**: Fondo medianoche profundo `#020420` con tarjetas `#080C1E` y bordes glow sutiles en `rgba(0, 220, 130, 0.15)`.
- **Crisp Minimal Light Mode**: Fondo ultra limpio `#F8FAFC`, tarjetas en blanco puro `#FFFFFF` y píldoras `#E6FBF2`.
- **Accessibility**: Estricto cumplimiento WCAG 2.1 AA en ambos modos.

---

## Color Palette

The palette is defined as CSS variables in `medvet-frontend/app/assets/css/main.css` (single source of truth).

### Nuxt Emerald & Health (Salud / Vitalidad / Acciones)
| Token | Hex | Usage |
|-------|-----|-------|
| `forest-50` | `#f0fdf7` | Tint suave |
| `forest-100` | `#e6fbf2` | Ghost hover bg / badges Nuxt |
| `forest-200` | `#8cf3c4` | Light accents |
| `forest-300` | `#42e89f` | Dark panels text |
| `forest-400` | `#00dc82` | **NUXT SIGNATURE GREEN** |
| `forest-500` | `#00a155` | Nuxt Green 500 |
| `forest-600` | `#008244` | Acento de salud primario en Light |
| `forest-700` | `#00703c` | Botones secundarios de salud |
| `forest-800` | `#025734` | Hover secundario |
| `forest-900` | `#013821` | Panels oscuros |
| `forest-950` | `#012817` | Footer / deepest |

### Nuxt CTA & Accents (Reserva / Glow / Cyan)
| Token | Hex | Usage |
|-------|-----|-------|
| `amber-100` | `#e6fbf2` | Soft tint badges |
| `amber-400` | `#36e4da` | Nuxt Cyan |
| `amber-500` | `#00dc82` | **Signature Nuxt Green** |
| `amber-600` | `#008244` (Light) / `#00dc82` (Dark) | **Primary Action CTA** |
| `amber-700` | `#0284c7` | Hover / pressed |
| `amber-800` | `#0369a1` | Dark accents |

### Joyful Warmth — Warm Amber & Tangerine (Mascotas Felices / Destacados)
| Token | Hex | Usage |
|-------|-----|-------|
| `joy-amber` | `#f59e0b` | Calificaciones (4.9 ★), avisos amigables |
| `joy-orange` | `#f97316` | Acentos enérgicos y llamadas a la acción |
| `joy-bg` | `#fffbeb` | Fondos de avisos cálidos |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#00dc82` | Active, confirmed, available |
| `warning` | `#f59e0b` | Pending, attention needed |
| `error` | `#dc2626` | Cancelled, errors |
| `info` | `#36e4da` | Information, completed |
| `coral-glow` | `#f43f5e` | Alerts, live indicators, urgencias |

### Neutrals — Crisp Minimal
| Token | Hex | Usage |
|-------|-----|-------|
| `cream-50` | `#ffffff` | Card backgrounds |
| `cream-100` | `#f8fafc` | Page background ultra limpio |
| `cream-200` | `#e2e8f0` | Borders |
| `cream-300` | `#cbd5e1` | Stronger borders |
| `cream-400` | `#94a3b8` | Disabled |
| `ink-900` | `#020420` | Primary text (Nuxt Midnight) |
| `ink-700` | `#1e293b` | Secondary text |
| `ink-600` | `#334155` | Tertiary text |
| `ink-500` | `#64748b` | Muted text |
| `ink-400` | `#94a3b8` | Placeholders |
| `ink-300` | `#cbd5e1` | Faint text |

### Dark Mode — Nuxt Deep Space Midnight
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| Background | `cream-100` `#f8fafc` | `#020420` | Page bg (Nuxt Deep Space) |
| Surface | `cream-50` `#ffffff` | `#080c1e` | Cards (Nuxt Dark Card) |
| Border | `cream-200` `#e2e8f0` | `#111a36` | Dividers |
| CTA | `amber-600` `#008244` | `#00dc82` | Primary buttons (Nuxt Glow) |
| Accent | `forest-600` `#008244` | `#00dc82` | Health accents |
| Joy Accent | `joy-amber` `#f59e0b` | `#fbbf24` | Warm highlights |
| Text Primary | `ink-900` `#020420` | `#ffffff` | Headings |
| Text Secondary | `ink-500` `#64748b` | `#94a3b8` | Body muted |
| Alerts | `coral-glow` `#f43f5e` | `#fb7185` | Alerts |

---

## Typography

### Font Stack
```css
/* Títulos y Cuerpo: Moderna, geométrica y ultra legible */
font-family: 'DM Sans', 'Public Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 30px | 700 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 400 | 1.4 |

---

## Spacing Scale

Based on 4px grid:
| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Icon padding |
| `sm` | 8px | Compact gaps |
| `md` | 16px | Default gaps |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Page padding |
| `2xl` | 48px | Major sections |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 6px | Badges, small elements |
| `md` | 8px | Cards, inputs |
| `lg` | 12px | Modals, dropdowns |
| `full` | 9999px | Avatars, pills |

---

## Shadows

| Level | Value | Usage |
|-------|-------|-------|
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards |
| `lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |

---

## Component Patterns

### Cards
```vue
<UCard class="hover:border-blue-500 transition-colors">
  <!-- Content -->
</UCard>
```
- Background: `white`
- Border: `1px solid gray-200`
- Border radius: `8px`
- Padding: `24px`
- Hover: subtle border color change

### Buttons
```vue
<UButton variant="solid" color="primary">Primary Action</UButton>
<UButton variant="outline">Secondary</UButton>
<UButton variant="ghost" color="red">Danger</UButton>
```

### Badges (Status)
| Status | Color | Background |
|--------|-------|------------|
| Active/Confirmed | Green | `teal-100` / `#ccfbf1` |
| Pending | Yellow | `amber-100` / `#fef3c7` |
| Inactive/Cancelled | Red | `red-100` / `#fee2e2` |
| Info/Completed | Blue | `blue-100` / `#dbeafe` |

### Tables
- Header: `gray-50` background
- Rows: white with `gray-200` borders
- Hover: `gray-50` background
- Actions: icon buttons in ghost style

### Modals
- Overlay: `black/50` opacity
- Background: white
- Border radius: `12px`
- Padding: `24px`
- Max width: `480px` (default), `640px` (large)

---

## Layout Patterns

### Admin Dashboard
```
┌─────────────────────────────────────┐
│  Sidebar (240px)  │    Main Content │
│                   │                 │
│  - Logo           │  - Header       │
│  - Nav items      │  - Stats Grid   │
│  - User info      │  - Data Table   │
│                   │                 │
└─────────────────────────────────────┘
```

### Public Pages
```
┌─────────────────────────────────────┐
│           Header (64px)             │
├─────────────────────────────────────┤
│                                     │
│         Main Content                │
│         (max-width: 1200px)         │
│         centered                    │
│                                     │
├─────────────────────────────────────┤
│           Footer                    │
└─────────────────────────────────────┘
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |

### Mobile Adaptations
- Sidebar collapses to hamburger
- Cards stack vertically
- Tables become card lists
- Modals become full-screen

---

## Dark Mode

### Implementation
```nuxt
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    strategy: 'class' // Enables dark mode via class
  }
})
```

Dark mode toggles with the `.dark` class on `<html>` (see `main.css`): all `--color-*` tokens swap to the Marine Navy set. The palette is tokenized — never use raw hex values in components.

---

## Animation Guidelines

| Action | Duration | Easing |
|--------|----------|--------|
| Hover states | 150ms | ease-in-out |
| Modal open | 200ms | ease-out |
| Page transitions | 300ms | ease-in-out |
| Loading spinners | 1000ms | linear |

---

## Accessibility

- All interactive elements must have `focus-visible` states
- Color contrast ratio: minimum 4.5:1 for text
- All images require `alt` text
- Form inputs must have associated labels
- Keyboard navigation support required

---

## Icons

Using Heroicons (outlined style):
```vue
<UIcon name="i-heroicons-home" class="w-5 h-5" />
```

### Icon Sizes
| Size | Class | Usage |
|------|-------|-------|
| xs | `w-4 h-4` | Badges, tags |
| sm | `w-5 h-5` | Buttons, nav |
| md | `w-6 h-6` | Headers |
| lg | `w-8 h-8` | Feature icons |

---

## Implementation Notes

1. Use Nuxt UI components as base
2. Apply Tailwind CSS classes for customization
3. Follow consistent spacing with `gap-*` and `p-*` utilities
4. Use semantic color tokens, not raw hex values
5. Maintain dark mode compatibility with `dark:` prefix
