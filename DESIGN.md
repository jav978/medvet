# MedVet Design System — Google Stitch Inspired

## Design Philosophy

**"Simple, Clean, Intent-Driven"**

MedVet follows Google Stitch's design principles:
- **Clarity**: Every element has purpose
- **Whitespace**: Breathing room between elements
- **Consistency**: Predictable patterns across all pages
- **Accessibility**: WCAG 2.1 AA compliant

---

## Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#eff6ff` | Light backgrounds |
| `primary-100` | `#dbeafe` | Hover states |
| `primary-500` | `#3b82f6` | Buttons, links |
| `primary-600` | `#2563eb` | Active states |
| `primary-900` | `#1e3a5a` | Dark accents |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#22c55e` | Active, confirmed, available |
| `warning` | `#f59e0b` | Pending, attention needed |
| `error` | `#ef4444` | Cancelled, errors |
| `info` | `#3b82f6` | Information, completed |

### Neutrals
| Token | Hex | Usage |
|-------|-----|-------|
| `gray-50` | `#f9fafb` | Page background |
| `gray-100` | `#f3f4f6` | Card backgrounds |
| `gray-200` | `#e5e7eb` | Borders |
| `gray-500` | `#6b7280` | Secondary text |
| `gray-900` | `#111827` | Primary text |

---

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
| Active/Confirmed | Green | `green-100` |
| Pending | Yellow | `yellow-100` |
| Inactive/Cancelled | Red | `red-100` |
| Info/Completed | Blue | `blue-100` |

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

### Color Overrides
| Token | Light | Dark |
|-------|-------|------|
| Background | `gray-50` | `gray-900` |
| Surface | `white` | `gray-800` |
| Border | `gray-200` | `gray-700` |
| Text Primary | `gray-900` | `gray-50` |
| Text Secondary | `gray-500` | `gray-400` |

### Implementation
```nuxt
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    strategy: 'class' // Enables dark mode via class
  }
})
```

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
