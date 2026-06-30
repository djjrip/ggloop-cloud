/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#07070a',
          800: '#0b0b12',
          700: '#12121c',
        },
        brand: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          violet: '#8b5cf6',
          cyan: '#22d3ee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)',
        glow: '0 0 28px rgba(99,102,241,0.45)',
        'glow-violet': '0 0 28px rgba(139,92,246,0.4)',
      },
      backdropBlur: {
        glass: '18px',
      },
      keyframes: {
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        drift: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(40px,-30px) scale(1.08)' },
        },
        ctaGlow: {
          '0%,100%': { boxShadow: '0 0 16px rgba(99,102,241,0.22)' },
          '50%': { boxShadow: '0 0 26px rgba(99,102,241,0.42)' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 1.8s ease-in-out infinite',
        drift: 'drift 24s ease-in-out infinite',
        'drift-rev': 'drift 28s ease-in-out infinite reverse',
        ctaGlow: 'ctaGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
