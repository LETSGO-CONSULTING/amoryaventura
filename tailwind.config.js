/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Original palette
        coral: { DEFAULT: '#FF6B6B', dark: '#e55555', light: '#ff8e8e' },
        terracota: '#E07A5F',
        vino: { DEFAULT: '#6D2E46', light: '#8a3a5a', dark: '#541f34' },
        olive: '#7A9E7E',
        sand: '#F8F4EF',
        warm: '#FFFDFB',
        brand: {
          dark: '#2E2E2E',
          secondary: '#5C5C5C',
          border: '#E8DED7',
        },
        // Logo palette — extracted from Stitch "Amor y Aventura" logo
        logo: {
          navy:   { DEFAULT: '#0F314C', light: '#1a4a72', dark: '#071e30' },
          sun:    '#F5DC60',
          orange: '#F4A21B',
          green:  { DEFAULT: '#69B645', dark: '#2C5C38', light: '#A7D448' },
          teal:   { DEFAULT: '#27545F', light: '#2E4F4E' },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #F8F4EF 0%, #FFFDFB 100%)',
        'gradient-hero': 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
