/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        islamic: {
          green: '#0d6e3d',
          gold: '#c5a54e',
        },
      },
      backgroundColor: {
        app: 'var(--color-bg-app)',
        card: 'var(--color-bg-card)',
        input: 'var(--color-bg-input)',
        hover: 'var(--color-bg-hover)',
        sidebar: 'var(--color-bg-sidebar)',
      },
      textColor: {
        content: {
          DEFAULT: 'var(--color-content)',
          secondary: 'var(--color-content-secondary)',
          tertiary: 'var(--color-content-tertiary)',
          muted: 'var(--color-content-muted)',
        },
      },
      borderColor: {
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
        },
      },
    },
  },
  plugins: [],
}
