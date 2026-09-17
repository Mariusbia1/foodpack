/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shop: {
          black: '#000000',
          dark: '#0A0A0A',
          gray: '#F0EEED',
          'gray-light': '#F2F0F1',
          'gray-border': '#0000001A',
          muted: '#00000099',
          faint: '#00000066',
          red: '#FF3333',
          'red-light': 'rgba(255, 51, 51, 0.1)',
          green: '#01AB31',
          star: '#FFC633',
        },
        ink: '#000000',
        ivory: '#FFFFFF',
        linen: '#F0EEED',
        sand: '#F2F0F1',
        gold: '#FFC633',
        mist: '#F0EEED',
        brown: '#000000',
        champagne: '#F9F8F6',
        goldSoft: '#FF3333',
        plum: '#000000',
      },
      fontFamily: {
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.05)',
        floating: '0 20px 50px rgba(0, 0, 0, 0.15)',
        soft: '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        card: '20px',
        pill: '9999px',
      }
    },
  },
  plugins: [],
}
