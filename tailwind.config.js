
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./views/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#C5A358', dark: '#A68A46' },
        wellness: {
          beige: '#FAF9F6',
          linen: '#FFFFFF',
          sage: '#4A5D4E',
          blush: '#E29595',
          gold: '#D4AF37',
          onyx: '#121212'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
