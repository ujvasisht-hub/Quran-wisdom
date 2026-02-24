/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#022c22',
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e8cc6e',
          dark: '#b8941f',
        },
        ivory: {
          DEFAULT: '#fffcf2',
          100: '#fff9e6',
          200: '#fef3cd',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
