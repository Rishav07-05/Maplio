/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        midnight: {
          950: '#05060a',
          900: '#0b0f17',
          800: '#121826',
          700: '#1b2333',
          600: '#253147',
        },
        aurora: {
          500: '#5ad7ff',
          400: '#8df2ff',
          300: '#b6fbff',
        },
        blaze: {
          500: '#ff7d5a',
          400: '#ff9a7a',
        },
      },
      boxShadow: {
        glass: '0 16px 40px rgba(6, 11, 20, 0.55)',
        glow: '0 0 40px rgba(90, 215, 255, 0.35)',
      },
      backdropBlur: {
        xl: '24px',
      },
    },
  },
  plugins: [],
}
