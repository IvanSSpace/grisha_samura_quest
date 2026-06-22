/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0907',
        ash: '#15110c',
        ember: '#c9a227',
        gold: '#d9c089',
        blood: '#7a1f1f',
        bloodlight: '#b23a3a',
        parch: '#cbb994',
        fog: '#8a8170',
      },
      fontFamily: {
        title: ['"Cinzel"', 'Georgia', 'serif'],
        body: ['"EB Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(201,162,39,0.25)',
        bloodglow: '0 0 30px rgba(178,58,58,0.35)',
      },
      keyframes: {
        fadein: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        flicker: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.82 },
        },
        sheen: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadein: 'fadein 0.7s ease-out both',
        flicker: 'flicker 4s ease-in-out infinite',
        sheen: 'sheen 3.5s linear infinite',
      },
    },
  },
  plugins: [],
}
