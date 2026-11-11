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
        workspace: {
          bg: '#08090D',
          surface1: '#10121A',
          surface2: '#151823',
          surface3: '#1D2029',
          surface: '#10121A',
          surfaceHover: '#151823',
          card: 'rgba(16, 18, 26, 0.85)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.14)',
          violet: '#9B87FF',
          violetGlow: 'rgba(155, 135, 255, 0.25)',
          cyan: '#50DED0',
          cyanGlow: 'rgba(80, 222, 208, 0.22)',
          accent: '#9B87FF',
          teal: '#50DED0',
          text: '#FFFFFF',
          muted: '#9296A5',
          lightBg: '#F8F9FC',
          lightSurface1: '#FFFFFF',
          lightSurface2: '#F0F2F8',
          lightSurface3: '#E5E8F2',
          lightBorder: 'rgba(0, 0, 0, 0.08)',
          lightText: '#0E1017',
          lightMuted: '#636674'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'violet-glow': '0 10px 30px -10px rgba(155, 135, 255, 0.25), 0 0 20px -5px rgba(155, 135, 255, 0.15)',
        'cyan-glow': '0 10px 30px -10px rgba(80, 222, 208, 0.22), 0 0 20px -5px rgba(80, 222, 208, 0.12)',
        'window-active': '0 24px 70px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(155, 135, 255, 0.25), 0 8px 32px -4px rgba(155, 135, 255, 0.15)',
        'window-inactive': '0 20px 50px -10px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'dock': '0 20px 45px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.12)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
      },
      animation: {
        'aurora-drift': 'auroraDrift 20s ease-in-out infinite alternate',
        'aurora-glow': 'auroraGlow 14s ease-in-out infinite alternate',
      },
      keyframes: {
        auroraDrift: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-30px, 20px) scale(1.08)' },
          '100%': { transform: 'translate(25px, -15px) scale(0.96)' },
        },
        auroraGlow: {
          '0%': { opacity: '0.22', filter: 'hue-rotate(0deg)' },
          '50%': { opacity: '0.32', filter: 'hue-rotate(15deg)' },
          '100%': { opacity: '0.20', filter: 'hue-rotate(-15deg)' },
        }
      }
    },
  },
  plugins: [],
}
