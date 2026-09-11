/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'abyss':    '#0a0a12',
        'surface':  '#12121e',
        'border':   '#5c5c86',
        'text':     '#e0e0e0',
        'subtext':  '#a8a8d0',
        'cyan':     '#00ffcc',
        'red':      '#ff0055',
      },
      fontFamily: {
        arcade: ['"Press Start 2P"', 'cursive'],
        mono:   ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'cyan-glow':    '0 0 8px #00ffcc, 0 0 24px #00ffcc44',
        'red-glow':     '0 0 8px #ff0055, 0 0 24px #ff005544',
        'btn':          '4px 4px 0px #000000',
        'btn-cyan':     '4px 4px 0px #007755, 0 0 12px #00ffcc88',
        'btn-red':      '4px 4px 0px #660022, 0 0 12px #ff005588',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.88' },
          '75%': { opacity: '0.95' },
        },
        scandown: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100vh' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 6px #00ffcc, 0 0 18px #00ffcc44' },
          '50%':       { boxShadow: '0 0 16px #00ffcc, 0 0 40px #00ffcc88' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        flicker:       'flicker 3s ease-in-out infinite',
        blink:         'blink 1s step-end infinite',
        'pulse-cyan':  'pulse-cyan 2s ease-in-out infinite',
        shake:         'shake 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}
