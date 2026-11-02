const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        display: ['Manrope', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary, #004bca)',
          strong: 'var(--primary-strong, #0061ff)',
          container: 'var(--primary-container, #eff4ff)',
          'on-container': 'var(--on-primary-container, #001d4f)',
        },
        secondary: {
          DEFAULT: 'var(--secondary, #712ae2)',
          container: 'var(--secondary-container, #f3e8ff)',
        },
        tertiary: {
          DEFAULT: 'var(--tertiary, #007f57)',
          container: 'var(--tertiary-container, #e6f7f2)',
        },
        surface: {
          DEFAULT: 'var(--surface, #f8f9ff)',
          low: 'var(--surface-low, #eff4ff)',
          high: 'var(--surface-high, #ffffff)',
          tint: 'var(--surface-tint, #e5eeff)',
        },
        outline: {
          DEFAULT: 'var(--outline, #c2c6d9)',
          variant: 'var(--outline-variant, #e2e8f0)',
        },
        text: {
          DEFAULT: 'var(--text, #0b1c30)',
          muted: 'var(--text-muted, #5a6072)',
        },
        sidebar: 'var(--sidebar, #213145)',
        ninja: {
          gray: '#242930',
          'gray-darker': '#2F2E2E',
          'gray-lighter': '#363D47',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography'),
  ],
};
