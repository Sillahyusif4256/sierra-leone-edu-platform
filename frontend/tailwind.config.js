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
        'sl-green': '#1EB53A',
        'sl-white': '#FFFFFF',
        'sl-blue': '#0072C6',
        primary: {
          50: '#E8F8EC',
          100: '#C5EDD0',
          200: '#9FE0B1',
          300: '#77D391',
          400: '#58C97A',
          500: '#1EB53A',
          600: '#18A233',
          700: '#128C2B',
          800: '#0C7623',
          900: '#065016',
        },
        secondary: {
          500: '#003DA5',
          600: '#003494',
        },
        dark: {
          900: '#0D1B2A',
          800: '#1A2E45',
          700: '#243B55',
        },
      },
      fontSize: {
        'h1': 'clamp(24px, 5vw, 48px)',
        'h2': 'clamp(20px, 4vw, 36px)',
        'body': 'clamp(14px, 2vw, 16px)',
      },
    },
  },
  plugins: [],
}
