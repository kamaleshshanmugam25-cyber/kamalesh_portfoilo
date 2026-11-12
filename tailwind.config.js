/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '380px',
      },
      colors: {
        brutal: {
          yellow: '#F5F04E',
          bg: '#F5F04E',
          surface: '#F5F5F0',
          white: '#FFFFFF',
          black: '#151515',
          blue: '#3155FF',
          pink: '#FF5C8A',
          cyan: '#39D5C8',
          lime: '#A3E635',
          purple: '#A855F7',
          orange: '#FB923C'
        },
        workspace: {
          bg: '#F5F04E',
          surface: '#F5F5F0',
          surfaceHover: '#FFFFFF',
          card: '#FFFFFF',
          border: '#151515',
          blue: '#3155FF',
          pink: '#FF5C8A',
          yellow: '#F5F04E',
          accent: '#3155FF',
          teal: '#39D5C8',
          text: '#151515',
          muted: '#525252'
        }
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace']
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #151515',
        'brutal': '4px 4px 0px #151515',
        'brutal-md': '6px 6px 0px #151515',
        'brutal-lg': '8px 8px 0px #151515',
        'brutal-xl': '12px 12px 0px #151515',
        'brutal-blue': '4px 4px 0px #3155FF',
        'brutal-pink': '4px 4px 0px #FF5C8A',
        'brutal-white': '4px 4px 0px #FFFFFF',
        'window': '8px 8px 0px #151515',
        'window-active': '10px 10px 0px #151515',
        'dock': '6px 6px 0px #151515',
        'card': '6px 6px 0px #151515'
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px'
      }
    },
  },
  plugins: [],
}
