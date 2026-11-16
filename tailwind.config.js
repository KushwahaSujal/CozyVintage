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
        cozy: {
          ivory: '#F6F0E5',
          parchment: '#E7DDCA',
          parchmentDark: '#D8CCA8',
          sage: '#78927A',
          sageLight: '#9BB29D',
          sageDark: '#5E7860',
          forest: '#496354',
          forestDark: '#35483D',
          gold: '#B68B58',
          goldLight: '#CF9E65',
          goldMuted: '#9E784C',
          brown: '#735943',
          brownDark: '#564232',
          lavender: '#9D8DF1',
          rose: '#D48C9A',
          softGold: '#E5C378',
          water: '#5EA3A3',
          waterLight: '#A3D9D9',
          waterDark: '#3B7A7A'
        },
        darkSurface: {
          bg: '#141C16',
          card: '#1D2720',
          cardHover: '#26332A',
          border: '#2E3E33',
          text: '#F2EDE4',
          textMuted: '#A0ACA2'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'cozy': '0 4px 20px -2px rgba(115, 89, 67, 0.12)',
        'cozy-lg': '0 10px 30px -4px rgba(115, 89, 67, 0.18)',
        'cozy-inner': 'inset 0 2px 4px 0 rgba(73, 99, 84, 0.08)',
        'glow-gold': '0 0 15px rgba(182, 139, 88, 0.35)',
        'glow-sage': '0 0 15px rgba(120, 146, 122, 0.35)',
        'glow-water': '0 0 15px rgba(94, 163, 163, 0.45)',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'water-wave': 'waterWave 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.8s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-5px) rotate(1deg)' },
        },
        waterWave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.08)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
