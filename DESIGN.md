# Unified Enterprise UI/UX Design System Specification (`DESIGN.md`)

> **Master Blueprint**: A standardized, accessibility-first design system architecture for **Invoicely** and cross-project SaaS applications, web dashboards, and professional web platforms.

---

## 1. Design Vision & Core Principles

- **Accessibility-First (WCAG 2.1 AA)**: Ensured color contrast ratios (≥ 4.5:1 for normal text, ≥ 3:1 for large headers), standard touch targets (min `44x44px`), explicit visible focus rings (`focus:ring-2 focus:ring-blue-500/30`), and semantic HTML layout tree with ARIA annotations.
- **Utility & Scanner-Friendly Visuals**: High-contrast financial metrics, clean layout density, clear typography hierarchy, and immediate interactive feedback.
- **Modern Elevation & Glassmorphism**: Multi-layered card interfaces (`--surface` canvas with elevated floating cards) enhanced with subtle `backdrop-filter: blur(12px)` glass rules, crisp borders (`border-slate-200/80`), and smooth hover elevation lifts.
- **Unified Visual Language**: Standardized iconography ([Material Symbols](https://fonts.google.com/icons) / [Lucide React](https://lucide.dev)), distinct semantic color-coding, and cohesive geometry (`rounded-xl` for cards, `rounded-lg` for controls).
- **Cross-Project Scalability**: Modular token architecture adaptable across SaaS platforms, enterprise dashboards, marketing landing pages, and personal portfolios.

---

## 2. Design Tokens & Theme Configuration

### 2.1 CSS Theme Variables (`src/resources/css/app.css` & `src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap');
@import "tailwindcss";

@theme {
  /* Brand & Primary Palette */
  --color-primary: #004bca;
  --color-primary-strong: #0061ff;
  --color-primary-container: #eff4ff;
  --color-on-primary-container: #001d4f;

  /* Secondary & Tertiary Accents */
  --color-secondary: #712ae2;
  --color-secondary-container: #f3e8ff;
  --color-tertiary: #007f57;
  --color-tertiary-container: #e6f7f2;

  /* Surface System */
  --color-surface: #f8f9ff;
  --color-surface-low: #eff4ff;
  --color-surface-high: #ffffff;
  --color-surface-tint: #e5eeff;
  --color-sidebar: #213145;

  /* Semantic Feedback Palette */
  --color-success: #007f57;
  --color-warning: #d97706;
  --color-danger: #ba1a1a;
  --color-info: #0284c7;

  /* Typography & Outlines */
  --color-text: #0b1c30;
  --color-text-muted: #5a6072;
  --color-outline: #c2c6d9;
  --color-outline-variant: #e2e8f0;

  /* Font Families */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: "Manrope", "Inter", sans-serif;
}
```

### 2.2 Light vs. Dark Mode Token Matrix

| Semantic Token | Light Mode Hex | Dark Mode Hex | Tailwind Utility Class | Usage / Target Component |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | `#004bca` | `#4d8dff` | `bg-blue-600` / `text-blue-600` | Active buttons, branding badges, focused tabs |
| **Primary Active** | `#0061ff` | `#60a5fa` | `bg-blue-500` / `text-blue-500` | Hover & active states, primary CTAs |
| **Success / Paid** | `#007f57` | `#34d399` | `bg-emerald-600` / `text-emerald-600` | Positive revenue, paid badges, success alerts |
| **Warning / Review**| `#d97706` | `#fbbf24` | `bg-amber-600` / `text-amber-500` | Pending payments, warnings, review states |
| **Danger / Overdue**| `#ba1a1a` | `#f87171` | `bg-red-600` / `text-red-500` | Overdue invoices, deletion actions, errors |
| **Canvas Background**| `#f8f9ff` | `#0b131e` | `bg-slate-50` / `dark:bg-slate-950` | Main application viewport canvas |
| **Card Surface** | `#ffffff` | `#152232` | `bg-white` / `dark:bg-slate-900` | Floating UI cards, data tables, modals |
| **Sidebar Surface** | `#213145` | `#121b27` | `bg-slate-800` / `dark:bg-slate-900` | Executive side menu, dark app navigation |
| **Primary Text** | `#0b1c30` | `#f1f5f9` | `text-slate-900` / `dark:text-slate-100` | Page titles, table headers, high-emphasis text |
| **Secondary Text** | `#5a6072` | `#94a3b8` | `text-slate-500` / `dark:text-slate-400` | Helper descriptions, metadata, form labels |
| **Border / Divider**| `#c2c6d9` | `#28384d` | `border-slate-200` / `dark:border-slate-800` | Card borders, data table row dividers |

---

## 3. Typography & Scale Hierarchy

### Font Families
- **Display Headings (`h1`, `h2`, `h3`, `h4`)**: `Manrope` (Weights: `600` Semi-Bold, `700` Bold, `800` Extra-Bold).
- **Body & Controls (`p`, `span`, `input`, `button`)**: `Inter` (Weights: `400` Regular, `500` Medium, `600` Semi-Bold, `700` Bold).

### Scale & Tailwind Code Standards

```html
<!-- Main Page Hero Header (H1) -->
<h1 class="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
  Executive Dashboard — <span class="text-blue-600 dark:text-blue-400">Overview</span>
</h1>

<!-- Section Heading (H2) -->
<h2 class="font-display text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
  Invoice Lifecycle
</h2>

<!-- Card Title (H3 / H4) -->
<h3 class="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
  Revenue Trends
</h3>

<!-- Hero KPI / Metric Digit -->
<div class="font-display text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
  $452,000.00
</div>

<!-- Standard Body Paragraph -->
<p class="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
  Financial health overview and collection metrics for the active fiscal quarter.
</p>

<!-- Form Label / Uppercase Metadata -->
<label class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
  Issue Date
</label>
```

---

## 4. Elevational & Glassmorphic Utilities

### 4.1 Utility Classes (`app.css`)

```css
/* Modern Glassmorphic Container */
.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(194, 198, 217, 0.4);
}

.dark .glass-panel {
  background: rgba(21, 34, 50, 0.75);
  border: 1px solid rgba(40, 56, 77, 0.5);
}

/* Subtle Base Card Shadow */
.card-shadow {
  box-shadow: 0 4px 12px -2px rgba(11, 28, 48, 0.05), 0 2px 6px -1px rgba(11, 28, 48, 0.03);
}

/* Elevational Lift on Hover */
.card-hover {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-hover:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 30px -8px rgba(11, 28, 48, 0.1), 0 8px 12px -4px rgba(11, 28, 48, 0.06);
}

/* Multi-Tone Brand Gradients */
.gradient-brand {
  background: linear-gradient(135deg, #004bca 0%, #0061ff 100%);
}

.gradient-accent {
  background: linear-gradient(135deg, #4f46e5 0%, #712ae2 100%);
}
```

---

## 5. Unified Component System Architecture

### 5.1 App Shell Header & Navigation
- **Height**: `h-16` (64px)
- **Background**: `bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800`
- **Positioning**: `sticky top-0 z-40`

```tsx
export function AppHeader({ user, onSearch }: { user: any; onSearch?: (q: string) => void }) {
  return (
    <header className="h-16 sticky top-0 z-40 px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
      {/* Global Search Bar */}
      <div className="relative flex-1 max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
          search
        </span>
        <input
          type="text"
          placeholder="Search invoices, clients, reports..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all"
          aria-label="Global search"
        />
      </div>

      {/* User Quick Actions & Profile */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          className="p-2 min-h-[44px] min-w-[44px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center space-x-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
          </div>
          <img
            src={user.avatar || 'https://via.placeholder.com/40'}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
    </header>
  );
}
```

### 5.2 KPI & Result Metric Cards
Provides high scannability for statistical, financial, or numeric outputs.

```tsx
export function MetricCard({
  title,
  value,
  change,
  status = 'success',
  icon
}: {
  title: string;
  value: string;
  change?: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  icon?: string;
}) {
  const badgeColors = {
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/60',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200/60',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 card-shadow card-hover flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        {change && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeColors[status]}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
```

### 5.3 Accessible Form Controls
Enforces min height `44px` for touch accuracy and high-contrast visible focus rings (`focus:ring-2 focus:ring-blue-500/30`).

```tsx
export function InputField({
  label,
  id,
  type = 'text',
  placeholder,
  error,
  ...props
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  [key: string]: any;
}) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 border ${
          error ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-500/30'
        } rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 transition-all`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
```

### 5.4 Data Table Component with Status Badges

```tsx
export function StatusBadge({ status }: { status: 'Paid' | 'Pending' | 'Overdue' | 'Draft' }) {
  const styles = {
    Paid: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    Pending: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    Overdue: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900',
    Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
}
```

### 5.5 Action Button Taxonomy

```html
<!-- Primary Action Button (Gradient Lift) -->
<button type="button" class="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
  <span class="material-symbols-outlined text-lg">add</span>
  <span>Create Invoice</span>
</button>

<!-- Secondary / Ghost Button -->
<button type="button" class="min-h-[44px] px-4 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
  <span>Export CSV</span>
</button>

<!-- Danger Action Button -->
<button type="button" class="min-h-[44px] px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
  <span class="material-symbols-outlined text-lg">delete</span>
  <span>Delete</span>
</button>
```

---

## 6. Layout Grid & Structure Architecture

```
+-------------------------------------------------------------------------------+
|                       Sticky Application Shell Header (h-16)                  |
+-------------------------------------------------------------------------------+
|  Sidebar (260px)  |  Main Content Container (max-w-7xl mx-auto px-6 py-8)    |
|  - Brand Logo     |                                                           |
|  - Navigation     |  +-----------------------------------------------------+  |
|  - Primary Action |  | Section Header (Title, Subtitle & Action Toolbar)    |  |
|                   |  +-----------------------------------------------------+  |
|                   |                                                           |
|                   |  +-----------------------------------------------------+  |
|                   |  | KPI Grid: 1 col (sm) -> 2 col (md) -> 4 col (xl)    |  |
|                   |  | [ Revenue ]  [ Pending ]  [ Overdue ]  [ Rate ]    |  |
|                   |  +-----------------------------------------------------+  |
|                   |                                                           |
|                   |  +---------------------------------+ +-----------------+  |
|                   |  | Main Content Panel (2/3 width)  | | Side Card (1/3) |  |
|                   |  | - Data Table / Chart Visuals    | | - Quick stats   |  |
|                   |  | - Filterable Lists              | | - Actions       |  |
|                   |  +---------------------------------+ +-----------------+  |
+-------------------------------------------------------------------------------+
```

---

## 7. Responsive Breakpoints & Container Capacities

- **Mobile (`< 640px`)**: Single-column layout (`grid-cols-1`), touch targets enforce min `44px`, collapsible mobile menu drawer.
- **Tablet (`640px - 1024px`)**: 2-column KPI cards (`grid-cols-2`), padding `px-6`.
- **Desktop (`≥ 1024px`)**: Fixed 260px left sidebar + fluid main content area capped at `max-w-7xl` centered (`mx-auto`). 4-column metric grid (`xl:grid-cols-4`).

---

## 8. Accessibility (a11y) & UX Guidelines

1. **Focus Ring Standard**: All interactive inputs, buttons, and links MUST feature visible focus rings (`focus:outline-none focus:ring-2 focus:ring-blue-500/40`).
2. **Touch Targets**: Minimum hit area of `44x44px` on mobile/tablet viewports for touch accessibility.
3. **Contrast Ratios**: Contrast minimum of **4.5:1** for normal text and **3:1** for large metrics and graphics.
4. **ARIA & Screen Readers**: Interactive elements without text labels require explicit `aria-label` tags (e.g., `aria-label="Close modal"`).

---

## 9. Micro-Interactions & Feedback Triggers

1. **Hover Card Lift**: Cards lift `-3px` on Y-axis with expanded soft shadow (`box-shadow: 0 20px 30px -8px rgba(11,28,48,0.1)`).
2. **Action Feedback**:
   - Copy button toggles state immediately to checkmark icon with a 2-second timeout.
   - Form field submission triggers inline error message or toast notification (`react-hot-toast`).
3. **Smooth Scroll**: Root document uses `scroll-behavior: smooth`.

---

## 10. Cross-Project Blueprint & Adoption Guide

To adapt this unified UI/UX design system across new web applications:

1. **Copy Theme Tokens**: Include `@theme` block and custom CSS utility classes (`.glass-panel`, `.card-shadow`, `.card-hover`) in `index.css`.
2. **Typography**: Load Google Fonts `Inter` and `Manrope`.
3. **Reuse UI Primitives**: Import standard `AppHeader`, `MetricCard`, `InputField`, `StatusBadge`, and button taxonomy.
4. **Maintain Color Role Integrity**: Use Primary (`#004bca` / `#0061ff`) for actions, Slate for neutrals, and Emerald / Amber / Red for status feedback.
