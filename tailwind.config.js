/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf7fd',
          100: '#f4edfc',
          200: '#e9dbf9',
          300: '#d7bef4',
          400: '#bc94ec',
          500: '#9d63e0',
          600: '#8342d0',
          700: '#6f30b9',
          800: '#5c2999',
          900: '#4c247c',
          950: '#2e0f52',
        },
        surface: {
          lavender: '#f6f3fb',
          card: '#ffffff',
          soft: '#fbf9fe',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-purple': '0 10px 30px -5px rgba(124, 58, 237, 0.08), 0 4px 6px -2px rgba(124, 58, 237, 0.04)',
        'glow': '0 0 25px rgba(139, 92, 246, 0.25)',
      }
    },
  },
  plugins: [],
}

