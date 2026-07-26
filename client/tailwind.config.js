/** @type {import('tailwindcss').Config} */
//
// theme.extend is the block published in client/DESIGN.md ("Implementation
// Tokens"), used as given. Every value indirects through a CSS custom property
// so the .dark block in src/input.css can retheme the whole app by overriding
// variables — no utility class ever learns which theme is active.
//
// `border` is exposed as `hairline` because Tailwind already owns the `border`
// utility for border-width; `divide-hairline` / `border-hairline` set the
// divider color without colliding with it.
module.exports = {
  content: ["./public/**/*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)",
        },
        hairline: "var(--color-border)",
        "border-interactive": "var(--color-border-interactive)",
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          faint: "var(--color-ink-faint)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          active: "var(--color-primary-active)",
          wash: "var(--color-primary-wash)",
        },
        "on-primary": "var(--color-on-primary)",
        priority: {
          1: "var(--color-priority-1)",
          2: "var(--color-priority-2)",
          3: "var(--color-priority-3)",
          4: "var(--color-priority-4)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "headline-lg": ["30px", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "1.5" }],
        "body-md": ["14px", { lineHeight: "1.5" }],
        "body-sm": ["13px", { lineHeight: "1.45" }],
        "label-lg": ["15px", { lineHeight: "1.2", fontWeight: "600" }],
        "label-md": ["13px", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "500" }],
      },
      borderRadius: {
        none: "var(--rounded-none)",
        sm: "var(--rounded-sm)",
        md: "var(--rounded-md)",
        lg: "var(--rounded-lg)",
        xl: "var(--rounded-xl)",
        full: "var(--rounded-full)",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        gutter: "var(--space-gutter)",
        "page-margin": "var(--space-page-margin)",
        divider: "var(--space-divider)",
        checkbox: "var(--space-checkbox)",
        control: "var(--space-control-height)",
        row: "var(--space-row-height)",
      },
      maxWidth: {
        content: "var(--size-content-max)",
      },
      width: {
        sidebar: "var(--size-sidebar)",
      },
      boxShadow: {
        raised: "var(--shadow-raised)",
        overlay: "var(--shadow-overlay)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
      },
      transitionDuration: {
        state: "var(--duration-state)",
        enter: "var(--duration-enter)",
      },
    },
  },
  plugins: [],
};
